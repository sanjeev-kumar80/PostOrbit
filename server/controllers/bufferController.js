const crypto = require("crypto");
const axios = require("axios");
const BufferConnection = require("../models/BufferConnection");
const OAuthState = require("../models/OAuthState");
const { encryptToken, decryptToken } = require("../utils/tokenEncryption");
const { bufferGraphQL, getBufferAccessToken } = require("../services/bufferService");
const { createNotification } = require("../services/notificationService");
const AUTH_URL = "https://auth.buffer.com";

const requiredConfig = () => {
  if (!process.env.BUFFER_CLIENT_ID || !process.env.BUFFER_REDIRECT_URI) {
    throw new Error("Configure BUFFER_CLIENT_ID and BUFFER_REDIRECT_URI on the server");
  }
};

const startBufferOAuth = async (req, res) => {
  try {
    requiredConfig();
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    const state = crypto.randomBytes(32).toString("base64url");
    await OAuthState.create({ stateHash: crypto.createHash("sha256").update(state).digest("hex"), user: req.user._id, verifier, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    const params = new URLSearchParams({ client_id: process.env.BUFFER_CLIENT_ID, redirect_uri: process.env.BUFFER_REDIRECT_URI, response_type: "code", scope: "posts:read posts:write account:read offline_access", state, code_challenge: challenge, code_challenge_method: "S256" });
    return res.json({ success: true, authorizationUrl: `${AUTH_URL}/auth?${params}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const bufferCallback = async (req, res) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
  try {
    const { code, state, error } = req.query;
    if (!state) throw new Error("Missing OAuth state");
    const stateHash = crypto.createHash("sha256").update(String(state)).digest("hex");
    const attempt = await OAuthState.findOneAndDelete({ stateHash, expiresAt: { $gt: new Date() } });
    if (!attempt) throw new Error("OAuth state is invalid or expired");
    if (error || !code) return res.redirect(`${clientUrl}/dashboard?bufferError=authorization_denied`);
    const form = new URLSearchParams({ client_id: process.env.BUFFER_CLIENT_ID, grant_type: "authorization_code", code: String(code), redirect_uri: process.env.BUFFER_REDIRECT_URI, code_verifier: attempt.verifier });
    if (process.env.BUFFER_CLIENT_SECRET) form.set("client_secret", process.env.BUFFER_CLIENT_SECRET);
    const tokenResponse = await axios.post(`${AUTH_URL}/token`, form, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    const tokens = tokenResponse.data;
    const account = await bufferGraphQL(tokens.access_token, "query { account { id email organizations { id name } } }");
    const organizations = account.account?.organizations || [];
    const channels = [];
    for (const organization of organizations) {
      const query = `query { channels(input: { organizationId: ${JSON.stringify(organization.id)} }) { id name service organizationId isDisconnected isLocked } }`;
      const channelResult = await bufferGraphQL(tokens.access_token, query);
      channels.push(...(channelResult.channels || []));
    }
    await BufferConnection.findOneAndUpdate({ user: attempt.user }, {
      user: attempt.user, bufferAccountId: account.account?.id || "", email: account.account?.email || "",
      organizations, channels,
      accessTokenEncrypted: encryptToken(tokens.access_token), refreshTokenEncrypted: tokens.refresh_token ? encryptToken(tokens.refresh_token) : null,
      tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + Number(tokens.expires_in) * 1000) : null,
      scopes: String(tokens.scope || "").split(" ").filter(Boolean), isActive: true, connectedAt: new Date(),
    }, { upsert: true, new: true, runValidators: true });
    return res.redirect(`${clientUrl}/dashboard?bufferConnected=1`);
  } catch (err) {
    console.error("Buffer OAuth callback failed:", err.response?.status || err.message);
    return res.redirect(`${clientUrl}/dashboard?bufferError=connection_failed`);
  }
};

const fetchBufferAccount = async (req, res) => {
  try {
    const token = await getBufferAccessToken(req.user._id);
    const data = await bufferGraphQL(token, "query { account { id email organizations { id name } } }");
    res.json({ success: true, data: data.account });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const fetchBufferChannels = async (req, res) => {
  try {
    const organizationId = String(req.params.organizationId || "");
    if (!organizationId || organizationId.length > 200) return res.status(400).json({ success: false, message: "A valid organization ID is required" });
    const token = await getBufferAccessToken(req.user._id);
    const query = `query { channels(input: { organizationId: ${JSON.stringify(organizationId)} }) { id name displayName service descriptor type externalLink isDisconnected isLocked isQueuePaused } }`;
    const data = await bufferGraphQL(token, query);
    await BufferConnection.findOneAndUpdate({ user: req.user._id, isActive: true }, {
      $pull: { channels: { organizationId } },
    });
    await BufferConnection.findOneAndUpdate({ user: req.user._id, isActive: true }, {
      $push: { channels: { $each: (data.channels || []).map((channel) => ({ ...channel, organizationId })) } },
    });
    res.json({ success: true, data: data.channels || [] });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const getBufferConnection = async (req, res) => {
  const connection = await BufferConnection.findOne({ user: req.user._id, isActive: true }).select("bufferAccountId email scopes connectedAt tokenExpiresAt").lean();
  res.json({ success: true, connected: Boolean(connection), data: connection || null });
};

const disconnectBuffer = async (req, res) => {
  const result = await BufferConnection.findOneAndDelete({ user: req.user._id });
  if (result) await createNotification(req.user._id, "disconnected", "Buffer disconnected", "Your Buffer connection was removed.");
  res.json({ success: true, disconnected: Boolean(result) });
};

module.exports = { startBufferOAuth, bufferCallback, fetchBufferAccount, fetchBufferChannels, getBufferConnection, disconnectBuffer };
