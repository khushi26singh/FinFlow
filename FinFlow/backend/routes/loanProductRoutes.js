const express = require('express');
const router = express.Router();
const {
	getLoanProducts,
	getLoanProductById,
	createLoanProduct,
	updateLoanProduct,
	deleteLoanProduct,
} = require('../controllers/loanProductController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getLoanProducts);
router.get('/:id', getLoanProductById);
router.post('/', protect, createLoanProduct);
router.put('/:id', protect, updateLoanProduct);
router.delete('/:id', protect, deleteLoanProduct);

module.exports = router;