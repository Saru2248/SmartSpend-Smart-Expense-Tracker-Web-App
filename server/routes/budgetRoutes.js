const express = require('express');
const router = express.Router();
const { getBudgets, setBudget, getBudgetStatus } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

// All budget routes are protected
router.use(protect);

router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.route('/status')
  .get(getBudgetStatus);

module.exports = router;
