const express = require('express');
const { 
  getLoanProducts, 
  getLoanProductById, 
  createLoanProduct, 
  updateLoanProduct, 
  deleteLoanProduct 
} = require('../controllers/loanProductController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public reads
router.get('/', getLoanProducts);
router.get('/:id', getLoanProductById);

// Admin-only writes
router.post('/', protect, authorize('admin'), createLoanProduct);
router.put('/:id', protect, authorize('admin'), updateLoanProduct);
router.delete('/:id', protect, authorize('admin'), deleteLoanProduct);

module.exports = router;