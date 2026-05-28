# 💸 SmartSpend — Smart Expense Tracker Web Application



<p align="center">

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

</p>

---

## 📌 Overview

**SmartSpend** is a production-oriented MERN Stack Expense Tracker Web Application designed to help users manage personal finances, analyze spending habits, monitor monthly budgets, and visualize transaction insights using interactive dashboards and charts.

The application provides:

* Secure JWT Authentication
* Income & Expense Tracking
* Category-Based Budgeting
* Interactive Analytics Dashboard
* Real-Time Financial Insights
* Responsive Modern UI

This project demonstrates real-world Full Stack Development concepts including authentication, REST APIs, MongoDB integration, protected routes, CRUD operations, state management, and data visualization.

---

# 🚀 Live Features

## ✅ Authentication System

* User Registration
* Secure Login
* JWT Authorization
* Password Hashing using bcrypt

## 💰 Transaction Management

* Add Income
* Add Expenses
* Edit Transactions
* Delete Transactions
* Category Filtering
* Transaction History

## 📊 Dashboard Analytics

* Total Income
* Total Expenses
* Remaining Balance
* Monthly Reports
* Category-wise Analytics

## 📈 Data Visualization

* Pie Charts
* Bar Graphs
* Monthly Spending Trends
* Budget Utilization Charts

## 🎯 Budget Tracking

* Set Monthly Budgets
* Budget Warnings
* Overspending Alerts
* Category Spending Limits

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Recharts
* Tailwind CSS / Custom CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

## Database

* MongoDB
* Mongoose ODM

## Tools & Platforms

* GitHub
* Postman
* MongoDB Atlas
* VS Code

---

# 🧱 System Architecture

```text
Client (React.js Frontend)
        │
        ▼
REST API Calls (Axios)
        │
        ▼
Express.js Backend Server
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Auth  Transactions Budgets
Routes   Routes     Routes
        │
        ▼
MongoDB Database
```

---

# 📂 Project Structure

```bash
Smart-Expense-Tracker-Web-App/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── screenshots/
├── README.md
├── .gitignore
└── .env.example
```

---

# 🔐 Authentication Flow

```text
User Login/Register
        │
        ▼
JWT Token Generated
        │
        ▼
Stored in LocalStorage
        │
        ▼
Protected API Requests
        │
        ▼
Backend Middleware Verification
```

---

# 🗄️ Database Collections

## User Collection

```json
{
  "name": "Sarthak",
  "email": "sarthak@gmail.com",
  "password": "hashed_password"
}
```

## Transaction Collection

```json
{
  "userId": "ObjectId",
  "type": "expense",
  "category": "Food",
  "amount": 250,
  "description": "Lunch",
  "date": "2026-05-28"
}
```

## Budget Collection

```json
{
  "userId": "ObjectId",
  "monthlyBudget": 20000
}
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/Smart-Expense-Tracker-Web-App.git
cd Smart-Expense-Tracker-Web-App
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run Backend Server

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# 🌐 API Endpoints

## Authentication APIs

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

---

## Transaction APIs

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | /api/transactions     |
| POST   | /api/transactions     |
| PUT    | /api/transactions/:id |
| DELETE | /api/transactions/:id |

---

## Budget APIs

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /api/budgets |
| GET    | /api/budgets |

---


---

# 🧪 Testing

## API Testing

* Postman Collection
* JWT Protected Routes
* CRUD Validation
* Error Handling

## Manual Testing

* Login Validation
* Transaction CRUD
* Budget Alerts
* Chart Updates

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing using bcryptjs
* Protected Backend Routes
* Environment Variable Protection
* MongoDB Validation

---

# 📈 Future Improvements

* AI Expense Prediction
* Export Reports as PDF
* Email Notifications
* Dark Mode
* Multi-Currency Support
* Mobile App Version
* Recurring Payments System

---

# 🎯 Learning Outcomes

This project demonstrates:

* Full Stack MERN Development
* REST API Design
* Authentication Systems
* MongoDB Integration
* React State Management
* CRUD Operations
* Responsive UI Development
* Data Visualization
* GitHub Project Structuring

---

# 👨‍💻 Author

## Sarthak Dhumal

* Full Stack Developer
* MERN Stack Enthusiast
* Backend & FinTech Project Developer

---

# ⭐ Repository Guidelines

If you found this project useful:

* Star the repository
* Fork the project
* Create pull requests
* Share feedback

---

