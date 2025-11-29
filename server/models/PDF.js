const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['syllabus', 'pyq', 'notes', 'exclusive'],
      required: true,
    },
    year: {
      type: String,
      enum: ['1st-year', '2nd-year', '3rd-year', null],
      default: null,
    },
    subject: {
      type: String,
      trim: true,
    },
    paper: {
      type: String,
      enum: ['paper-1', 'paper-2', null],
      default: null,
    },
    yearValue: {
      type: String,
      enum: ['2025', '2024', '2023', '2022', null],
      default: null,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
pdfSchema.index({ category: 1, year: 1, subject: 1 });
pdfSchema.index({ category: 1, year: 1, subject: 1, yearValue: 1, paper: 1 });
pdfSchema.index({ isPremium: 1 });
pdfSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PDF', pdfSchema);

