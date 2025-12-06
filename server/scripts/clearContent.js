const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('redis');
const PDF = require('../models/PDF');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const clearContent = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all PDFs
    const result = await PDF.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} PDFs`);

    // Clear Redis Cache
    if (process.env.UPSTASH_REDIS_URL) {
      const redis = createClient({
        url: process.env.UPSTASH_REDIS_URL
      });
      await redis.connect();
      await redis.flushAll();
      console.log('🧹 Redis cache cleared');
      await redis.disconnect();
    }

    console.log('✨ All content cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing content:', error);
    process.exit(1);
  }
};

clearContent();
