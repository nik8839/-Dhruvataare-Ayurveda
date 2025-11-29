const User = require("../models/User");
const Analytics = require("../models/Analytics");
const generateToken = require("../utils/generateToken");
const { cacheSet } = require("../config/redis");

// Simple OTP storage (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide a phone number",
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP (expires in 10 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send OTP via SMS
    let smsSent = false;
    
    try {
      // Twilio SMS - Primary SMS provider
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        
        await client.messages.create({
          body: `Your OTP for EduTech is: ${otp}. Valid for 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${phone}`
        });
        
        console.log(`✅ Twilio SMS sent to ${phone}`);
        smsSent = true;
      }
      
      // Console fallback (Development mode)
      if (!smsSent) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`📱 OTP for ${phone}: ${otp}`);
        console.log(`⏰ Valid for 10 minutes`);
        console.log(`${'='.repeat(50)}\n`);
      }
    } catch (smsError) {
      console.error('SMS sending failed:', smsError.message);
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📱 FALLBACK OTP for ${phone}: ${otp}`);
      console.log(`${'='.repeat(50)}\n`);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number and OTP",
      });
    }

    const storedOTP = otpStore.get(phone);

    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified successfully
    otpStore.set(phone, {
      ...storedOTP,
      verified: true,
    });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, phone, collegeName, password } = req.body;

    // Verify OTP was verified
    const storedOTP = otpStore.get(phone);
    if (!storedOTP || !storedOTP.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your phone number with OTP first",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      collegeName,
      password,
    });

    // Clear OTP after successful registration
    otpStore.delete(phone);

    const token = generateToken(user._id);

    // Cache user token
    await cacheSet(`user:${token}`, user, 900);

    // Track analytics
    setImmediate(async () => {
      try {
        await Analytics.create({
          type: "user_register",
          userId: user._id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        collegeName: user.collegeName,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Validate phone & password
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number and password",
      });
    }

    // Check for user
    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const token = generateToken(user._id);

    // Cache user token
    await cacheSet(`user:${token}`, user, 900);

    // Track analytics
    setImmediate(async () => {
      try {
        await Analytics.create({
          type: "user_login",
          userId: user._id,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        collegeName: user.collegeName,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        collegeName: user.collegeName,
        email: user.email,
        role: user.role,
        photo: user.photo,
        purchasedItems: user.purchasedItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  sendOTP,
  verifyOTP,
};
