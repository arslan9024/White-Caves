import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ChevronDown, Home, Building2, Settings, Info, Phone, LogIn, Moon, Sun, Bell, User, LogOut, CreditCard, HelpCircle } from 'lucide-react';
import { PUBLIC_NAV } from '../../../config/navigation';
import { setTheme } from '../../../store/navigationSlice';
import './MainNavBar.css';

const MainNavBar = ({ showDashboardNav = false, user = null, onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(state => state.navigation?.theme || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navIcons = {
    '🏠': Home,
    '🏢': Building2,
    '⚙️': Settings,
    'ℹ️': Info,
    '📞': Phone
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const getUserInitials = () => {
    if (!user) return 'WC';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user.email) return user.email[0].toUpperCase();
    return 'WC';
  };

  const handleProfileAction = (action) => {
    setShowUserMenu(false);
    switch (action) {
      case 'profile': navigate('/profile'); break;
      case 'settings': navigate('/settings'); break;
      case 'billing': navigate('/billing'); break;
      case 'help': window.open('https://help.whitecaves.ae', '_blank'); break;
      case 'logout': onLogout?.(); break;
      default: break;
    }
  };

  return (
    <header className={`public-navbar ${showDashboardNav ? 'dashboard-mode' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <span>W</span>
          </div>
          <div className="logo-text">
            <span className="logo-title">White Caves</span>
            <span className="logo-subtitle">Luxury Real Estate</span>
          </div>
        </div>

        <nav className="navbar-nav">
          {PUBLIC_NAV.main.map((item) => {
            const Icon = navIcons[item.icon] || Home;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className="nav-link"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="nav-dropdown-wrapper">
            <button 
              className={`nav-link dropdown-trigger ${activeDropdown === 'buy' ? 'active' : ''}`}
              onClick={() => toggleDropdown('buy')}
            >
              <Building2 size={16} />
              <span>Buy</span>
              <ChevronDown size={14} className={`chevron ${activeDropdown === 'buy' ? 'open' : ''}`} />
            </button>
            {activeDropdown === 'buy' && (
              <div className="nav-dropdown">
                {PUBLIC_NAV.buy.map((item) => (
                  <button 
                    key={item.path}
                    className="dropdown-item"
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="nav-dropdown-wrapper">
            <button 
              className={`nav-link dropdown-trigger ${activeDropdown === 'rent' ? 'active' : ''}`}
              onClick={() => toggleDropdown('rent')}
            >
              <Building2 size={16} />
              <span>Rent</span>
              <ChevronDown size={14} className={`chevron ${activeDropdown === 'rent' ? 'open' : ''}`} />
            </button>
            {activeDropdown === 'rent' && (
              <div className="nav-dropdown">
                {PUBLIC_NAV.rent.map((item) => (
                  <button 
                    key={item.path}
                    className="dropdown-item"
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="nav-dropdown-wrapper">
            <button 
              className={`nav-link dropdown-trigger ${activeDropdown === 'sell' ? 'active' : ''}`}
              onClick={() => toggleDropdown('sell')}
            >
              <Building2 size={16} />
              <span>Sell</span>
              <ChevronDown size={14} className={`chevron ${activeDropdown === 'sell' ? 'open' : ''}`} />
            </button>
            {activeDropdown === 'sell' && (
              <div className="nav-dropdown">
                {PUBLIC_NAV.sell.map((item) => (
                  <button 
                    key={item.path}
                    className="dropdown-item"
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          {showDashboardNav && user ? (
            <>
              <button 
                className="navbar-icon-btn"
                onClick={handleThemeToggle}
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="navbar-dropdown-wrapper">
                <button 
                  className="navbar-icon-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                </button>
                {showNotifications && (
                  <div className="navbar-dropdown notifications">
                    <div className="dropdown-header">
                      <h4>Notifications</h4>
                    </div>
                    <div className="empty-state">
                      <Bell size={24} strokeWidth={1.5} />
                      <p>No new notifications</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="navbar-dropdown-wrapper">
                <button 
                  className="user-avatar-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="avatar">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} />
                    ) : (
                      <span>{getUserInitials()}</span>
                    )}
                  </div>
                  <ChevronDown size={14} className={`chevron ${showUserMenu ? 'open' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="navbar-dropdown user-menu">
                    <div className="user-header">
                      <div className="user-avatar-large">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} />
                        ) : (
                          <span>{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="user-info">
                        <span className="name">{user.displayName || 'Company Owner'}</span>
                        <span className="email">{user.email || 'owner@whitecaves.ae'}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="menu-item" onClick={() => handleProfileAction('profile')}>
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button className="menu-item" onClick={() => handleProfileAction('settings')}>
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <button className="menu-item" onClick={() => handleProfileAction('billing')}>
                      <CreditCard size={18} />
                      <span>Billing</span>
                    </button>
                    <div className="dropdown-divider" />
                    <button className="menu-item" onClick={() => handleProfileAction('help')}>
                      <HelpCircle size={18} />
                      <span>Help Center</span>
                    </button>
                    <div className="dropdown-divider" />
                    <button className="menu-item logout" onClick={() => handleProfileAction('logout')}>
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button 
              className="signin-btn"
              onClick={() => navigate('/signin')}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>

        <button 
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {PUBLIC_NAV.main.map((item) => {
              const Icon = navIcons[item.icon] || Home;
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mobile-actions">
            <button 
              className="mobile-signin-btn"
              onClick={() => {
                navigate('/signin');
                setMobileMenuOpen(false);
              }}
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavBar;
