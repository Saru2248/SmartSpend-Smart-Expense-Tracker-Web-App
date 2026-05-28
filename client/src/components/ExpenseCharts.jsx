import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#14b8a6'  // Teal
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 14px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
          {payload[0].name}
        </p>
        <p style={{ margin: '4px 0 0 0', fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
          ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseCharts = ({ categoryData = [], trendData = [] }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      
      {/* Category Breakdown (Pie/Donut) */}
      <div className="glass-card" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#ffffff' }}>Category Distribution</h3>
        
        {categoryData.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            No expense data available for visualization.
          </div>
        ) : (
          <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '0.78rem', color: '#94a3b8', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Trend (Bar Chart) */}
      <div className="glass-card" style={{ minHeight: '360px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: '#ffffff' }}>Income vs Expense Trend</h3>

        {trendData.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            No transaction history to display trends.
          </div>
        ) : (
          <div style={{ flex: 1, width: '100%', minHeight: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          background: '#1e293b',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          padding: '10px 14px',
                          borderRadius: '8px'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                            {payload[0].payload.label}
                          </p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--success)' }}>
                            Income: ₹{payload[0].value.toFixed(2)}
                          </p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--danger)' }}>
                            Expense: ₹{payload[1].value.toFixed(2)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="var(--success)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};

export default ExpenseCharts;
