const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const SocialAccount = require("../models/SocialAccount");

const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const filter = { role: "USER" };
    const query = String(req.query.search || "").trim();
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ name: { $regex: escaped, $options: "i" } }, { email: { $regex: escaped, $options: "i" } }];
    }
    if (req.query.status === "active") filter.isActive = true;
    if (req.query.status === "inactive") filter.isActive = false;
    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).select("name email role isActive createdAt updatedAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ]);
    res.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("Admin users error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

const getUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid user ID" });
  try {
    const user = await User.findOne({ _id: req.params.id, role: "USER" }).select("name email role isActive createdAt updatedAt").lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const [posts, accounts] = await Promise.all([
      Post.find({ user: user._id }).select("status createdAt publishedAt scheduledAt").sort({ createdAt: -1 }).limit(20).lean(),
      SocialAccount.find({ user: user._id }).select("platform accountName isActive connectedAt createdAt updatedAt").sort({ createdAt: -1 }).lean(),
    ]);
    res.json({ success: true, data: { ...user, activity: [...posts.map(p => ({ type: "post", status: p.status, createdAt: p.createdAt })), ...accounts.map(a => ({ type: "social_account", platform: a.platform, status: a.isActive ? "connected" : "disconnected", createdAt: a.updatedAt || a.connectedAt }))].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20), socialAccounts: accounts } });
  } catch (error) {
    console.error("Admin user detail error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user details" });
  }
};

const updateUserStatus = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid user ID" });
  if (typeof req.body.isActive !== "boolean") return res.status(400).json({ success: false, message: "isActive must be a boolean" });
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: "USER" }, { $set: { isActive: req.body.isActive } }, { new: true, runValidators: true }).select("name email role isActive createdAt");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Admin user status error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};

const deleteUser = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid user ID" });
  const session = await mongoose.startSession();
  try {
    let deleted = false;
    await session.withTransaction(async () => {
      const user = await User.findOne({ _id: req.params.id, role: "USER" }).session(session);
      if (!user) return;
      await Promise.all([Post.deleteMany({ user: user._id }, { session }), SocialAccount.deleteMany({ user: user._id }, { session }), user.deleteOne({ session })]);
      deleted = true;
    });
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User and associated posts and social account records deleted" });
  } catch (error) {
    console.error("Admin user delete error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  } finally { await session.endSession(); }
};

const getSocialAccounts = async (req, res) => {
  try {
    const filter = {};
    if (["active", "inactive"].includes(req.query.status)) filter.isActive = req.query.status === "active";
    if (["instagram", "facebook", "linkedin", "x"].includes(String(req.query.platform || "").toLowerCase())) filter.platform = String(req.query.platform).toLowerCase();
    const accounts = await SocialAccount.find(filter).select("user platform platformUserId accountName isActive connectedAt createdAt updatedAt").populate("user", "name email").sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: accounts.length, data: accounts });
  } catch (error) {
    console.error("Admin social accounts error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch social accounts" });
  }
};

const getSocialAccount = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid social account ID" });
  try {
    const account = await SocialAccount.findById(req.params.id).select("user platform platformUserId accountName isActive connectedAt createdAt updatedAt scopes tokenExpiresAt").populate("user", "name email").lean();
    if (!account) return res.status(404).json({ success: false, message: "Social account not found" });
    res.json({ success: true, data: account });
  } catch (error) {
    console.error("Admin social account detail error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch social account details" });
  }
};

module.exports = { getUsers, getUser, updateUserStatus, deleteUser, getSocialAccounts, getSocialAccount };
