import React, { useState } from 'react';
import { 
  Search, Bell, User, Moon, Sun, Menu, LogOut, 
  Settings, HelpCircle, ChevronDown
} from 'lucide-react';
import RoleSelectorDropdown from '../../shared/components/ui/RoleSelectorDropdown';
import './DashboardHeader.css';

const DashboardHeader = ({ 
  title = 'Executive Dashboard',
  subtitle = 'White Caves Real Estate LLC',
  currentRole,
  onRoleChange,
  onMenuToggle,
  theme = 'dark',
  onThemeToggle,
  notifications = [],
  user = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="dashboard-header-new">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{title}</h1>
          <span className="header-subtitle">{subtitle}</span>
        </div>
      </div>

      <div className="header-center">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search assistants, features, data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-shortcut">
            <kbd>⌘</kbd><kbd>K</kbd>
          </span>
        </div>
      </div>

      <div className="header-right">
        <button 
          className="header-icon-btn theme-toggle" 
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="notifications-wrapper">
          <button 
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-indicator">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif, index) => (
                    <div key={index} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                      <div className="notif-content">
                        <p className="notif-message">{notif.message}</p>
                        <span className="notif-time">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">
                    <Bell size={24} />
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="role-selector-wrapper">
          <RoleSelectorDropdown 
            currentRole={currentRole}
            onRoleChange={onRoleChange}
          />
        </div>

        <div className="user-menu-wrapper">
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <User size={18} />
              )}
            </div>
            <ChevronDown size={14} className="chevron" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar large">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.displayName || 'Owner'}</span>
                  <span className="user-email">{user?.email || 'admin@whitecaves.ae'}</span>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="dropdown-item">
                <HelpCircle size={16} />
                <span>Help & Support</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
