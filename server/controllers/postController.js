const mongoose = require("mongoose");
const Post = require("../models/Post");
const { createNotification } = require("../services/notificationService");
const {
  getBufferAccessToken,
  getOwnedBufferChannels,
  createBufferPost,
  editBufferPost,
  deleteBufferPost,
  getBufferPost,
  mapBufferStatus,
} = require("../services/bufferService");

const ALLOWED_PLATFORMS = ["instagram", "facebook", "linkedin"];
const POST_FIELDS = "content media platforms platformResults status scheduledAt publishedAt channelIds bufferPostIds createdAt updatedAt";

const validatePostFields = ({ content, media, channelIds, scheduledAt, action }) => {
  if (typeof content !== "string" || !content.trim()) return "Post content is required";
  if (content.length > 5000) return "Post content cannot exceed 5000 characters";
  if (!Array.isArray(media)) return "Media must be a list";
  if (media.some((item) => !item || !["image", "video"].includes(item.type) || !/^https?:\/\//i.test(item.url || ""))) {
    return "Each media item must have a public HTTP or HTTPS URL and a supported type";
  }
  if (!Array.isArray(channelIds) || new Set(channelIds).size !== channelIds.length || channelIds.some((id) => typeof id !== "string" || !id.trim())) {
    return "Select valid Buffer channels";
  }
  if (["schedule", "publish"].includes(action) && channelIds.length === 0) return "Select at least one Buffer channel";
  if (action === "schedule" && (!scheduledAt || Number.isNaN(Date.parse(scheduledAt)) || new Date(scheduledAt) <= new Date())) {
    return "Choose a valid future date and time";
  }
  return null;
};

const publicAssets = (media) => media.map((item) => ({ [item.type]: { url: item.url } }));

const findOwnedChannels = async (userId, channelIds, accessToken) => {
  if (!channelIds.length) return [];
  const available = await getOwnedBufferChannels(userId, accessToken);
  const indexed = new Map(available.map((channel) => [channel.id, channel]));
  const selected = channelIds.map((id) => indexed.get(id));
  if (selected.some((channel) => !channel)) throw new Error("One or more selected Buffer channels are not connected to your account");
  if (selected.some((channel) => channel.isDisconnected || channel.isLocked)) throw new Error("One or more selected Buffer channels are disconnected or unavailable");
  return selected;
};

const getAction = (body) => {
  if (body.action) return body.action;
  if (body.status === "scheduled") return "schedule";
  return "draft";
};

const createPost = async (req, res) => {
  try {
    const action = getAction(req.body);
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
    const media = req.body.media || [];
    const channelIds = req.body.channelIds || [];
    const scheduledAt = req.body.scheduledAt;
    const validation = validatePostFields({ content, media, channelIds, scheduledAt, action });
    if (validation) return res.status(400).json({ success: false, message: validation });
    if (!["draft", "schedule", "publish"].includes(action)) return res.status(400).json({ success: false, message: "Unsupported post action" });

    const platformsFromRequest = Array.isArray(req.body.platforms) ? req.body.platforms : [];
    if (platformsFromRequest.some((platform) => !ALLOWED_PLATFORMS.includes(platform))) {
      return res.status(400).json({ success: false, message: "One or more platforms are invalid" });
    }

    let accessToken = null;
    let channels = [];
    if (channelIds.length) {
      accessToken = await getBufferAccessToken(req.user._id);
      channels = await findOwnedChannels(req.user._id, channelIds, accessToken);
    }

    const platforms = [...new Set(channels.map((channel) => String(channel.service).toLowerCase()).filter((platform) => ALLOWED_PLATFORMS.includes(platform)))];
    const initialStatus = action === "draft" ? "draft" : action === "schedule" ? "scheduled" : "publishing";
    const post = await Post.create({
      user: req.user._id,
      content,
      media,
      platforms: platforms.length ? platforms : platformsFromRequest,
      channelIds,
      status: initialStatus,
      scheduledAt: action === "schedule" ? new Date(scheduledAt) : undefined,
      platformResults: channels.map((channel) => ({
        platform: String(channel.service).toLowerCase(),
        channelId: channel.id,
        channelName: channel.displayName || channel.name,
        status: "pending",
      })),
    });

    if (!channels.length) return res.status(201).json({ success: true, message: "Draft saved", data: post });

    for (let index = 0; index < channels.length; index += 1) {
      const channel = channels[index];
      const result = post.platformResults[index];
      try {
        const input = {
          text: content,
          channelId: channel.id,
          schedulingType: "automatic",
          mode: action === "schedule" ? "customScheduled" : action === "publish" ? "shareNow" : "addToQueue",
          ...(action === "schedule" ? { dueAt: new Date(scheduledAt).toISOString() } : {}),
          ...(action === "draft" ? { saveToDraft: true } : {}),
          ...(media.length ? { assets: publicAssets(media) } : {}),
        };
        const bufferPost = await createBufferPost(accessToken, input);
        result.bufferPostId = bufferPost.id;
        result.status = action === "draft" ? "draft" : mapBufferStatus(bufferPost.status || (action === "publish" ? "sending" : "scheduled"));
        result.scheduledAt = bufferPost.dueAt || (action === "schedule" ? new Date(scheduledAt) : null);
        result.publishedAt = bufferPost.sentAt ? new Date(bufferPost.sentAt) : null;
        if (bufferPost.error) result.error = bufferPost.error;
        post.bufferPostIds.push(bufferPost.id);
      } catch (error) {
        result.status = "failed";
        result.error = error.message;
      }
    }

    const resultStates = post.platformResults.map((result) => result.status);
    if (action === "draft") post.status = resultStates.some((state) => state === "failed") ? "failed" : "draft";
    else if (resultStates.length && resultStates.every((state) => state === "published")) {
      post.status = "published";
      post.publishedAt = new Date();
    } else if (resultStates.some((state) => state === "failed")) post.status = "failed";
    else if (action === "publish") post.status = "publishing";
    else post.status = "scheduled";
    await post.save();

    if (post.status === "scheduled") await createNotification(req.user._id, "scheduled", "Post scheduled", `Your post is scheduled for ${new Date(post.scheduledAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.`, post._id);
    if (post.status === "failed") await createNotification(req.user._id, "failed", "Post failed", "Buffer could not accept this post for one or more channels.", post._id);

    const failed = post.platformResults.filter((result) => result.status === "failed");
    return res.status(201).json({
      success: failed.length < post.platformResults.length,
      message: failed.length ? "Post was not accepted for every selected channel" : "Post sent to Buffer",
      data: post,
      errors: failed.map(({ channelName, error }) => ({ channelName, message: error })),
    });
  } catch (error) {
    console.error("Create Post Error:", error.message);
    return res.status(/Buffer|channel|connect|expired/i.test(error.message) ? 400 : 500).json({ success: false, message: error.message || "Failed to create post" });
  }
};

const synchronizePost = async (post, accessToken) => {
  const previousStatus = post.status;
  let changed = false;
  for (const result of post.platformResults) {
    if (!result.bufferPostId) continue;
    try {
      const remote = await getBufferPost(accessToken, result.bufferPostId);
      if (!remote) continue;
      const nextStatus = mapBufferStatus(remote.status);
      if (result.status !== nextStatus) { result.status = nextStatus; changed = true; }
      if (remote.error && result.error !== remote.error) { result.error = remote.error; changed = true; }
      if (remote.dueAt && String(result.scheduledAt) !== String(remote.dueAt)) { result.scheduledAt = new Date(remote.dueAt); changed = true; }
      if (remote.sentAt && String(result.publishedAt) !== String(remote.sentAt)) { result.publishedAt = new Date(remote.sentAt); changed = true; }
    } catch (error) {
      // Keep the last known status if Buffer is temporarily unavailable.
      console.warn("Buffer status sync skipped:", error.message);
      return;
    }
  }
  if (!changed) return;
  const states = post.platformResults.map((result) => result.status);
  if (states.length && states.every((status) => status === "published")) {
    post.status = "published";
    post.publishedAt = post.platformResults.reduce((latest, result) => result.publishedAt && result.publishedAt > latest ? result.publishedAt : latest, new Date(0));
  } else if (states.some((status) => status === "failed")) post.status = "failed";
  else if (states.some((status) => status === "publishing")) post.status = "publishing";
  else if (states.some((status) => status === "scheduled")) post.status = "scheduled";
  else if (states.every((status) => status === "draft")) post.status = "draft";
  await post.save();
  if (previousStatus !== post.status && post.status === "published") await createNotification(post.user, "published", "Post published", "Buffer reports that your post was published.", post._id);
  if (previousStatus !== post.status && post.status === "failed") await createNotification(post.user, "failed", "Post failed", "Buffer reports a publishing error. Open My Posts for details.", post._id);
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
    const needsSync = posts.filter((post) => post.bufferPostIds?.length && ["scheduled", "publishing", "failed"].includes(post.status)).slice(0, 20);
    if (needsSync.length) {
      try {
        const token = await getBufferAccessToken(req.user._id);
        for (const post of needsSync) await synchronizePost(post, token);
      } catch (error) {
        console.warn("Buffer status sync unavailable:", error.message);
      }
    }
    return res.json({ success: true, count: posts.length, data: posts.map((post) => post.toObject()) });
  } catch (error) {
    console.error("Get Posts Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

const updatePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid post ID" });
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (!["draft", "scheduled"].includes(post.status)) return res.status(400).json({ success: false, message: "Only drafts and scheduled posts can be edited" });

    const previousScheduledAt = post.scheduledAt ? new Date(post.scheduledAt).getTime() : null;
    const content = req.body.content === undefined ? post.content : String(req.body.content).trim();
    const media = req.body.media === undefined ? post.media : req.body.media;
    const channelIds = req.body.channelIds === undefined ? post.channelIds : req.body.channelIds;
    const status = req.body.status === undefined ? post.status : req.body.status;
    const scheduledAt = req.body.scheduledAt === undefined ? post.scheduledAt : req.body.scheduledAt;
    const action = status === "scheduled" ? "schedule" : "draft";
    const validation = validatePostFields({ content, media, channelIds, scheduledAt, action });
    if (validation) return res.status(400).json({ success: false, message: validation });
    if (!["draft", "scheduled"].includes(status)) return res.status(400).json({ success: false, message: "Choose draft or scheduled status" });

    if (post.bufferPostIds.length && channelIds.slice().sort().join("|") !== post.channelIds.slice().sort().join("|")) {
      return res.status(400).json({ success: false, message: "Changing Buffer channels for an existing post is unsupported. Delete it and create a new post for the new channels." });
    }
    const token = channelIds.length ? await getBufferAccessToken(req.user._id) : null;
    const channels = channelIds.length ? await findOwnedChannels(req.user._id, channelIds, token) : [];
    if (post.bufferPostIds.length) {
      for (const result of post.platformResults) {
        if (!result.bufferPostId) continue;
        const bufferPost = await editBufferPost(token, {
          id: result.bufferPostId,
          text: content,
          assets: publicAssets(media),
          ...(status === "scheduled" ? { saveToDraft: false, mode: "customScheduled", dueAt: new Date(scheduledAt).toISOString() } : { saveToDraft: true }),
        });
        result.status = status === "draft" ? "draft" : mapBufferStatus(bufferPost.status || "scheduled");
        result.error = null;
        result.scheduledAt = bufferPost.dueAt ? new Date(bufferPost.dueAt) : status === "scheduled" ? new Date(scheduledAt) : null;
      }
    } else if (channels.length) {
      post.platformResults = channels.map((channel) => ({ platform: String(channel.service).toLowerCase(), channelId: channel.id, channelName: channel.displayName || channel.name, status: "pending" }));
      for (let index = 0; index < channels.length; index += 1) {
        const channel = channels[index];
        const input = { text: content, channelId: channel.id, schedulingType: "automatic", mode: status === "scheduled" ? "customScheduled" : "addToQueue", ...(status === "scheduled" ? { dueAt: new Date(scheduledAt).toISOString() } : { saveToDraft: true }), ...(media.length ? { assets: publicAssets(media) } : {}) };
        const created = await createBufferPost(token, input);
        post.platformResults[index].bufferPostId = created.id;
        post.platformResults[index].status = status === "draft" ? "draft" : mapBufferStatus(created.status || "scheduled");
        post.bufferPostIds.push(created.id);
      }
    }

    post.content = content;
    post.media = media;
    post.channelIds = channelIds;
    post.platforms = [...new Set(channels.map((channel) => String(channel.service).toLowerCase()))];
    post.status = status;
    post.scheduledAt = status === "scheduled" ? new Date(scheduledAt) : undefined;
    await post.save();
    if (post.status === "scheduled" && previousScheduledAt !== new Date(post.scheduledAt).getTime()) {
      await createNotification(req.user._id, previousScheduledAt ? "rescheduled" : "scheduled", previousScheduledAt ? "Post rescheduled" : "Post scheduled", `Your post is scheduled for ${new Date(post.scheduledAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.`, post._id);
    }
    return res.json({ success: true, message: "Post updated", data: post });
  } catch (error) {
    console.error("Update Post Error:", error.message);
    return res.status(400).json({ success: false, message: error.message || "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid post ID" });
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.status === "published" || post.platformResults.some((item) => item.status === "published")) {
      return res.status(400).json({ success: false, message: "Published posts cannot be removed from the social network. Delete them there if needed." });
    }
    if (post.bufferPostIds.length) {
      const token = await getBufferAccessToken(req.user._id);
      for (const id of post.bufferPostIds) await deleteBufferPost(token, id);
    }
    await Post.deleteOne({ _id: post._id, user: req.user._id });
    return res.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete Post Error:", error.message);
    return res.status(400).json({ success: false, message: error.message || "Failed to delete post" });
  }
};

module.exports = { createPost, getMyPosts, updatePost, deletePost };
