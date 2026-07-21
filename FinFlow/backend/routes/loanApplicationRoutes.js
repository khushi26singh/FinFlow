const express = require('express');
const router = express.Router();
const {
  applyForLoan,
  getMyApplications,
  getAllApplications,
  updateLoanStatus,
} = require('../controllers/loanApplicationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyForLoan);
router.get('/my-applications', protect, getMyApplications);
router.get('/applications', protect, getAllApplications);
router.patch('/applications/:id/status', protect, updateLoanStatus);

module.exports = router;