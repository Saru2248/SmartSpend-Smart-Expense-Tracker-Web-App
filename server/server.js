const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST before anything else
dotenv.config();

// Initialize Database Connection
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for testing/development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Expense Tracker API is running' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
