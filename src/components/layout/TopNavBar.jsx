import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    ]
  },
  'seller': {
    label: 'Seller',
    icon: '💰',
    color: '#10b981',
    items: [
      { path: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/seller/pricing-tools', label: 'Pricing Tools', icon: '💰' },
    ]
  },
  'landlord': {
    label: 'Landlord',
    icon: '🔑',
    color: '#8b5cf6',
    items: [
      { path: '/landlord/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/landlord/rental-management', label: 'Rental Management', icon: '🏠' },
    ]
  },
  'tenant': {
    label: 'Tenant',
    icon: '🏡',
    color: '#06b6d4',
    items: [
      { path: '/tenant/dashboard', label: 'Dashboard', icon: '📊' },
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
    ]
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    icon: '🏢',
    color: '#ef4444',
    items: [
      { path: '/secondary-sales-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/secondary-sales-agent/sales-pipeline', label: 'Sales Pipeline', icon: '📈' },
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
    ],
    whatsapp: [
      { path: '/owner/whatsapp', label: 'Messages', icon: '💬' },
      { path: '/owner/whatsapp/chatbot', label: 'Chatbot', icon: '🤖' },
      { path: '/owner/whatsapp/analytics', label: 'Analytics', icon: '📈' },
      { path: '/owner/whatsapp/settings', label: 'Settings', icon: '⚙️' },
    ]
  }
};

export default function TopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user.currentUser);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [whatsappMenuOpen, setWhatsappMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const whatsappRef = useRef(null);

  const storedRole = localStorage.getItem('userRole');
  const userRole = storedRole ? JSON.parse(storedRole)?.role : null;
  const menu = userRole ? roleMenus[userRole] : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (whatsappRef.current && !whatsappRef.current.contains(event.target)) {
        setWhatsappMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    localStorage.removeItem('userRole');
    setProfileMenuOpen(false);
    navigate('/');
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
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ '--role-color': menu.color }}
            >
              <span className="role-icon">{menu.icon}</span>
              <span className="role-label">{menu.label} Portal</span>
              <span className="dropdown-arrow">{menuOpen ? '▲' : '▼'}</span>
            </button>
            
            {menuOpen && (
              <div className="dropdown-menu role-menu">
                {menu.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`dropdown-item ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
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
              onClick={() => setWhatsappMenuOpen(!whatsappMenuOpen)}
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
                    onClick={() => setWhatsappMenuOpen(false)}
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
        <div className="datetime-display">
          <div className="date">{formatDate(currentTime)}</div>
          <div className="time">{formatTime(currentTime)}</div>
        </div>

        <div className="profile-dropdown" ref={profileRef}>
          <button 
            className="profile-trigger"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
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
                  {userRole && (
                    <span className="profile-role" style={{ color: menu?.color }}>
                      {menu?.icon} {menu?.label}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <Link to="/profile" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                <span className="item-icon">👤</span>
                My Profile
              </Link>
              <Link to="/select-role" className="dropdown-item" onClick={() => setProfileMenuOpen(false)}>
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
