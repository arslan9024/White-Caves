// FILE: src/pages/dashboard/DashboardContentRouter.tsx
/**
 * White Caves Real Estate LLC - Modern Dashboard Viewport Content Router
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC, Suspense, lazy } from 'react';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { ProfileDashboardView } from './ProfileDashboardView';
import { LegacyDomainRouter } from './LegacyDomainRouter';
import { checkDashboardRoleGuard } from './DashboardRoleGuards';
import { UserRoleContext } from '../../context/UserRoleContext';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

// Lazy-loaded CRM modules for optimized initial dashboard bundle
const DepartmentManagementWorkspace = lazy(() =>
  import('../../components/crm/DepartmentManager').then(m => ({ default: m.DepartmentManagementWorkspace }))
);
const DepartmentOverviewView = lazy(() =>
  import('../../components/crm/DepartmentManager/DepartmentOverviewView').then(m => ({ default: m.DepartmentOverviewView }))
);
const EmployeeManagerView = lazy(() =>
  import('../../components/crm/EmployeeManager').then(m => ({ default: m.EmployeeManagerView }))
);
const EmployeeOverviewView = lazy(() =>
  import('../../components/crm/EmployeeManager/EmployeeOverviewView').then(m => ({ default: m.EmployeeOverviewView }))
);
const AiAssistantManagerView = lazy(() =>
  import('../../components/crm/AiAssistantManager').then(m => ({ default: m.AiAssistantManagerView }))
);
const TaskManagerView = lazy(() =>
  import('../../components/crm/TaskManager').then(m => ({ default: m.TaskManagerView }))
);
const TaskOverviewView = lazy(() =>
  import('../../components/crm/TaskManager/TaskOverviewView').then(m => ({ default: m.TaskOverviewView }))
);
const LeaderboardView = lazy(() =>
  import('../../components/crm/Leaderboard').then(m => ({ default: m.LeaderboardView }))
);
const LeaderboardOverviewView = lazy(() =>
  import('../../components/crm/Leaderboard/LeaderboardOverviewView').then(m => ({ default: m.LeaderboardOverviewView }))
);
const REPropertyManagerView = lazy(() =>
  import('../../components/crm/REPropertyManager').then(m => ({ default: m.REPropertyManagerView }))
);
const REPropertyOverviewView = lazy(() =>
  import('../../components/crm/REPropertyManager/REPropertyOverviewView').then(m => ({ default: m.REPropertyOverviewView }))
);
const DealManagerView = lazy(() =>
  import('../../components/crm/DealManager').then(m => ({ default: m.DealManagerView }))
);
const DealOverviewView = lazy(() =>
  import('../../components/crm/DealManager/DealOverviewView').then(m => ({ default: m.DealOverviewView }))
);
const DocumentManagerView = lazy(() =>
  import('../../components/crm/DocumentManager').then(m => ({ default: m.DocumentManagerView }))
);
const DocumentOverviewView = lazy(() =>
  import('../../components/crm/DocumentManager/DocumentOverviewView').then(m => ({ default: m.DocumentOverviewView }))
);
const CustomerManagerView = lazy(() =>
  import('../../components/crm/CustomerManager').then(m => ({ default: m.CustomerManagerView }))
);
const CustomerOverviewView = lazy(() =>
  import('../../components/crm/CustomerManager/CustomerOverviewView').then(m => ({ default: m.CustomerOverviewView }))
);
const RelationshipManagerView = lazy(() =>
  import('../../components/crm/RelationshipManager').then(m => ({ default: m.RelationshipManagerView }))
);
const ErmsOverviewView = lazy(() =>
  import('../../components/crm/RelationshipManager/ErmsOverviewView').then(m => ({ default: m.ErmsOverviewView }))
);
const RoleManagerView = lazy(() =>
  import('../../components/crm/RoleManager').then(m => ({ default: m.RoleManagerView }))
);
const LandlordManagerView = lazy(() =>
  import('../../components/crm/LandlordManager').then(m => ({ default: m.LandlordManagerView }))
);
const TenantManagerView = lazy(() =>
  import('../../components/crm/TenantManager').then(m => ({ default: m.TenantManagerView }))
);
const BrokerManagerView = lazy(() =>
  import('../../components/crm/BrokerManager').then(m => ({ default: m.BrokerManagerView }))
);
const LindaWhatsAppCRM = lazy(() => import('../../components/crm/LindaWhatsAppCRM'));

export interface DashboardContentRouterProps {
  activeTab: ActivityTab;
  isRootOverview: boolean;
  activeItemId: string | null;
  isReadOnly: boolean;
  isErmsRootOverview: boolean;
  ermsSubTab: 'entities' | 'relationships' | 'graph' | 'matrix';
  ermsEntityId: string | null;
  ermsRelationshipId: string | null;
  activeAgent?: { id: string; name: string } | null;
  navigate: (route: string) => void;
  onOpenRoleModal?: () => void;
}

export const DashboardContentRouter: FC<DashboardContentRouterProps> = ({
  activeTab,
  isRootOverview,
  activeItemId,
  isReadOnly,
  isErmsRootOverview,
  ermsSubTab,
  ermsEntityId,
  ermsRelationshipId,
  activeAgent,
  navigate,
  onOpenRoleModal,
}) => {
  const roleContext = React.useContext(UserRoleContext);
  const role = roleContext?.role || 'guest';
  const isMdOrFounder = Boolean(
    roleContext?.isManagingDirector || roleContext?.isFounder || role === 'managing_director'
  );
  const isConfirmed = isMdOrFounder || Boolean(roleContext?.isRoleConfirmed && role !== 'guest');

  // Check portal / role isolation guards
  const guardedView = checkDashboardRoleGuard({
    role,
    isConfirmed,
    isMdOrFounder,
    activeTab,
    isRootOverview,
    navigate,
    onOpenRoleModal,
  });
  if (guardedView) return guardedView;

  // Direct Linda / AI Command Center selection
  if (
    activeTab === 'linda' ||
    activeAgent?.id === 'linda' ||
    (activeTab === 'ai-command' && activeItemId === 'linda')
  ) {
    return (
      <div style={{ padding: '20px', flex: 1 }}>
        <LindaWhatsAppCRM />
      </div>
    );
  }

  if (activeTab === 'aiams' || activeTab === 'ai-command' || activeAgent?.id === 'ai-command') {
    return (
      <AiAssistantManagerView
        selectedSubRoute={activeItemId}
        isReadOnly={isReadOnly}
        onNavigate={navigate}
      />
    );
  }

  // Tier 1 Internal Corporate Directorate (L3, L4, L5)
  switch (activeTab) {
    case 'departments':
      return isRootOverview ? (
        <DepartmentOverviewView onNavigate={navigate} />
      ) : (
        <DepartmentManagementWorkspace
          selectedDeptId={
            activeItemId && activeItemId !== 'slots' && activeItemId !== 'pillars'
              ? activeItemId
              : undefined
          }
          onNavigateBack={() => navigate('/dashboard/departments/slots')}
          onSelectDept={code => navigate(`/dashboard/departments/${code}`)}
          isReadOnly={isReadOnly}
        />
      );

    case 'employees':
      return isRootOverview ? (
        <EmployeeOverviewView onNavigate={navigate} />
      ) : (
        <EmployeeManagerView
          selectedEmpId={
            activeItemId &&
            activeItemId !== 'roster' &&
            activeItemId !== 'directors' &&
            activeItemId !== 'supervisors'
              ? activeItemId
              : undefined
          }
          onNavigateBack={() => navigate('/dashboard/employees/roster')}
          onSelectEmployee={id => navigate(`/dashboard/employees/${id}`)}
        />
      );

    case 'tasks':
      return isRootOverview ? (
        <TaskOverviewView onNavigate={navigate} />
      ) : (
        <TaskManagerView
          selectedTaskId={
            activeItemId !== 'catalog' && activeItemId !== 'categories' ? activeItemId : null
          }
          onSelectTask={id => navigate(`/dashboard/tasks/${id}`)}
          onNavigateBack={() => navigate('/dashboard/tasks/catalog')}
        />
      );

    case 'leaderboard':
      return isRootOverview ? (
        <LeaderboardOverviewView onNavigate={navigate} />
      ) : (
        <LeaderboardView />
      );

    case 'REproperties':
      return isRootOverview ? (
        <REPropertyOverviewView onNavigate={navigate} />
      ) : (
        <REPropertyManagerView
          selectedPropertyId={
            activeItemId !== 'inventory' && activeItemId !== 'clusters' ? activeItemId : null
          }
          onSelectProperty={id => navigate(`/dashboard/REproperties/${id}`)}
          onNavigateBack={() => navigate('/dashboard/REproperties/inventory')}
        />
      );

    case 'deals':
      return isRootOverview ? (
        <DealOverviewView onNavigate={navigate} />
      ) : (
        <DealManagerView
          selectedDealId={
            activeItemId !== 'pipeline' && activeItemId !== 'escrow' ? activeItemId : null
          }
          onSelectDeal={id => navigate(`/dashboard/deals/${id}`)}
          onNavigateBack={() => navigate('/dashboard/deals/pipeline')}
        />
      );

    case 'documents':
      return isRootOverview ? (
        <DocumentOverviewView onNavigate={navigate} />
      ) : (
        <DocumentManagerView
          selectedDocId={
            activeItemId !== 'vault' && activeItemId !== 'compliance' ? activeItemId : null
          }
          onSelectDoc={id => navigate(`/dashboard/documents/${id}`)}
          onNavigateBack={() => navigate('/dashboard/documents/vault')}
        />
      );

    case 'relationships':
    case 'erms': {
      const initialErmsTab =
        ermsSubTab === 'entities' || ermsSubTab === 'relationships' ? ermsSubTab : 'erd';
      if (activeTab === 'erms' && isErmsRootOverview) {
        return <ErmsOverviewView onNavigate={navigate} />;
      }
      return (
        <RelationshipManagerView
          initialTab={initialErmsTab}
          selectedEntityId={ermsEntityId}
          selectedRelationshipId={ermsRelationshipId}
          onSelectEntity={id => navigate(`/dashboard/erms/entities/${id}`)}
          onSelectRelationship={id => navigate(`/dashboard/erms/relationships/${id}`)}
          onNavigateToDeepRoute={route => navigate(route)}
        />
      );
    }

    case 'customers':
      return isRootOverview ? (
        <CustomerOverviewView onNavigate={navigate} />
      ) : (
        <CustomerManagerView
          selectedCustomerId={
            activeItemId !== 'leads' && activeItemId !== 'investors' ? activeItemId : null
          }
          onSelectCustomer={id => navigate(`/dashboard/customers/${id}`)}
          onNavigateBack={() => navigate('/dashboard/customers/leads')}
        />
      );

    case 'roles':
      return (
        <RoleManagerView
          selectedRoleId={activeItemId || undefined}
          onSelectRole={id => navigate(`/dashboard/roles/${id}`)}
          onNavigateBack={() => navigate('/dashboard/roles')}
        />
      );

    case 'profile':
      return <ProfileDashboardView />;

    // Migrated Legacy & Enterprise Domain Suite
    case 'finance' as ActivityTab:
    case 'audit' as ActivityTab:
    case 'governance' as ActivityTab:
    case 'commissions' as ActivityTab:
    case 'performance' as ActivityTab:
    case 'viewings' as ActivityTab:
    case 'analytics' as ActivityTab:
    case 'module' as ActivityTab:
    case 'dept-view' as ActivityTab:
      return (
        <LegacyDomainRouter
          tab={activeTab}
          subItemId={activeItemId}
          user={roleContext?.user || null}
          onNavigate={navigate}
        />
      );

    case 'landlord' as ActivityTab:
      return <LandlordManagerView />;
    case 'tenant' as ActivityTab:
      return <TenantManagerView />;
    case 'broker' as ActivityTab:
      return <BrokerManagerView />;
    default:
      return (
        <div style={{ flex: 1, padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
          <span>🎯 {activeTab.toUpperCase()} Viewport Initialized</span>
        </div>
      );
  }
};

export default DashboardContentRouter;
