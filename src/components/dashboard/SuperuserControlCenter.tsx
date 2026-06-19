import React, { FC, useMemo } from 'react';

interface SuperuserControlCenterProps {
  persona?: 'superuser' | 'executive';
  hotLeadsCount: number;
  superuserModuleCount: number;
  monthlyRevenueLabel: string;
  profileCompletionPercent: number;
  propertiesCount: number;
  agentsCount: number;
  leadsCount: number;
  contractsCount: number;
  onRefreshData: () => void;
  onOpenCommandPalette: () => void;
  onOpenAdminWorkspace: () => void;
  onOpenAnalyticsWorkspace: () => void;
  onOpenUsersWorkspace: () => void;
  onLaunchUnifiedCRM: () => void;
  onOpenPropertiesWorkspace: () => void;
  onOpenLeadsWorkspace: () => void;
  onOpenAgentsWorkspace: () => void;
  onOpenContractsWorkspace: () => void;
  onOpenFinanceWorkspace?: () => void;
  onOpenComplianceWorkspace?: () => void;
  onLaunchAIModules?: () => void;
}

interface SuperMetric {
  id: string;
  label: string;
  value: string;
  tone: 'neutral' | 'positive' | 'warn';
  icon: string;
}

interface OperationsDomain {
  id: string;
  title: string;
  value: string;
  detail: string;
  tone: 'healthy' | 'attention';
  actionLabel: string;
  onAction: () => void;
}

const TONE_LABELS: Record<SuperMetric['tone'], string> = {
  neutral: 'Stable',
  positive: 'Healthy',
  warn: 'Attention',
};

const toHealthScore = (
  hotLeadsCount: number,
  moduleCount: number,
  profileCompletionPercent: number
): number => {
  const normalizedLeadPressure = Math.min(hotLeadsCount, 25) / 25;
  const normalizedModules = Math.min(moduleCount, 20) / 20;
  const normalizedProfile = Math.min(Math.max(profileCompletionPercent, 0), 100) / 100;

  const score = Math.round(
    (1 - normalizedLeadPressure) * 45 + normalizedModules * 25 + normalizedProfile * 30
  );

  return Math.min(Math.max(score, 0), 100);
};

