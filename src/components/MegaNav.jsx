import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import UniversalProfile from './layout/UniversalProfile';
import './MegaNav.css';

export default function MegaNav({ user }) {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

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
    { label: 'About', href: '/about', isRoute: true },
    { label: 'Services', href: '/services', isRoute: true },
    { label: 'Careers', href: '/careers', isRoute: true },
    { label: 'Contact', href: '/contact', isRoute: true },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveMenu(null);
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
          <Link to="/" className="mega-nav-logo">
            <img src="/company-logo.jpg" alt="White Caves" className="logo-img" />
          </Link>

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
                  {link.isRoute ? (
                    <Link to={link.href} className="mega-nav-link">{link.label}</Link>
                  ) : (
                    <a href={link.href} className="mega-nav-link">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>

            <div className="mega-nav-actions">
              <ThemeToggle />
              <UniversalProfile />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
