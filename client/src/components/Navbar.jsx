import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LogOut, Wallet, LayoutDashboard, User } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 13, 22, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: '#ffffff'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={20} color="#fff" />
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SmartSpend
          </span>
        </Link>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {user ? (
            <>
              <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <User size={14} color="#6366f1" />
                <span>Hi, <strong>{user.username}</strong></span>
              </div>

              <button 
                onClick={handleLogout} 
                className="btn btn-secondary" 
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
