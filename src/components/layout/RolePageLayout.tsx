import React, { useEffect, useState, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubNavBar } from '../common';
import { setCurrentModule, setCurrentSubModule, setActiveRole } from '../../store/navigationSlice';
import { getModuleById } from '../../features/featureRegistry';
import { DashboardHeader } from '../../shared/components/dashboard';
import WeatherWidget from '../../shared/components/ui/WeatherWidget';
import ProfilePanel from '../../shared/components/ui/ProfilePanel';
import RoleSelectorDropdown from '../../shared/components/ui/RoleSelectorDropdown';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store/store';
import {
  RolePageLayoutContainer,
  RolePageContainer,
  RolePageContent,
  RolePageUniversalActions,
  RolePageProfileButton
} from './RolePageLayout/styles';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface StatusBarProps {
  [key: string]: unknown;
}

interface UserProfile {
  name?: string;
  photo?: string;
  [key: string]: unknown;
}

interface RoleOption {
  id: string;
  [key: string]: unknown;
}

interface RolePageLayoutProps {
  title?: string;
  subtitle?: string;
  role?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  showSubNav?: boolean;
  showStatusBar?: boolean;
  showWeather?: boolean;
  showRoleSelector?: boolean;
  showProfileButton?: boolean;
  statusBarProps?: StatusBarProps;
  onSubModuleChange?: (subModuleId: string) => void;
}

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
}: RolePageLayoutProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => (state as any).user?.currentUser) as UserProfile | null;
  const [showProfile, setShowProfile] = useState(false);

  const handleRoleChange = (selectedRole: RoleOption) => {
    dispatch(setActiveRole(selectedRole.id));
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
    <RolePageUniversalActions>
      {showWeather && <WeatherWidget compact />}
      {showRoleSelector && (
        <RoleSelectorDropdown 
          currentRole={role}
          onRoleChange={handleRoleChange}
          compact
        />
      )}
      {showProfileButton && user && (
        <RolePageProfileButton
          onClick={() => setShowProfile(true)}
          title="View Profile"
        >
          {user.photo ? (
            <img src={user.photo} alt={user.name} />
          ) : (
            <span>
              {(user.name || 'U').charAt(0).toUpperCase()}
            </span>
          )}
        </RolePageProfileButton>
      )}
      {actions}
    </RolePageUniversalActions>
  );

  return (
    <RolePageLayoutContainer $role={role}>
      {showSubNav && <SubNavBar moduleId={role} onSubModuleChange={onSubModuleChange} />}
      <RolePageContainer>
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          actions={universalActions}
          showStatusBar={showStatusBar}
          statusBarProps={statusBarProps}
        />
        <RolePageContent>
          {children}
        </RolePageContent>
      </RolePageContainer>
      
      {showProfile && (
        <ProfilePanel 
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </RolePageLayoutContainer>
  );
}
