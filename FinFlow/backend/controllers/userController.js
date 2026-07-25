const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const { search = '', role = '' } = req.query;
    const users = await userService.listUsers({ search, role });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  updateRole,
};