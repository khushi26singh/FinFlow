const loanApplicationService = require('../services/loanApplicationService');
const LoanApplication = require('../models/LoanApplication'); // <--- ADD THIS LINE!
// @desc    Upload documents for a loan application
// @route   POST /api/loans/applications/:id/documents
// @access  Private
const uploadDocuments = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await LoanApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files were uploaded' });
    }

    // Format the newly uploaded files
    const newDocuments = req.files.map(file => ({
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`, // The public URL path
      mimeType: file.mimetype
    }));

    // Ensure the documents array exists, then append the new ones
    application.documents = [...(application.documents || []), ...newDocuments];
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

const applyForLoan = async (req, res) => {
  try {
    const application = await loanApplicationService.applyForLoan({
      applicantId: req.user.id,
      payload: req.body,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await loanApplicationService.getMyApplications(req.user.id);
    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const result = await loanApplicationService.getAllApplications({ 
      status, search, page: parseInt(page), limit: parseInt(limit) 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await loanApplicationService.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const application = await loanApplicationService.updateApplicationStatus({
      id: req.params.id,
      status: req.body.status,
      remarks: req.body.remarks,
      assignedUnderwriterId: req.user?.id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getApplicationStats = async (req, res) => {
  try {
    const stats = await loanApplicationService.getApplicationStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  applyForLoan,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  uploadDocuments,
};