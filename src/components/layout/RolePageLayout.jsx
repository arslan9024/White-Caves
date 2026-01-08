import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PageHeader, ActionButton, SubNavBar } from '../common';
import { setCurrentModule, setCurrentSubModule, setActiveRole } from '../../store/navigationSlice';
import { getModuleById } from '../../features/featureRegistry';
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
  onSubModuleChange
}) {
  const dispatch = useDispatch();
  
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

  return (
    <div className={`role-page-layout ${roleClasses[role] || ''} ${className}`}>
      {showSubNav && <SubNavBar moduleId={role} onSubModuleChange={onSubModuleChange} />}
      <div className="role-page-container">
        <PageHeader
          title={title}
          subtitle={subtitle}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />
        <div className="role-page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export { ActionButton };
