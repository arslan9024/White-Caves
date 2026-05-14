import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * ComplianceView Component
 * Displays regulatory compliance, audit trails, KYC, and legal requirements
 * Default service for COMPLIANCE department
 */
interface ComplianceViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: Record<string, unknown>;
}

const ComplianceView: React.FC<ComplianceViewProps> = ({
  serviceName = 'compliance-dashboard',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('COMPLIANCE')!;

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'compliance-dashboard') {
      return (
        <>
          <DataCard title="Compliance Dashboard" subtitle="Compliance status and issues">
            Issues: {JSON.stringify(getCount(data?.issues))} items
          </DataCard>
          <DataCard title="Audit Trails" subtitle="Recent audit activities and logs">
            Audits: {JSON.stringify(getCount(data?.auditTrails))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'kyc-management') {
      return (
        <DataCard title="KYC Management" subtitle="Know Your Customer verification">
          KYC: {JSON.stringify(getCount(data?.kyc))} items
        </DataCard>
      );
    }

    if (subitemId === 'audit-trails') {
      return (
        <DataCard title="Audit Trails" subtitle="Complete audit log">
          Audits: {JSON.stringify(getCount(data?.auditTrails))} items
        </DataCard>
      );
    }

    if (subitemId === 'regulatory-requirements') {
      return (
        <DataCard title="Regulatory Requirements" subtitle="Regulatory compliance checklist">
          Requirements: {JSON.stringify(getCount(data?.regulations))} items
        </DataCard>
      );
    }

    if (subitemId === 'legal-documents') {
      return (
        <DataCard title="Legal Documents" subtitle="Contracts and legal agreements">
          Documents: {JSON.stringify(getCount(data?.legalDocs))} items
        </DataCard>
      );
    }

    return null;
  };

  return (
    <BaseDepartmentView
      config={config}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={departmentData}
      contentRenderer={renderContent}
    />
  );
};

export default ComplianceView;
