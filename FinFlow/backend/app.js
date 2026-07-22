const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const loanProductRoutes = require('./routes/loanProductRoutes');
const loanApplicationRoutes = require('./routes/loanApplicationRoutes');
const creditScoreRoutes = require('./routes/creditScoreRoutes');
const emiRoutes = require('./routes/emiRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Base Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loan-products', loanProductRoutes);
app.use('/api/loans/products', loanProductRoutes);
app.use('/api/loans', loanApplicationRoutes);
app.use('/api/credit', creditScoreRoutes);
app.use('/api/emi', emiRoutes);

module.exports = app;