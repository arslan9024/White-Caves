import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Sun, Moon, Menu, X, ChevronDown,
  Settings, LogOut, User, Command, Building2, Users, Bot
} from 'lucide-react';
import {
  toggleSidebar,
  toggleNotifications,
  toggleProfileMenu,
  closeAllDropdowns,
  toggleMobileMenu,
  selectTopBar,
  selectSidebar,
  selectLayout
} from '../../store/slices/navigationUISlice';
import { selectUserInfo, selectActiveRole } from '../../store/slices/accessControlSlice';
import { selectActiveWorkspace } from '../../store/slices/dashboardViewSlice';
import './TopCommandBar.css';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'lead', title: 'New lead assigned', message: 'Sarah Williams from Dubai Marina', time: '2m ago', unread: true },
  { id: 2, type: 'property', title: 'Property viewed', message: 'DH-66534 received 5 views', time: '15m ago', unread: true },
  { id: 3, type: 'system', title: 'Daily report ready', message: 'Your executive summary is available', time: '1h ago', unread: false }
];

const TopCommandBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const topBar = useSelector(selectTopBar);
  const sidebar = useSelector(selectSidebar);
  const layout = useSelector(selectLayout);
  const userInfo = useSelector(selectUserInfo);
  const activeRole = useSelector(selectActiveRole);
  const activeWorkspace = useSelector(selectActiveWorkspace);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [theme, setTheme] = useState('light');
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => n.unread).length;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target) &&
          profileRef.current && !profileRef.current.contains(e.target)) {
        dispatch(closeAllDropdowns());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isMobile = layout.breakpoint === 'mobile';

  return (
    <header className="top-command-bar">
      <div className="tcb-left">
        {isMobile ? (
          <button 
            className="tcb-menu-btn"
            onClick={() => dispatch(toggleMobileMenu())}
          >
            {layout.isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        ) : (
          <button 
            className="tcb-collapse-btn"
            onClick={() => dispatch(toggleSidebar())}
            title={sidebar.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu size={20} />
          </button>
        )}

        <div className="tcb-logo" onClick={() => navigate('/dashboard')}>
          <div className="tcb-logo-icon">
            <Building2 size={24} />
          </div>
          {!isMobile && (
            <span className="tcb-logo-text">White Caves</span>
          )}
        </div>
      </div>

      <div className="tcb-center">
        <form className={`tcb-search ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
          <Search size={18} className="tcb-search-icon" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search properties, leads, agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!isMobile && (
            <div className="tcb-search-hint">
              <Command size={12} />
              <span>K</span>
            </div>
          )}
        </form>
      </div>

      <div className="tcb-right">
        <button 
          className="tcb-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="tcb-notifications" ref={notificationRef}>
          <button 
            className={`tcb-icon-btn ${topBar.notificationsOpen ? 'active' : ''}`}
            onClick={() => dispatch(toggleNotifications())}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="tcb-badge">{unreadCount}</span>
            )}
          </button>

          {topBar.notificationsOpen && (
            <div className="tcb-dropdown notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="mark-read-btn">Mark all read</button>
              </div>
              <div className="dropdown-list">
                {MOCK_NOTIFICATIONS.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${notif.unread ? 'unread' : ''}`}
                  >
                    <div className="notif-icon">
                      {notif.type === 'lead' && <Users size={16} />}
                      {notif.type === 'property' && <Building2 size={16} />}
                      {notif.type === 'system' && <Bot size={16} />}
                    </div>
                    <div className="notif-content">
                      <p className="notif-title">{notif.title}</p>
                      <p className="notif-message">{notif.message}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button onClick={() => navigate('/notifications')}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="tcb-profile" ref={profileRef}>
          <button 
            className={`tcb-profile-btn ${topBar.profileMenuOpen ? 'active' : ''}`}
            onClick={() => dispatch(toggleProfileMenu())}
          >
            <div className="profile-avatar">
              {userInfo.userAvatar ? (
                <img src={userInfo.userAvatar} alt="Profile" />
              ) : (
                <User size={18} />
              )}
            </div>
            {!isMobile && (
              <>
                <div className="profile-info">
                  <span className="profile-name">{userInfo.userName || 'Owner'}</span>
                  <span className="profile-role">{activeRole}</span>
                </div>
                <ChevronDown size={16} className={topBar.profileMenuOpen ? 'rotated' : ''} />
              </>
            )}
          </button>

          {topBar.profileMenuOpen && (
            <div className="tcb-dropdown profile-dropdown">
              <div className="dropdown-header profile-header">
                <div className="profile-avatar large">
                  <User size={24} />
                </div>
                <div>
                  <p className="profile-name">{userInfo.userName || 'Company Owner'}</p>
                  <p className="profile-email">{userInfo.userEmail || 'owner@whitecaves.ae'}</p>
                </div>
              </div>
              <div className="dropdown-list">
                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button className="dropdown-item" onClick={() => navigate('/settings')}>
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-list">
                <button className="dropdown-item danger" onClick={() => navigate('/signin')}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopCommandBar;
