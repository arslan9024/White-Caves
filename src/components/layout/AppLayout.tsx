import React, { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { UniversalNav } from '../common';
import { UnifiedNavbar } from '../UnifiedNavbar';
import { BiometricReminder } from '../../features/auth/components/BiometricLogin';
import { AppLayoutContainer, AppMain } from './AppLayout/styles';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  navProps?: Record<string, unknown>;
}

interface UserState {
  user: {
    currentUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
  };
}

const ROLE_PATHS: string[] = ['buyer', 'seller', 'landlord', 'tenant', 'leasing-agent', 'secondary-sales-agent', 'owner'];

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showNav = true,
  navProps = {}
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState['user'] }) => state.user?.currentUser);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const potentialRole = pathParts[1];
    
    if (ROLE_PATHS.includes(potentialRole)) {
      dispatch(setActiveRole(potentialRole));
    }
  }, [location.pathname, dispatch]);

  // Extract page title from current path
  const getPageTitle = (): string => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length === 0) return 'Home';
    
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  return (
    <AppLayoutContainer>
      <UnifiedNavbar 
        title={getPageTitle()}
        user={user ? {
          name: user.name || user.email,
          email: user.email,
          role: (['admin', 'super_user', 'agent', 'client'] as const).includes(
            user.role as 'admin' | 'super_user' | 'agent' | 'client'
          ) ? (user.role as 'admin' | 'super_user' | 'agent' | 'client') : undefined,
        } : undefined}
        notifications={[]}
        systemStatus="online"
      />
      {showNav && <UniversalNav {...navProps} />}
      <AppMain $withNav={showNav} style={{ marginTop: '64px' }}>
        <BiometricReminder />
        {children}
      </AppMain>
    </AppLayoutContainer>
  );
};

export default AppLayout;
