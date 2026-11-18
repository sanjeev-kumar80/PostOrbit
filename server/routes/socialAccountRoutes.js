
const express = require("express");
const router = express.Router();

const {
  getMySocialAccounts,
  disconnectSocialAccount,
} = require("../controllers/socialAccountController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMySocialAccounts);
router.delete("/:id", protect, disconnectSocialAccount);

module.exports = router;
