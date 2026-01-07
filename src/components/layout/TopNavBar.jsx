import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setOnlineStatus,
  updateCurrentTime,
  toggleProfileMenu,
  closeProfileMenu,
  toggleRoleMenu,
  closeRoleMenu,
  toggleWhatsappMenu,
  closeWhatsappMenu,
  closeAllMenus,
  setActiveRole,
  setTheme
} from '../../store/navigationSlice';
import './TopNavBar.css';

const roleMenus = {
  'buyer': {
    label: 'Buyer',
    icon: '🏠',
    color: '#3b82f6',
    items: [
      { path: '/buyer/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/buyer/mortgage-calculator', label: 'Mortgage Calculator', icon: '🧮' },
      { path: '/buyer/dld-fees', label: 'DLD Fees', icon: '🏛️' },
      { path: '/buyer/title-deed-registration', label: 'Title Deed', icon: '📜' },
      { path: '/buyer/saved-properties', label: 'Saved Properties', icon: '❤️' },
      { path: '/buyer/viewings', label: 'My Viewings', icon: '📅' },
    ]
  },
  'seller': {
    label: 'Seller',
    icon: '💰',
    color: '#10b981',
    items: [
      { path: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/seller/pricing-tools', label: 'Pricing Tools', icon: '💰' },
      { path: '/seller/listings', label: 'My Listings', icon: '🏠' },
      { path: '/seller/inquiries', label: 'Buyer Inquiries', icon: '💬' },
      { path: '/seller/documents', label: 'Documents', icon: '📋' },
    ]
  },
  'landlord': {
    label: 'Landlord',
    icon: '🔑',
    color: '#8b5cf6',
    items: [
      { path: '/landlord/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/landlord/rental-management', label: 'Rental Management', icon: '🏠' },
      { path: '/landlord/tenants', label: 'My Tenants', icon: '👥' },
      { path: '/landlord/finances', label: 'Finances', icon: '💰' },
      { path: '/landlord/maintenance', label: 'Maintenance', icon: '🔧' },
    ]
  },
  'tenant': {
    label: 'Tenant',
    icon: '🏡',
    color: '#06b6d4',
    items: [
      { path: '/tenant/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/tenant/my-rentals', label: 'My Rentals', icon: '🏠' },
      { path: '/tenant/payments', label: 'Payments', icon: '💳' },
      { path: '/tenant/maintenance', label: 'Maintenance', icon: '🔧' },
    ]
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    icon: '📋',
    color: '#f59e0b',
    items: [
      { path: '/leasing-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/leasing-agent/tenant-screening', label: 'Tenant Screening', icon: '👤' },
      { path: '/leasing-agent/contracts', label: 'Contracts', icon: '📜' },
      { path: '/leasing-agent/listings', label: 'My Listings', icon: '🏠' },
      { path: '/leasing-agent/leads', label: 'Leads', icon: '📞' },
      { path: '/leasing-agent/calendar', label: 'Calendar', icon: '📅' },
      { path: '/leasing-agent/commission', label: 'Commission', icon: '💰' },
    ]
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    icon: '🏢',
    color: '#ef4444',
    items: [
      { path: '/secondary-sales-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/secondary-sales-agent/sales-pipeline', label: 'Sales Pipeline', icon: '📈' },
      { path: '/secondary-sales-agent/listings', label: 'My Listings', icon: '🏠' },
      { path: '/secondary-sales-agent/leads', label: 'Leads', icon: '📞' },
      { path: '/secondary-sales-agent/calendar', label: 'Calendar', icon: '📅' },
      { path: '/secondary-sales-agent/commission', label: 'Commission', icon: '💰' },
    ]
  },
  'owner': {
    label: 'Owner',
    icon: '👑',
    color: '#ffd700',
    items: [
      { path: '/owner/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/owner/business-model', label: 'Business Model', icon: '📋' },
      { path: '/owner/client-services', label: 'Client Services', icon: '🏢' },
      { path: '/owner/system-health', label: 'System Health', icon: '🩺' },
      { path: '/owner/agents', label: 'Manage Agents', icon: '👥' },
      { path: '/owner/properties', label: 'All Properties', icon: '🏠' },
      { path: '/owner/reports', label: 'Reports', icon: '📈' },
      { path: '/owner/settings', label: 'Settings', icon: '⚙️' },
    ],
    whatsapp: [
      { path: '/owner/whatsapp', label: 'Messages', icon: '💬' },
      { path: '/owner/whatsapp/chatbot', label: 'Chatbot', icon: '🤖' },
      { path: '/owner/whatsapp/analytics', label: 'Analytics', icon: '📈' },
      { path: '/owner/whatsapp/settings', label: 'Settings', icon: '⚙️' },
    ],
    browseAs: {
      clients: [
        { path: '/buyer/dashboard', label: 'Buyer Portal', icon: '🏠' },
        { path: '/seller/dashboard', label: 'Seller Portal', icon: '💰' },
        { path: '/landlord/dashboard', label: 'Landlord Portal', icon: '🏢' },
        { path: '/tenant/dashboard', label: 'Tenant Portal', icon: '🔑' },
      ],
      employees: [
        { path: '/leasing-agent/dashboard', label: 'Leasing Agent', icon: '📋' },
        { path: '/secondary-sales-agent/dashboard', label: 'Sales Agent', icon: '💼' },
      ]
    }
  }
};

export default function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.user.currentUser);
  const { 
    isOnline, 
    currentTime, 
    profileMenuOpen, 
    roleMenuOpen, 
    whatsappMenuOpen,
    activeRole,
    theme
  } = useSelector(state => state.navigation);
  
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const whatsappRef = useRef(null);

  const menu = activeRole ? roleMenus[activeRole] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateCurrentTime(new Date().toISOString()));
    }, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        dispatch(closeRoleMenu());
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        dispatch(closeProfileMenu());
      }
      if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
        dispatch(closeWhatsappMenu());
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const currentDateTime = new Date(currentTime);
  
  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-AE', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-AE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const handleLogout = () => {
    dispatch(setActiveRole(null));
    dispatch(closeAllMenus());
    navigate('/');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getProfileImage = () => {
    if (user?.photoURL) {
      return <img src={user.photoURL} alt="Profile" className="profile-img" />;
    }
    return <span className="profile-initials">{getInitials(user?.displayName || user?.email)}</span>;
  };

  return (
    <header className="top-nav-bar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
          <span className="logo-text">White Caves</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/properties" className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}>
            Properties
          </Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
            Services
          </Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
        </nav>
      </div>

      <div className="nav-center">
        {menu && (
          <div className="role-dropdown" ref={menuRef}>
            <button 
              className="role-trigger"
              onClick={() => dispatch(toggleRoleMenu())}
              style={{ '--role-color': menu.color }}
            >
              <span className="role-icon">{menu.icon}</span>
              <span className="role-label">{menu.label} Portal</span>
              <span className="dropdown-arrow">{roleMenuOpen ? '▲' : '▼'}</span>
            </button>
            
            {roleMenuOpen && (
              <div className="dropdown-menu role-menu">
                {menu.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`dropdown-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => dispatch(closeRoleMenu())}
                  >
                    <span className="item-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                
                {menu.browseAs && (
                  <>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-section-label">Browse as Client</div>
                    {menu.browseAs.clients.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`dropdown-item browse-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => dispatch(closeRoleMenu())}
                      >
                        <span className="item-icon">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                    <div className="dropdown-section-label">Browse as Employee</div>
                    {menu.browseAs.employees.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`dropdown-item browse-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => dispatch(closeRoleMenu())}
                      >
                        <span className="item-icon">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {menu?.whatsapp && (
          <div className="whatsapp-dropdown" ref={whatsappRef}>
            <button 
              className="whatsapp-trigger"
              onClick={() => dispatch(toggleWhatsappMenu())}
            >
              <span className="wa-icon">💬</span>
              <span>WhatsApp</span>
              <span className="dropdown-arrow">{whatsappMenuOpen ? '▲' : '▼'}</span>
            </button>
            
            {whatsappMenuOpen && (
              <div className="dropdown-menu whatsapp-menu">
                {menu.whatsapp.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`dropdown-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => dispatch(closeWhatsappMenu())}
                  >
                    <span className="item-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="nav-right">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="online-indicator">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
          <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <div className="datetime-display">
          <div className="date">{formatDate(currentDateTime)}</div>
          <div className="time">{formatTime(currentDateTime)}</div>
        </div>

        <div className="profile-dropdown" ref={profileRef}>
          <button 
            className="profile-trigger"
            onClick={() => dispatch(toggleProfileMenu())}
          >
            <div className="profile-circle">
              {getProfileImage()}
            </div>
          </button>

          {profileMenuOpen && (
            <div className="dropdown-menu profile-menu">
              <div className="profile-header">
                <div className="profile-circle large">
                  {getProfileImage()}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.displayName || 'Guest'}</span>
                  <span className="profile-email">{user?.email}</span>
                  {activeRole && (
                    <span className="profile-role" style={{ color: menu?.color }}>
                      {menu?.icon} {menu?.label}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <Link to="/profile" className="dropdown-item" onClick={() => dispatch(closeProfileMenu())}>
                <span className="item-icon">👤</span>
                My Profile
              </Link>
              <Link to="/select-role" className="dropdown-item" onClick={() => dispatch(closeProfileMenu())}>
                <span className="item-icon">🔄</span>
                Switch Role
              </Link>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item logout" onClick={handleLogout}>
                <span className="item-icon">🚪</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
