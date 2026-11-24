const axios = require("axios");
const crypto = require("crypto");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { createNotification } = require("../services/notificationService");

const uploadMedia = async (req, res) => {
  try {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud || !apiKey || !apiSecret) return res.status(503).json({ success: false, message: "Media uploads need Cloudinary credentials. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the server environment." });
    if (!Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ success: false, message: "Choose a file to upload" });
    if (req.body.length > 100 * 1024 * 1024) return res.status(413).json({ success: false, message: "Media files must be 100 MB or smaller" });
    const contentType = String(req.headers["x-file-content-type"] || "").toLowerCase();
    const type = contentType.startsWith("video/") ? "video" : contentType.startsWith("image/") ? "image" : null;
    if (!type) return res.status(415).json({ success: false, message: "Upload an image or video file" });
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${apiSecret}`).digest("hex");
    const boundary = `PostOrbit${crypto.randomBytes(12).toString("hex")}`;
    const filename = String(req.headers["x-file-name"] || "upload").replace(/[\r\n"\\]/g, "_").slice(0, 120);
    const fields = { timestamp: String(timestamp), api_key: apiKey, signature };
    const parts = Object.entries(fields).map(([name, value]) => Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`), req.body, Buffer.from(`\r\n--${boundary}--\r\n`));
    const form = Buffer.concat(parts);
    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/${type}/upload`, form, {
      headers: { "Content-Type": `multipart/form-data; boundary=${boundary}`, "Content-Length": form.length }, timeout: 120000, maxBodyLength: Infinity, maxContentLength: Infinity,
    });
    return res.status(201).json({ success: true, data: { url: data.secure_url, type, publicId: data.public_id, bytes: data.bytes } });
  } catch (error) {
    console.error("Media upload failed:", error.response?.status || error.message);
    return res.status(502).json({ success: false, message: error.response?.data?.error?.message || "Media upload failed" });
  }
};

const generateCaption = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ success: false, message: "AI captions are not configured. Add OPENAI_API_KEY to the server environment." });
    const { prompt, caption = "", tone = "Friendly", platform = "Instagram", kind = "caption" } = req.body;
    if (!String(prompt || caption).trim()) return res.status(400).json({ success: false, message: "Add a topic or caption to continue" });
    if (![["Professional", "Friendly", "Funny", "Promotional"].includes(tone), ["Instagram", "Facebook", "LinkedIn"].includes(platform), ["caption", "hashtags", "rewrite"].includes(kind)].every(Boolean)) {
      return res.status(400).json({ success: false, message: "Invalid tone, platform or generation type" });
    }
    const user = await User.findById(req.user._id);
    if (!user.subscription) user.subscription = { plan: "free", status: "free", aiUsageCount: 0, scheduledPostCount: 0 };
    const message = kind === "hashtags" ? `Generate relevant hashtags for ${platform}. Return hashtags only.`
      : kind === "rewrite" ? `Rewrite this caption in a ${tone} tone for ${platform}:` : `Write a ${tone} ${platform} caption about:`;
    const { data } = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: "Write concise social media content. Do not invent factual claims. Return only the requested content." }, { role: "user", content: `${message}\n${String(prompt || caption).trim()}` }],
      max_tokens: 500,
      temperature: 0.8,
    }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 30000 });
    const generated = data.choices?.[0]?.message?.content?.trim();
    if (!generated) throw new Error("AI returned an empty response");
    user.subscription.aiUsageCount += 1;
    await user.save();
    return res.json({ success: true, data: { content: generated, usage: user.subscription.aiUsageCount } });
  } catch (error) {
    console.error("AI generation failed:", error.response?.status || error.message);
    return res.status(error.response?.status === 401 ? 503 : 502).json({ success: false, message: "Caption generation failed. Check the server AI configuration and try again." });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const user = req.user._id;
    const [published, activity, byPlatform] = await Promise.all([
      Post.countDocuments({ user, status: "published" }),
      Post.aggregate([
        { $match: { user: req.user._id, status: "published", publishedAt: { $gte: new Date(Date.now() - 29 * 86400000) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$publishedAt", timezone: "Asia/Kolkata" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Post.aggregate([
        { $match: { user: req.user._id, status: "published" } }, { $unwind: "$platforms" },
        { $group: { _id: "$platforms", count: { $sum: 1 } } }, { $sort: { count: -1 } },
      ]),
    ]);
    return res.json({ success: true, data: { totalPublished: published, activity: activity.map((item) => ({ date: item._id, count: item.count })), byPlatform: byPlatform.map((item) => ({ platform: item._id, count: item.count })), engagement: null, reach: null, metricsNote: "Engagement and reach are not exposed by the connected Buffer OAuth API." } });
  } catch (error) {
    console.error("Analytics fetch failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load analytics" });
  }
};

const listNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50).lean();
  const unread = await Notification.countDocuments({ user: req.user._id, readAt: null });
  return res.json({ success: true, data: notifications, unread });
};

const markNotificationRead = async (req, res) => {
  const result = await Notification.updateOne({ _id: req.params.id, user: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  if (!result.matchedCount) return res.status(404).json({ success: false, message: "Notification not found" });
  return res.json({ success: true });
};

const markAllNotificationsRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
  return res.json({ success: true });
};

module.exports = { uploadMedia, generateCaption, getAnalytics, listNotifications, markNotificationRead, markAllNotificationsRead, createNotification };
