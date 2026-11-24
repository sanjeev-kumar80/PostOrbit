
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const https = require("https");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const postRoutes = require("./routes/postRoutes");
const socialAccountRoutes = require("./routes/socialAccountRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminManagementRoutes = require("./routes/adminManagementRoutes");

const app = express();

const configuredOrigins = [process.env.CLIENT_URL, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);
const localDevOrigins = process.env.NODE_ENV === "production"
  ? []
  : ["http://localhost:5173", "http://127.0.0.1:5173", "https://localhost:5173", "https://127.0.0.1:5173"];
const allowedOrigins = new Set([...configuredOrigins, ...localDevOrigins]);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, health checks) and configured browser origins.
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Setup-Key"],
  })
);

app.use(express.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminManagementRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/social-accounts", socialAccountRoutes);

// Health check API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to PostOrbit API",
  });
});

// Start server only after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    if (process.env.LOCAL_HTTPS === "true" && process.env.NODE_ENV !== "production") {
      const keyPath = path.resolve(__dirname, process.env.LOCAL_HTTPS_KEY_PATH || ".cert/localhost-key.pem");
      const certPath = path.resolve(__dirname, process.env.LOCAL_HTTPS_CERT_PATH || ".cert/localhost-cert.pem");
      https.createServer({ key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }, app)
        .listen(PORT, () => console.log(`PostOrbit HTTPS server running at https://localhost:${PORT}`));
    } else {
      app.listen(PORT, () => console.log(`PostOrbit server running on port ${PORT}`));
    }
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
