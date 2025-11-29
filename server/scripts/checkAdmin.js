const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const admin = await User.findOne({ phone: "9999999999" });
    if (admin) {
      console.log("Admin user found:", admin.email, admin.phone, admin.role);
      // Verify password manually if needed, but for now just existence
    } else {
      console.log("Admin user NOT found");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkAdmin();
