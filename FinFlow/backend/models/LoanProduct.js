const mongoose = require('mongoose');

const loanProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanProduct', loanProductSchema);