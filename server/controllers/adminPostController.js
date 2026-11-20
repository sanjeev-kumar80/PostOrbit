const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");

const getPosts = async (req, res) => {
  try {
    const { search = "", platform, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (["draft", "scheduled", "published", "failed"].includes(status)) filter.status = status;
    if (["instagram", "facebook", "linkedin"].includes(platform)) filter.platforms = platform;
    if (search.trim()) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const matchingUsers = await User.find({ $or: [{ name: regex }, { email: regex }] }).distinct("_id");
      filter.$or = [{ content: regex }, { user: { $in: matchingUsers } }];
    }
    const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const [data, total] = await Promise.all([
      Post.find(filter).select("content platforms platformResults status scheduledAt publishedAt createdAt updatedAt user").populate("user", "name email").sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
      Post.countDocuments(filter),
    ]);
    res.json({ success: true, data, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } });
  } catch (error) {
    console.error("Admin posts error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

const getPost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid post id" });
  try {
    const post = await Post.findById(req.params.id).populate("user", "name email").lean();
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch post" });
  }
};

const getScheduledPosts = async (req, res) => {
  try {
    const posts = await Post.find({ $or: [{ status: "scheduled" }, { status: "failed", scheduledAt: { $exists: true, $ne: null } }] }).select("content platforms platformResults status scheduledAt createdAt user").populate("user", "name email").sort({ scheduledAt: 1 }).lean();
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch scheduled posts" });
  }
};

const getPublishingStatistics = async (req, res) => {
  try {
    const [totalPosts, publishedPosts, failedPosts, scheduledPosts, dailyActivity] = await Promise.all([
      Post.countDocuments(), Post.countDocuments({ status: "published" }), Post.countDocuments({ status: "failed" }), Post.countDocuments({ status: "scheduled" }),
      Post.aggregate([{ $match: { createdAt: { $gte: new Date(Date.now() - 29 * 86400000) } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    ]);
    res.json({ success: true, data: { totalPosts, publishedPosts, failedPosts, scheduledPosts, dailyActivity: dailyActivity.map(x => ({ date: x._id, count: x.count })) } });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to fetch publishing statistics" }); }
};

const getMonthlyPostAnalytics = async (req, res) => {
  try {
    const months = Math.min(36, Math.max(1, Number.parseInt(req.query.months, 10) || 12));
    const from = new Date(); from.setMonth(from.getMonth() - months + 1, 1); from.setHours(0, 0, 0, 0);
    const rows = await Post.aggregate([{ $match: { createdAt: { $gte: from } } }, { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    res.json({ success: true, data: rows.map(x => ({ month: x._id, count: x.count })) });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to fetch monthly analytics" }); }
};

const getUserGrowth = async (req, res) => {
  try {
    const rows = await User.aggregate([{ $match: { role: "USER" } }, { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    let total = 0;
    res.json({ success: true, data: rows.map(x => ({ month: x._id, newUsers: x.count, totalUsers: (total += x.count) })) });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to fetch user growth" }); }
};

const getPlatformDistribution = async (req, res) => {
  try {
    const rows = await Post.aggregate([{ $unwind: "$platforms" }, { $group: { _id: "$platforms", count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    res.json({ success: true, data: rows.map(x => ({ platform: x._id, count: x.count })) });
  } catch (error) { res.status(500).json({ success: false, message: "Failed to fetch platform distribution" }); }
};

// AI usage is deliberately marked untracked until the product persists AI events.
const getAiUsage = async (_req, res) => res.json({ success: true, data: { tracked: false, total: null, byMonth: [], message: "AI usage is not recorded in the current data model." } });

module.exports = { getPosts, getPost, getScheduledPosts, getPublishingStatistics, getMonthlyPostAnalytics, getUserGrowth, getPlatformDistribution, getAiUsage };
