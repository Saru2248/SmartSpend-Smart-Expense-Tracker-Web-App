import React, { useState } from 'react';
import { Edit2, Trash2, Filter, DollarSign, Calendar, Tag } from 'lucide-react';

const ALL_CATEGORIES = [
  'All',
  'Salary', 'Freelance', 'Investments', 'Refunds',
  'Food', 'Rent', 'Travel', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Health', 'Other'
];

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('All');

  // Filter transactions in memory
  const filteredTransactions = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
    return matchesType && matchesCategory;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="glass-card" style={{ flex: 1 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>History</h3>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-secondary)" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input"
              style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-input"
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="All">All Categories</option>
            {ALL_CATEGORIES.slice(1).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div style={{
          padding: '40px 0',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <DollarSign size={40} style={{ color: 'var(--text-muted)' }} />
          <p>No transactions found matching your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTransactions.map((tx) => (
            <div
              key={tx._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              {/* Left Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '60%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${tx.type}`}>
                    {tx.type}
                  </span>
                  <span style={{
                    fontWeight: 600,
                    color: '#ffffff',
                    fontSize: '0.95rem'
                  }}>
                    {tx.category}
                  </span>
                </div>
                {tx.description && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {tx.description}
                  </span>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <Calendar size={12} />
                  <span>{formatDate(tx.date)}</span>
                </div>
              </div>

              {/* Right Amount and Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-display)',
                  color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)'
                }}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onEdit(tx)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-glow)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                    title="Edit transaction"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(tx._id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-glow)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    title="Delete transaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
