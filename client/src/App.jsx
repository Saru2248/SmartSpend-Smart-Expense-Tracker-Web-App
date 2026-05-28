import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { api } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const activeUser = api.auth.getCurrentUser();
    if (activeUser) {
      setUser(activeUser);
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#090d16',
        color: '#ffffff',
        fontFamily: 'var(--font-sans)',
        fontSize: '1.1rem',
        fontWeight: 500
      }}>
        Initializing SmartSpend...
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <main className="container" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '30px 0',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        borderTop: '1px solid var(--border-color)',
        marginTop: '60px'
      }}>
        <p>&copy; {new Date().getFullYear()} SmartSpend Tracker. Course Portfolio Project. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
