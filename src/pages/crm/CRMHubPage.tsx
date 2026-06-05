/**
 * CRM Hub Page
 * Central command center for all CRM operations
 * Routes: /owner/crm, /lion/crm
 */

import React, { FC, memo, useState, useEffect, Suspense, useCallback } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Badge } from '../../components/ui';
import SuspenseLoader from '../../components/common/SuspenseLoader';
import { useCRMHubData } from '../../hooks/crm/useCRMHubData';
import { CRM_HUB_MODULE_ORDER, resolveCRMModules } from '../../config/crmModuleRegistry';

// ─── Types ──────────────────────────────────────────────────────────────

interface CRMModuleDef {
  id: string;
  label: string;
  icon: string;
  description: string;
  Component: React.ComponentType<Record<string, unknown>>;
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

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModuleCard = styled.div<{ $color: string; $active: boolean }>`
  background: ${props => (props.$active ? `${props.$color}08` : 'white')};
  border-radius: 12px;
  padding: 1.25rem;
  border: 2px solid ${props => (props.$active ? props.$color : '#e8e8e8')};
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

interface CRMQuickActionsProps {
  leadManagementLabel: string;
  propertyPortfolioLabel: string;
  agentPerformanceLabel: string;
  auditLogLabel: string;
  whatsappLabel: string;
  financeLabel: string;
  executiveLabel: string;
  onOpenLeads: () => void;
  onOpenProperties: () => void;
  onOpenAgents: () => void;
  onOpenAuditLog: () => void;
  onOpenNadia: () => void;
  onOpenTheodora: () => void;
  onOpenZoe: () => void;
}

const CRMQuickActions = memo(function CRMQuickActions({
  leadManagementLabel,
  propertyPortfolioLabel,
  agentPerformanceLabel,
  auditLogLabel,
  whatsappLabel,
  financeLabel,
  executiveLabel,
  onOpenLeads,
  onOpenProperties,
  onOpenAgents,
  onOpenAuditLog,
  onOpenNadia,
  onOpenTheodora,
  onOpenZoe,
}: CRMQuickActionsProps) {
  return (
    <QuickActions>
      <QuickAction $color="#3B82F6" onClick={onOpenLeads}>
        🎯 {leadManagementLabel}
      </QuickAction>
      <QuickAction $color="#10B981" onClick={onOpenProperties}>
        🏠 {propertyPortfolioLabel}
      </QuickAction>
      <QuickAction $color="#F59E0B" onClick={onOpenAgents}>
        👥 {agentPerformanceLabel}
      </QuickAction>
      <QuickAction $color="#0EA5E9" onClick={onOpenAuditLog}>
        🧾 {auditLogLabel}
      </QuickAction>
      <QuickAction $color="#25D366" onClick={onOpenNadia}>
        💬 {whatsappLabel}
      </QuickAction>
      <QuickAction $color="#8B5CF6" onClick={onOpenTheodora}>
        💰 {financeLabel}
      </QuickAction>
      <QuickAction $color="#E31E24" onClick={onOpenZoe}>
        👑 {executiveLabel}
      </QuickAction>
    </QuickActions>
  );
});

const CRM_HUB_COPY = {
  en: {
    leadManagementLabel: 'Lead Management',
    propertyPortfolioLabel: 'Property Portfolio',
    agentPerformanceLabel: 'Agent Performance',
    auditLogLabel: 'Audit Log',
    whatsappLabel: 'WhatsApp CRM',
    financeLabel: 'Finance & Commissions',
    executiveLabel: 'Executive View',
  },
  ar: {
    leadManagementLabel: 'إدارة العملاء المحتملين',
    propertyPortfolioLabel: 'محفظة العقارات',
    agentPerformanceLabel: 'أداء الوكلاء',
    auditLogLabel: 'سجل التدقيق',
    whatsappLabel: 'واتساب CRM',
    financeLabel: 'المالية والعمولات',
    executiveLabel: 'الرؤية التنفيذية',
  },
} as const;

const getCRMHubLocale = (): keyof typeof CRM_HUB_COPY => {
  if (typeof document === 'undefined') return 'en';
  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  return lang.startsWith('ar') ? 'ar' : 'en';
};

// ─── Module Definitions ─────────────────────────────────────────────────

const CRM_MODULES: CRMModuleDef[] = resolveCRMModules(CRM_HUB_MODULE_ORDER).map(module => ({
  id: module.id,
  label: module.label,
  icon: module.icon,
  description: module.description,
  color: module.color,
  Component: module.Component as React.ComponentType<Record<string, unknown>>,
}));

const formatTimeAgo = (timestamp: string) => {
  if (!timestamp) return 'Recently';
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

// ─── CRM Hub Component ─────────────────────────────────────────────────

const CRMHubPage: FC = () => {
  const copy = CRM_HUB_COPY[getCRMHubLocale()];
  const {
    user,
    recentActivities,
    totalLeads,
    totalClients,
    totalAgents,
    totalCommissions,
    hotLeadCount,
    pipelineValue,
  } = useCRMHubData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active module state
  const [activeModule, setActiveModule] = useState<string | null>(
    searchParams.get('module') || null
  );

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

  const handleOpenLeads = useCallback(() => navigate('/owner/crm/leads'), [navigate]);
  const handleOpenProperties = useCallback(() => navigate('/owner/crm/properties'), [navigate]);
  const handleOpenAgents = useCallback(() => navigate('/owner/crm/agents'), [navigate]);
  const handleOpenAuditLog = useCallback(() => navigate('/owner/crm/audit-log'), [navigate]);
  const handleOpenNadia = useCallback(() => handleModuleSelect('nadia'), []);
  const handleOpenTheodora = useCallback(() => handleModuleSelect('theodora'), []);
  const handleOpenZoe = useCallback(() => handleModuleSelect('zoe'), []);

  // If a module is selected, show it full-screen
  if (activeModule) {
    const moduleDef = CRM_MODULES.find(m => m.id === activeModule);
    if (moduleDef) {
      const ModuleComponent = moduleDef.Component;
      return (
        <HubContainer>
          <ContentArea>
            <ContentHeader>
              <BackButton onClick={handleBackToHub}>← Back to CRM Hub</BackButton>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{moduleDef.icon}</span>
                <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{moduleDef.label}</span>
              </div>
              <Badge variant="success" size="small">
                Active
              </Badge>
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
      <CRMQuickActions
        leadManagementLabel={copy.leadManagementLabel}
        propertyPortfolioLabel={copy.propertyPortfolioLabel}
        agentPerformanceLabel={copy.agentPerformanceLabel}
        auditLogLabel={copy.auditLogLabel}
        whatsappLabel={copy.whatsappLabel}
        financeLabel={copy.financeLabel}
        executiveLabel={copy.executiveLabel}
        onOpenLeads={handleOpenLeads}
        onOpenProperties={handleOpenProperties}
        onOpenAgents={handleOpenAgents}
        onOpenAuditLog={handleOpenAuditLog}
        onOpenNadia={handleOpenNadia}
        onOpenTheodora={handleOpenTheodora}
        onOpenZoe={handleOpenZoe}
      />

      {/* Stats Overview */}
      <StatsGrid>
        <StatCard $color="#3B82F6" onClick={() => navigate('/owner/crm/leads')}>
          <StatLabel>Total Leads</StatLabel>
          <StatValue $color="#3B82F6">{totalLeads}</StatValue>
        </StatCard>

        <StatCard $color="#EF4444" onClick={() => navigate('/owner/crm/leads')}>
          <StatLabel>Hot Leads</StatLabel>
          <StatValue $color="#EF4444">{hotLeadCount}</StatValue>
        </StatCard>

        <StatCard $color="#10B981" onClick={() => navigate('/owner/crm/properties')}>
          <StatLabel>Active Clients</StatLabel>
          <StatValue $color="#10B981">{totalClients}</StatValue>
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
