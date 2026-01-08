import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setOnlineStatus,
  updateCurrentTime,
  toggleRoleMenu,
  closeRoleMenu,
  toggleWhatsappMenu,
  closeWhatsappMenu,
  setTheme
} from '../../store/navigationSlice';
import UniversalProfile from '../layout/UniversalProfile';
import './UniversalNav.css';

const DEFAULT_NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/services', label: 'Services' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const PUBLIC_ROLE_MENUS = {
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
    ]
  }
};

const OWNER_MENU = {
  label: 'Owner Panel',
  icon: '👑',
  color: '#ffd700',
  isOwnerExclusive: true,
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
};

const ROLE_MENUS = {
  ...PUBLIC_ROLE_MENUS,
  'owner': OWNER_MENU
};

export default function UniversalNav({
  variant = 'default',
  navLinks = DEFAULT_NAV_LINKS,
  showDateTime = true,
  showOnlineStatus = true,
  logoPath = '/company-logo.jpg',
  logoText = 'White Caves',
  className = ''
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { 
    isOnline, 
    currentTime, 
    roleMenuOpen, 
    whatsappMenuOpen,
    activeRole,
    theme
  } = useSelector(state => state.navigation);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const whatsappRef = useRef(null);

  const menu = activeRole ? ROLE_MENUS[activeRole] : null;

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
      if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
        dispatch(closeWhatsappMenu());
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const currentDateTime = new Date(currentTime);
  
  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-AE', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-AE', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  return (
    <header className={`universal-nav ${variant} ${className}`}>
      <div className="universal-nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src={logoPath} alt={logoText} />
            <span className="logo-text">{logoText}</span>
          </Link>

          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className={`nav-center ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.icon && <span className="nav-icon">{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>

          {menu && (
            <div className="role-dropdown" ref={menuRef}>
              <button 
                className="role-trigger"
                onClick={() => dispatch(toggleRoleMenu())}
                style={{ '--role-color': menu.color }}
              >
                <span className="role-icon">{menu.icon}</span>
                <span className="role-label">{menu.label}</span>
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
        </nav>

        <div className="nav-right">
          {showOnlineStatus && (
            <div className="online-indicator">
              <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
              <span className="status-text">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          )}

          {showDateTime && (
            <div className="datetime-display">
              <span className="date">{formatDate(currentDateTime)}</span>
              <span className="time">{formatTime(currentDateTime)}</span>
            </div>
          )}

          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <UniversalProfile variant="compact" />
        </div>
      </div>
    </header>
  );
}

export { ROLE_MENUS, PUBLIC_ROLE_MENUS, OWNER_MENU, DEFAULT_NAV_LINKS };
