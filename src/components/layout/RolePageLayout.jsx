import React from 'react';
import { PageHeader, ActionButton } from '../common';
import './RolePageLayout.css';

export default function RolePageLayout({
  title,
  subtitle,
  role,
  breadcrumbs,
  actions,
  children,
  className = ''
}) {
  const roleClasses = {
    buyer: 'role-buyer',
    seller: 'role-seller',
    landlord: 'role-landlord',
    tenant: 'role-tenant',
    'leasing-agent': 'role-leasing-agent',
    'secondary-sales-agent': 'role-sales-agent',
    owner: 'role-owner',
  };

  return (
    <div className={`role-page-layout ${roleClasses[role] || ''} ${className}`}>
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
