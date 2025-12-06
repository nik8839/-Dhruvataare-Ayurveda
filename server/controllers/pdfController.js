const PDF = require("../models/PDF");
const Purchase = require("../models/Purchase");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const { cacheGet, cacheSet, cacheDelete } = require("../config/redis");
const fs = require("fs");
const path = require("path");

// @desc    Get all PDFs with filters
// @route   GET /api/pdfs
// @access  Public
const getPDFs = async (req, res, next) => {
  try {
    const { category, year, subject, yearValue, paper } = req.query;

    // Build cache key
    const cacheKey = `pdfs:${category}:${year}:${subject}:${yearValue}:${paper}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        count: cached.length,
        data: cached,
      });
    }

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (year) {
      if (year === 'General') {
        query.year = null;
      } else {
        query.year = year;
      }
    }
    if (subject) query.subject = new RegExp(subject, "i");
    if (yearValue) query.yearValue = yearValue;
    if (paper) query.paper = paper;

    const pdfs = await PDF.find(query).sort({ createdAt: -1 });

    // Cache for 1 hour (Redis)
    await cacheSet(cacheKey, pdfs, 3600);

    // Prevent browser caching
    res.setHeader('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      count: pdfs.length,
      data: pdfs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content taxonomy (dynamic subjects/years/papers by category)
// @route   GET /api/pdfs/taxonomy
// @access  Public
const getTaxonomy = async (req, res, next) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    // Build cache key
    const cacheKey = `taxonomy:${category}`;

    // Try cache first
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached
      });
    }

    // Get all PDFs for this category
    const pdfs = await PDF.find({ category, isActive: true });

    // Build taxonomy structure
    const taxonomy = {};

    pdfs.forEach(pdf => {
      // Use year or default to 'General' for hierarchy
      // This ensures even if year is missing, it shows up in the UI
      const yearKey = pdf.year || 'General';

      if (!taxonomy[yearKey]) {
        taxonomy[yearKey] = {
          subjects: new Set(),
          years: new Set(),
          papers: new Set()
        };
      }
      
      if (pdf.subject) taxonomy[yearKey].subjects.add(pdf.subject);
      if (pdf.yearValue) taxonomy[yearKey].years.add(pdf.yearValue);
      if (pdf.paper) taxonomy[yearKey].papers.add(pdf.paper);
    });

    // Convert Sets to sorted Arrays
    Object.keys(taxonomy).forEach(key => {
      if (key === 'subjects') {
        taxonomy.subjects = Array.from(taxonomy.subjects).sort();
      } else {
        taxonomy[key].subjects = Array.from(taxonomy[key].subjects).sort();
        taxonomy[key].years = Array.from(taxonomy[key].years).sort().reverse(); // Latest first
        taxonomy[key].papers = Array.from(taxonomy[key].papers).sort();
      }
    });

    // Cache for 1 hour (Redis)
    await cacheSet(cacheKey, taxonomy, 3600);

    // Prevent browser caching
    res.setHeader('Cache-Control', 'no-store');

    res.status(200).json({
      success: true,
      data: taxonomy
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get single PDF
// @route   GET /api/pdfs/:id
// @access  Public
const getPDF = async (req, res, next) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf || !pdf.isActive) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Increment view count
    pdf.viewCount += 1;
    await pdf.save();

    // Track analytics
    setImmediate(async () => {
      try {
        await Analytics.create({
          type: "pdf_view",
          userId: req.user ? req.user.id : null,
          pdfId: pdf._id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    });

    res.status(200).json({
      success: true,
      data: pdf,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View PDF file
// @route   GET /api/pdfs/:id/view
// @access  Public
const viewPDF = async (req, res, next) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf || !pdf.isActive) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Block view access for premium content
    if (pdf.isPremium) {
      return res.status(403).json({
        success: false,
        message: "Preview not available for exclusive content. Please purchase and download.",
      });
    }

    const filePath = path.join(__dirname, "..", pdf.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${pdf.fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Download PDF file
// @route   GET /api/pdfs/:id/download
// @access  Private
const downloadPDF = async (req, res, next) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf || !pdf.isActive) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Check if premium and user has purchased
    if (pdf.isPremium) {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      
      const hasPurchased = user.purchasedItems && user.purchasedItems.some(
        (item) => item.pdfId.toString() === pdf._id.toString()
      );

      if (!hasPurchased) {
        return res.status(403).json({
          success: false,
          message: "Please purchase this PDF to download",
          requiresPurchase: true,
          price: pdf.price,
        });
      }
    }

    const filePath = path.join(__dirname, "..", pdf.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    // Increment download count
    pdf.downloadCount += 1;
    await pdf.save();

    // Track analytics
    setImmediate(async () => {
      try {
        await Analytics.create({
          type: "pdf_download",
          userId: req.user.id,
          pdfId: pdf._id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdf.fileName}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Create PDF
// @route   POST /api/pdfs
// @access  Private/Admin
const createPDF = async (req, res, next) => {
  try {
    console.log('📤 Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.log('❌ No file attached');
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const pdfData = {
      ...req.body,
      filePath: req.file.path,
      fileName: req.file.filename,
      fileSize: req.file.size,
    };

    if (req.body.isPremium === "true") {
      pdfData.isPremium = true;
      pdfData.price = parseFloat(req.body.price) || 0;
    }

    console.log('💾 Attempting to save PDF with data:', pdfData);
    const pdf = await PDF.create(pdfData);
    console.log('✅ PDF saved successfully:', pdf._id);

    // Clear cache (both PDFs and taxonomy)
    await cacheDelete(`pdfs:*`);
    await cacheDelete(`taxonomy:*`);

    res.status(201).json({
      success: true,
      data: pdf,
    });
  } catch (error) {
    console.error('❌ Error creating PDF:', error);
    console.error('Error details:', error.message);
    next(error);
  }
};

// @desc    Update PDF
// @route   PUT /api/pdfs/:id
// @access  Private/Admin
const updatePDF = async (req, res, next) => {
  try {
    let pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    pdf = await PDF.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Clear cache (both PDFs and taxonomy)
    await cacheDelete(`pdfs:*`);
    await cacheDelete(`taxonomy:*`);

    res.status(200).json({
      success: true,
      data: pdf,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete PDF
// @route   DELETE /api/pdfs/:id
// @access  Private/Admin
const deletePDF = async (req, res, next) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // Delete file
    const filePath = path.join(__dirname, "..", pdf.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pdf.deleteOne();

    // Clear cache (both PDFs and taxonomy)
    await cacheDelete(`pdfs:*`);
    await cacheDelete(`taxonomy:*`);

    res.status(200).json({
      success: true,
      message: "PDF deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all cache
// @route   POST /api/pdfs/clear-cache
// @access  Private/Admin
const clearCache = async (req, res, next) => {
  try {
    await cacheDelete(`pdfs:*`);
    await cacheDelete(`taxonomy:*`);
    
    res.status(200).json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPDFs,
  getTaxonomy,
  getPDF,
  viewPDF,
  downloadPDF,
  createPDF,
  updatePDF,
  deletePDF,
  clearCache,
};
