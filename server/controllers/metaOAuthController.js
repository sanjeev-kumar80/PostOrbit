
const jwt = require("jsonwebtoken");
const axios = require("axios");

const SocialAccount = require("../models/SocialAccount");
const { encryptToken } = require("../utils/tokenEncryption");

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v25.0";

// START META LOGIN

const connectMeta = async (req, res) => {
  try {
    const state = jwt.sign(
      {
        userId: req.user._id.toString(),
        purpose: "meta-oauth",
      },
      process.env.SOCIAL_OAUTH_STATE_SECRET,
      { expiresIn: "10m" }
    );

    const params = new URLSearchParams({
      client_id: process.env.META_APP_ID,
      redirect_uri: process.env.META_REDIRECT_URI,
      response_type: "code",
      scope: [
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_posts",
        "instagram_basic",
        "instagram_content_publish",
      ].join(","),
      state,
    });

    return res.redirect(
      `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params}`
    );
  } catch (error) {
    console.error("Meta Connect Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to start Meta connection",
    });
  }
};


// META OAUTH CALLBACK
const metaCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error || !code || !state) {
      return res.redirect(
        `${process.env.CLIENT_URL}/dashboard?socialError=meta_cancelled`
      );
    }

    const decoded = jwt.verify(
      state,
      process.env.SOCIAL_OAUTH_STATE_SECRET
    );

    if (decoded.purpose !== "meta-oauth") {
      throw new Error("Invalid OAuth state");
    }

    const tokenResponse = await axios.get(
      `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`,
      {
        params: {
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          redirect_uri: process.env.META_REDIRECT_URI,
          code,
        },
      }
    );

    const shortLivedToken = tokenResponse.data.access_token;

    // Exchange for a long-lived user token
    const longTokenResponse = await axios.get(
      `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`,
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    const accessToken = longTokenResponse.data.access_token;

    // Fetch Facebook Pages managed by the user
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/${GRAPH_VERSION}/me/accounts`,
      {
        params: {
          fields: "id,name,access_token,instagram_business_account",
          access_token: accessToken,
        },
      }
    );

    const savedAccounts = [];

    for (const page of pagesResponse.data.data || []) {
      // Save Facebook Page
      await SocialAccount.findOneAndUpdate(
        {
          user: decoded.userId,
          platform: "facebook",
          platformUserId: page.id,
        },
        {
          user: decoded.userId,
          platform: "facebook",
          platformUserId: page.id,
          accountName: page.name,
          accessTokenEncrypted: encryptToken(
            page.access_token
          ),
          isActive: true,
          connectedAt: new Date(),
        },
        { upsert: true, new: true, runValidators: true }
      );

      savedAccounts.push("facebook");

      // Save linked Instagram Professional account
      if (page.instagram_business_account?.id) {
        const instagram = page.instagram_business_account;

        await SocialAccount.findOneAndUpdate(
          {
            user: decoded.userId,
            platform: "instagram",
            platformUserId: instagram.id,
          },
          {
            user: decoded.userId,
            platform: "instagram",
            platformUserId: instagram.id,
            accountName: page.name,
            accessTokenEncrypted: encryptToken(
              page.access_token
            ),
            isActive: true,
            connectedAt: new Date(),
          },
          { upsert: true, new: true, runValidators: true }
        );

        savedAccounts.push("instagram");
      }
    }

    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?socialConnected=${savedAccounts.length}`
    );
  } catch (error) {
    console.error(
      "Meta OAuth Callback Error:",
      error.response?.data || error.message
    );

    return res.redirect(
      `${process.env.CLIENT_URL}/dashboard?socialError=meta_failed`
    );
  }
};

module.exports = {
  connectMeta,
  metaCallback,
};
