const LoanApplication = require('../models/LoanApplication');

// @desc    Apply for a loan
// @route   POST /api/loans/apply
// @access  Private (Applicant)
const applyForLoan = async (req, res) => {
  try {
    const { loanProduct, amountRequested, tenureMonths } = req.body;

    const application = await LoanApplication.create({
      applicant: req.user._id,
      loanProduct,
      amountRequested,
      tenureMonths,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's loan applications
// @route   GET /api/loans/my-applications
// @access  Private (Applicant)
const getMyApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({ applicant: req.user._id })
      .populate('loanProduct', 'name interestRate');
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications (Underwriter / Admin)
// @route   GET /api/loans/applications
// @access  Private (Underwriter/Admin)
const getAllApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find()
      .populate('applicant', 'name email')
      .populate('loanProduct', 'name interestRate');
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update loan status (Approve / Reject)
// @route   PATCH /api/loans/applications/:id/status
// @access  Private (Underwriter/Admin)
const updateLoanStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status || application.status;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    if (req.user) application.assignedUnderwriter = req.user._id;

    await application.save();
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForLoan,
  getMyApplications,
  getAllApplications,
  updateLoanStatus,
};