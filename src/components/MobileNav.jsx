
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function MobileNav({ isOpen, onClose }) {
  const { isDark, setIsDark } = useTheme();
  
  return (
    <div className={`mobile-nav ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="mobile-nav-links">
        <a href="#home" onClick={onClose}>Home</a>
        <a href="#properties" onClick={onClose}>Properties</a>
        <a href="#about" onClick={onClose}>About</a>
        <Link to="/services" onClick={onClose}>Services</Link>
        <Link to="/careers" onClick={onClose}>Careers</Link>
        <Link to="/contact" onClick={onClose}>Contact</Link>
        <button 
          className="theme-toggle mobile" 
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? '🌞' : '🌙'}
        </button>
      </div>
    </div>
  );
}
