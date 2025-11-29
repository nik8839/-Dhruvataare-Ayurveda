const mongoose = require("mongoose");
const PDF = require("../models/PDF");
require("dotenv").config();

const addSampleExclusive = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGODB_URI_PROD
    );

    // Check if sample exclusive content already exists
    const existing = await PDF.findOne({ category: "exclusive" });
    if (existing) {
      console.log("Sample exclusive content already exists");
      console.log(
        "Existing PDFs:",
        await PDF.countDocuments({ category: "exclusive" })
      );
      process.exit(0);
    }

    // Create sample exclusive PDFs (without actual files for now)
    const samplePDFs = [
      {
        title: "Premium Notes - Mathematics",
        description: "Comprehensive mathematics notes",
        category: "exclusive",
        isPremium: true,
        price: 99,
        filePath: "./uploads/sample1.pdf",
        fileName: "sample1.pdf",
        fileSize: 1024000,
        isActive: true,
      },
      {
        title: "Video Lecture Series",
        description: "Expert video lectures",
        category: "exclusive",
        isPremium: false,
        price: 0,
        filePath: "./uploads/sample2.pdf",
        fileName: "sample2.pdf",
        fileSize: 1024000,
        isActive: true,
      },
      {
        title: "Mock Tests Collection",
        description: "Practice mock tests",
        category: "exclusive",
        isPremium: true,
        price: 149,
        filePath: "./uploads/sample3.pdf",
        fileName: "sample3.pdf",
        fileSize: 1024000,
        isActive: true,
      },
    ];

    const created = await PDF.insertMany(samplePDFs);
    console.log(`Created ${created.length} sample exclusive PDFs`);
    console.log("Sample exclusive content added successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error adding sample exclusive content:", error);
    process.exit(1);
  }
};

addSampleExclusive();
