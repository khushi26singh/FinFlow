const express = require('express');
const router = express.Router();
const { getMyCreditScore, updateCreditProfile } = require('../controllers/creditScoreController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-score', protect, getMyCreditScore);
router.post('/update', protect, updateCreditProfile);

module.exports = router;