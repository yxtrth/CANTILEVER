import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-icon">📝</span>
            <span>BlogSpace</span>
          </Link>

          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-button" onClick={closeMobileMenu}>
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-button dashboard-btn" onClick={closeMobileMenu}>
                  Dashboard
                </Link>
                <Link to="/create-post" className="nav-button primary" onClick={closeMobileMenu}>
                  ✍️ Write Post
                </Link>
                
                <div className="user-info">
                  <span className="user-avatar">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name">{user?.firstName}</span>
                </div>
                
                <Link to="/profile" className="nav-button" onClick={closeMobileMenu}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="nav-button primary signup-btn" onClick={closeMobileMenu}>
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
