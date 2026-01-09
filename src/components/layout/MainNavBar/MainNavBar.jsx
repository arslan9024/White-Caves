import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Menu, X, ChevronDown, Home, Building2, Settings, Info, Phone, LogIn,
  Sun, Moon, Bell, User, LogOut, HelpCircle, CreditCard, Search
} from 'lucide-react';
import { PUBLIC_NAV, ROLE_NAV } from '../../../config/navigation';
import { getAccessLevel } from '../../../config/rolePermissions';
import { setTheme } from '../../../store/navigationSlice';
import { auth } from '../../../config/firebase';
import './MainNavBar.css';

const MainNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector(state => state.user?.currentUser);
  const userRole = useSelector(state => state.user?.role || localStorage.getItem('userRole'));
  const theme = useSelector(state => state.navigation?.theme || 'light');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const isAuthenticated = !!user;
  const accessLevel = getAccessLevel(userRole);
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/owner') ||
                          location.pathname.includes('/agent') ||
                          location.pathname.includes('/tenant');

  const navIcons = {
    '🏠': Home,
    '🏢': Building2,
    '⚙️': Settings,
    'ℹ️': Info,
    '📞': Phone
  };

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

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('userRole');
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
      case 'dashboard':
        const roleNav = ROLE_NAV[userRole];
        if (roleNav?.dashboard) {
          navigate(roleNav.dashboard);
        }
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
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

  const getRoleLabel = () => {
    const roleNav = ROLE_NAV[userRole];
    return roleNav?.label || 'User';
  };

  const getNavItems = () => {
    if (!isAuthenticated || !isDashboardPage) {
      return PUBLIC_NAV.main;
    }
    const roleNav = ROLE_NAV[userRole];
    if (roleNav?.links) {
      return roleNav.links.slice(0, 5);
    }
    return PUBLIC_NAV.main;
  };

  const navItems = getNavItems();

  return (
    <header className={`main-navbar ${isDashboardPage ? 'dashboard-mode' : ''}`}>
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
          {navItems.map((item) => {
            const Icon = navIcons[item.icon] || Home;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {!isDashboardPage && (
            <>
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
            </>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <button 
                className="navbar-icon-btn theme-toggle" 
                onClick={handleThemeToggle}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="notifications-wrapper" ref={notifRef}>
                <button 
                  className="navbar-icon-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </button>
                
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="dropdown-header">
                      <h4>Notifications</h4>
                      <button className="mark-all-read">Mark all read</button>
                    </div>
                    <div className="notifications-list">
                      <div className="notification-item unread">
                        <div className="notif-icon"><Bell size={14} /></div>
                        <div className="notif-content">
                          <p className="notif-message">New lead assigned to you</p>
                          <span className="notif-time">2 min ago</span>
                        </div>
                      </div>
                      <div className="notification-item unread">
                        <div className="notif-icon"><Bell size={14} /></div>
                        <div className="notif-content">
                          <p className="notif-message">Property viewing scheduled</p>
                          <span className="notif-time">1 hour ago</span>
                        </div>
                      </div>
                      <div className="notification-item">
                        <div className="notif-icon"><Bell size={14} /></div>
                        <div className="notif-content">
                          <p className="notif-message">Contract signed successfully</p>
                          <span className="notif-time">Yesterday</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-footer">
                      <button>View all notifications</button>
                    </div>
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
                    <span className="user-name">{user?.displayName || 'User'}</span>
                    <span className="user-role">{getRoleLabel()}</span>
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
                        <span className="dropdown-user-name">{user?.displayName || 'User'}</span>
                        <span className="dropdown-user-email">{user?.email || ''}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <div className="dropdown-menu-items">
                      <button className="dropdown-item" onClick={() => handleProfileAction('dashboard')}>
                        <Home size={18} />
                        <span>My Dashboard</span>
                      </button>
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
            {navItems.map((item) => {
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
            {isAuthenticated ? (
              <>
                <button 
                  className="mobile-theme-btn"
                  onClick={handleThemeToggle}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button 
                  className="mobile-logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavBar;
