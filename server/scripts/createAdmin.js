require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env file!');
      console.log('Please add MONGODB_URI to server/.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const adminPhone = process.env.ADMIN_PHONE || "9999999999";
    const adminPassword = process.env.ADMIN_PASSWORD || "SecurePassword123";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@edutech.com";

    // Check if admin exists
    const existingAdmin = await User.findOne({ phone: adminPhone });
    if (existingAdmin) {
      console.log("\n✅ Admin user already exists!");
      console.log(`📱 Phone: ${adminPhone}`);
      console.log(`🔐 Password: ${adminPassword}`);
      console.log(`\nLogin at: http://localhost:3000/admin/login\n`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      phone: adminPhone,
      password: adminPassword,
      role: "admin",
      collegeName: "EduTech Admin",
    });

    console.log("\n✅ Admin user created successfully!");
    console.log(`📱 Phone: ${adminPhone}`);
    console.log(`🔐 Password: ${adminPassword}`);
    console.log(`\nLogin at: http://localhost:3000/admin/login\n`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
