const User = require('../models/User');

const VALID_ROLES = ['applicant', 'underwriter', 'admin'];

const listUsers = async ({ search, role }) => {
  const query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  return User.find(query)
    .select('-password')
    .sort({ createdAt: -1 });
};

const updateUserRole = async (id, role) => {
  if (!VALID_ROLES.includes(role)) {
    throw new Error('Invalid user role');
  }

  return User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true })
    .select('-password');
};

module.exports = {
  listUsers,
  updateUserRole,
};