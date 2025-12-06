const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const PDF = require('../models/PDF');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const debugSyllabus = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const pdfs = await PDF.find({ category: 'syllabus' });
    console.log(`Found ${pdfs.length} syllabus PDFs:`);
    
    pdfs.forEach(pdf => {
      console.log('--------------------------------');
      console.log(`Title: ${pdf.title}`);
      console.log(`Subject: ${pdf.subject}`);
      console.log(`Year: '${pdf.year}' (Type: ${typeof pdf.year})`);
      console.log(`IsActive: ${pdf.isActive}`);
      console.log(`ID: ${pdf._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugSyllabus();
