import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShieldAlert, Plus, CheckCircle } from 'lucide-react';

const BUDGET_CATEGORIES = ['All', 'Food', 'Rent', 'Travel', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Health', 'Other'];

const BudgetSummary = ({ refreshTrigger, onBudgetUpdated }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [category, setCategory] = useState('All');
  const [limit, setLimit] = useState('');
  const [report, setReport] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const fetchBudgetStatus = async () => {
    try {
      const res = await api.budgets.getStatus(month);
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Error fetching budget status:', err);
    }
  };

  useEffect(() => {
    fetchBudgetStatus();
  }, [month, refreshTrigger]);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setError('');

    if (!limit || Number(limit) < 0) {
      setError('Please enter a valid budget limit');
      return;
    }

    try {
      const res = await api.budgets.setLimit(category, Number(limit), month);
      if (res.success) {
        setSuccessMsg(`Budget for ${category} successfully updated!`);
        setLimit('');
        fetchBudgetStatus();
        if (onBudgetUpdated) {
          onBudgetUpdated();
        }
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Error updating budget limit');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Budget Control Form */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#ffffff' }}>Set Monthly Budgets</h3>
        
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
        
        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: 'var(--success)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle size={14} />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSetBudget} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          alignItems: 'end'
        }}>
          {/* Month Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Month</label>
            <input
              type="month"
              className="form-input"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          {/* Category Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-input form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {BUDGET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'Global Limit' : cat}</option>
              ))}
            </select>
          </div>

          {/* Limit Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Limit (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 500"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          {/* Action Submit */}
          <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
            <Plus size={16} />
            Set Limit
          </button>
        </form>
      </div>

      {/* Active Budgets List */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#ffffff' }}>Active Budgets ({month})</h3>

        {report.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>
            No budget limits defined for this month.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {report.map((b) => {
              // Determine progress color
              let progressColor = 'var(--success)';
              if (b.percentage >= 100) {
                progressColor = 'var(--danger)';
              } else if (b.percentage >= 85) {
                progressColor = 'var(--warning)';
              }

              return (
                <div key={b._id} style={{
                  background: 'rgba(255, 255, 255, 0.01)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}>
                  {/* Title and details */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: 600, color: '#ffffff' }}>
                      {b.category === 'All' ? 'Global Budget Limit' : b.category}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>₹{b.actual.toFixed(2)}</strong> of ₹{b.limit.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar Container */}
                  <div style={{
                    height: '8px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(b.percentage, 100)}%`,
                      background: progressColor,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease-out'
                    }}></div>
                  </div>

                  {/* Warning message/percentage */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem'
                  }}>
                    <span style={{ color: progressColor, fontWeight: 500 }}>
                      {b.percentage}% Used
                    </span>

                    {/* Exceeded / Warning Badge */}
                    {b.isExceeded && (
                      <span style={{
                        color: 'var(--danger)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ShieldAlert size={12} />
                        Over Budget! (-₹{Math.abs(b.difference).toFixed(2)})
                      </span>
                    )}

                    {b.isWarning && !b.isExceeded && (
                      <span style={{
                        color: 'var(--warning)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <ShieldAlert size={12} />
                        Approaching Limit (₹{b.difference.toFixed(2)} left)
                      </span>
                    )}

                    {!b.isExceeded && !b.isWarning && (
                      <span style={{ color: 'var(--text-muted)' }}>
                        ₹{b.difference.toFixed(2)} remaining
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSummary;
