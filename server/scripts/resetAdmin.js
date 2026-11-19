/**
 * Reset script: Deletes all existing admin accounts so you can register a fresh one.
 * Run from server/ directory:
 *   node scripts/resetAdmin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const deleted = await User.deleteMany({ role: { $in: ["ADMIN", "SUPER_ADMIN"] } });
  console.log(`✅ Deleted ${deleted.deletedCount} admin account(s). You can now register a fresh admin.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Reset failed:", err.message);
  process.exit(1);
});
