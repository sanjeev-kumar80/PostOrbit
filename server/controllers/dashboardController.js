const Post = require("../models/Post");
const SocialAccount = require("../models/SocialAccount");
const User = require("../models/User");

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalPosts, publishedPosts, scheduledPosts, draftPosts, connectedAccounts, recentPosts] = await Promise.all([
      Post.countDocuments({ user: userId }),
      Post.countDocuments({ user: userId, status: "published" }),
      Post.countDocuments({ user: userId, status: "scheduled" }),
      Post.countDocuments({ user: userId, status: "draft" }),
      SocialAccount.countDocuments({ user: userId, isActive: true }),
      Post.find({ user: userId }).select("content platforms status scheduledAt publishedAt createdAt").sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return res.status(200).json({ success: true, message: "Dashboard data fetched successfully", data: {
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
      stats: { totalPosts, publishedPosts, scheduledPosts, draftPosts, connectedAccounts }, recentPosts,
    } });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
  }
};

const getAdminDashboardOverview = async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalPosts, scheduledPosts, publishedPosts, failedPosts, recentUsers, recentPosts] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({ role: "USER", isActive: true }),
      Post.countDocuments(),
      Post.countDocuments({ status: "scheduled" }),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "failed" }),
      User.find({ role: "USER" }).select("name email createdAt").sort({ createdAt: -1 }).limit(5).lean(),
      Post.find().select("content status createdAt user").populate("user", "name email").sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    const activities = [
      ...recentUsers.map((user) => ({ id: `user-${user._id}`, type: "user_joined", message: `${user.name} joined PostOrbit`, actor: user.name, createdAt: user.createdAt })),
      ...recentPosts.map((post) => ({ id: `post-${post._id}`, type: `post_${post.status}`, message: `${post.user?.name || "A user"} ${post.status} a post`, actor: post.user?.name || "A user", status: post.status, createdAt: post.createdAt })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    return res.status(200).json({ success: true, data: {
      stats: { totalUsers, activeUsers, totalPosts, scheduledPosts, publishedPosts, failedPosts },
      activities,
      admin: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    } });
  } catch (error) {
    console.error("Admin dashboard error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch admin dashboard data" });
  }
};

module.exports = { getDashboardOverview, getAdminDashboardOverview };
