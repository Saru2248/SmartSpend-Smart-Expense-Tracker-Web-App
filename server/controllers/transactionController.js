const Transaction = require('../models/Transaction');

// @desc    Get all transactions for the user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    
    // Build query object
    let query = { user: req.user._id };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Sort by date descending
    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving transactions' });
  }
};

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date, description } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Please provide type, amount and category' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      date: date || new Date(),
      description
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error adding transaction' });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Make sure transaction belongs to user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized to update this transaction' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error updating transaction' });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Make sure transaction belongs to user
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized to delete this transaction' });
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error deleting transaction' });
  }
};
