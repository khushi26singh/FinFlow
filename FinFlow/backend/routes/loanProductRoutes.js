const express = require('express');
const router = express.Router();
const { getLoanProducts, createLoanProduct } = require('../controllers/loanProductController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getLoanProducts);
router.post('/', protect, createLoanProduct);

module.exports = router;