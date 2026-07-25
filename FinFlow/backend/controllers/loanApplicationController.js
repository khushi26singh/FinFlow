const loanApplicationService = require('../services/loanApplicationService');

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
};