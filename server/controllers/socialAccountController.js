
const SocialAccount = require("../models/SocialAccount");
const { createNotification } = require("../services/notificationService");

// GET CONNECTED SOCIAL ACCOUNTS
const getMySocialAccounts = async (req, res) => {
  try {
    const accounts = await SocialAccount.find({
      user: req.user._id,
    })
      .select(
        "platform platformUserId accountName tokenExpiresAt scopes isActive connectedAt createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    console.error("Get Social Accounts Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch social accounts",
    });
  }
};

// DISCONNECT SOCIAL ACCOUNT
const disconnectSocialAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await SocialAccount.findOneAndUpdate({
      _id: id,
      user: req.user._id,
      isActive: true,
    }, { $set: { isActive: false }, $unset: { accessTokenEncrypted: "", refreshTokenEncrypted: "" } }, { new: true, runValidators: false });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Social account not found",
      });
    }

    await createNotification(req.user._id, "disconnected", "Social account disconnected", `${account.platform} account was disconnected.`);

    return res.status(200).json({
      success: true,
      message: `${account.platform} account disconnected successfully`,
    });
  } catch (error) {
    console.error("Disconnect Social Account Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to disconnect social account",
    });
  }
};

module.exports = {
  getMySocialAccounts,
  disconnectSocialAccount,
};
