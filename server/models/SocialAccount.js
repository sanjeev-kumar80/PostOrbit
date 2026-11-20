
const mongoose = require("mongoose");

const socialAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    platform: {
      type: String,
      enum: ["instagram", "facebook", "linkedin", "x"],
      required: true,
    },

    platformUserId: {
      type: String,
      required: true,
      trim: true,
    },

    accountName: {
      type: String,
      trim: true,
      default: "",
    },

    accessTokenEncrypted: {
      type: String,
      required: true,
      select: false,
    },

    refreshTokenEncrypted: {
      type: String,
      default: null,
      select: false,
    },

    tokenExpiresAt: {
      type: Date,
      default: null,
    },

    scopes: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Same platform account cannot be connected twice by the same user
socialAccountSchema.index(
  { user: 1, platform: 1, platformUserId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SocialAccount", socialAccountSchema);
