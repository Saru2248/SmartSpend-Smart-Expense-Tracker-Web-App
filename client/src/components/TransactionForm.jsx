import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X } from 'lucide-react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Refunds', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Travel', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Health', 'Other'];

const TransactionForm = ({ onSubmit, editTransaction, onCancelEdit }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Update form if editTransaction is provided
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount);
      setCategory(editTransaction.category);
      setDate(new Date(editTransaction.date).toISOString().split('T')[0]);
      setDescription(editTransaction.description || '');
    } else {
      resetForm();
    }
  }, [editTransaction]);

  // Adjust category if type changes
  useEffect(() => {
    if (!editTransaction) {
      if (type === 'income') {
        setCategory(INCOME_CATEGORIES[0]);
      } else {
        setCategory(EXPENSE_CATEGORIES[0]);
      }
    }
  }, [type, editTransaction]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    const payload = {
      type,
      amount: Number(amount),
      category,
      date,
      description
    };

    onSubmit(payload);
    if (!editTransaction) {
      resetForm();
    }
  };

  return (
    <div className="glass-card" style={{ height: 'fit-content' }}>
      <h3 style={{
        marginBottom: '20px',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#ffffff'
      }}>
        {editTransaction ? <Save size={18} color="var(--primary)" /> : <PlusCircle size={18} color="var(--primary)" />}
        {editTransaction ? 'Edit Transaction' : 'Add New Transaction'}
      </h3>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--danger)',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Transaction Type Toggles */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setType('expense')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: type === 'expense' ? 'var(--danger)' : 'var(--border-color)',
                background: type === 'expense' ? 'var(--danger-glow)' : 'transparent',
                color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: type === 'income' ? 'var(--success)' : 'var(--border-color)',
                background: type === 'income' ? 'var(--success-glow)' : 'transparent',
                color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Category Selector */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            className="form-input form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {type === 'income'
              ? INCOME_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              : EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="form-group">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            id="date"
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Description Input */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="description" className="form-label">Description (Optional)</label>
          <input
            id="description"
            type="text"
            className="form-input"
            placeholder="e.g. Groceries at supermarket"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength="200"
          />
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {editTransaction ? 'Save Changes' : 'Add Transaction'}
          </button>
          
          {editTransaction && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              style={{ padding: '12px' }}
              title="Cancel editing"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
