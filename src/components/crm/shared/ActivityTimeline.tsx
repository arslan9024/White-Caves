import React, { memo, useMemo } from 'react';
import { CheckCircle, AlertCircle, Clock, Zap, User } from 'lucide-react';
import './SharedComponents.css';

const getStatusIcon = (type) => {
  switch (type) {
    case 'success': return <CheckCircle size={14} className="status-success" />;
    case 'warning': 
    case 'pending': return <Clock size={14} className="status-warning" />;
    case 'error': return <AlertCircle size={14} className="status-error" />;
    case 'active': return <Zap size={14} className="status-active" />;
    default: return <User size={14} className="status-default" />;
  }
};

const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const ActivityTimeline = memo(({ 
  activities, 
  maxItems = 10,
  showTimestamp = true,
  compact = false,
  color = 'var(--assistant-color, #0EA5E9)'
}) => {
  const displayActivities = useMemo(() => 
    activities.slice(0, maxItems),
    [activities, maxItems]
  );
  
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-timeline empty">
        <p>No recent activity</p>
      </div>
    );
  }
  
  return (
    <div className={`activity-timeline ${compact ? 'compact' : ''}`} style={{ '--timeline-accent': color }}>
      {displayActivities.map((activity, index) => (
        <div key={activity.id || index} className="activity-item">
          <div className="activity-indicator">
            {getStatusIcon(activity.type || activity.status)}
            {index < displayActivities.length - 1 && <div className="activity-line" />}
          </div>
          <div className="activity-content">
            <div className="activity-header">
              <span className="activity-action">{activity.action}</span>
              {showTimestamp && (
                <span className="activity-time">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              )}
            </div>
            {activity.target && (
              <span className="activity-target">{activity.target}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

ActivityTimeline.displayName = 'ActivityTimeline';
export default ActivityTimeline;
