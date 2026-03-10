import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { UniversalNav } from '../common';
import { UnifiedNavbar } from '../UnifiedNavbar';
import { BiometricReminder } from '../../features/auth/components/BiometricLogin';
import { AppLayoutContainer, AppMain } from './AppLayout/styles';

const ROLE_PATHS = ['buyer', 'seller', 'landlord', 'tenant', 'leasing-agent', 'secondary-sales-agent', 'owner'];

export default function AppLayout({ 
  children, 
  showNav = true,
  navProps = {}
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user?.currentUser);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const potentialRole = pathParts[1];
    
    if (ROLE_PATHS.includes(potentialRole)) {
      dispatch(setActiveRole(potentialRole));
    }
  }, [location.pathname, dispatch]);

  // Extract page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    if (pathParts.length === 0) return 'Home';
    
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <AppLayoutContainer>
      <UnifiedNavbar 
        title={getPageTitle()}
        user={user}
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
}
