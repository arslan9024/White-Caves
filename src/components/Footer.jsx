import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <img src="/company-logo.jpg" alt="White Caves Real Estate LLC" className="footer-logo" />
          <p className="footer-tagline">Your trusted partner in Dubai luxury real estate since 2010</p>
          <div className="footer-contact">
            <p><span className="contact-icon">📍</span> Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
            <p><span className="contact-icon">📞</span> Office: +971 4 335 0592</p>
            <p><span className="contact-icon">📱</span> Mobile: +971 56 361 6136</p>
            <p><span className="contact-icon">📧</span> admin@whitecaves.com</p>
            <p><span className="contact-icon">🌐</span> www.whitecaves.com</p>
          </div>
          <div className="footer-apps">
            <p className="apps-title">Contact us on:</p>
            <div className="app-buttons">
              <a href="https://wa.me/971563616136" target="_blank" rel="noopener noreferrer" className="app-btn whatsapp">
                <span>WhatsApp</span>
              </a>
              <a href="botim://call?number=+971563616136" className="app-btn botim">
                <span>Botim</span>
              </a>
              <a href="https://gochat.me/+971563616136" target="_blank" rel="noopener noreferrer" className="app-btn gochat">
                <span>GoChat</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Property Types</h3>
          <ul>
            <li><Link to="/properties?type=villa">Villas</Link></li>
            <li><Link to="/properties?type=apartment">Apartments</Link></li>
            <li><Link to="/properties?type=penthouse">Penthouses</Link></li>
            <li><Link to="/properties?type=townhouse">Townhouses</Link></li>
            <li><Link to="/properties?type=commercial">Commercial</Link></li>
            <li><Link to="/properties?type=offplan">Off-Plan</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Popular Areas</h3>
          <ul>
            <li><Link to="/properties?location=palm-jumeirah">Palm Jumeirah</Link></li>
            <li><Link to="/properties?location=downtown">Downtown Dubai</Link></li>
            <li><Link to="/properties?location=emirates-hills">Emirates Hills</Link></li>
            <li><Link to="/properties?location=dubai-marina">Dubai Marina</Link></li>
            <li><Link to="/properties?location=jumeirah">Jumeirah</Link></li>
            <li><Link to="/properties?location=business-bay">Business Bay</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <SocialLinks />
          <div className="footer-rating">
            <p>Love our service? Leave us a review!</p>
            <div className="star-rating-footer">
              <a href="https://g.page/r/whitecaves/review" target="_blank" rel="noopener noreferrer">
                ★★★★★
              </a>
            </div>
          </div>
          <div className="footer-rera">
            <p className="rera-badge">RERA Licensed</p>
            <p className="dld-badge">Dubai Land Department Registered</p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© {currentYear} White Caves Real Estate LLC. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
