const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// All transaction routes are protected
router.use(protect);

router
  .route('/')
  .get(getTransactions)
  .post(addTransaction);

router
  .route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
