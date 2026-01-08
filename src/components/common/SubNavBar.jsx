import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSubModule } from '../../store/navigationSlice';
import { getSubNavItems, getModuleById } from '../../features/featureRegistry';
import './SubNavBar.css';

const SubNavBar = ({ moduleId, onSubModuleChange }) => {
  const dispatch = useDispatch();
  const { currentSubModule, activeRole } = useSelector((state) => ({
    currentSubModule: state.navigation.currentSubModule,
    activeRole: state.navigation.activeRole
  }));

  const role = moduleId || activeRole;
  const subNavItems = getSubNavItems(role, role);
  const currentModule = getModuleById(role);

  const handleSubModuleClick = (subModule) => {
    dispatch(setCurrentSubModule(subModule.id));
    if (onSubModuleChange) {
      onSubModuleChange(subModule.id);
    }
  };

  if (subNavItems.length === 0) return null;

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-container">
        <div className="sub-navbar-header">
          {currentModule && (
            <>
              <span className="module-icon">{currentModule.icon}</span>
              <span className="module-title">{currentModule.name}</span>
            </>
          )}
        </div>
        
        <nav className="sub-navbar-nav">
          {subNavItems.map((item) => (
            <button
              key={item.id}
              className={`sub-nav-item ${currentSubModule === item.id ? 'active' : ''}`}
              onClick={() => handleSubModuleClick(item)}
              aria-label={item.label}
              title={item.label}
            >
              <span className="sub-nav-icon">{item.icon}</span>
              <span className="sub-nav-label">{item.label}</span>
              {item.badgeCount && item.badgeCount > 0 && (
                <span className="sub-nav-badge">{item.badgeCount}</span>
              )}
              {currentSubModule === item.id && (
                <span className="sub-nav-indicator"></span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="sub-navbar-actions">
          <button className="sub-nav-action-btn">
            <span className="action-icon">⚡</span>
            <span className="action-label">Quick Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubNavBar;
