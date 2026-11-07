// FILE: src/pages/dashboard/LegacyDomainRouter.tsx
/**
 * White Caves Real Estate LLC - Legacy & Enterprise Domain Viewport Router
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC, Suspense, lazy } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import type { CrmUser } from '../../components/dashboard/viewport/ModuleViewport';

// Lazy-loaded enterprise legacy & dashboard2 views
const AuditLogPage = lazy(() => import('../crm/AuditLogPage'));
const CommissionTrackingPage = lazy(() => import('../crm/CommissionTrackingPage'));
const AgentPerformancePage = lazy(() => import('../crm/AgentPerformancePage'));
const ViewingsPage = lazy(() => import('../crm/ViewingsPage'));
const GovernanceDashboard = lazy(() => import('../crm/GovernanceDashboard/GovernanceDashboard'));
const UnifiedDashboardPage = lazy(() => import('../crm/UnifiedDashboardPage'));
const ModuleViewport = lazy(() => import('../../components/dashboard/viewport/ModuleViewport'));
const TheodoraFinanceCRM = lazy(() => import('../../components/crm/TheodoraFinanceCRM_NEW'));

// Dedicated legacy department views
const ExecutiveDepartmentView = lazy(() => import('../crm/ExecutiveDepartmentView'));
const FinanceDepartmentView = lazy(() => import('../crm/FinanceDepartmentView'));
const OperationsDepartmentView = lazy(() => import('../crm/OperationsDepartmentView'));
const LegalDepartmentView = lazy(() => import('../crm/LegalDepartmentView'));
const MarketingDepartmentView = lazy(() => import('../crm/MarketingDepartmentView'));
const TechnologyDepartmentView = lazy(() => import('../crm/TechnologyDepartmentView'));
const ComplianceDepartmentView = lazy(() => import('../crm/ComplianceDepartmentView'));

export interface LegacyDomainRouterProps {
  tab: string;
  subItemId: string | null;
  user: any;
  onNavigate: (route: string) => void;
}

export const LegacyDomainRouter: FC<LegacyDomainRouterProps> = ({
  tab,
  subItemId,
  user,
  onNavigate,
}) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SkeletonLoader width="100%" height="450px" borderRadius="16px" />}>
        {(() => {
          switch (tab) {
            case 'finance':
              return <TheodoraFinanceCRM moduleId={subItemId || undefined} />;

            case 'audit':
              return <AuditLogPage />;

            case 'governance':
              return <GovernanceDashboard />;

            case 'commissions':
              return <CommissionTrackingPage />;

            case 'performance':
              return <AgentPerformancePage />;

            case 'viewings':
              return <ViewingsPage />;

            case 'analytics':
              return <UnifiedDashboardPage />;

            case 'module':
              return (
                <ModuleViewport
                  moduleId={subItemId || 'theodora'}
                  user={user}
                  onBackToOverview={() => onNavigate('/dashboard')}
                />
              );

            case 'dept-view': {
              const deptId = subItemId?.toLowerCase() || '';
              if (deptId.includes('exec') || deptId.includes('md') || deptId === 'dept-01') {
                return <ExecutiveDepartmentView />;
              }
              if (deptId.includes('fin') || deptId.includes('revenue') || deptId === 'dept-06') {
                return <FinanceDepartmentView />;
              }
              if (deptId.includes('ops') || deptId.includes('facilities') || deptId === 'dept-05') {
                return <OperationsDepartmentView />;
              }
              if (deptId.includes('leg') || deptId.includes('convey') || deptId === 'dept-11') {
                return <LegalDepartmentView />;
              }
              if (deptId.includes('mkt') || deptId.includes('market') || deptId === 'dept-07') {
                return <MarketingDepartmentView />;
              }
              if (deptId.includes('tech') || deptId.includes('gateway') || deptId === 'dept-04') {
                return <TechnologyDepartmentView />;
              }
              if (deptId.includes('comp') || deptId.includes('rera') || deptId === 'dept-10') {
                return <ComplianceDepartmentView />;
              }
              return (
                <ModuleViewport
                  moduleId={subItemId || 'dept_summary'}
                  user={user}
                  onBackToOverview={() => onNavigate('/dashboard/departments')}
                />
              );
            }

            default:
              return (
                <div style={{ flex: 1, padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  <span>🎯 {tab.toUpperCase()} Enterprise Viewport Initialized</span>
                </div>
              );
          }
        })()}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LegacyDomainRouter;
