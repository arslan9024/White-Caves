import React from 'react';
import { Link } from 'react-router-dom';
import './QuickLinks.css';

export default function QuickLinks({ title, links, columns = 4, className = '' }) {
  return (
    <div className={`quick-links-container ${className}`}>
      {title && <h3 className="quick-links-title">{title}</h3>}
      <div 
        className="quick-links-grid"
        style={{ '--link-columns': columns }}
      >
        {links.map((link, index) => (
          <QuickLinkCard key={link.path || index} {...link} />
        ))}
      </div>
    </div>
  );
}

export function QuickLinkCard({ 
  path, 
  icon, 
  title, 
  description,
  onClick,
  external = false,
  className = ''
}) {
  const content = (
    <>
      <span className="quick-link-icon">{icon}</span>
      <span className="quick-link-title">{title}</span>
      {description && <span className="quick-link-desc">{description}</span>}
    </>
  );

  if (onClick) {
    return (
      <button 
        className={`quick-link-card ${className}`}
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    );
  }

  if (external) {
    return (
      <a 
        href={path} 
        className={`quick-link-card ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={path} className={`quick-link-card ${className}`}>
      {content}
    </Link>
  );
}
