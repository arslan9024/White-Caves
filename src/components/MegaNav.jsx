import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import './MegaNav.css';

export default function MegaNav({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, setIsDark } = useTheme();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef(null);
  const userMenuRef = useRef(null);

  const menuItems = [
    {
      label: 'Buy',
      submenu: {
        featured: [
          { title: 'New Listings', desc: 'Latest properties on the market', icon: '🏠' },
          { title: 'Luxury Homes', desc: 'Premium villas & penthouses', icon: '✨' },
          { title: 'Investment Properties', desc: 'High ROI opportunities', icon: '📈' },
        ],
        propertyTypes: ['Villas', 'Apartments', 'Penthouses', 'Townhouses', 'Land'],
        locations: ['Palm Jumeirah', 'Downtown Dubai', 'Emirates Hills', 'Dubai Marina', 'Arabian Ranches'],
        priceRanges: ['Under 5M AED', '5M - 15M AED', '15M - 30M AED', '30M+ AED'],
      }
    },
    {
      label: 'Rent',
      submenu: {
        featured: [
          { title: 'Move-in Ready', desc: 'Available immediately', icon: '🔑' },
          { title: 'Furnished Homes', desc: 'Fully equipped properties', icon: '🛋️' },
          { title: 'Short Term', desc: 'Flexible rental options', icon: '📅' },
        ],
        propertyTypes: ['Villas', 'Apartments', 'Penthouses', 'Townhouses', 'Studios'],
        locations: ['JBR', 'Dubai Marina', 'Business Bay', 'DIFC', 'City Walk'],
        priceRanges: ['Under 100K/yr', '100K - 250K/yr', '250K - 500K/yr', '500K+/yr'],
      }
    },
    {
      label: 'Commercial',
      submenu: {
        featured: [
          { title: 'Office Spaces', desc: 'Premium work environments', icon: '🏢' },
          { title: 'Retail Units', desc: 'High-traffic locations', icon: '🏪' },
          { title: 'Warehouses', desc: 'Industrial & logistics', icon: '🏭' },
        ],
        propertyTypes: ['Offices', 'Retail', 'Warehouses', 'Mixed Use', 'Land'],
        locations: ['DIFC', 'Business Bay', 'JLT', 'Dubai South', 'Jebel Ali'],
        priceRanges: ['Under 1M AED', '1M - 5M AED', '5M - 20M AED', '20M+ AED'],
      }
    },
    {
      label: 'New Projects',
      submenu: {
        featured: [
          { title: 'Off-Plan', desc: 'Pre-launch opportunities', icon: '🏗️' },
          { title: 'Under Construction', desc: 'Projects in progress', icon: '🔨' },
          { title: 'Ready Soon', desc: 'Completing this year', icon: '🎯' },
        ],
        developers: ['Emaar', 'DAMAC', 'Meraas', 'Nakheel', 'Dubai Properties'],
        locations: ['Dubai Creek Harbour', 'MBR City', 'Dubai Hills', 'The Valley', 'Dubai South'],
        paymentPlans: ['10% Down', '20% Down', 'Post-Handover', '5-Year Plan'],
      }
    },
  ];

  const simpleLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuEnter = (index) => {
    setActiveMenu(index);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  return (
    <header className="mega-nav-header" ref={navRef}>
      <nav className="mega-nav">
        <div className="mega-nav-container">
          <a href="#home" className="mega-nav-logo">
            <img src="/company-logo.jpg" alt="White Caves" className="logo-img" />
          </a>

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className={`hamburger-icon ${mobileOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <div className={`mega-nav-menu ${mobileOpen ? 'mobile-open' : ''}`}>
            <ul className="mega-nav-list">
              {menuItems.map((item, index) => (
                <li 
                  key={item.label}
                  className={`mega-nav-item ${activeMenu === index ? 'active' : ''}`}
                  onMouseEnter={() => handleMenuEnter(index)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button className="mega-nav-trigger">
                    {item.label}
                    <svg className="dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <div className="mega-dropdown">
                    <div className="mega-dropdown-content">
                      <div className="mega-col mega-featured">
                        <h4>Featured</h4>
                        <div className="featured-list">
                          {item.submenu.featured.map((feat) => (
                            <a href="#" key={feat.title} className="featured-item">
                              <span className="featured-icon">{feat.icon}</span>
                              <div className="featured-text">
                                <span className="featured-title">{feat.title}</span>
                                <span className="featured-desc">{feat.desc}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="mega-col">
                        <h4>{item.submenu.propertyTypes ? 'Property Types' : 'Developers'}</h4>
                        <ul className="mega-links">
                          {(item.submenu.propertyTypes || item.submenu.developers || []).map((type) => (
                            <li key={type}><a href="#">{type}</a></li>
                          ))}
                        </ul>
                      </div>

                      <div className="mega-col">
                        <h4>Locations</h4>
                        <ul className="mega-links">
                          {item.submenu.locations.map((loc) => (
                            <li key={loc}><a href="#">{loc}</a></li>
                          ))}
                        </ul>
                      </div>

                      <div className="mega-col">
                        <h4>{item.submenu.priceRanges ? 'Price Range' : 'Payment Plans'}</h4>
                        <ul className="mega-links">
                          {(item.submenu.priceRanges || item.submenu.paymentPlans || []).map((val) => (
                            <li key={val}><a href="#">{val}</a></li>
                          ))}
                        </ul>
                      </div>

                      <div className="mega-cta">
                        <div className="mega-cta-content">
                          <h4>Need Help Finding a Property?</h4>
                          <p>Our experts are ready to assist you</p>
                          <a href="#contact" className="btn btn-primary">Contact Us</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}

              {simpleLinks.map((link) => (
                <li key={link.label} className="mega-nav-item simple">
                  <a href={link.href} className="mega-nav-link">{link.label}</a>
                </li>
              ))}
            </ul>

            <div className="mega-nav-actions">
              <button 
                className="theme-toggle-btn" 
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>

              {user ? (
                <div className="user-menu" ref={userMenuRef}>
                  <button 
                    className="user-avatar-btn" 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} />
                    ) : (
                      <span>{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                    )}
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-avatar">
                          {user.photo ? (
                            <img src={user.photo} alt={user.name} />
                          ) : (
                            <span>{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                        <div className="user-dropdown-info">
                          <span className="user-dropdown-name">{user.name || 'User'}</span>
                          <span className="user-dropdown-email">{user.email || ''}</span>
                        </div>
                      </div>
                      <div className="user-dropdown-divider"></div>
                      <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Profile
                      </Link>
                      <Link to="/select-role" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/>
                          <rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Dashboard
                      </Link>
                      <div className="user-dropdown-divider"></div>
                      <button className="user-dropdown-item logout" onClick={async () => {
                        setUserMenuOpen(false);
                        try {
                          await signOut(auth);
                          localStorage.removeItem('userRole');
                          dispatch(setUser(null));
                          navigate('/');
                        } catch (error) {
                          console.error('Logout error:', error);
                        }
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="btn btn-primary btn-sm">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
