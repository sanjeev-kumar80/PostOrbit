
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
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "draft",
    },
    scheduledAt: Date,
    publishedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
