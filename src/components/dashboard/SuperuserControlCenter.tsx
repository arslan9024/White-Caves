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
}

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
      },
      {
        id: 'ai-modules',
        label: 'AI modules',
        value: String(superuserModuleCount),
        tone: superuserModuleCount >= 10 ? 'positive' : 'neutral',
      },
      {
        id: 'revenue',
        label: 'Monthly revenue',
        value: monthlyRevenueLabel,
        tone: 'neutral',
      },
      {
        id: 'health-score',
        label: 'Operational health',
        value: `${healthScore}/100`,
        tone: healthScore >= 75 ? 'positive' : healthScore >= 50 ? 'neutral' : 'warn',
      },
    ],
    [healthScore, hotLeadsCount, monthlyRevenueLabel, superuserModuleCount]
  );

  return (
    <section className="dashboard-superuser-strip" aria-label="Superuser controls">
      <div className="dashboard-superuser-strip__copy">
        <p className="dashboard-superuser-strip__eyebrow">Superuser command strip</p>
        <h2>Executive control center is live</h2>
        <p>
          Coordinate critical workflows, route actions instantly, and keep platform performance in a
          healthy state.
        </p>
      </div>

      <div className="dashboard-superuser-grid" aria-label="Superuser quick metrics">
        {metrics.map(metric => (
          <article key={metric.id} className="dashboard-superuser-metric-card">
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span className={`dashboard-superuser-metric-chip ${metric.tone}`}>{metric.tone}</span>
          </article>
        ))}
      </div>

      <div className="dashboard-superuser-strip__actions">
        <button type="button" className="dashboard-superuser-btn" onClick={onRefreshData}>
          Refresh live data
        </button>
        <button
          type="button"
          className="dashboard-superuser-btn dashboard-superuser-btn--primary"
          onClick={onOpenCommandPalette}
        >
          Open command palette
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onOpenAdminWorkspace}>
          Open admin workspace
        </button>
        <button
          type="button"
          className="dashboard-superuser-btn"
          onClick={onOpenAnalyticsWorkspace}
        >
          Open analytics workspace
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onOpenUsersWorkspace}>
          Open users workspace
        </button>
        <button type="button" className="dashboard-superuser-btn" onClick={onLaunchUnifiedCRM}>
          Launch unified CRM
        </button>
      </div>
    </section>
  );
};

export default SuperuserControlCenter;
