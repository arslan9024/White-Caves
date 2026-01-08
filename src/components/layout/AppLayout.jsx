import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { UniversalNav } from '../common';
import './AppLayout.css';

const ROLE_PATHS = ['buyer', 'seller', 'landlord', 'tenant', 'leasing-agent', 'secondary-sales-agent', 'owner'];

export default function AppLayout({ 
  children, 
  showNav = true,
  navProps = {}
}) {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const potentialRole = pathParts[1];
    
    if (ROLE_PATHS.includes(potentialRole)) {
      dispatch(setActiveRole(potentialRole));
    }
  }, [location.pathname, dispatch]);

  return (
    <div className="app-layout">
      {showNav && <UniversalNav {...navProps} />}
      <main className={`app-main ${showNav ? 'with-nav' : ''}`}>
        {children}
      </main>
    </div>
  );
}
