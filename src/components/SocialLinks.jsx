
import React from 'react';
import './SocialLinks.css';

export default function SocialLinks() {
  const socialLinks = [
    { icon: '👨‍💼', name: 'LinkedIn', url: '#' },
    { icon: '📸', name: 'Instagram', url: '#' },
    { icon: '🐦', name: 'Twitter', url: '#' },
    { icon: '📘', name: 'Facebook', url: '#' },
    { icon: '🎥', name: 'YouTube', url: '#' }
  ];

  return (
    <div className="social-links">
      {socialLinks.map((social, index) => (
        <a 
          key={index} 
          href={social.url}
          className="social-link"
          title={social.name}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="social-icon">{social.icon}</span>
        </a>
      ))}
    </div>
  );
}
