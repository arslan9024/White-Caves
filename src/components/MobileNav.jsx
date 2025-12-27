import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import { PUBLIC_NAV, ROLE_NAV, getRoleCategory } from '../config/navigation';
import './MobileNav.css';

export default function MobileNav({ isOpen, onClose }) {
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user.currentUser);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserRole(parsed.role);
      } catch (e) {
        setUserRole(null);
      }
    }
  }, [user]);

  const handleNavClick = (path) => {
    if (path.startsWith('#')) {
      onClose();
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
      onClose();
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const roleNav = userRole ? ROLE_NAV[userRole] : null;
  const roleCategory = getRoleCategory(userRole);

  return (
    <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className={`mobile-nav ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="mobile-nav-header">
          <img src="/company-logo.jpg" alt="White Caves" className="mobile-nav-logo" />
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="mobile-nav-content">
          <button className="mobile-home-btn" onClick={() => handleNavClick('/')}>
            <span>🏠</span> Home
          </button>

          <div className="mobile-nav-section">
            <button 
              className={`section-toggle ${expandedSection === 'explore' ? 'expanded' : ''}`}
              onClick={() => toggleSection('explore')}
            >
              <span>🔍 Explore</span>
              <span className="toggle-icon">{expandedSection === 'explore' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'explore' && (
              <div className="section-links">
                {PUBLIC_NAV.buy.map(item => (
                  <button key={item.path} onClick={() => handleNavClick(item.path)}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-nav-section">
            <button 
              className={`section-toggle ${expandedSection === 'rent' ? 'expanded' : ''}`}
              onClick={() => toggleSection('rent')}
            >
              <span>🔑 Rent</span>
              <span className="toggle-icon">{expandedSection === 'rent' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'rent' && (
              <div className="section-links">
                {PUBLIC_NAV.rent.map(item => (
                  <button key={item.path} onClick={() => handleNavClick(item.path)}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mobile-nav-section">
            <button 
              className={`section-toggle ${expandedSection === 'sell' ? 'expanded' : ''}`}
              onClick={() => toggleSection('sell')}
            >
              <span>💰 Sell</span>
              <span className="toggle-icon">{expandedSection === 'sell' ? '−' : '+'}</span>
            </button>
            {expandedSection === 'sell' && (
              <div className="section-links">
                {PUBLIC_NAV.sell.map(item => (
                  <button key={item.path} onClick={() => handleNavClick(item.path)}>
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user && roleNav && (
            <div className="mobile-nav-section role-section">
              <button 
                className={`section-toggle ${expandedSection === 'dashboard' ? 'expanded' : ''}`}
                onClick={() => toggleSection('dashboard')}
              >
                <span>{roleNav.icon} My {roleNav.label}</span>
                <span className="toggle-icon">{expandedSection === 'dashboard' ? '−' : '+'}</span>
              </button>
              {expandedSection === 'dashboard' && (
                <div className="section-links">
                  {roleNav.links.map(item => (
                    <button key={item.path} onClick={() => handleNavClick(item.path)}>
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mobile-nav-divider" />

          <div className="mobile-nav-links">
            <button onClick={() => handleNavClick('/services')}>
              <span>⚙️</span> Services
            </button>
            <button onClick={() => handleNavClick('/careers')}>
              <span>💼</span> Careers
            </button>
            <button onClick={() => handleNavClick('/contact')}>
              <span>📞</span> Contact Us
            </button>
          </div>

          <div className="mobile-nav-divider" />

          <div className="mobile-nav-footer">
            <button 
              className="theme-toggle-btn" 
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>

            {!user ? (
              <button 
                className="sign-in-btn"
                onClick={() => handleNavClick('/signin')}
              >
                🔐 Sign In
              </button>
            ) : (
              <button 
                className="profile-btn"
                onClick={() => handleNavClick('/profile')}
              >
                👤 My Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
