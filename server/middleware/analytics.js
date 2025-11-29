const Analytics = require("../models/Analytics");

const trackAnalytics = async (req, res, next) => {
  // Track analytics asynchronously without blocking the request
  setImmediate(async () => {
    try {
      const analyticsData = {
        type: req.analyticsType || "page_view",
        userId: req.user ? req.user.id : null,
        pdfId: req.analyticsPdfId || null,
        page: req.path || null,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent") || null,
        metadata: req.analyticsMetadata || {},
      };

      await Analytics.create(analyticsData);
    } catch (error) {
      // Don't throw error, just log it
      console.error("Analytics tracking error:", error);
    }
  });

  next();
};

module.exports = trackAnalytics;
