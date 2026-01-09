import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, User, Moon, Sun, Menu, LogOut, 
  Settings, HelpCircle, ChevronDown, LayoutDashboard,
  Command, Layers, CreditCard
} from 'lucide-react';
import { setTheme } from '../../store/navigationSlice';
import './DashboardHeader.css';

const DASHBOARD_TABS = [
  { id: 'overview', title: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai-command', title: 'AI Command', icon: Command },
  { id: 'ai-hub', title: 'AI Hub', icon: Layers }
];

const DashboardHeader = ({ 
  title = 'Executive Dashboard',
  subtitle = 'White Caves Real Estate LLC',
  activeTab = 'overview',
  onTabChange,
  onMenuToggle,
  notifications = [],
  user = null,
  onLogout
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(state => state.navigation?.theme || 'light');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.dashboard-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

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
    setShowUserMenu(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        onTabChange?.('settings');
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
    <header className="dashboard-header-crimson">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        
        <div className="header-logo">
          <div className="logo-icon">
            <span>W</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">White Caves</span>
            <span className="logo-subtitle">AI Command Center</span>
          </div>
        </div>

        <div className="header-tabs">
          {DASHBOARD_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`header-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                <Icon size={18} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="header-center">
        <div className={`dashboard-search ${searchFocused ? 'focused' : ''}`}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="dashboard-search-input"
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

      <div className="header-right">
        <button 
          className="header-icon-btn theme-toggle" 
          onClick={handleThemeToggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notifications-wrapper" ref={notifRef}>
          <button 
            className={`header-icon-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notif, index) => (
                    <div key={index} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                      <div className="notif-icon">
                        <Bell size={14} />
                      </div>
                      <div className="notif-content">
                        <p className="notif-message">{notif.message}</p>
                        <span className="notif-time">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">
                    <Bell size={32} strokeWidth={1.5} />
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="dropdown-footer">
                  <button>View all notifications</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="user-menu-wrapper" ref={userMenuRef}>
          <button 
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
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
            <ChevronDown size={16} className={`chevron ${showUserMenu ? 'open' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-user-header">
                <div className="dropdown-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="dropdown-user-info">
                  <span className="dropdown-user-name">{user?.displayName || 'Company Owner'}</span>
                  <span className="dropdown-user-email">{user?.email || 'owner@whitecaves.ae'}</span>
                </div>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-menu-items">
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

export default DashboardHeader;
