import React, { FC } from 'react';

interface DashboardModuleToolbarProps {
  label: string;
  onBack: () => void;
}

const DashboardModuleToolbar: FC<DashboardModuleToolbarProps> = ({ label, onBack }) => {
  return (
    <div className="dashboard-module-toolbar">
      <button className="crm-back-button" onClick={onBack}>
        ← Back to dashboard
      </button>
      <span className="dashboard-module-toolbar__label">{label}</span>
    </div>
  );
};

export default DashboardModuleToolbar;
