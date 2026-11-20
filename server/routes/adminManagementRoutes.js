const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { getUsers, getUser, updateUserStatus, deleteUser, getSocialAccounts, getSocialAccount } = require("../controllers/adminManagementController");

router.use(protect, requireAdmin);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/social-accounts", getSocialAccounts);
router.get("/social-accounts/:id", getSocialAccount);

module.exports = router;
