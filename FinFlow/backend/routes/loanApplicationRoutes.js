const express = require('express');
const {
  applyForLoan,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  uploadDocuments,
} = require('../controllers/loanApplicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
// Also ensure uploadDocuments is imported from your controller!
// Customer routes
router.post('/apply', protect, applyForLoan);
router.get('/my-applications', protect, getMyApplications);

// Admin / Underwriter routes
// NOTE: /stats must come before /:id so 'stats' isn't treated as an ID parameter
router.get('/stats', protect, authorize('admin', 'underwriter'), getApplicationStats);
router.get('/', protect, authorize('admin', 'underwriter'), getAllApplications);
router.get('/:id', protect, authorize('admin', 'underwriter'), getApplicationById);
router.patch('/:id/status', protect, authorize('admin', 'underwriter'), updateApplicationStatus);
// Upload up to 5 documents at once under the field name 'documents'
router.post('/:id/documents', protect, upload.array('documents', 5), uploadDocuments);

module.exports = router;