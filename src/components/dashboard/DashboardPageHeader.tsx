import React, { FC } from 'react';

interface DashboardPageHeaderProps {
  currentModule: string | null;
  currentRole: string;
  currentTabLabel?: string;
  selectedCRMModuleLabel?: string;
  roleLabel: string;
  roleDescription: string;
  greetingLine: string;
  userEmail: string;
}

const DashboardPageHeader: FC<DashboardPageHeaderProps> = ({
  currentModule,
  currentRole,
  currentTabLabel,
  selectedCRMModuleLabel,
  roleLabel,
  roleDescription,
  greetingLine,
  userEmail,
}) => {
  return (
    <section className="dashboard-page-header">
      <div className="dashboard-page-header__copy">
        <span className="dashboard-page-header__eyebrow">
          {currentModule ?? currentRole} / {selectedCRMModuleLabel ?? currentTabLabel ?? 'Overview'}
        </span>
        <h1>{roleLabel} Dashboard</h1>
        <p className="dashboard-page-header__subtitle">{roleDescription}</p>
        <p className="dashboard-page-header__greeting">{greetingLine}</p>
      </div>
      <div className="dashboard-page-header__meta">
        <div className="dashboard-breadcrumbs" aria-label="Breadcrumb">
          <span>CRM</span>
          <span aria-hidden="true">/</span>
          <span>{roleLabel}</span>
          <span aria-hidden="true">/</span>
          <span>{selectedCRMModuleLabel ?? currentTabLabel ?? 'Overview'}</span>
        </div>
        <div className="dashboard-page-header__status">
          <span className="dashboard-status-pill">Live workspace</span>
          <span className="dashboard-status-pill dashboard-status-pill--muted">{userEmail}</span>
        </div>
      </div>
    </section>
  );
};

export default DashboardPageHeader;
