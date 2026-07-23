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
      required: true,
    },
    personalDetails: {
      fullName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    employmentDetails: {
      employmentType: {
        type: String,
        enum: ['salaried', 'self_employed', 'business_owner', 'unemployed'],
        required: true,
      },
      employerName: { type: String },
      monthlyIncome: { type: Number, required: true },
      experienceMonths: { type: Number, required: true },
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
    assignedUnderwriter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    eligibility: {
      isEligible: { type: Boolean },
      checks: [
        {
          rule: { type: String },
          label: { type: String },
          value: { type: mongoose.Schema.Types.Mixed },
          passed: { type: Boolean },
        },
      ],
      evaluatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);