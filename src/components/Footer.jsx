import React from 'react';
import './Footer.css';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img src="/company-logo.jpg" alt="White Caves Real Estate LLC" className="footer-logo" />
          <p>Your trusted partner in Dubai real estate</p>
          <div className="footer-contact">
            <p>📍 Office D-72, El-Shaye-4, Port Saeed, Dubai</p>
            <p>📞 +971 4 335 0592</p>
            <p>📧 admin@whitecaves.com</p>
          </div>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#properties">Properties</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <SocialLinks />
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 White Caves Real Estate LLC. All rights reserved.</p>
      </div>
    </footer>
  );
}
