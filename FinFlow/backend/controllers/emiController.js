const emiService = require('../services/emiService');

const validateEmiPayload = (payload) => {
  const requiredFields = ['loanAmount', 'interestRate', 'tenureMonths'];
  const missingFields = requiredFields.filter(
    (field) => payload[field] === undefined || payload[field] === null || payload[field] === ''
  );

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(', ')}`;
  }

  if (Number.isNaN(Number(payload.loanAmount)) || Number(payload.loanAmount) <= 0) {
    return 'Loan amount must be a number greater than 0';
  }

  if (Number.isNaN(Number(payload.interestRate)) || Number(payload.interestRate) <= 0) {
    return 'Interest rate must be a number greater than 0';
  }

  const tenure = Number(payload.tenureMonths);
  if (Number.isNaN(tenure) || tenure <= 0 || !Number.isInteger(tenure)) {
    return 'Tenure must be a whole number of months greater than 0';
  }

  return null;
};

// @desc    Calculate EMI, total interest, total amount, and amortization schedule
// @route   POST /api/emi/calculate
// @access  Public
const calculateEmi = async (req, res) => {
  try {
    const validationError = validateEmiPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { loanAmount, interestRate, tenureMonths } = req.body;

    const result = emiService.calculate({
      loanAmount: Number(loanAmount),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  calculateEmi,
};