const Analytics = require("../models/Analytics");
const PDF = require("../models/PDF");
const User = require("../models/User");
const { cacheGet, cacheSet } = require("../config/redis");

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const cacheKey = `analytics:dashboard:${startDate}:${endDate}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
      });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get total page views
    const totalPageViews = await Analytics.countDocuments({
      type: "page_view",
      ...dateFilter,
    });

    // Get total PDF views
    const totalPdfViews = await Analytics.countDocuments({
      type: "pdf_view",
      ...dateFilter,
    });

    // Get total PDF downloads
    const totalPdfDownloads = await Analytics.countDocuments({
      type: "pdf_download",
      ...dateFilter,
    });

    // Get total user logins
    const totalUserLogins = await Analytics.countDocuments({
      type: "user_login",
      ...dateFilter,
    });

    // Get total user registrations
    const totalUserRegistrations = await Analytics.countDocuments({
      type: "user_register",
      ...dateFilter,
    });

    // Get unique visitors (by IP)
    const uniqueVisitors = await Analytics.distinct("ipAddress", {
      type: "page_view",
      ...dateFilter,
    });

    // Get most viewed PDFs
    const mostViewedPDFs = await Analytics.aggregate([
      {
        $match: {
          type: "pdf_view",
          pdfId: { $ne: null },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$pdfId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "pdfs",
          localField: "_id",
          foreignField: "_id",
          as: "pdf",
        },
      },
      {
        $unwind: "$pdf",
      },
      {
        $project: {
          pdfId: "$_id",
          title: "$pdf.title",
          category: "$pdf.category",
          viewCount: "$count",
        },
      },
    ]);

    // Get most downloaded PDFs
    const mostDownloadedPDFs = await Analytics.aggregate([
      {
        $match: {
          type: "pdf_download",
          pdfId: { $ne: null },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$pdfId",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "pdfs",
          localField: "_id",
          foreignField: "_id",
          as: "pdf",
        },
      },
      {
        $unwind: "$pdf",
      },
      {
        $project: {
          pdfId: "$_id",
          title: "$pdf.title",
          category: "$pdf.category",
          downloadCount: "$count",
        },
      },
    ]);

    // Get daily statistics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Analytics.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          pageViews: {
            $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] },
          },
          pdfViews: {
            $sum: { $cond: [{ $eq: ["$type", "pdf_view"] }, 1, 0] },
          },
          pdfDownloads: {
            $sum: { $cond: [{ $eq: ["$type", "pdf_download"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get total users
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get total PDFs
    const totalPDFs = await PDF.countDocuments({ isActive: true });

    const analyticsData = {
      overview: {
        totalPageViews,
        totalPdfViews,
        totalPdfDownloads,
        totalUserLogins,
        totalUserRegistrations,
        uniqueVisitors: uniqueVisitors.length,
        totalUsers,
        totalPDFs,
      },
      mostViewedPDFs,
      mostDownloadedPDFs,
      dailyStats,
    };

    // Cache for 5 minutes
    await cacheSet(cacheKey, analyticsData, 300);

    res.status(200).json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real-time analytics
// @route   GET /api/analytics/realtime
// @access  Private/Admin
const getRealtimeAnalytics = async (req, res, next) => {
  try {
    const last5Minutes = new Date();
    last5Minutes.setMinutes(last5Minutes.getMinutes() - 5);

    const activeUsers = await Analytics.distinct("ipAddress", {
      createdAt: { $gte: last5Minutes },
    });

    const recentActivity = await Analytics.find({
      createdAt: { $gte: last5Minutes },
    })
      .populate("userId", "name email")
      .populate("pdfId", "title")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        activeUsers: activeUsers.length,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
  getRealtimeAnalytics,
};
