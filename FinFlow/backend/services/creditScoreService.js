// backend/services/creditScoreService.js
const CreditScore = require('../models/CreditScore');

const deriveRiskProfile = (score) => {
  if (score >= 750) return { status: 'Excellent', riskCategory: 'Low' };
  if (score >= 650) return { status: 'Good', riskCategory: 'Low' };
  if (score >= 550) return { status: 'Fair', riskCategory: 'Medium' };
  return { status: 'Poor', riskCategory: 'High' };
};

class CreditScoreService {
  async getOrCreateProfile(userId) {
    let profile = await CreditScore.findOne({ user: userId });

    if (!profile) {
      const defaults = deriveRiskProfile(720);
      profile = await CreditScore.create({
        user: userId,
        score: 720,
        status: defaults.status,
        riskCategory: defaults.riskCategory,
        annualIncome: 75000,
        existingDebt: 5000,
      });
    }

    return profile;
  }

  async updateProfile(userId, { annualIncome, existingDebt, score }) {
    const update = {};
    if (annualIncome !== undefined) update.annualIncome = annualIncome;
    if (existingDebt !== undefined) update.existingDebt = existingDebt;
    if (score !== undefined) {
      update.score = score;
      const derived = deriveRiskProfile(score);
      update.status = derived.status;
      update.riskCategory = derived.riskCategory;
    }

    return CreditScore.findOneAndUpdate(
      { user: userId },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }
}

module.exports = new CreditScoreService();