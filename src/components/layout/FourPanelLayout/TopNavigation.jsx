import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search, Bell, Settings, LogOut, User, HelpCircle, 
  Moon, Sun, Menu, MessageSquare, ChevronDown, Sparkles
} from 'lucide-react';
import { COLOR_TOKENS } from '../../../styles/design-tokens/colors';
import './TopNavigation.enhanced.css';

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
        
        {/* Logo with Red/White Branding */}
        <div className="logo-enhanced" style={{ 
          borderColor: COLOR_TOKENS.primary.red,
          color: COLOR_TOKENS.primary.red 
        }}>
          <div className="logo-icon">
            <span>W</span>
            <span>C</span>
          </div>
          <div className="logo-text-group">
            <span className="logo-text" style={{ color: COLOR_TOKENS.primary.red }}>White Caves</span>
            <span className="logo-subtitle">Real Estate AI</span>
          </div>
        </div>
      </div>
      
      {/* Center - Search Bar with Red Accent */}
      <div className="nav-center">
        <div className={`search-container-enhanced ${searchOpen ? 'active' : ''}`} style={{
          borderColor: searchOpen ? COLOR_TOKENS.primary.red : undefined,
          boxShadow: searchOpen ? `0 0 0 2px ${COLOR_TOKENS.accent.redVeryLight}` : undefined
        }}>
          <Search size={18} className="search-icon" style={{ color: COLOR_TOKENS.primary.red }} />
          <input
            type="text"
            placeholder="Search objects, properties, clients..."
            className="search-input-enhanced"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
          {searchQuery && (
            <button 
              className="clear-search-enhanced"
              onClick={() => setSearchQuery('')}
              style={{ color: COLOR_TOKENS.primary.red }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      {/* Right - Controls with Red Branding */}
      <div className="nav-right">
        {/* Notifications */}
        <div className="nav-item notifications">
          <button 
            className="icon-btn-enhanced"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            style={{ color: COLOR_TOKENS.primary.red }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge-enhanced" style={{ 
                backgroundColor: COLOR_TOKENS.primary.red,
                color: COLOR_TOKENS.secondary.white 
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="notifications-dropdown-enhanced">
              <h3 style={{ color: COLOR_TOKENS.primary.red }}>Notifications</h3>
              <div className="notifications-list-enhanced">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(notif => (
                    <div key={notif.id} className="notification-item-enhanced">
                      <div className="notification-dot" style={{ backgroundColor: COLOR_TOKENS.primary.red }}></div>
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
              <a href="#" className="view-all-link-enhanced" style={{ color: COLOR_TOKENS.primary.red }}>View All</a>
            </div>
          )}
        </div>
        
        {/* Theme Toggle */}
        <button 
          className="icon-btn-enhanced"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
          style={{ color: COLOR_TOKENS.primary.red }}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Quick Help */}
        <button 
          className="icon-btn-enhanced"
          aria-label="Help"
          style={{ color: COLOR_TOKENS.primary.red }}
        >
          <HelpCircle size={20} />
        </button>
        
        {/* User Profile Menu */}
        <div className="profile-menu-enhanced">
          <button 
            className="profile-btn-enhanced"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{ borderColor: COLOR_TOKENS.primary.red }}
          >
            <div className="profile-avatar-enhanced" style={{ 
              background: COLOR_TOKENS.accent.redVeryLight,
              borderColor: COLOR_TOKENS.primary.red 
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={18} style={{ color: COLOR_TOKENS.primary.red }} />
              )}
            </div>
            <span className="profile-name-btn" style={{ color: COLOR_TOKENS.primary.red }}>
              {user?.name || 'User'}
            </span>
            <ChevronDown size={16} style={{ color: COLOR_TOKENS.primary.red }} />
          </button>
          
          {profileMenuOpen && (
            <div className="profile-dropdown-enhanced">
              <div className="profile-header-enhanced" style={{ 
                borderBottomColor: COLOR_TOKENS.accent.redVeryLight 
              }}>
                <div className="profile-avatar-large-enhanced" style={{ 
                  background: COLOR_TOKENS.accent.redVeryLight,
                  borderColor: COLOR_TOKENS.primary.red 
                }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <User size={24} style={{ color: COLOR_TOKENS.primary.red }} />
                  )}
                </div>
                <div className="profile-info-enhanced">
                  <p className="profile-name-large" style={{ color: COLOR_TOKENS.primary.red }}>
                    {user?.name}
                  </p>
                  <p className="profile-role">{user?.role}</p>
                  <p className="profile-email">{user?.email}</p>
                </div>
              </div>
              
              <a href="#" className="dropdown-item-enhanced" style={{ color: COLOR_TOKENS.primary.red }}>
                <User size={16} />
                <span>Profile Settings</span>
              </a>
              <a href="#" className="dropdown-item-enhanced" style={{ color: COLOR_TOKENS.primary.red }}>
                <Settings size={16} />
                <span>Preferences</span>
              </a>
              <a href="#" className="dropdown-item-enhanced" style={{ color: COLOR_TOKENS.primary.red }}>
                <MessageSquare size={16} />
                <span>Message Center</span>
              </a>
              
              <div className="dropdown-divider-enhanced"></div>
              
              <a href="#" className="dropdown-item-enhanced" style={{ color: COLOR_TOKENS.primary.red }}>
                <HelpCircle size={16} />
                <span>Help & Support</span>
              </a>
              
              <div className="dropdown-divider-enhanced"></div>
              
              <a href="#" className="dropdown-item-logout-enhanced">
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
