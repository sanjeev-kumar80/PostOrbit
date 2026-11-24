
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    subscription: {
      plan: { type: String, enum: ["free", "premium"], default: "free" },
      billingCycle: { type: String, enum: ["monthly", "yearly", null], default: null },
      status: { type: String, enum: ["free", "active", "trialing", "past_due", "canceled"], default: "free" },
      aiUsageCount: { type: Number, default: 0, min: 0 },
      scheduledPostCount: { type: Number, default: 0, min: 0 },
      currentPeriodStart: Date,
      currentPeriodEnd: Date,
    },

    billingHistory: [{
      provider: { type: String, default: null },
      invoiceId: { type: String, default: null },
      amount: { type: Number, default: null },
      currency: { type: String, default: "INR" },
      status: { type: String, enum: ["paid", "pending", "failed", "refunded"] },
      paidAt: Date,
      invoiceUrl: String,
    }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
