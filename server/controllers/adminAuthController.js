const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const registerFirstAdmin = async (req, res) => {
  try {
    const configuredKey = process.env.ADMIN_SETUP_KEY;
    const isDev = process.env.NODE_ENV !== "production";

    // In production, always require the setup key.
    // In development, skip the check if ADMIN_SETUP_KEY is not configured.
    if (configuredKey) {
      const rawKey = req.get("x-admin-setup-key") || req.body.setupKey || "";
      const provided = Buffer.from(String(rawKey).trim());
      const expected = Buffer.from(configuredKey.trim());
      if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
        console.warn("[AdminAuth] Setup key mismatch. Provided length:", provided.length, "Expected length:", expected.length);
        return res.status(403).json({ success: false, message: "Invalid setup key. Please check the ADMIN_SETUP_KEY in your server .env file." });
      }
    } else if (!isDev) {
      return res.status(503).json({ success: false, message: "Admin registration is not enabled on this server" });
    }

    if (await User.exists({ role: { $in: ADMIN_ROLES } })) {
      return res.status(409).json({ success: false, message: "Admin registration is closed. An administrator already exists." });
    }

    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: "ADMIN",
    });
    return res.status(201).json({ success: true, message: "Admin account created. Sign in to continue.", user: safeUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }
    console.error("Admin registration error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to create admin account" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account is inactive. Please contact support." });
    }
    if (!ADMIN_ROLES.includes(user.role)) {
      return res.status(403).json({ success: false, message: "Administrator access required" });
    }

    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ success: true, message: "Admin login successful", token, user: safeUser(user) });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to sign in" });
  }
};

const getAdminProfile = (req, res) => res.status(200).json({ success: true, user: safeUser(req.user) });

const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new passwords are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must contain at least 8 characters" });
    }
    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Admin password update error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to update password" });
  }
};

module.exports = { registerFirstAdmin, loginAdmin, getAdminProfile, changeAdminPassword };
