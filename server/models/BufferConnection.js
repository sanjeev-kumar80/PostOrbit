const mongoose = require("mongoose");

const bufferConnectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  bufferAccountId: { type: String, default: "" },
  email: { type: String, default: "" },
  organizations: [{ id: { type: String, required: true }, name: { type: String, default: "" } }],
  channels: [{
    id: { type: String, required: true }, organizationId: { type: String, required: true },
    name: { type: String, default: "" }, service: { type: String, default: "" },
    isDisconnected: { type: Boolean, default: false }, isLocked: { type: Boolean, default: false },
  }],
  accessTokenEncrypted: { type: String, required: true, select: false },
  refreshTokenEncrypted: { type: String, default: null, select: false },
  tokenExpiresAt: { type: Date, default: null },
  scopes: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  connectedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("BufferConnection", bufferConnectionSchema);
