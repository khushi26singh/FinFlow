// backend/services/loanApplicationService.js
const LoanApplication = require('../models/LoanApplication');
const eligibilityService = require('./eligibilityService');

class LoanApplicationService {
  async createApplication(applicantId, payload) {
    const application = await LoanApplication.create({
      applicant: applicantId,
      loanProduct: payload.loanProduct,
      personalDetails: payload.personalDetails,
      employmentDetails: payload.employmentDetails,
      requestedAmount: payload.requestedAmount,
      tenureMonths: payload.tenureMonths,
    });

    await application.populate('loanProduct', 'interestRate');

    const eligibilityResult = await eligibilityService.evaluateApplication(application);

    application.eligibility = eligibilityResult;
    application.status = eligibilityResult.isEligible ? 'under_review' : 'rejected';
    if (!eligibilityResult.isEligible) {
      application.remarks = 'Automatically rejected: application did not meet eligibility criteria.';
    }

    await application.save();

    return application;
  }

  async getApplicationsForUser(applicantId) {
    return LoanApplication.find({ applicant: applicantId })
      .populate('loanProduct', 'name interestRate')
      .sort({ createdAt: -1 });
  }

  async getAllApplications() {
    return LoanApplication.find()
      .populate('applicant', 'name email')
      .populate('loanProduct', 'name interestRate')
      .sort({ createdAt: -1 });
  }

  async updateStatus(id, { status, rejectionReason, underwriterId }) {
    const application = await LoanApplication.findById(id);
    if (!application) return null;

    if (status) application.status = status;
    if (rejectionReason) application.remarks = rejectionReason;
    if (underwriterId) application.assignedUnderwriter = underwriterId;

    await application.save();
    return application;
  }
}

module.exports = new LoanApplicationService();