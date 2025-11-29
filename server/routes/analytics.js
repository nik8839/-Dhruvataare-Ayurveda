const express = require("express");
const router = express.Router();
const {
  getDashboardAnalytics,
  getRealtimeAnalytics,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/auth");

router.get("/dashboard", protect, authorize("admin"), getDashboardAnalytics);
router.get("/realtime", protect, authorize("admin"), getRealtimeAnalytics);

module.exports = router;
