const mongoose = require("mongoose");

const oauthStateSchema = new mongoose.Schema({
  stateHash: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  verifier: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

module.exports = mongoose.model("OAuthState", oauthStateSchema);
