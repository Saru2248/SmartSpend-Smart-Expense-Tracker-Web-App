const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category for this budget (or All for a global limit)'],
    trim: true,
    default: 'All'
  },
  limit: {
    type: Number,
    required: [true, 'Please set a budget limit'],
    min: [0, 'Limit cannot be negative']
  },
  month: {
    type: String,
    required: [true, 'Please specify the month (YYYY-MM)'],
    match: [/^\d{4}-\d{2}$/, 'Please use the YYYY-MM format']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user only has one budget per category per month
BudgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
