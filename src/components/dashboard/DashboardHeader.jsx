import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Bell, User, Moon, Sun, Menu, LogOut, 
  Settings, HelpCircle, ChevronDown, LayoutDashboard,
  CreditCard, Bot, MessageSquare, Building2, Target, Users, TrendingUp,
  Home, Wallet, Megaphone, Shield, Server, Palette, Database,
  Scale, Eye, Zap, Activity, Clock, Command, FileText, BarChart3,
  Lightbulb, Code, Wrench, Crown, PieChart, Map, Star, Heart, Send
} from 'lucide-react';
import { setTheme } from '../../store/navigationSlice';
import { setMainViewContent } from '../../store/appSlice';
import './DashboardHeader.css';

const ICON_MAP = {
  LayoutDashboard, Lightbulb, BarChart3, FileText, MessageSquare, Users, 
  Bot, Building2, Database, Target, Star, Heart, TrendingUp, Home,
  Wallet, CreditCard, Shield, Megaphone, Eye, Wrench, Clock, Code,
  Crown, PieChart, Map, Send, Activity, Server, Palette, Scale, Zap, Command
};

const DashboardHeader = ({ 
  activeAssistant,
  onFeatureSelect,
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
  const [activeFeature, setActiveFeature] = useState(null);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const features = useMemo(() => {
    if (!activeAssistant?.features) return [];
    return activeAssistant.features;
  }, [activeAssistant]);

  useEffect(() => {
    if (features.length > 0 && !activeFeature) {
      setActiveFeature(features[0].id);
    }
  }, [features, activeFeature]);

  useEffect(() => {
    if (activeAssistant) {
      setActiveFeature(activeAssistant.features?.[0]?.id || null);
    }
  }, [activeAssistant?.id]);

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

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature.id);
    dispatch(setMainViewContent({
      component: feature.component,
      props: { assistantId: activeAssistant?.id }
    }));
    onFeatureSelect?.(feature);
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

  const getFeatureIcon = (iconName) => {
    return ICON_MAP[iconName] || LayoutDashboard;
  };

  return (
    <header className="dashboard-header-crimson">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>

        {activeAssistant && (
          <div className="active-assistant-context">
            <div 
              className="assistant-badge"
              style={{ background: `${activeAssistant.color}20`, color: activeAssistant.color }}
            >
              <Bot size={16} />
              <span>{activeAssistant.name}</span>
            </div>
          </div>
        )}

        <div className="header-tabs">
          {features.map(feature => {
            const Icon = getFeatureIcon(feature.icon);
            return (
              <button
                key={feature.id}
                className={`header-tab ${activeFeature === feature.id ? 'active' : ''}`}
                onClick={() => handleFeatureClick(feature)}
                style={{ '--tab-color': activeAssistant?.color || '#D32F2F' }}
              >
                <Icon size={18} />
                <span>{feature.label}</span>
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
            placeholder={`Search ${activeAssistant?.name || 'assistants'}...`}
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
