const LoanApplication = require('../models/LoanApplication');
const eligibilityService = require('../services/eligibilityService');

// @desc    Evaluate (or re-evaluate) eligibility for a loan application
// @route   GET /api/eligibility/:applicationId
// @access  Private (application owner, underwriter, or admin)
const checkEligibility = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.applicationId).populate(
      'loanProduct',
      'interestRate'
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const isOwner = application.applicant.toString() === req.user._id.toString();
    const isStaff = ['underwriter', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this application' });
    }

    const result = await eligibilityService.evaluateApplication(application);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkEligibility,
};