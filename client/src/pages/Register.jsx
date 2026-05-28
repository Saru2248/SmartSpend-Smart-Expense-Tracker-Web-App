import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User, Mail, Lock, Wallet, ArrowRight } from 'lucide-react';

const Register = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const data = await api.auth.register(username, email, password);
      setUser({ username: data.username, email: data.email, _id: data._id });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 80px)',
      padding: '24px 0'
    }} className="animate-fade-in">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Brand/Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '12px',
            borderRadius: '14px',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
          }}>
            <Wallet size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#ffffff', marginBottom: '8px' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join SmartSpend and master your budgeting goals
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label htmlFor="password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)'
              }} />
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Get Started'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
