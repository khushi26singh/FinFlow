const loanApplicationService = require('../services/loanApplicationService');

const validateApplicationPayload = (payload) => {
  const requiredTopLevel = ['loanProduct', 'requestedAmount', 'tenureMonths', 'personalDetails', 'employmentDetails'];
  const missingTopLevel = requiredTopLevel.filter((field) => payload[field] === undefined || payload[field] === null);
  if (missingTopLevel.length > 0) {
    return `Missing required fields: ${missingTopLevel.join(', ')}`;
  }

  const requiredPersonalFields = ['fullName', 'dateOfBirth', 'phone', 'address', 'city', 'state', 'pincode'];
  const missingPersonal = requiredPersonalFields.filter((field) => !payload.personalDetails[field]);
  if (missingPersonal.length > 0) {
    return `Missing personal details: ${missingPersonal.join(', ')}`;
  }

  const requiredEmploymentFields = ['employmentType', 'monthlyIncome', 'experienceMonths'];
  const missingEmployment = requiredEmploymentFields.filter(
    (field) => payload.employmentDetails[field] === undefined || payload.employmentDetails[field] === ''
  );
  if (missingEmployment.length > 0) {
    return `Missing employment details: ${missingEmployment.join(', ')}`;
  }

  if (Number(payload.requestedAmount) <= 0) {
    return 'Requested amount must be greater than 0';
  }

  if (Number(payload.tenureMonths) <= 0) {
    return 'Tenure must be greater than 0 months';
  }

  if (Number(payload.employmentDetails.monthlyIncome) < 0) {
    return 'Monthly income cannot be negative';
  }

  if (Number(payload.employmentDetails.experienceMonths) < 0) {
    return 'Experience cannot be negative';
  }

  return null;
};

// @desc    Apply for a loan
// @route   POST /api/loans/apply
// @access  Private (Applicant)
const applyForLoan = async (req, res) => {
  try {
    const validationError = validateApplicationPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const application = await loanApplicationService.createApplication(req.user._id, req.body);
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
    const applications = await loanApplicationService.getApplicationsForUser(req.user._id);
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
    const applications = await loanApplicationService.getAllApplications();
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
    const application = await loanApplicationService.updateStatus(req.params.id, {
      status,
      rejectionReason,
      underwriterId: req.user?._id,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

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