const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
const errorHandler = require("./middleware/errorHandler");
const trackAnalytics = require("./middleware/analytics");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Connect to Redis
connectRedis();

const app = express();

// Trust proxy - required for rate limiting behind load balancers (Render, Vercel, etc.)
app.set('trust proxy', 1);

// Security middleware - Configure helmet to allow iframe embedding
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "frame-ancestors": ["'self'", "http://localhost:3000", "https://dhruvataare-ayurveda.vercel.app", "https://dhruvataare-ayurveda-u61c.vercel.app"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://dhruvataare-ayurveda-u61c.vercel.app",
      "https://dhruvataare-ayurveda.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// More strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased from 5 to 100 for testing
  message: "Too many login attempts, please try again later.",
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Track page views
app.use("/api/", (req, res, next) => {
  if (req.path !== "/health" && !req.path.startsWith("/analytics")) {
    setImmediate(async () => {
      try {
        const Analytics = require("./models/Analytics");
        await Analytics.create({
          type: "page_view",
          page: req.path,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    });
  }
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/pdfs", require("./routes/pdfs"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/analytics", require("./routes/analytics"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;
