const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get user budgets for a given month (YYYY-MM)
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ success: false, message: 'Please specify a month (YYYY-MM)' });
    }

    const budgets = await Budget.find({ user: req.user._id, month });

    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving budgets' });
  }
};

// @desc    Create or update a budget limit
// @route   POST /api/budgets
// @access  Private
exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    if (!limit || !month) {
      return res.status(400).json({ success: false, message: 'Please provide limit and month (YYYY-MM)' });
    }

    const categoryVal = category || 'All';

    // Find and update, or insert if not exists (upsert)
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category: categoryVal, month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error setting budget' });
  }
};

// @desc    Get budget spending details (limit vs actual) for a given month
// @route   GET /api/budgets/status
// @access  Private
exports.getBudgetStatus = async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    if (!month) {
      return res.status(400).json({ success: false, message: 'Please specify a month (YYYY-MM)' });
    }

    // 1. Fetch budgets for the user and month
    const budgets = await Budget.find({ user: req.user._id, month });

    // 2. Fetch all expenses for this user in this month
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);

    const expenses = await Transaction.find({
      user: req.user._id,
      type: 'expense',
      date: { $gte: start, $lte: end }
    });

    // 3. Compute aggregate actual expense by category
    const categorySpending = {};
    let totalExpense = 0;

    expenses.forEach((exp) => {
      totalExpense += exp.amount;
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    // 4. Map budgets to actual spending
    const report = budgets.map((b) => {
      const actual = b.category === 'All' ? totalExpense : (categorySpending[b.category] || 0);
      const difference = b.limit - actual;
      const percentage = b.limit > 0 ? Number(((actual / b.limit) * 100).toFixed(2)) : 0;
      const isExceeded = actual > b.limit;
      const isWarning = percentage >= 85 && percentage <= 100; // Trigger alert when approaching limit

      return {
        _id: b._id,
        category: b.category,
        limit: b.limit,
        actual,
        difference,
        percentage,
        isExceeded,
        isWarning
      };
    });

    res.json({
      success: true,
      month,
      totalExpense,
      report
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving budget status' });
  }
};
