const LoanProduct = require('../models/LoanProduct');

// @desc    Get all active loan products
// @route   GET /api/loans/products
// @access  Public
const getLoanProducts = async (req, res) => {
  try {
    const products = await LoanProduct.find({ isActive: true });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new loan product
// @route   POST /api/loans/products
// @access  Private (Admin only)
const createLoanProduct = async (req, res) => {
  try {
    const product = await LoanProduct.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLoanProducts,
  createLoanProduct,
};