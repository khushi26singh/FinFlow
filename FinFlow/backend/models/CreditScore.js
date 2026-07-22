const mongoose = require('mongoose');

const creditScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CreditScore', creditScoreSchema);