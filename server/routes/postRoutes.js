
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.use(protect);

router.post("/", createPost);
router.get("/", getMyPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
