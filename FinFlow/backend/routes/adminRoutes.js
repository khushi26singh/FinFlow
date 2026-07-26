const express = require('express');
const router = express.Router();
const { createUnderwriter } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Admins can hit this route
router.post('/create-underwriter', protect, authorize('admin'), createUnderwriter);

module.exports = router;