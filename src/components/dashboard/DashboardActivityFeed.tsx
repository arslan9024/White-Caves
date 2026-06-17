import React, { FC } from 'react';
import { useCompanyActivityFeed } from '../../hooks/useCompanyActivityFeed';

interface DashboardActivityFeedProps {
  seedItems?: Record<string, unknown>[];
  onViewAll?: () => void;
}

const DashboardActivityFeed: FC<DashboardActivityFeedProps> = ({ seedItems = [], onViewAll }) => {
  const { items, isLoading, error } = useCompanyActivityFeed(seedItems);

  return (
    <section className="dashboard-activity-feed" aria-label="Company activity feed">
      <div className="dashboard-activity-feed__header">
        <h3>Live activity feed</h3>
        <button type="button" onClick={onViewAll}>
          View all
        </button>
      </div>
      {isLoading && <p className="dashboard-activity-feed__state">Loading latest activity…</p>}
      {error && <p className="dashboard-activity-feed__state">{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <p className="dashboard-activity-feed__state">No activity events yet.</p>
      )}
      <div className="dashboard-activity-feed__list">
        {items.map(item => (
          <article key={item.id} className="dashboard-activity-feed__item">
            <div className="dashboard-activity-feed__avatar">{item.actor.slice(0, 1).toUpperCase()}</div>
            <div className="dashboard-activity-feed__copy">
              <strong>{item.actor}</strong>
              <p>
                {item.action} {item.entity}
              </p>
              <small>{item.relativeTime}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardActivityFeed;
