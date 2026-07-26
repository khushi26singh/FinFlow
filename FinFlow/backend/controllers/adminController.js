const User = require('../models/User');

// @desc    Create a new underwriter account
// @route   POST /api/admin/create-underwriter
// @access  Private/Admin Only
exports.createUnderwriter = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Force role to underwriter
    const underwriter = await User.create({
      name,
      email,
      password, // Provide a temporary password to the underwriter securely
      phone,
      role: 'underwriter',
    });

    res.status(201).json({
      success: true,
      message: 'Underwriter created successfully',
      data: {
        _id: underwriter._id,
        name: underwriter.name,
        email: underwriter.email,
        role: underwriter.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};