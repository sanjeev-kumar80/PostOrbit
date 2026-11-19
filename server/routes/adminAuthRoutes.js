const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { registerFirstAdmin, loginAdmin, getAdminProfile, changeAdminPassword } = require("../controllers/adminAuthController");

router.post("/register", registerFirstAdmin);
router.post("/login", loginAdmin);
router.post("/logout", protect, requireAdmin, (req, res) => res.status(200).json({ success: true, message: "Logged out" }));
router.get("/me", protect, requireAdmin, getAdminProfile);
router.patch("/password", protect, requireAdmin, changeAdminPassword);

module.exports = router;
