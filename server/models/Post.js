
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    media: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],

    platforms: [
      {
        type: String,
        enum: ["instagram", "facebook", "linkedin"],
      },
    ],

    // Separate publishing result for every platform
    platformResults: [
      {
        platform: {
          type: String,
          enum: ["instagram", "facebook", "linkedin"],
          required: true,
        },
        channelId: { type: String, default: null },
        channelName: { type: String, default: "" },
        bufferPostId: { type: String, default: null },
        status: {
          type: String,
          enum: ["pending", "draft", "scheduled", "publishing", "published", "failed"],
          default: "pending",
        },
        platformPostId: {
          type: String,
          default: null,
        },
        error: {
          type: String,
          default: null,
        },
        publishedAt: {
          type: Date,
          default: null,
        },
        scheduledAt: { type: Date, default: null },
      },
    ],

    status: {
      type: String,
      enum: ["draft", "scheduled", "publishing", "published", "failed"],
      default: "draft",
    },

    channelIds: { type: [String], default: [] },
    bufferPostIds: { type: [String], default: [] },

    scheduledAt: Date,
    publishedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
