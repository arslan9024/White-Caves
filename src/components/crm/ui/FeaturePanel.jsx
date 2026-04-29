import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, ExternalLink, RefreshCw } from 'lucide-react';
import './FeaturePanel.css';

const FeaturePanel = ({
  title,
  subtitle,
  icon: Icon,
  color = '#DC2626',
  collapsed = false,
  collapsible = true,
  loading = false,
  actions = [],
  onSettings,
  onExpand,
  headerContent,
  footerContent,
  children,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div 
      className={`feature-panel ${isCollapsed ? 'collapsed' : ''} ${loading ? 'loading' : ''} ${className}`}
      style={{ '--panel-accent': color }}
    >
      <div className="fp-header" onClick={toggleCollapse}>
        <div className="fp-header-left">
          {Icon && (
            <div className="fp-icon">
              <Icon size={20} />
            </div>
          )}
          <div className="fp-title-section">
            <h3 className="fp-title">{title}</h3>
            {subtitle && <span className="fp-subtitle">{subtitle}</span>}
          </div>
        </div>
        
        <div className="fp-header-right">
          {headerContent}
          
          {actions.map((action, idx) => (
            <button
              key={idx}
              className={`fp-action ${action.variant || ''}`}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.();
              }}
              disabled={action.disabled}
              title={action.tooltip}
            >
              {action.loading ? (
                <RefreshCw size={14} className="spinning" />
              ) : action.icon ? (
                <action.icon size={14} />
              ) : null}
              {action.label && <span>{action.label}</span>}
            </button>
          ))}
          
          {onSettings && (
            <button 
              className="fp-settings"
              onClick={(e) => {
                e.stopPropagation();
                onSettings();
              }}
            >
              <Settings size={16} />
            </button>
          )}
          
          {collapsible && (
            <button className="fp-toggle">
              {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="fp-content">
            {loading ? (
              <div className="fp-loading">
                <div className="loading-spinner" />
                <span>Loading...</span>
              </div>
            ) : children}
          </div>
          
          {footerContent && (
            <div className="fp-footer">
              {footerContent}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeaturePanel;
