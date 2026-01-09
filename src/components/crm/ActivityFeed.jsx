import React from 'react';
import { Clock } from 'lucide-react';
import './ActivityFeed.css';

const getTimeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
};

const ActivityItem = ({ activity }) => {
  return (
    <div className={`activity-item ${activity.type || 'default'}`}>
      <div className="activity-icon-wrapper" style={{ backgroundColor: activity.color || '#3B82F6' }}>
        {activity.icon}
      </div>
      <div className="activity-content">
        <p className="activity-message">
          {activity.user && <strong>{activity.user}</strong>} {activity.message}
        </p>
        {activity.details && <p className="activity-details">{activity.details}</p>}
        <span className="activity-time">
          <Clock size={12} />
          {getTimeAgo(activity.timestamp)}
        </span>
      </div>
      {activity.badge && (
        <span className={`activity-badge ${activity.badge.type}`}>
          {activity.badge.label}
        </span>
      )}
    </div>
  );
};

const ActivityFeed = ({
  activities = [],
  title = 'Recent Activity',
  maxItems = 10,
  showHeader = true,
  emptyMessage = 'No recent activity'
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="activity-feed">
      {showHeader && (
        <div className="activity-feed-header">
          <h3>{title}</h3>
          {activities.length > maxItems && (
            <button className="view-all-btn">View all</button>
          )}
        </div>
      )}
      <div className="activity-feed-list">
        {displayedActivities.length === 0 ? (
          <div className="activity-empty">{emptyMessage}</div>
        ) : (
          displayedActivities.map((activity, index) => (
            <ActivityItem key={activity.id || index} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
