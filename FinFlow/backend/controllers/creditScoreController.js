const creditScoreService = require('../services/creditScoreService');

const validateCreditProfilePayload = (payload) => {
  if (payload.score !== undefined && (Number(payload.score) < 300 || Number(payload.score) > 900)) {
    return 'Credit score must be between 300 and 900';
  }

  if (payload.annualIncome !== undefined && Number(payload.annualIncome) < 0) {
    return 'Annual income cannot be negative';
  }

  if (payload.existingDebt !== undefined && Number(payload.existingDebt) < 0) {
    return 'Existing debt cannot be negative';
  }

  return null;
};

// @desc    Get or create credit score profile for logged in user
// @route   GET /api/credit/my-score
// @access  Private
const getMyCreditScore = async (req, res) => {
  try {
    const creditProfile = await creditScoreService.getOrCreateProfile(req.user._id);
    res.json({ success: true, data: creditProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update annual income & debt profile
// @route   POST /api/credit/update
// @access  Private
const updateCreditProfile = async (req, res) => {
  try {
    const validationError = validateCreditProfilePayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const creditProfile = await creditScoreService.updateProfile(req.user._id, req.body);
    res.json({ success: true, data: creditProfile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyCreditScore,
  updateCreditProfile,
};