const express = require('express');
const router = express.Router();
const {
  getPDFs,
  getTaxonomy,
  getPDF,
  viewPDF,
  downloadPDF,
  createPDF,
  updatePDF,
  deletePDF,
  clearCache,
} = require('../controllers/pdfController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/').get(getPDFs).post(protect, authorize('admin'), upload.single('pdf'), createPDF);
router.route('/taxonomy').get(getTaxonomy);
router.route('/clear-cache').post(protect, authorize('admin'), clearCache);
router.route('/:id').get(getPDF).put(protect, authorize('admin'), updatePDF).delete(protect, authorize('admin'), deletePDF);
router.route('/:id/view').get(viewPDF);
router.route('/:id/download').get(protect, downloadPDF);

module.exports = router;

