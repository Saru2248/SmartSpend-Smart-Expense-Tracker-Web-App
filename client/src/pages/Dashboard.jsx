import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseCharts from '../components/ExpenseCharts';
import BudgetSummary from '../components/BudgetSummary';
import { TrendingUp, TrendingDown, Landmark, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [editTransaction, setEditTransaction] = useState(null);
  const [refreshBudgets, setRefreshBudgets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main loader for all dashboard states
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch summaries
      const summaryData = await api.dashboard.getSummary();
      if (summaryData.success) {
        setSummary(summaryData.summary);
        setCategoryBreakdown(summaryData.categoryBreakdown);
        setMonthlyTrend(summaryData.monthlyTrend);
      }

      // Fetch transaction list
      const txData = await api.transactions.getAll();
      if (txData.success) {
        setTransactions(txData.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
      setError('Could not connect to database or API. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAddOrUpdateTransaction = async (payload) => {
    try {
      if (editTransaction) {
        // Update mode
        await api.transactions.update(editTransaction._id, payload);
        setEditTransaction(null);
      } else {
        // Create mode
        await api.transactions.create(payload);
      }
      
      // Refresh transactions, analytics, and budgets status
      loadDashboardData();
      setRefreshBudgets((prev) => prev + 1);
    } catch (err) {
      alert(err.message || 'Error processing transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.transactions.delete(id);
        loadDashboardData();
        setRefreshBudgets((prev) => prev + 1);
      } catch (err) {
        alert(err.message || 'Error deleting transaction');
      }
    }
  };

  const handleEditTrigger = (tx) => {
    setEditTransaction(tx);
    // Scroll smoothly to form
    window.scrollTo({ top: document.getElementById('transaction-section')?.offsetTop - 80, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditTransaction(null);
  };

  const handleBudgetNotification = () => {
    // Reload dashboard summary data when budgets are updated
    loadDashboardData();
  };

  return (
    <div style={{ padding: '30px 0' }} className="animate-fade-in">
      
      {/* Dashboard Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
            Financial Overview
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time insights on incomes, expenses, and monthly budget reports
          </p>
        </div>
        
        <button
          onClick={loadDashboardData}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
          title="Refresh Data"
        >
          <RefreshCw size={16} className={loading ? 'spin-anim' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--danger)',
          padding: '14px 18px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {/* Summary Metrics Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Net Balance Card */}
        <div className="glass-card glow-primary" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Net Balance
            </p>
            <h3 style={{
              fontSize: '2rem',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontWeight: 700
            }}>
              ₹{summary.netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--primary)'
          }}>
            <Landmark size={24} />
          </div>
        </div>

        {/* Total Income Card */}
        <div className="glass-card glow-success" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Income
            </p>
            <h3 style={{
              fontSize: '2rem',
              color: 'var(--success)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700
            }}>
              +₹{summary.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--success)'
          }}>
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="glass-card glow-danger" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Total Expenses
            </p>
            <h3 style={{
              fontSize: '2rem',
              color: 'var(--danger)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700
            }}>
              -₹{summary.totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--danger)'
          }}>
            <TrendingDown size={24} />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ marginBottom: '30px' }}>
        <ExpenseCharts categoryData={categoryBreakdown} trendData={monthlyTrend} />
      </div>

      {/* Core CRUD Form and History List */}
      <div id="transaction-section" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        alignItems: 'start',
        marginBottom: '30px'
      }}>
        <TransactionForm
          onSubmit={handleAddOrUpdateTransaction}
          editTransaction={editTransaction}
          onCancelEdit={handleCancelEdit}
        />
        
        <TransactionList
          transactions={transactions}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {/* Budget Tracker Module */}
      <div>
        <BudgetSummary
          refreshTrigger={refreshBudgets}
          onBudgetUpdated={handleBudgetNotification}
        />
      </div>

      {/* Inline style overrides for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
