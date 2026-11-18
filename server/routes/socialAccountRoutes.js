
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

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMySocialAccounts);
router.delete("/:id", protect, disconnectSocialAccount);

router.get("/meta/connect", protect, connectMeta);
router.get("/meta/callback", metaCallback);

module.exports = router;
