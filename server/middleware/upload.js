const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dhruvataare-pdfs', // Folder name in Cloudinary
    resource_type: 'raw', // Use raw
    access_mode: 'public', // Ensure files are public
    public_id: (req, file) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return 'pdf-' + uniqueSuffix; // No extension!
    },
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: fileFilter,
});

// Wrap multer to handle errors gracefully
const upload = (req, res, next) => {
  uploadMiddleware.single('pdf')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary Upload Error:', err);
      // Pass error to Express error handler
      return next(err);
    }
    next();
  });
};

module.exports = { single: () => upload }; // Mocking the .single() interface for compatibility

