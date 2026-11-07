// FILE: src/pages/dashboard/DashboardRoleGuards.tsx
/**
 * White Caves Real Estate LLC - Dashboard Role Guards (Portal Isolation)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { LandlordManagerView } from '../../components/crm/LandlordManager';
import { TenantManagerView } from '../../components/crm/TenantManager';
import { BrokerManagerView } from '../../components/crm/BrokerManager';
import { DocumentOverviewView } from '../../components/crm/DocumentManager/DocumentOverviewView';
import { DocumentManagerView } from '../../components/crm/DocumentManager';
import { REPropertyOverviewView } from '../../components/crm/REPropertyManager/REPropertyOverviewView';
import { REPropertyManagerView } from '../../components/crm/REPropertyManager';
import { DealOverviewView } from '../../components/crm/DealManager/DealOverviewView';
import { DealManagerView } from '../../components/crm/DealManager';
import { CustomerOverviewView } from '../../components/crm/CustomerManager/CustomerOverviewView';
import { CustomerManagerView } from '../../components/crm/CustomerManager';
import { ProfileDashboardView } from './ProfileDashboardView';
import { AccessDeniedView } from './AccessDeniedView';
import { GuestDashboardGatewayView } from './GuestDashboardGatewayView';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export interface GuardParams {
  role: string;
  isConfirmed: boolean;
  isMdOrFounder: boolean;
  activeTab: ActivityTab;
  isRootOverview: boolean;
  navigate: (route: string) => void;
  onOpenRoleModal?: () => void;
}

export function checkDashboardRoleGuard(p: GuardParams): React.ReactElement | null {
  const { role, isConfirmed, isMdOrFounder, activeTab, isRootOverview, navigate, onOpenRoleModal } = p;

  if (!isMdOrFounder && (!isConfirmed || role === 'guest')) {
    if (activeTab === 'landlord') return <LandlordManagerView />;
    if (activeTab === 'tenant') return <TenantManagerView />;
    if (activeTab === 'broker') return <BrokerManagerView />;
    if (activeTab === 'profile') return <ProfileDashboardView />;
    return <GuestDashboardGatewayView onOpenRoleModal={onOpenRoleModal} onNavigate={navigate} />;
  }

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

  if (role === 'agent' || role === 'broker') {
    if (activeTab === 'departments' || activeTab === 'broker') return <BrokerManagerView />;
    if (activeTab === 'REproperties') {
      return isRootOverview ? (
        <REPropertyOverviewView onNavigate={navigate} />
      ) : (
        <REPropertyManagerView onNavigateBack={() => navigate('/dashboard/REproperties/inventory')} />
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

  return null;
}
