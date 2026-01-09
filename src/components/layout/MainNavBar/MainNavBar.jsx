import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Moon, Sun, ChevronDown, User,
  Settings, LogOut, HelpCircle, Shield, CreditCard
} from 'lucide-react';
import './MainNavBar.css';

const MainNavBar = ({
  theme = 'light',
  onThemeToggle,
  user = null,
  notifications = [],
  onLogout
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.main-nav-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getUserInitials = () => {
    if (!user) return 'WC';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'WC';
  };

  const handleProfileAction = (action) => {
    setShowProfileMenu(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'help':
        window.open('https://help.whitecaves.ae', '_blank');
        break;
      case 'logout':
        onLogout?.();
        break;
      default:
        break;
    }
  };

  return (
    <header className="main-nav-bar">
      <div className="main-nav-left">
        <div className="main-nav-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <span className="logo-letter">W</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">White Caves</span>
            <span className="logo-subtitle">AI Command Center</span>
          </div>
        </div>
      </div>

      <div className="main-nav-center">
        <div className={`main-nav-search ${searchFocused ? 'focused' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="main-nav-search-input"
            placeholder="Search assistants, properties, leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="search-shortcut">
            <kbd>⌘</kbd><kbd>K</kbd>
          </div>
        </div>
      </div>

      <div className="main-nav-right">
        <button
          className="nav-icon-btn theme-toggle"
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="nav-dropdown-container" ref={notifRef}>
          <button
            className={`nav-icon-btn notifications-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="dropdown-content">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <Bell size={32} strokeWidth={1.5} />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif, idx) => (
                    <div key={idx} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                      <div className="notif-icon" style={{ background: notif.color || '#D32F2F' }}>
                        {notif.icon || <Bell size={14} />}
                      </div>
                      <div className="notif-content">
                        <p className="notif-title">{notif.title}</p>
                        <span className="notif-time">{notif.time || 'Just now'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="dropdown-footer">
                  <button onClick={() => navigate('/notifications')}>View all notifications</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nav-dropdown-container profile-container" ref={profileRef}>
          <button
            className="profile-trigger"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <span>{getUserInitials()}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.displayName || 'Company Owner'}</span>
              <span className="user-role">Owner</span>
            </div>
            <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'open' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.displayName || 'Company Owner'}</span>
                  <span className="profile-email">{user?.email || 'owner@whitecaves.ae'}</span>
                </div>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-content">
                <button className="dropdown-item" onClick={() => handleProfileAction('profile')}>
                  <User size={18} />
                  <span>My Profile</span>
                </button>
                <button className="dropdown-item" onClick={() => handleProfileAction('settings')}>
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <button className="dropdown-item" onClick={() => handleProfileAction('billing')}>
                  <CreditCard size={18} />
                  <span>Billing</span>
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => handleProfileAction('help')}>
                  <HelpCircle size={18} />
                  <span>Help Center</span>
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={() => handleProfileAction('logout')}>
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MainNavBar;
