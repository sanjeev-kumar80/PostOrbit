
const express = require("express");
const router = express.Router();

const {
  getMySocialAccounts,
  disconnectSocialAccount,
} = require("../controllers/socialAccountController");

const {
  connectMeta,
  metaCallback,
} = require("../controllers/metaOAuthController");

const {
  startBufferOAuth,
  bufferCallback,
  fetchBufferAccount,
  fetchBufferChannels,
  getBufferConnection,
  disconnectBuffer,
} = require("../controllers/bufferController");

const { protect } = require("../middleware/authMiddleware");

// Get connected accounts
router.get("/", protect, getMySocialAccounts);

// Disconnect account
router.delete("/:id", protect, disconnectSocialAccount);

router.get("/buffer/connect", protect, startBufferOAuth);
router.get("/buffer/callback", bufferCallback);
router.get("/buffer/connection", protect, getBufferConnection);
router.delete("/buffer/connection", protect, disconnectBuffer);
router.get("/buffer/account", protect, fetchBufferAccount);

router.get(
  "/buffer/channels/:organizationId",
  protect,
  fetchBufferChannels
);

// Meta OAuth
router.get("/meta/connect", protect, connectMeta);
router.get("/meta/callback", metaCallback);

module.exports = router;
