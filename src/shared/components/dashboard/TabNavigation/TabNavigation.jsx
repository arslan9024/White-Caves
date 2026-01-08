import React, { useRef, useEffect } from 'react';
import './TabNavigation.css';

export default function TabNavigation({
  tabs = [],
  activeTab,
  onTabChange,
  variant = 'default',
  className = '',
  showBadges = true,
}) {
  const tabsRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const container = tabsRef.current;
      const activeElement = activeTabRef.current;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const tabLeft = activeElement.offsetLeft;
      const tabWidth = activeElement.offsetWidth;

      if (tabLeft < scrollLeft) {
        container.scrollTo({ left: tabLeft - 16, behavior: 'smooth' });
      } else if (tabLeft + tabWidth > scrollLeft + containerWidth) {
        container.scrollTo({ 
          left: tabLeft + tabWidth - containerWidth + 16, 
          behavior: 'smooth' 
        });
      }
    }
  }, [activeTab]);

  const handleKeyDown = (e, index) => {
    let newIndex = index;
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    }
    
    if (newIndex !== index) {
      onTabChange(tabs[newIndex].id);
    }
  };

  return (
    <div className={`tab-navigation ${variant} ${className}`}>
      <div 
        className="tab-navigation-list"
        ref={tabsRef}
        role="tablist"
        aria-label="Content tabs"
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              className={`tab-item ${isActive ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
              {showBadges && tab.count !== undefined && tab.count > 0 && (
                <span className="tab-badge">{tab.count > 99 ? '99+' : tab.count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TabPanel({ id, activeTab, children, className = '' }) {
  if (id !== activeTab) return null;
  
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={`tab-panel ${className}`}
    >
      {children}
    </div>
  );
}
