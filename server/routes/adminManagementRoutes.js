const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { getUsers, getUser, updateUserStatus, deleteUser, getSocialAccounts, getSocialAccount } = require("../controllers/adminManagementController");
const { getPosts, getPost, getScheduledPosts, getPublishingStatistics, getMonthlyPostAnalytics, getUserGrowth, getPlatformDistribution, getAiUsage } = require("../controllers/adminPostController");

router.use(protect, requireAdmin);
router.get("/posts", getPosts);
router.get("/posts/scheduled", getScheduledPosts);
router.get("/posts/:id", getPost);
router.get("/analytics/publishing", getPublishingStatistics);
router.get("/analytics/monthly-posts", getMonthlyPostAnalytics);
router.get("/analytics/user-growth", getUserGrowth);
router.get("/analytics/platform-distribution", getPlatformDistribution);
router.get("/analytics/ai-usage", getAiUsage);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/social-accounts", getSocialAccounts);
router.get("/social-accounts/:id", getSocialAccount);

module.exports = router;
