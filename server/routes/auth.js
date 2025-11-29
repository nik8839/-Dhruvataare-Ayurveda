const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  sendOTP,
  verifyOTP,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { body } = require("express-validator");

// Validation middleware
const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("collegeName").trim().notEmpty().withMessage("College name is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateOTP = [
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("otp")
    .matches(/^[0-9]{6}$/)
    .withMessage("Please provide a valid 6-digit OTP"),
];

router.post(
  "/send-otp",
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  sendOTP
);
router.post("/verify-otp", validateOTP, verifyOTP);
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getMe);

module.exports = router;
