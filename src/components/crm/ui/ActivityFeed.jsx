import React from 'react';
import { 
  CheckCircle, AlertCircle, Clock, User, Building2, 
  MessageSquare, DollarSign, FileText, Bot 
} from 'lucide-react';
import './ActivityFeed.css';

const ACTIVITY_ICONS = {
  lead: User,
  property: Building2,
  message: MessageSquare,
  payment: DollarSign,
  contract: FileText,
  ai: Bot,
  default: Clock
};

const STATUS_ICONS = {
  success: { icon: CheckCircle, className: 'status-success' },
  warning: { icon: AlertCircle, className: 'status-warning' },
  pending: { icon: Clock, className: 'status-pending' },
  error: { icon: AlertCircle, className: 'status-error' }
};

const ActivityFeed = ({
  activities = [],
  loading = false,
  maxItems = 10,
  showViewAll = true,
  onViewAll,
  emptyMessage = 'No recent activity'
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  if (loading) {
    return (
      <div className="activity-feed loading">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="activity-skeleton">
            <div className="skeleton-icon" />
            <div className="skeleton-content">
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
            <div className="skeleton-time" />
          </div>
        ))}
      </div>
    );
  }

  if (displayedActivities.length === 0) {
    return (
      <div className="activity-feed empty">
        <Clock size={32} className="empty-icon" />
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-list">
        {displayedActivities.map((activity, idx) => {
          const TypeIcon = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.default;
          const statusConfig = STATUS_ICONS[activity.status] || STATUS_ICONS.pending;
          const StatusIcon = statusConfig.icon;

          return (
            <div key={activity.id || idx} className="activity-item">
              <div className={`activity-status ${statusConfig.className}`}>
                <StatusIcon size={14} />
              </div>
              <div className="activity-type-icon">
                <TypeIcon size={16} />
              </div>
              <div className="activity-content">
                <span className="activity-title">{activity.title}</span>
                {activity.description && (
                  <span className="activity-description">{activity.description}</span>
                )}
              </div>
              <span className="activity-time">{activity.time}</span>
            </div>
          );
        })}
      </div>

      {showViewAll && activities.length > maxItems && (
        <button className="activity-view-all" onClick={onViewAll}>
          View all {activities.length} activities
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;
