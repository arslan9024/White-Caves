import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search, Bell, Settings, LogOut, User, HelpCircle, 
  Moon, Sun, Menu, MessageSquare, ChevronDown
} from 'lucide-react';
import './TopNavigation.css';

/**
 * TopNavigation Component
 * 
 * Global navigation bar featuring:
 * - Search functionality across all objects
 * - Notifications and alerts
 * - User profile menu
 * - Theme toggle (light/dark)
 * - Quick links to major sections
 * - Department/role indicators
 */

export default function TopNavigation({ onMenuToggle, onAssistantToggle }) {
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Redux state
  const user = useSelector(state => state.auth?.user);
  const notifications = useSelector(state => state.notifications?.list || []);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch({ type: 'SEARCH_OBJECTS', payload: searchQuery });
    }
  };
  
  return (
    <header className="top-navigation">
      <div className="nav-left">
        {/* Menu Toggle for Mobile */}
        <button 
          className="menu-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        {/* Logo */}
        <div className="logo">
          <span className="logo-text">White Caves</span>
          <span className="logo-subtitle">Real Estate AI</span>
        </div>
      </div>
      
      {/* Center - Search Bar */}
      <div className="nav-center">
        <div className={`search-container ${searchOpen ? 'active' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search objects, properties, clients..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Right - Controls */}
      <div className="nav-right">
        {/* Notifications */}
        <div className="nav-item notifications">
          <button 
            className="icon-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="notifications-dropdown">
              <h3>Notifications</h3>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(notif => (
                    <div key={notif.id} className="notification-item">
                      <div className="notification-content">
                        <p className="notification-title">{notif.title}</p>
                        <p className="notification-time">{notif.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>
              <a href="#" className="view-all-link">View All</a>
            </div>
          )}
        </div>
        
        {/* Theme Toggle */}
        <button 
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Quick Help */}
        <button 
          className="icon-btn"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>
        
        {/* User Profile Menu */}
        <div className="profile-menu">
          <button 
            className="profile-btn"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={18} />
              )}
            </div>
            <span className="profile-name">{user?.name || 'User'}</span>
            <ChevronDown size={16} />
          </button>
          
          {profileMenuOpen && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="profile-info">
                  <p className="profile-name-large">{user?.name}</p>
                  <p className="profile-role">{user?.role}</p>
                  <p className="profile-email">{user?.email}</p>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <a href="#" className="dropdown-item">
                <User size={16} />
                <span>Profile Settings</span>
              </a>
              <a href="#" className="dropdown-item">
                <Settings size={16} />
                <span>Preferences</span>
              </a>
              <a href="#" className="dropdown-item">
                <MessageSquare size={16} />
                <span>Message Center</span>
              </a>
              
              <div className="dropdown-divider"></div>
              
              <a href="#" className="dropdown-item">
                <HelpCircle size={16} />
                <span>Help & Support</span>
              </a>
              
              <div className="dropdown-divider"></div>
              
              <a href="#" className="dropdown-item logout">
                <LogOut size={16} />
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
