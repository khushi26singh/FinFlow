const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loanProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanProduct',
    },
    requestedAmount: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    creditScore: { type: Number },
    remarks: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);