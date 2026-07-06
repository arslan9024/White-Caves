import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { setActiveRole, closeAllMenus, setTheme } from '../../store/navigationSlice';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import './UniversalProfile.css';

export default function UniversalProfile({ variant = 'default', showSignIn = true }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const { activeRole, theme } = useSelector(state => state.navigation);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getRoleInfo = (role) => {
    const roles = {
      'buyer': { label: 'Buyer', icon: '🏠', color: '#3b82f6' },
      'seller': { label: 'Seller', icon: '💰', color: '#10b981' },
      'landlord': { label: 'Landlord', icon: '🔑', color: '#8b5cf6' },
      'tenant': { label: 'Tenant', icon: '🏡', color: '#06b6d4' },
      'leasing-agent': { label: 'Leasing Agent', icon: '📋', color: '#f59e0b' },
      'secondary-sales-agent': { label: 'Sales Agent', icon: '🏢', color: '#ef4444' },
      'owner': { label: 'Owner', icon: '👑', color: '#ffd700' },
    };
    return roles[role] || null;
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      dispatch(setUser(null));
      dispatch(setActiveRole(null));
      dispatch(closeAllMenus());
      navigate('/');
    } catch (error) {
      
    }
  };

  const roleInfo = getRoleInfo(activeRole);

  if (!user) {
    if (!showSignIn) return null;
    
    return (
      <div className={`universal-profile ${variant}`}>
        <Link to="/signin" className="profile-signin-btn">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className={`universal-profile ${variant}`} ref={menuRef}>
      <button 
        className="profile-trigger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="User menu"
      >
        <div className="profile-avatar">
          {user.photoURL || user.photo ? (
            <img 
              src={user.photoURL || user.photo} 
              alt={user.displayName || user.name || 'User'} 
              className="avatar-img" 
            />
          ) : (
            <span className="avatar-initials">
              {getInitials(user.displayName || user.name, user.email)}
            </span>
          )}
        </div>
        {variant !== 'compact' && (
          <span className="profile-arrow">{menuOpen ? '▲' : '▼'}</span>
        )}
      </button>

      {menuOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <div className="profile-avatar large">
              {user.photoURL || user.photo ? (
                <img 
                  src={user.photoURL || user.photo} 
                  alt={user.displayName || user.name || 'User'} 
                  className="avatar-img" 
                />
              ) : (
                <span className="avatar-initials">
                  {getInitials(user.displayName || user.name, user.email)}
                </span>
              )}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user.displayName || user.name || 'User'}</span>
              <span className="profile-email">{user.email}</span>
              {roleInfo && (
                <span className="profile-role" style={{ color: roleInfo.color }}>
                  {roleInfo.icon} {roleInfo.label}
                </span>
              )}
            </div>
          </div>

          <div className="profile-dropdown-divider"></div>

          <button 
            className="profile-dropdown-item theme-toggle-item"
            onClick={toggleTheme}
          >
            <span className="dropdown-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <Link 
            to="/profile" 
            className="profile-dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            <span className="dropdown-icon">👤</span>
            My Profile
          </Link>

          <Link 
            to="/select-role" 
            className="profile-dropdown-item"
            onClick={() => setMenuOpen(false)}
          >
            <span className="dropdown-icon">🔄</span>
            {activeRole ? 'Switch Role' : 'Select Role'}
          </Link>

          {activeRole && (
            <Link 
              to="/crm"
              className="profile-dropdown-item"
              onClick={() => setMenuOpen(false)}
            >
              <span className="dropdown-icon">📊</span>
              Dashboard
            </Link>
          )}

          <div className="profile-dropdown-divider"></div>

          <button 
            className="profile-dropdown-item logout"
            onClick={handleLogout}
          >
            <span className="dropdown-icon">🚪</span>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
