import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubNavBar } from '../common';
import { setCurrentModule, setCurrentSubModule, setActiveRole } from '../../store/navigationSlice';
import { getModuleById } from '../../features/featureRegistry';
import { DashboardHeader } from '../../shared/components/dashboard';
import WeatherWidget from '../../shared/components/ui/WeatherWidget';
import ProfilePanel from '../../shared/components/ui/ProfilePanel';
import RoleSelectorDropdown from '../../shared/components/ui/RoleSelectorDropdown';
import { useNavigate } from 'react-router-dom';
import './RolePageLayout.css';

export default function RolePageLayout({
  title,
  subtitle,
  role,
  breadcrumbs,
  actions,
  children,
  className = '',
  showSubNav = true,
  showStatusBar = true,
  showWeather = true,
  showRoleSelector = true,
  showProfileButton = true,
  statusBarProps = {},
  onSubModuleChange
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user?.currentUser);
  const [showProfile, setShowProfile] = useState(false);

  const handleRoleChange = (selectedRole) => {
    if (selectedRole.dashboardPath) {
      navigate(selectedRole.dashboardPath);
    }
  };
  
  const roleClasses = {
    buyer: 'role-buyer',
    seller: 'role-seller',
    landlord: 'role-landlord',
    tenant: 'role-tenant',
    'leasing-agent': 'role-leasing-agent',
    'secondary-sales-agent': 'role-sales-agent',
    owner: 'role-owner',
  };

  useEffect(() => {
    if (role) {
      dispatch(setActiveRole(role));
      const module = getModuleById(role);
      if (module) {
        dispatch(setCurrentModule(role));
        if (module.defaultSubModule) {
          dispatch(setCurrentSubModule(module.defaultSubModule));
        }
      }
    }
  }, [role, dispatch]);

  const universalActions = (
    <div className="role-page-universal-actions">
      {showWeather && <WeatherWidget compact />}
      {showRoleSelector && (
        <RoleSelectorDropdown 
          currentRole={role}
          onRoleChange={handleRoleChange}
          compact
        />
      )}
      {showProfileButton && user && (
        <button 
          className="role-page-profile-btn"
          onClick={() => setShowProfile(true)}
          title="View Profile"
        >
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="profile-avatar-img" />
          ) : (
            <span className="profile-avatar-initial">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      )}
      {actions}
    </div>
  );

  return (
    <div className={`role-page-layout ${roleClasses[role] || ''} ${className}`}>
      {showSubNav && <SubNavBar moduleId={role} onSubModuleChange={onSubModuleChange} />}
      <div className="role-page-container">
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          actions={universalActions}
          showStatusBar={showStatusBar}
          statusBarProps={statusBarProps}
        />
        <div className="role-page-content">
          {children}
        </div>
      </div>
      
      {showProfile && (
        <ProfilePanel 
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}

