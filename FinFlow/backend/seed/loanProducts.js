const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const LoanProduct = require('../models/LoanProduct');

dotenv.config();

const loanProducts = [
  {
    name: 'Personal Loan',
    description: 'Quick unsecured financing for personal expenses.',
    minAmount: 50000,
    maxAmount: 1000000,
    interestRate: 11.5,
    tenureMonths: 60,
    isActive: true,
  },
  {
    name: 'Education Loan',
    description: 'Support for higher education and skill development.',
    minAmount: 100000,
    maxAmount: 2500000,
    interestRate: 9.2,
    tenureMonths: 120,
    isActive: true,
  },
  {
    name: 'Medical Loan',
    description: 'Covers planned and emergency medical expenses.',
    minAmount: 25000,
    maxAmount: 750000,
    interestRate: 10.8,
    tenureMonths: 48,
    isActive: true,
  },
  {
    name: 'Travel Loan',
    description: 'Financing for domestic and international trips.',
    minAmount: 25000,
    maxAmount: 500000,
    interestRate: 12.4,
    tenureMonths: 36,
    isActive: true,
  },
  {
    name: 'Home Renovation',
    description: 'Funds for repairs, interiors, and home improvements.',
    minAmount: 100000,
    maxAmount: 3000000,
    interestRate: 10.1,
    tenureMonths: 84,
    isActive: true,
  },
  {
    name: 'Marriage Loan',
    description: 'Helps manage wedding and celebration expenses.',
    minAmount: 50000,
    maxAmount: 1500000,
    interestRate: 11.9,
    tenureMonths: 60,
    isActive: true,
  },
  {
    name: 'Car Loan',
    description: 'Affordable financing for new and used cars.',
    minAmount: 200000,
    maxAmount: 5000000,
    interestRate: 8.75,
    tenureMonths: 84,
    isActive: true,
  },
  {
    name: 'Two Wheeler Loan',
    description: 'Loan options for bikes and scooters.',
    minAmount: 30000,
    maxAmount: 300000,
    interestRate: 9.85,
    tenureMonths: 48,
    isActive: true,
  },
];

const seedLoanProducts = async () => {
  await connectDB();

  for (const product of loanProducts) {
    await LoanProduct.updateOne(
      { name: product.name },
      { $set: product },
      { upsert: true }
    );
  }

  console.log(`Seeded ${loanProducts.length} loan products.`);
  await mongoose.connection.close();
};

seedLoanProducts().catch(async (error) => {
  console.error('Loan product seed failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});