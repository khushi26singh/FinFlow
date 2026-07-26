const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit(1);
    }

    await User.create({
      name: 'System Admin',
      email: 'admin@finflow.com',
      password: 'SecureAdminPassword123!', // Will be hashed by your User model pre-save hook
      phone: '1234567890',
      role: 'admin',
    });

    console.log('Admin successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();