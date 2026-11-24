
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { uploadMedia, generateCaption, getAnalytics, listNotifications, markNotificationRead, markAllNotificationsRead } = require("../controllers/productController");

router.use(protect);

router.post("/ai-caption", generateCaption);
router.post("/media", uploadMedia);
router.get("/analytics", getAnalytics);
router.get("/notifications", listNotifications);
router.patch("/notifications/read-all", markAllNotificationsRead);
router.patch("/notifications/:id/read", markNotificationRead);

router.post("/", createPost);
router.get("/", getMyPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
