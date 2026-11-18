
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
      enum: ["instagram", "facebook", "linkedin"],
      required: true,
    },
    accountName: {
      type: String,
      required: true,
      trim: true,
    },
    platformAccountId: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

socialAccountSchema.index(
  { user: 1, platform: 1, platformAccountId: 1 },
  { unique: true }
);

module.exports = mongoose.model("SocialAccount", socialAccountSchema);
