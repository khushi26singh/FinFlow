const mongoose = require('mongoose');

const creditScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    riskCategory: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    annualIncome: {
      type: Number,
      default: 0,
    },
    // Existing monthly debt/EMI obligations (not annual) — used for DTI calculations
    existingDebt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreditScore', creditScoreSchema);