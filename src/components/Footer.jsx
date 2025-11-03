
import React from 'react';
import './Footer.css';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>White Caves</h3>
          <p>Your trusted partner in Dubai real estate</p>
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
        <p>© 2024 White Caves Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
}
