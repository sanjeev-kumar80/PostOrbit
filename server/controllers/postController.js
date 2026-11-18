
const Post = require("../models/Post");

const ALLOWED_PLATFORMS = ["instagram", "facebook", "linkedin"];

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { content, platforms = [], status = "draft", scheduledAt } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    if (!Array.isArray(platforms)) {
      return res.status(400).json({
        success: false,
        message: "Platforms must be an array",
      });
    }

    const invalidPlatforms = platforms.filter(
      (platform) => !ALLOWED_PLATFORMS.includes(platform)
    );

    if (invalidPlatforms.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more platforms are invalid",
      });
    }

    if (!["draft", "scheduled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Only draft or scheduled posts can be created",
      });
    }

    if (status === "scheduled") {
      if (!scheduledAt || Number.isNaN(Date.parse(scheduledAt))) {
        return res.status(400).json({
          success: false,
          message: "A valid scheduled date is required",
        });
      }

      if (new Date(scheduledAt) <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in the future",
        });
      }

      if (platforms.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Select at least one platform for scheduling",
        });
      }
    }

    const post = await Post.create({
      user: req.user._id,
      content: content.trim(),
      platforms,
      status,
      scheduledAt: status === "scheduled" ? new Date(scheduledAt) : undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Create Post Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

// GET LOGGED-IN USER POSTS
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get Posts Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

// UPDATE POST
const updatePost = async (req, res) => {
  try {
    const { content, platforms, status, scheduledAt } = req.body;

    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (content !== undefined) {
      if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Post content cannot be empty",
        });
      }
      post.content = content.trim();
    }

    if (platforms !== undefined) {
      if (
        !Array.isArray(platforms) ||
        platforms.some((platform) => !ALLOWED_PLATFORMS.includes(platform))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid platforms",
        });
      }
      post.platforms = platforms;
    }

    if (status !== undefined) {
      if (!["draft", "scheduled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Only draft or scheduled status is allowed",
        });
      }
      post.status = status;
    }

    if (post.status === "scheduled") {
      const dateToUse = scheduledAt !== undefined
        ? scheduledAt
        : post.scheduledAt;

      if (!dateToUse || Number.isNaN(Date.parse(dateToUse))) {
        return res.status(400).json({
          success: false,
          message: "A valid scheduled date is required",
        });
      }

      if (new Date(dateToUse) <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in the future",
        });
      }

      if (post.platforms.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Select at least one platform for scheduling",
        });
      }

      post.scheduledAt = new Date(dateToUse);
    } else {
      post.scheduledAt = undefined;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    console.error("Update Post Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
};

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete Post Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

module.exports = {
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
};
