/**
 * One-time migration script: Set isActive=true for all users that are
 * missing the isActive field (created before the field was added to schema).
 *
 * Run from the server/ directory:
 *   node scripts/fixIsActive.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const result = await User.updateMany(
    { isActive: { $exists: false } },
    { $set: { isActive: true } }
  );

  console.log(`Fixed ${result.modifiedCount} user(s) missing isActive field.`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
