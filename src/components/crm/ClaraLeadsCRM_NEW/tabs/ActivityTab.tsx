import React, { useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';

export default function ActivityTab() {
  const { leads } = useLeadsData();
  const [filterType, setFilterType] = useState('all');

  // Generate mock activity from leads
  const activities = leads.flatMap(lead => [
    {
      id: `activity_${lead.id}_1`,
      type: 'email_sent',
      leadName: lead.name,
      description: `Email sent: "${lead.nextAction}"`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: `activity_${lead.id}_2`,
      type: 'call_completed',
      leadName: lead.name,
      description: 'Call completed - 32 minutes',
      timestamp: new Date(Date.now() - (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000)
    },
    {
      id: `activity_${lead.id}_3`,
      type: 'meeting_scheduled',
      leadName: lead.name,
      description: 'Meeting scheduled for next week',
      timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: `activity_${lead.id}_4`,
      type: 'status_changed',
      leadName: lead.name,
      description: `Status changed to "${lead.status}"`,
      timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
    }
  ]);

  // Sort by most recent
  let filteredActivities = [...activities].sort((a, b) => b.timestamp - a.timestamp);

  if (filterType !== 'all') {
    filteredActivities = filteredActivities.filter(a => a.type === filterType);
  }

  const getActivityIcon = (type) => {
    const icons = {
      email_sent: '✉️',
      call_completed: '☎️',
      meeting_scheduled: '📅',
      status_changed: '✅',
      note_added: '📝',
      deal_updated: '💼'
    };
    return icons[type] || '📌';
  };

  const getActivityLabel = (type) => {
    const labels = {
      email_sent: 'Email Sent',
      call_completed: 'Call Completed',
      meeting_scheduled: 'Meeting Scheduled',
      status_changed: 'Status Changed',
      note_added: 'Note Added',
      deal_updated: 'Deal Updated'
    };
    return labels[type] || 'Activity';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const activityTypes = ['all', 'email_sent', 'call_completed', 'meeting_scheduled', 'status_changed'];

  return (
    <div className="activity-section">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Recent Activity
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          margin: 0
        }}>
          {filteredActivities.length} activity record{filteredActivities.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          {activityTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Activity Types' : getActivityLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="activity-timeline">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <div className="activity-type">
                  {getActivityLabel(activity.type)}
                </div>
                <div className="activity-description">
                  <strong>{activity.leadName}</strong> • {activity.description}
                </div>
                <div className="activity-time">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--color-border-default)'
          }}>
            <p style={{ fontSize: '14px', margin: 0 }}>
              No activity found for this filter
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginTop: '20px'
      }}>
        <div style={{
          padding: '12px',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-sm)',
          border: '1px solid var(--color-border-default)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            EMAIL SENT
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-info)' }}>
            {activities.filter(a => a.type === 'email_sent').length}
          </div>
        </div>
        <div style={{
          padding: '12px',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-sm)',
          border: '1px solid var(--color-border-default)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            CALLS MADE
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-warning)' }}>
            {activities.filter(a => a.type === 'call_completed').length}
          </div>
        </div>
        <div style={{
          padding: '12px',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-sm)',
          border: '1px solid var(--color-border-default)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            MEETINGS SCHEDULED
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-success)' }}>
            {activities.filter(a => a.type === 'meeting_scheduled').length}
          </div>
        </div>
      </div>
    </div>
  );
}
