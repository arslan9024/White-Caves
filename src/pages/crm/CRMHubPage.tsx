/**
 * CRM Hub Page
 * Central command center for all CRM operations
 * Routes: /owner/crm, /lion/crm
 */

import React, { FC, useState, useEffect, lazy, Suspense } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Tabs } from '../../components/ui';
import SuspenseLoader from '../../components/common/SuspenseLoader';
import type { RootState, AppDispatch } from '../../store/store';
import {
  selectAllLeads,
  selectHotLeads,
  selectAllClients,
  selectAllAgents,
  selectAllCommissions,
  selectRecentActivities,
  selectOverviewData,
  fetchLeadsFromAPI,
  fetchAgentsFromAPI,
  fetchDashboardOverview,
} from '../../store/crmDataSlice';

// Lazy-load CRM modules
const ClaraLeadsCRM = lazy(() => import('../../components/crm/ClaraLeadsCRM_NEW'));
const MaryInventoryCRM = lazy(() => import('../../components/crm/MaryInventoryCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('../../components/crm/SophiaSalesCRM_NEW'));
const ZoeExecutiveCRM = lazy(() => import('../../components/crm/ZoeExecutiveCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('../../components/crm/TheodoraFinanceCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('../../components/crm/DaisyLeasingCRM_NEW'));
const NadiaWhatsAppCRM = lazy(() => import('../../components/crm/NadiaWhatsAppCRM'));

// ─── Types ──────────────────────────────────────────────────────────────

interface CRMModuleDef {
  id: string;
  label: string;
  icon: string;
  description: string;
  Component: FC<Record<string, unknown>>;
  color: string;
}

// ─── Styled Components ──────────────────────────────────────────────────

const HubContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const HubHeader = styled.div`
  margin-bottom: 2rem;
`;

const HubTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.25rem 0;
`;

const HubSubtitle = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${props => props.$color};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div<{ $color: string }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.$color};
`;

const StatChange = styled.span<{ $positive: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.$positive ? '#10B981' : '#EF4444'};
  margin-left: 0.5rem;
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModuleCard = styled.div<{ $color: string; $active: boolean }>`
  background: ${props => props.$active ? `${props.$color}08` : 'white'};
  border-radius: 12px;
  padding: 1.25rem;
  border: 2px solid ${props => props.$active ? props.$color : '#e8e8e8'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$color};
    box-shadow: 0 4px 16px ${props => props.$color}20;
    transform: translateY(-2px);
  }
`;

const ModuleIcon = styled.div<{ $color: string }>`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ModuleName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 0.25rem 0;
`;

const ModuleDesc = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
  line-height: 1.4;
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  min-height: 500px;
  overflow: hidden;
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #bbb;
  }
`;

const ActivityFeed = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 1.25rem;
  margin-top: 1.5rem;
`;

const ActivityTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 1rem 0;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color};
  margin-top: 6px;
  flex-shrink: 0;
`;

const ActivityText = styled.div`
  font-size: 0.85rem;
  color: #444;
  line-height: 1.4;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #aaa;
  margin-top: 2px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const QuickAction = styled.button<{ $color: string }>`
  background: ${props => props.$color};
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.$color}40;
  }
`;

// ─── Module Definitions ─────────────────────────────────────────────────

const CRM_MODULES: CRMModuleDef[] = [
  {
    id: 'clara',
    label: 'Lead Management',
    icon: '🎯',
    description: 'Track prospects, score leads, manage pipeline',
    Component: ClaraLeadsCRM,
    color: '#3B82F6',
  },
  {
    id: 'mary',
    label: 'Property Inventory',
    icon: '🏠',
    description: 'Property listings, availability, owner tracking',
    Component: MaryInventoryCRM,
    color: '#10B981',
  },
  {
    id: 'sophia',
    label: 'Sales Pipeline',
    icon: '💰',
    description: 'Deals, pipeline stages, agent performance',
    Component: SophiaSalesCRM,
    color: '#F59E0B',
  },
  {
    id: 'theodora',
    label: 'Finance & Commissions',
    icon: '📊',
    description: 'Revenue tracking, commissions, payments',
    Component: TheodoraFinanceCRM,
    color: '#8B5CF6',
  },
  {
    id: 'daisy',
    label: 'Leasing Management',
    icon: '📋',
    description: 'Tenants, lease agreements, renewals',
    Component: DaisyLeasingCRM,
    color: '#EC4899',
  },
  {
    id: 'nadia',
    label: 'WhatsApp CRM',
    icon: '💬',
    description: 'WhatsApp conversations, templates, campaigns',
    Component: NadiaWhatsAppCRM,
    color: '#25D366',
  },
  {
    id: 'zoe',
    label: 'Executive Dashboard',
    icon: '👑',
    description: 'KPIs, compliance, strategic overview',
    Component: ZoeExecutiveCRM,
    color: '#D32F2F',
  },
];

// ─── CRM Hub Component ─────────────────────────────────────────────────

const CRMHubPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector((state: RootState) => state.user.currentUser);

  // CRM data from Redux
  const allLeads = useSelector(selectAllLeads);
  const hotLeads = useSelector(selectHotLeads);
  const allClients = useSelector(selectAllClients);
  const allAgents = useSelector(selectAllAgents);
  const commissions = useSelector(selectAllCommissions);
  const recentActivities = useSelector((state: RootState) => selectRecentActivities(state, 8));
  const overview = useSelector(selectOverviewData);

  // Active module state
  const [activeModule, setActiveModule] = useState<string | null>(
    searchParams.get('module') || null
  );

  // Try to fetch from API on mount (silently falls back to dummy data)
  useEffect(() => {
    const leadsPromise = dispatch(fetchLeadsFromAPI({}));
    const agentsPromise = dispatch(fetchAgentsFromAPI());
    const overviewPromise = dispatch(fetchDashboardOverview());

    return () => {
      leadsPromise.abort?.();
      agentsPromise.abort?.();
      overviewPromise.abort?.();
    };
  }, [dispatch]);

  // Sync URL params
  useEffect(() => {
    if (activeModule) {
      setSearchParams({ module: activeModule });
    } else {
      setSearchParams({});
    }
  }, [activeModule, setSearchParams]);

  const handleModuleSelect = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const handleBackToHub = () => {
    setActiveModule(null);
  };

  // Calculate stats
  const totalLeads = allLeads.length;
  const totalClients = allClients.length;
  const totalAgents = allAgents.length;
  const totalCommissions = commissions.length;
  const hotLeadCount = hotLeads.length;
  const overviewMetrics = (overview as Record<string, Record<string, unknown>> | null)?.metrics;
  const rawPipelineValue = overviewMetrics?.pipelineValue;
  const pipelineValue = rawPipelineValue !== undefined && rawPipelineValue !== null
    ? Number(rawPipelineValue)
    : allLeads.reduce((sum: number, l) => sum + (Number(l.value) || Number(l.budget) || 0), 0);

  // If a module is selected, show it full-screen
  if (activeModule) {
    const moduleDef = CRM_MODULES.find(m => m.id === activeModule);
    if (moduleDef) {
      const ModuleComponent = moduleDef.Component;
      return (
        <HubContainer>
          <ContentArea>
            <ContentHeader>
              <BackButton onClick={handleBackToHub}>
                ← Back to CRM Hub
              </BackButton>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{moduleDef.icon}</span>
                <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{moduleDef.label}</span>
              </div>
              <Badge variant="success" size="small">Active</Badge>
            </ContentHeader>
            <div style={{ padding: '0' }}>
              <ErrorBoundary>
                <Suspense fallback={<SuspenseLoader />}>
                  <ModuleComponent role="owner" user={user} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </ContentArea>
        </HubContainer>
      );
    }
  }

  // Activity color mapping
  const activityColors: Record<string, string> = {
    lead: '#3B82F6',
    client: '#10B981',
    deal: '#F59E0B',
    commission: '#8B5CF6',
    system: '#6B7280',
  };

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return 'Recently';
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <HubContainer>
      {/* Header */}
      <HubHeader>
        <HubTitle>CRM Command Center</HubTitle>
        <HubSubtitle>
          Manage leads, properties, deals, and team performance — all in one place
        </HubSubtitle>
      </HubHeader>

      {/* Quick Actions */}
      <QuickActions>
        <QuickAction $color="#3B82F6" onClick={() => navigate('/owner/crm/leads')}>
          🎯 Lead Management
        </QuickAction>
        <QuickAction $color="#10B981" onClick={() => navigate('/owner/crm/properties')}>
          🏠 Property Portfolio
        </QuickAction>
        <QuickAction $color="#F59E0B" onClick={() => navigate('/owner/crm/agents')}>
          👥 Agent Performance
        </QuickAction>
        <QuickAction $color="#25D366" onClick={() => handleModuleSelect('nadia')}>
          💬 WhatsApp CRM
        </QuickAction>
        <QuickAction $color="#8B5CF6" onClick={() => handleModuleSelect('theodora')}>
          💰 Finance & Commissions
        </QuickAction>
        <QuickAction $color="#D32F2F" onClick={() => handleModuleSelect('zoe')}>
          👑 Executive View
        </QuickAction>
      </QuickActions>

      {/* Stats Overview */}
      <StatsGrid>
        <StatCard $color="#3B82F6" onClick={() => navigate('/owner/crm/leads')}>
          <StatLabel>Total Leads</StatLabel>
          <StatValue $color="#3B82F6">
            {totalLeads}
          </StatValue>
        </StatCard>

        <StatCard $color="#EF4444" onClick={() => navigate('/owner/crm/leads')}>
          <StatLabel>Hot Leads</StatLabel>
          <StatValue $color="#EF4444">
            {hotLeadCount}
          </StatValue>
        </StatCard>

        <StatCard $color="#10B981" onClick={() => navigate('/owner/crm/properties')}>
          <StatLabel>Active Clients</StatLabel>
          <StatValue $color="#10B981">
            {totalClients}
          </StatValue>
        </StatCard>

        <StatCard $color="#8B5CF6" onClick={() => handleModuleSelect('sophia')}>
          <StatLabel>Pipeline Value</StatLabel>
          <StatValue $color="#8B5CF6">
            {pipelineValue > 1000000
              ? `AED ${(pipelineValue / 1000000).toFixed(1)}M`
              : `AED ${(pipelineValue / 1000).toFixed(0)}K`}
          </StatValue>
        </StatCard>

        <StatCard $color="#F59E0B" onClick={() => navigate('/owner/crm/agents')}>
          <StatLabel>Active Agents</StatLabel>
          <StatValue $color="#F59E0B">{totalAgents}</StatValue>
        </StatCard>

        <StatCard $color="#EC4899">
          <StatLabel>Commissions</StatLabel>
          <StatValue $color="#EC4899">{totalCommissions}</StatValue>
        </StatCard>
      </StatsGrid>

      {/* CRM Modules Grid */}
      <ModulesGrid>
        {CRM_MODULES.map(module => (
          <ModuleCard
            key={module.id}
            $color={module.color}
            $active={false}
            onClick={() => handleModuleSelect(module.id)}
          >
            <ModuleIcon $color={module.color}>{module.icon}</ModuleIcon>
            <ModuleName>{module.label}</ModuleName>
            <ModuleDesc>{module.description}</ModuleDesc>
          </ModuleCard>
        ))}
      </ModulesGrid>

      {/* Recent Activity Feed */}
      <ActivityFeed>
        <ActivityTitle>Recent Activity</ActivityTitle>
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index: number) => (
            <ActivityItem key={String(activity.id) || index}>
              <ActivityDot $color={activityColors[String(activity.type)] || '#6B7280'} />
              <div>
                <ActivityText>
                  {String(activity.description || activity.action || `${activity.type} activity`)}
                </ActivityText>
                <ActivityTime>{formatTimeAgo(String(activity.timestamp))}</ActivityTime>
              </div>
            </ActivityItem>
          ))
        ) : (
          <ActivityItem>
            <ActivityDot $color="#6B7280" />
            <div>
              <ActivityText>System initialized — CRM modules loaded successfully</ActivityText>
              <ActivityTime>Just now</ActivityTime>
            </div>
          </ActivityItem>
        )}
      </ActivityFeed>
    </HubContainer>
  );
};

export default CRMHubPage;
