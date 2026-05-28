const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type (income or expense)'],
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: [true, 'Please enter an amount'],
    min: [0.01, 'Amount must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please select a date'],
    default: Date.now
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
