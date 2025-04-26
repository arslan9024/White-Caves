
import React from 'react';
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
        <a href="#contact" onClick={onClose}>Contact</a>
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
