import React from 'react';
import './FeatureSection.css';

const FeatureSection = ({
  title,
  subtitle,
  icon: Icon,
  action,
  actionLabel,
  children,
  className = '',
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <section className={`feature-section ${className} ${collapsed ? 'collapsed' : ''}`}>
      <div className="section-header">
        <div className="section-title-area">
          {Icon && (
            <div className="section-icon">
              <Icon size={20} />
            </div>
          )}
          <div className="section-title-text">
            <h3 className="section-title">{title}</h3>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        </div>
        <div className="section-actions">
          {action && (
            <button className="section-action-btn" onClick={action}>
              {actionLabel || 'Action'}
            </button>
          )}
          {collapsible && (
            <button 
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? 'Expand' : 'Collapse'}
            </button>
          )}
        </div>
      </div>
      {!collapsed && (
        <div className="section-content">
          {children}
        </div>
      )}
    </section>
  );
};

export default FeatureSection;
