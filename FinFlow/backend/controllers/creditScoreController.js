const CreditScore = require('../models/CreditScore');

// @desc    Get or create credit score profile for logged in user
// @route   GET /api/credit/my-score
// @access  Private
const getMyCreditScore = async (req, res) => {
  try {
    let creditProfile = await CreditScore.findOne({ user: req.user._id });

    // If no score profile exists, generate a default initial score profile
    if (!creditProfile) {
      creditProfile = await CreditScore.create({
        user: req.user._id,
        score: 720,
        riskCategory: 'Low',
        annualIncome: 75000,
        existingDebt: 5000,
      });
    }

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
    const { annualIncome, existingDebt, score } = req.body;

    let riskCategory = 'Medium';
    if (score >= 750) riskCategory = 'Low';
    else if (score < 620) riskCategory = 'High';

    const creditProfile = await CreditScore.findOneAndUpdate(
      { user: req.user._id },
      { annualIncome, existingDebt, score, riskCategory },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: creditProfile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyCreditScore,
  updateCreditProfile,
};