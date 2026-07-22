const loanProductService = require('../services/loanProductService');

const validateLoanProductPayload = (payload, { partial = false } = {}) => {
  const requiredFields = ['name', 'minAmount', 'maxAmount', 'interestRate', 'tenureMonths'];
  const missingFields = requiredFields.filter((field) => !partial && payload[field] === undefined);

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  if (payload.minAmount !== undefined && Number(payload.minAmount) < 0) {
    return 'Minimum amount must be greater than or equal to 0';
  }

  if (payload.maxAmount !== undefined && Number(payload.maxAmount) < 0) {
    return 'Maximum amount must be greater than or equal to 0';
  }

  if (
    payload.minAmount !== undefined &&
    payload.maxAmount !== undefined &&
    Number(payload.minAmount) > Number(payload.maxAmount)
  ) {
    return 'Minimum amount cannot be greater than maximum amount';
  }

  if (payload.interestRate !== undefined && Number(payload.interestRate) <= 0) {
    return 'Interest rate must be greater than 0';
  }

  if (payload.tenureMonths !== undefined && Number(payload.tenureMonths) <= 0) {
    return 'Tenure must be greater than 0 months';
  }

  return null;
};

// @desc    Get all active loan products
// @route   GET /api/loan-products
// @access  Public
const getLoanProducts = async (req, res) => {
  try {
    const products = await loanProductService.getAllProducts({
      includeInactive: req.query.includeInactive === 'true',
    });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single loan product
// @route   GET /api/loan-products/:id
// @access  Public
const getLoanProductById = async (req, res) => {
  try {
    const product = await loanProductService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Loan product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new loan product
// @route   POST /api/loan-products
// @access  Private (Admin only)
const createLoanProduct = async (req, res) => {
  try {
    const validationError = validateLoanProductPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const product = await loanProductService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a loan product
// @route   PUT /api/loan-products/:id
// @access  Private (Admin only)
const updateLoanProduct = async (req, res) => {
  try {
    const validationError = validateLoanProductPayload(req.body, { partial: true });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const product = await loanProductService.updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Loan product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a loan product
// @route   DELETE /api/loan-products/:id
// @access  Private (Admin only)
const deleteLoanProduct = async (req, res) => {
  try {
    const product = await loanProductService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Loan product not found' });
    }

    res.json({ success: true, message: 'Loan product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLoanProducts,
  getLoanProductById,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
};