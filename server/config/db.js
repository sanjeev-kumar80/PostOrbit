
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of hanging forever
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    console.error(
      "\n⚠️  Could not connect to MongoDB. Check:\n" +
      "  1. Your IP is whitelisted in MongoDB Atlas → Network Access\n" +
      "  2. MONGO_URI in server/.env is correct\n" +
      "  3. Internet connection is working\n"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
