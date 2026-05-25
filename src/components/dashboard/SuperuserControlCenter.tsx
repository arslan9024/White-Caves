import React, { FC, useMemo } from 'react';

interface SuperuserControlCenterProps {
  hotLeadsCount: number;
  superuserModuleCount: number;
  monthlyRevenueLabel: string;
  profileCompletionPercent: number;
  onRefreshData: () => void;
  onOpenCommandPalette: () => void;
  onOpenAdminWorkspace: () => void;
  onOpenAnalyticsWorkspace: () => void;
  onOpenUsersWorkspace: () => void;
  onLaunchUnifiedCRM: () => void;
}

interface SuperMetric {
  id: string;
  label: string;
  value: string;
  tone: 'neutral' | 'positive' | 'warn';
  icon: string;
}

const TONE_LABELS: Record<'neutral' | 'positive' | 'warn', string> = {
  positive: 'Healthy',
  neutral: 'Nominal',
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
  hotLeadsCount,
  superuserModuleCount,
  monthlyRevenueLabel,
  profileCompletionPercent,
  onRefreshData,
  onOpenCommandPalette,
  onOpenAdminWorkspace,
  onOpenAnalyticsWorkspace,
  onOpenUsersWorkspace,
  onLaunchUnifiedCRM,
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

  return (
    <section className="dashboard-superuser-strip" aria-label="Superuser controls">
      <div className="dashboard-superuser-strip__header">
        <div className="dashboard-superuser-strip__eyebrow-row">
          <span className="dashboard-superuser-live-dot" aria-hidden="true" />
          <p className="dashboard-superuser-strip__eyebrow">Platform live</p>
          <span className="dashboard-superuser-role-badge">👑 Lion</span>
        </div>
        <h2>Executive command center</h2>
        <p>
          Full-platform access. Coordinate workflows, route actions, and monitor platform health in
          real time.
        </p>
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

      <div className="dashboard-superuser-strip__actions">
        <button
          type="button"
          className="dashboard-superuser-btn dashboard-superuser-btn--primary"
          onClick={onOpenCommandPalette}
        >
          ⌘ Command palette
        </button>
        <div className="dashboard-superuser-strip__action-group">
          <button
            type="button"
            className="dashboard-superuser-btn dashboard-superuser-btn--secondary"
            onClick={onLaunchUnifiedCRM}
          >
            🧭 Unified CRM
          </button>
          <button
            type="button"
            className="dashboard-superuser-btn dashboard-superuser-btn--secondary"
            onClick={onOpenAdminWorkspace}
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            className="dashboard-superuser-btn dashboard-superuser-btn--secondary"
            onClick={onOpenAnalyticsWorkspace}
          >
            📈 Analytics
          </button>
          <button
            type="button"
            className="dashboard-superuser-btn dashboard-superuser-btn--secondary"
            onClick={onOpenUsersWorkspace}
          >
            👥 Users
          </button>
        </div>
        <button
          type="button"
          className="dashboard-superuser-btn dashboard-superuser-btn--ghost"
          onClick={onRefreshData}
        >
          ↺ Refresh
        </button>
      </div>
    </section>
  );
};

export default SuperuserControlCenter;
