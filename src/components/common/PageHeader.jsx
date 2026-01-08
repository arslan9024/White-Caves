import React from 'react';
import { Link } from 'react-router-dom';
import './PageHeader.css';

export default function PageHeader({ 
  title, 
  subtitle,
  breadcrumbs,
  actions,
  className = ''
}) {
  return (
    <div className={`page-header-reusable ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path || index}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      
      <div className="header-main">
        <div className="header-content">
          <h1>{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        
        {actions && (
          <div className="header-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function ActionButton({ 
  icon, 
  label, 
  onClick, 
  to, 
  variant = 'primary',
  size = 'default',
  disabled = false,
  className = ''
}) {
  const buttonClass = `action-btn ${variant} ${size} ${className}`;
  
  const content = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-label">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={buttonClass}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      className={buttonClass} 
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {content}
    </button>
  );
}
