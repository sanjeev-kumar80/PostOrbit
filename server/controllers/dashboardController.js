const Post = require("../models/Post");
const SocialAccount = require("../models/SocialAccount");
const BufferConnection = require("../models/BufferConnection");
const User = require("../models/User");

const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const [totalPosts, publishedPosts, scheduledPosts, draftPosts, failedPosts, socialAccounts, bufferConnection, recentPosts, upcomingPosts] = await Promise.all([
      Post.countDocuments({ user: userId }),
      Post.countDocuments({ user: userId, status: "published" }),
      Post.countDocuments({ user: userId, status: "scheduled" }),
      Post.countDocuments({ user: userId, status: "draft" }),
      Post.countDocuments({ user: userId, status: "failed" }),
      SocialAccount.countDocuments({ user: userId, isActive: true }),
      BufferConnection.findOne({ user: userId, isActive: true }).select("channels").lean(),
      Post.find({ user: userId }).select("content media platforms platformResults status scheduledAt publishedAt createdAt updatedAt").sort({ updatedAt: -1 }).limit(8).lean(),
      Post.find({ user: userId, status: "scheduled", scheduledAt: { $gte: now } }).select("content platforms scheduledAt").sort({ scheduledAt: 1 }).limit(5).lean(),
    ]);

    const connectedAccounts = socialAccounts + (bufferConnection?.channels || []).filter((channel) => !channel.isDisconnected && !channel.isLocked).length;
    const recentActivity = recentPosts.filter((post) => ["published", "failed", "scheduled", "publishing"].includes(post.status)).slice(0, 6).map((post) => ({
      id: String(post._id), type: post.status, content: post.content, platforms: post.platforms,
      createdAt: post.updatedAt || post.createdAt, scheduledAt: post.scheduledAt, publishedAt: post.publishedAt,
    }));

    return res.status(200).json({ success: true, message: "Dashboard data fetched successfully", data: {
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
      stats: { totalPosts, publishedPosts, scheduledPosts, draftPosts, failedPosts, connectedAccounts }, recentPosts, upcomingPosts, recentActivity,
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
