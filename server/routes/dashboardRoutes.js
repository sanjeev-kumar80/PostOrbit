
const express = require("express");
const router = express.Router();

const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  getDashboardOverview,
  getAdminDashboardOverview,
} = require("../controllers/dashboardController");

router.get("/overview", protect, getDashboardOverview);
router.get("/admin/overview", protect, requireAdmin, getAdminDashboardOverview);

module.exports = router;
