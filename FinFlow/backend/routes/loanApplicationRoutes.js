const express = require('express');
const {
  applyForLoan,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
} = require('../controllers/loanApplicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Customer routes
router.post('/apply', protect, applyForLoan);
router.get('/my-applications', protect, getMyApplications);

// Admin / Underwriter routes
// NOTE: /stats must come before /:id so 'stats' isn't treated as an ID parameter
router.get('/stats', protect, authorize('admin', 'underwriter'), getApplicationStats);
router.get('/', protect, authorize('admin', 'underwriter'), getAllApplications);
router.get('/:id', protect, authorize('admin', 'underwriter'), getApplicationById);
router.patch('/:id/status', protect, authorize('admin', 'underwriter'), updateApplicationStatus);

module.exports = router;