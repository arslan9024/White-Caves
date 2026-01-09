import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, Building2, Settings, Info, Phone, LogIn } from 'lucide-react';
import { PUBLIC_NAV } from '../../../config/navigation';
import './MainNavBar.css';

const MainNavBar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  return (
    <header className="public-navbar">
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
          <button 
            className="signin-btn"
            onClick={() => navigate('/signin')}
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
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
