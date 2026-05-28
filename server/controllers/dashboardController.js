const Transaction = require('../models/Transaction');

// @desc    Get dashboard summary cards and chart data
// @route   GET /api/dashboard/summary
// @access  Private
exports.getDashboardSummary = async (req, res) => {
  try {
    // 1. Get all transactions for the user
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

    // 2. Compute Summary Metrics (Total Income, Total Expense, Net Balance)
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    // 3. Category Breakdown (only for expenses)
    const categoryBreakdown = {};
    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
      }
    });

    const formattedCategoryBreakdown = Object.keys(categoryBreakdown).map((cat) => ({
      name: cat,
      value: Number(categoryBreakdown[cat].toFixed(2))
    }));

    // 4. Monthly Trend Data (Last 6 Months)
    // We group transactions by year-month
    const monthlyData = {};
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const year = date.getFullYear();
      const monthIdx = date.getMonth();
      const key = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
      const displayLabel = `${monthsName[monthIdx]} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { label: displayLabel, income: 0, expense: 0, sortKey: key };
      }

      if (tx.type === 'income') {
        monthlyData[key].income += tx.amount;
      } else {
        monthlyData[key].expense += tx.amount;
      }
    });

    // Sort months chronologically and take last 6
    const trendReport = Object.values(monthlyData)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-6);

    // 5. Get Recent 5 Transactions
    const recentTransactions = transactions.slice(0, 5);

    res.json({
      success: true,
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        netBalance: Number(netBalance.toFixed(2))
      },
      categoryBreakdown: formattedCategoryBreakdown,
      monthlyTrend: trendReport,
      recentTransactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error generating dashboard data' });
  }
};
