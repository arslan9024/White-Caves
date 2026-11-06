// FILE: src/pages/dashboard/DashboardContentRouter.tsx
/**
 * White Caves Real Estate LLC - Modern Dashboard Viewport Content Router
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC } from 'react';
import { DepartmentManagementWorkspace } from '../../components/crm/DepartmentManager';
import { DepartmentOverviewView } from '../../components/crm/DepartmentManager/DepartmentOverviewView';
import { EmployeeManagerView } from '../../components/crm/EmployeeManager';
import { EmployeeOverviewView } from '../../components/crm/EmployeeManager/EmployeeOverviewView';
import { TaskManagerView } from '../../components/crm/TaskManager';
import { TaskOverviewView } from '../../components/crm/TaskManager/TaskOverviewView';
import { LeaderboardView } from '../../components/crm/Leaderboard';
import { LeaderboardOverviewView } from '../../components/crm/Leaderboard/LeaderboardOverviewView';
import { REPropertyManagerView } from '../../components/crm/REPropertyManager';
import { REPropertyOverviewView } from '../../components/crm/REPropertyManager/REPropertyOverviewView';
import { DealManagerView } from '../../components/crm/DealManager';
import { DealOverviewView } from '../../components/crm/DealManager/DealOverviewView';
import { DocumentManagerView } from '../../components/crm/DocumentManager';
import { DocumentOverviewView } from '../../components/crm/DocumentManager/DocumentOverviewView';
import { CustomerManagerView } from '../../components/crm/CustomerManager';
import { CustomerOverviewView } from '../../components/crm/CustomerManager/CustomerOverviewView';
import { RelationshipManagerView } from '../../components/crm/RelationshipManager';
import { ErmsOverviewView } from '../../components/crm/RelationshipManager/ErmsOverviewView';
import { RoleManagerView } from '../../components/crm/RoleManager';
import { LandlordManagerView } from '../../components/crm/LandlordManager';
import { TenantManagerView } from '../../components/crm/TenantManager';
import { BrokerManagerView } from '../../components/crm/BrokerManager';
import { ProfileDashboardView } from './ProfileDashboardView';
import { GuestDashboardGatewayView } from './GuestDashboardGatewayView';
import { AccessDeniedView } from './AccessDeniedView';
import { UserRoleContext } from '../../context/UserRoleContext';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export interface DashboardContentRouterProps {
  activeTab: ActivityTab;
  isRootOverview: boolean;
  activeItemId: string | null;
  isReadOnly: boolean;
  isErmsRootOverview: boolean;
  ermsSubTab: 'entities' | 'relationships' | 'graph' | 'matrix';
  ermsEntityId: string | null;
  ermsRelationshipId: string | null;
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
  navigate,
  onOpenRoleModal,
}) => {
  const roleContext = React.useContext(UserRoleContext);
  const role = roleContext?.role || 'guest';
  const isMdOrFounder = Boolean(
    roleContext?.isManagingDirector || roleContext?.isFounder || role === 'managing_director'
  );
  const isConfirmed = isMdOrFounder || Boolean(roleContext?.isRoleConfirmed && role !== 'guest');

  // Guard 1: Unconfirmed or Guest users are restricted from internal corporate machinery
  // Managing Director (user-001) bypasses role confirmation and always sees the full dashboard.
  if (!isMdOrFounder && (!isConfirmed || role === 'guest')) {
    if (activeTab === 'landlord') return <LandlordManagerView />;
    if (activeTab === 'tenant') return <TenantManagerView />;
    if (activeTab === 'broker') return <BrokerManagerView />;
    if (activeTab === 'profile') return <ProfileDashboardView />;

    return <GuestDashboardGatewayView onOpenRoleModal={onOpenRoleModal} onNavigate={navigate} />;
  }

  // Guard 2: Sovereign Landlord portal isolation
  if (role === 'landlord') {
    if (activeTab === 'departments' || activeTab === 'landlord') return <LandlordManagerView />;
    if (activeTab === 'documents') {
      return isRootOverview ? (
        <DocumentOverviewView onNavigate={navigate} />
      ) : (
        <DocumentManagerView onNavigateBack={() => navigate('/dashboard/documents/vault')} />
      );
    }
    if (activeTab === 'profile') return <ProfileDashboardView />;
    return (
      <AccessDeniedView
        requiredRole="Corporate Directorate (L3+)"
        onNavigateBack={() => navigate('/dashboard/landlord')}
        onNavigateHome={() => navigate('/dashboard/landlord')}
      />
    );
  }

  // Guard 3: Sovereign Tenant portal isolation
  if (role === 'tenant') {
    if (activeTab === 'departments' || activeTab === 'tenant') return <TenantManagerView />;
    if (activeTab === 'documents') {
      return isRootOverview ? (
        <DocumentOverviewView onNavigate={navigate} />
      ) : (
        <DocumentManagerView onNavigateBack={() => navigate('/dashboard/documents/vault')} />
      );
    }
    if (activeTab === 'profile') return <ProfileDashboardView />;
    return (
      <AccessDeniedView
        requiredRole="Corporate Directorate (L3+)"
        onNavigateBack={() => navigate('/dashboard/tenant')}
        onNavigateHome={() => navigate('/dashboard/tenant')}
      />
    );
  }

  // Guard 4: Sovereign Broker hub isolation
  if (role === 'agent' || (role as string) === 'broker') {
    if (activeTab === 'departments' || activeTab === 'broker') return <BrokerManagerView />;
    if (activeTab === 'REproperties') {
      return isRootOverview ? (
        <REPropertyOverviewView onNavigate={navigate} />
      ) : (
        <REPropertyManagerView
          onNavigateBack={() => navigate('/dashboard/REproperties/inventory')}
        />
      );
    }
    if (activeTab === 'deals') {
      return isRootOverview ? (
        <DealOverviewView onNavigate={navigate} />
      ) : (
        <DealManagerView onNavigateBack={() => navigate('/dashboard/deals/pipeline')} />
      );
    }
    if (activeTab === 'customers') {
      return isRootOverview ? (
        <CustomerOverviewView onNavigate={navigate} />
      ) : (
        <CustomerManagerView onNavigateBack={() => navigate('/dashboard/customers/leads')} />
      );
    }
    if (activeTab === 'documents') {
      return isRootOverview ? (
        <DocumentOverviewView onNavigate={navigate} />
      ) : (
        <DocumentManagerView onNavigateBack={() => navigate('/dashboard/documents/vault')} />
      );
    }
    if (activeTab === 'profile') return <ProfileDashboardView />;
    return (
      <AccessDeniedView
        requiredRole="Corporate Directorate (L3+)"
        onNavigateBack={() => navigate('/dashboard/broker')}
        onNavigateHome={() => navigate('/dashboard/broker')}
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

    case 'relationships': {
      const initialRelTab =
        ermsSubTab === 'entities' || ermsSubTab === 'relationships' ? ermsSubTab : 'erd';
      return (
        <RelationshipManagerView
          initialTab={initialRelTab}
          selectedEntityId={ermsEntityId}
          selectedRelationshipId={ermsRelationshipId}
          onSelectEntity={id => navigate(`/dashboard/erms/entities/${id}`)}
          onSelectRelationship={id => navigate(`/dashboard/erms/relationships/${id}`)}
          onNavigateToDeepRoute={route => navigate(route)}
        />
      );
    }

    case 'erms': {
      const initialErmsTab =
        ermsSubTab === 'entities' || ermsSubTab === 'relationships' ? ermsSubTab : 'erd';
      return isErmsRootOverview ? (
        <ErmsOverviewView onNavigate={navigate} />
      ) : (
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

    case 'landlord' as ActivityTab:
      return <LandlordManagerView />;

    case 'tenant' as ActivityTab:
      return <TenantManagerView />;

    case 'broker' as ActivityTab:
      return <BrokerManagerView />;

    default:
      return (
        <div
          style={{
            flex: 1,
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
          }}
        >
          <span>🎯 {activeTab.toUpperCase()} Viewport Initialized</span>
        </div>
      );
  }
};

export default DashboardContentRouter;
