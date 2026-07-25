const LoanApplication = require('../models/LoanApplication');
const LoanProduct = require('../models/LoanProduct');
const eligibilityService = require('./eligibilityService');

const ALLOWED_STATUSES = ['pending', 'under_review', 'approved', 'agreement', 'disbursed', 'rejected'];

const STATUS_TRANSITIONS = {
  pending: ['under_review', 'rejected'],
  under_review: ['approved', 'rejected'],
  approved: ['agreement', 'rejected'],
  agreement: ['disbursed', 'rejected'],
  disbursed: [],
  rejected: [],
};

const getAllApplications = async ({ status, search, page, limit }) => {
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (search) {
    // Search against the nested personalDetails.fullName using regex
    query['personalDetails.fullName'] = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;
  const total = await LoanApplication.countDocuments(query);
  const applications = await LoanApplication.find(query)
    .populate('applicant', 'name email role phone createdAt')
    .populate('loanProduct', 'name type interestRate tenureMonths')
    .populate('assignedUnderwriter', 'name email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    applications,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalCount: total
  };
};

const getApplicationById = async (id) => {
  return await LoanApplication.findById(id)
    .populate('applicant', 'name email role')
    .populate('loanProduct')
    .populate('assignedUnderwriter', 'name email role');
};

const getApplicationStats = async () => {
  // 1. Status breakdown pie chart data
  const statusBreakdown = await LoanApplication.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // 2. Loan distribution by product (populate doesn't work directly in aggregate, we group by ID)
  const productDistribution = await LoanApplication.aggregate([
    { $group: { _id: '$loanProduct', count: { $sum: 1 }, totalAmount: { $sum: '$requestedAmount' } } },
    { $lookup: { from: 'loanproducts', localField: '_id', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    { $project: { name: '$product.name', count: 1, totalAmount: 1 } }
  ]);

  // 3. Approval rate %
  const totalDecided = await LoanApplication.countDocuments({ status: { $in: ['approved', 'rejected', 'agreement', 'disbursed'] } });
  const totalApproved = await LoanApplication.countDocuments({ status: { $in: ['approved', 'agreement', 'disbursed'] } });
  const approvalRate = totalDecided === 0 ? 0 : Math.round((totalApproved / totalDecided) * 100);

  // 4. Monthly application counts (for the line chart)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyCounts = await LoanApplication.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { 
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 }
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return {
    statusBreakdown,
    productDistribution,
    approvalRate,
    monthlyCounts
  };
};

const applyForLoan = async ({ applicantId, payload }) => {
  const loanProduct = await LoanProduct.findById(payload.loanProduct);

  if (!loanProduct) {
    throw new Error('Loan product not found');
  }

  const eligibility = await eligibilityService.evaluateApplication({
    ...payload,
    applicant: applicantId,
    loanProduct,
  });

  const status = eligibility.isEligible ? 'under_review' : 'rejected';

  const application = await LoanApplication.create({
    ...payload,
    applicant: applicantId,
    status,
    eligibility,
  });

  return LoanApplication.findById(application._id)
    .populate('applicant', 'name email role')
    .populate('loanProduct');
};

const getMyApplications = async (applicantId) => {
  return LoanApplication.find({ applicant: applicantId })
    .populate('loanProduct', 'name type interestRate')
    .sort({ createdAt: -1 });
};

const updateApplicationStatus = async ({ id, status, remarks, assignedUnderwriterId }) => {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error('Invalid application status');
  }

  const application = await LoanApplication.findById(id);

  if (!application) {
    return null;
  }

  const allowedTransitions = STATUS_TRANSITIONS[application.status] || [];
  if (application.status !== status && !allowedTransitions.includes(status)) {
    throw new Error(`Cannot change status from ${application.status} to ${status}`);
  }

  application.status = status;

  if (remarks !== undefined) {
    application.remarks = remarks;
  }

  if (assignedUnderwriterId) {
    application.assignedUnderwriter = assignedUnderwriterId;
  }

  await application.save();

  return LoanApplication.findById(application._id)
    .populate('applicant', 'name email role')
    .populate('loanProduct')
    .populate('assignedUnderwriter', 'name email role');
};

module.exports = {
  getAllApplications,
  getApplicationById,
  getApplicationStats,
  applyForLoan,
  getMyApplications,
  updateApplicationStatus,
};