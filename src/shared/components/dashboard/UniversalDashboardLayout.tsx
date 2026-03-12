import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserStatusBar from './UserStatusBar';
import RoleSelectorDropdown from '../ui/RoleSelectorDropdown';
import WeatherWidget from '../ui/WeatherWidget';
import ProfilePanel from '../ui/ProfilePanel';
import './UniversalDashboardLayout.css';

export interface DashboardTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface RoleOption {
  dashboardPath?: string;
  [key: string]: unknown;
}

interface UserData {
  name?: string;
  displayName?: string;
  photo?: string;
}

interface RootState {
  user?: { currentUser?: UserData };
}

export interface UniversalDashboardLayoutProps {
  title: string;
  subtitle?: string;
  roleId?: string;
  tabs?: DashboardTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  actions?: React.ReactNode;
  showRoleSelector?: boolean;
  showWeather?: boolean;
  showProfileButton?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const UniversalDashboardLayout: React.FC<UniversalDashboardLayoutProps> = ({
  title,
  subtitle,
  roleId,
  tabs = [],
  activeTab,
  onTabChange,
  actions,
  showRoleSelector = false,
  showWeather = true,
  showProfileButton = true,
  children,
  className = ''
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user?.currentUser);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const handleRoleChange = (role: RoleOption): void => {
    if (role.dashboardPath) {
      navigate(role.dashboardPath);
    }
  };

  return (
    <div className={`universal-dashboard-layout ${className}`}>
      <header className="dashboard-header-bar">
        <div className="dashboard-header-left">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">{title}</h1>
            {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="dashboard-header-center">
          <UserStatusBar 
            showGreeting={true}
            showTime={true}
            showDate={true}
            showOnlineStatus={true}
            userName={user?.name || user?.displayName}
            compact={false}
          />
        </div>

        <div className="dashboard-header-right">
          {showWeather && <WeatherWidget compact />}
          
          {showRoleSelector && (
            <RoleSelectorDropdown 
              currentRole={roleId}
              onRoleChange={handleRoleChange}
              compact
            />
          )}

          {showProfileButton && (
            <button 
              className="dashboard-profile-btn"
              onClick={() => setShowProfile(!showProfile)}
              title="View Profile"
            >
              {user?.photo ? (
                <img src={user.photo} alt={user.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          )}

          {actions && (
            <div className="dashboard-header-actions">
              {actions}
            </div>
          )}
        </div>
      </header>

      {tabs.length > 0 && (
        <nav className="dashboard-tabs-nav">
          <div className="dashboard-tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange?.(tab.id)}
              >
                {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                <span className="tab-label">{tab.label}</span>
                {tab.badge && <span className="tab-badge">{tab.badge}</span>}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="dashboard-main-content">
        {children}
      </main>

      {showProfile && (
        <ProfilePanel 
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default UniversalDashboardLayout;
