import React, { useState } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useProfile } from '../../../contexts/ProfileContext';
import './UnifiedProfile.css';

const UnifiedProfile = ({ 
  variant = 'sidebar',
  onSettingsClick,
  onHelpClick,
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, notifications, loading } = useProfile();
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;
  
  const variantConfig = {
    navbar: {
      showName: false,
      showEmail: false,
      showRole: false,
      showStats: false,
      expanded: false,
      dropdown: true,
      avatarSize: 'sm'
    },
    sidebar: {
      showName: true,
      showEmail: true,
      showRole: true,
      showStats: false,
      expanded: true,
      dropdown: false,
      avatarSize: 'md'
    },
    dashboard: {
      showName: true,
      showEmail: true,
      showRole: true,
      showStats: true,
      expanded: true,
      dropdown: false,
      avatarSize: 'lg'
    }
  };
  
  const config = variantConfig[variant] || variantConfig.sidebar;

  if (loading) {
    return (
      <div className={`unified-profile unified-profile--${variant} unified-profile--loading`}>
        <div className="unified-profile-skeleton">
          <div className="skeleton-avatar" />
          {config.showName && <div className="skeleton-text" />}
        </div>
      </div>
    );
  }

  const displayName = userProfile?.displayName || userProfile?.name || 'Owner';
  const email = userProfile?.email || 'admin@whitecaves.ae';
  const role = userProfile?.role || 'Owner';
  const photoURL = userProfile?.photoURL;

  return (
    <div className={`unified-profile unified-profile--${variant}`}>
      <div className="unified-profile-main">
        <div className={`unified-profile-avatar unified-profile-avatar--${config.avatarSize}`}>
          {photoURL ? (
            <img src={photoURL} alt={displayName} />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
          {unreadCount > 0 && variant === 'navbar' && (
            <span className="unified-profile-notification-badge">{unreadCount}</span>
          )}
        </div>
        
        {config.showName && (
          <div className="unified-profile-info">
            <h3 className="unified-profile-name">{displayName}</h3>
            {config.showEmail && (
              <p className="unified-profile-email">{email}</p>
            )}
            {config.showRole && (
              <span className="unified-profile-role">{role}</span>
            )}
          </div>
        )}
        
        {config.dropdown && (
          <button 
            className="unified-profile-trigger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <div className={`unified-profile-avatar unified-profile-avatar--${config.avatarSize}`}>
              {photoURL ? (
                <img src={photoURL} alt={displayName} />
              ) : (
                <User size={16} />
              )}
            </div>
            <ChevronDown size={14} className={`chevron ${isMenuOpen ? 'chevron--open' : ''}`} />
          </button>
        )}
      </div>
      
      {config.showStats && (
        <div className="unified-profile-stats">
          <div className="unified-profile-stat">
            <span className="unified-profile-stat-value">12</span>
            <span className="unified-profile-stat-label">Listings</span>
          </div>
          <div className="unified-profile-stat">
            <span className="unified-profile-stat-value">8</span>
            <span className="unified-profile-stat-label">Active</span>
          </div>
          <div className="unified-profile-stat">
            <span className="unified-profile-stat-value">4</span>
            <span className="unified-profile-stat-label">Pending</span>
          </div>
        </div>
      )}
      
      {config.expanded && (
        <div className="unified-profile-actions">
          <button className="unified-profile-action" onClick={onSettingsClick}>
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="unified-profile-action" onClick={onHelpClick}>
            <HelpCircle size={16} />
            <span>Help & Support</span>
          </button>
          <button className="unified-profile-action unified-profile-action--danger" onClick={onLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
      
      {config.dropdown && isMenuOpen && (
        <div className="unified-profile-dropdown">
          <div className="unified-profile-dropdown-header">
            <div className="unified-profile-avatar unified-profile-avatar--md">
              {photoURL ? (
                <img src={photoURL} alt={displayName} />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="unified-profile-dropdown-info">
              <span className="unified-profile-name">{displayName}</span>
              <span className="unified-profile-email">{email}</span>
            </div>
          </div>
          
          <div className="unified-profile-dropdown-divider" />
          
          <div className="unified-profile-dropdown-menu">
            <button className="unified-profile-dropdown-item" onClick={onSettingsClick}>
              <Settings size={16} />
              <span>Account Settings</span>
            </button>
            <button className="unified-profile-dropdown-item">
              <Bell size={16} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="unified-profile-dropdown-badge">{unreadCount}</span>
              )}
            </button>
            <button className="unified-profile-dropdown-item" onClick={onHelpClick}>
              <HelpCircle size={16} />
              <span>Help & Support</span>
            </button>
          </div>
          
          <div className="unified-profile-dropdown-divider" />
          
          <button className="unified-profile-dropdown-item unified-profile-dropdown-item--danger" onClick={onLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UnifiedProfile;