const SuperuserControlCenter: FC<SuperuserControlCenterProps> = ({
  persona = 'superuser',
  hotLeadsCount,
  superuserModuleCount,
  monthlyRevenueLabel,
  profileCompletionPercent,
  propertiesCount,
  agentsCount,
  leadsCount,
  contractsCount,
  onRefreshData,
  onOpenCommandPalette,
  onOpenAdminWorkspace,
  onOpenAnalyticsWorkspace,
  onOpenUsersWorkspace,
  onLaunchUnifiedCRM,
  onOpenPropertiesWorkspace,
  onOpenLeadsWorkspace,
  onOpenAgentsWorkspace,
  onOpenContractsWorkspace,
  onOpenFinanceWorkspace,
  onOpenComplianceWorkspace,
  onLaunchAIModules,
}) => {
  const healthScore = useMemo(
    () => toHealthScore(hotLeadsCount, superuserModuleCount, profileCompletionPercent),
    [hotLeadsCount, superuserModuleCount, profileCompletionPercent]
  );

  const metrics = useMemo<SuperMetric[]>(
    () => [
      {
        id: 'hot-leads',
        label: 'Hot leads',
        value: String(hotLeadsCount),
        tone: hotLeadsCount > 10 ? 'warn' : 'positive',
        icon: '🔥',
      },
      {
        id: 'ai-modules',
        label: 'AI modules',
        value: String(superuserModuleCount),
        tone: superuserModuleCount >= 10 ? 'positive' : 'neutral',
        icon: '🤖',
      },
      {
        id: 'revenue',
        label: 'Monthly revenue',
        value: monthlyRevenueLabel,
        tone: 'neutral',
        icon: '💰',
      },
      {
        id: 'health-score',
        label: 'Operational health',
        value: `${healthScore}/100`,
        tone: healthScore >= 75 ? 'positive' : healthScore >= 50 ? 'neutral' : 'warn',
        icon: '📊',
      },
    ],
    [healthScore, hotLeadsCount, monthlyRevenueLabel, superuserModuleCount]
  );

  const operationsDomains = useMemo<OperationsDomain[]>(
    () => [
      {
        id: 'properties',
        title: 'Portfolio Operations',
        value: String(propertiesCount),
        detail: 'Properties under active tracking',
        tone: propertiesCount > 0 ? 'healthy' : 'attention',
        actionLabel: 'Open properties',
        onAction: onOpenPropertiesWorkspace,
      },
      {
        id: 'leads',
        title: 'Lead Pipeline Operations',
        value: String(leadsCount),
        detail: `${hotLeadsCount} hot leads awaiting follow-up`,
        tone: hotLeadsCount > 10 ? 'attention' : 'healthy',
        actionLabel: 'Open leads',
        onAction: onOpenLeadsWorkspace,
      },
      {
        id: 'agents',
        title: 'Team Operations',
        value: String(agentsCount),
        detail: 'Agents available in the operating grid',
        tone: agentsCount > 0 ? 'healthy' : 'attention',
        actionLabel: 'Open agents',
        onAction: onOpenAgentsWorkspace,
      },
      {
        id: 'contracts',
        title: 'Contract Operations',
        value: String(contractsCount),
        detail: 'Execution and paperwork control',
        tone: contractsCount > 0 ? 'healthy' : 'attention',
        actionLabel: 'Open contracts',
        onAction: onOpenContractsWorkspace,
      },
      {
        id: 'analytics',
        title: 'Executive Analytics',
        value: monthlyRevenueLabel,
        detail: 'Performance and strategic decision signals',
        tone: 'healthy',
        actionLabel: 'Open analytics',
        onAction: onOpenAnalyticsWorkspace,
      },
      {
        id: 'users',
        title: 'User & Access Operations',
        value: `${superuserModuleCount} modules`,
        detail: 'Identity, access, and platform governance',
        tone: 'healthy',
        actionLabel: 'Open users',
        onAction: onOpenUsersWorkspace,
      },
      {
        id: 'finance',
        title: 'Finance & Commissions',
        value: monthlyRevenueLabel,
        detail: 'VAT, invoices, commissions, payout schedules',
        tone: 'healthy',
        actionLabel: 'Open finance',
        onAction: onOpenFinanceWorkspace ?? onOpenAnalyticsWorkspace,
      },
      {
        id: 'compliance',
        title: 'Compliance & Risk',
        value: 'RERA · DLD · AML',
        detail: 'Regulatory audits, KYC status, and risk flags',
        tone: 'healthy',
        actionLabel: 'Open compliance',
        onAction: onOpenComplianceWorkspace ?? onOpenAdminWorkspace,
      },
    ],
    [
      agentsCount,
      contractsCount,
      hotLeadsCount,
      leadsCount,
      monthlyRevenueLabel,
      onOpenAdminWorkspace,
      onOpenAgentsWorkspace,
      onOpenAnalyticsWorkspace,
      onOpenComplianceWorkspace,
      onOpenContractsWorkspace,
      onOpenFinanceWorkspace,
      onOpenLeadsWorkspace,
      onOpenPropertiesWorkspace,
      onOpenUsersWorkspace,
      propertiesCount,
      superuserModuleCount,
    ]
  );

  const isSuperuserPersona = persona === 'superuser';
  const controlLabel = isSuperuserPersona ? 'Superuser controls' : 'Executive controls';
  const roleBadge = isSuperuserPersona ? '👑 Lion' : '🏢 Managing Director';
  const roleIntro = isSuperuserPersona
    ? 'Full-platform access. Coordinate workflows, route actions, and monitor platform health in real time.'
    : 'Executive visibility across company operations with direct paths to high-priority workflows.';

  return (
    <section className="dashboard-superuser-strip" aria-label={controlLabel}>
      <div className="dashboard-superuser-strip__header">
        <div className="dashboard-superuser-strip__eyebrow-row">
          <span className="dashboard-superuser-live-dot" aria-hidden="true" />
          <p className="dashboard-superuser-strip__eyebrow">Platform live</p>
          <span className="dashboard-superuser-role-badge">{roleBadge}</span>
        </div>
        <h2>Executive command center</h2>
        <p>{roleIntro}</p>
      </div>

      <div className="dashboard-superuser-grid" aria-label="Superuser quick metrics">
        {metrics.map(metric => (
          <article key={metric.id} className="dashboard-superuser-metric-card">
            <span className="dashboard-superuser-metric-icon" aria-hidden="true">
              {metric.icon}
            </span>
            <div className="dashboard-superuser-metric-body">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </div>
            <span className={`dashboard-superuser-metric-chip ${metric.tone}`}>
              {TONE_LABELS[metric.tone]}
            </span>
          </article>
        ))}
      </div>

      <div
        className="dashboard-superuser-ops-grid"
        aria-label="Managing Director operations visibility"
      >
        {operationsDomains.map(domain => (
          <article key={domain.id} className="dashboard-superuser-ops-card">
            <div>
              <p className="dashboard-superuser-ops-card__title">{domain.title}</p>
              <strong>{domain.value}</strong>
              <p className="dashboard-superuser-ops-card__detail">{domain.detail}</p>
            </div>
            <div className="dashboard-superuser-ops-card__footer">
              <span
                className={`dashboard-superuser-ops-chip dashboard-superuser-ops-chip--${domain.tone}`}
              >
                {domain.tone === 'healthy' ? 'Healthy' : 'Needs attention'}
              </span>
              <button type="button" className="dashboard-superuser-btn" onClick={domain.onAction}>
                {domain.actionLabel}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-superuser-strip__actions">
        <button
          type="button"
          className="dashboard-superuser-btn dashboard-superuser-btn--primary"
          onClick={onOpenCommandPalette}
        >
          Command palette
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onLaunchUnifiedCRM}>
          Unified CRM
        </button>
        {onLaunchAIModules && (
          <button type="button" className="dashboard-superuser-btn" onClick={onLaunchAIModules}>
            AI modules
          </button>
        )}
        <button
          type="button"
          className="dashboard-superuser-btn"
          onClick={onOpenAnalyticsWorkspace}
        >
          Analytics
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onOpenAdminWorkspace}>
          Admin
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onOpenUsersWorkspace}>
          Users
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onRefreshData}>
          Refresh
        </button>
      </div>
    </section>
  );
};

export default SuperuserControlCenter;
