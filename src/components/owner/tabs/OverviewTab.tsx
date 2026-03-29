import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { OverviewTabProps } from './types';
import './TabStyles.css';

const OverviewTab: React.FC<OverviewTabProps> = ({ data, loading, onQuickAction }) => {
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div className="overview-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading overview">
          <div className="loading-spinner" />
          <p>Loading dashboard overview...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Properties', value: data?.totalProperties ?? 0, icon: '🏠', color: '#DC2626', change: '+12%' },
    { title: 'Active Agents', value: data?.activeAgents ?? 0, icon: '👥', color: '#2563EB', change: '+5%' },
    { title: 'Monthly Revenue', value: `AED ${(data?.monthlyRevenue ?? 0).toLocaleString()}`, icon: '💰', color: '#E31E24', change: '+18%' },
    { title: 'WhatsApp Leads', value: data?.whatsappLeads ?? 0, icon: '💬', color: '#25D366', change: '+25%' },
    { title: 'UAE Pass Users', value: data?.uaepassUsers ?? 0, icon: '🆔', color: '#ce1126', change: '+15%' },
    { title: 'Chatbot Chats', value: data?.chatbotConversations ?? 0, icon: '🤖', color: '#8B5CF6', change: '+30%' },
  ];

  const quickActions = [
    { id: 1, title: 'Add Property', icon: '➕', action: 'addProperty', color: '#22C55E' },
    { id: 2, title: 'Assign Agent', icon: '👤', action: 'assignAgent', color: '#3B82F6' },
    { id: 3, title: 'Generate Report', icon: '📊', action: 'generateReport', color: '#8B5CF6' },
    { id: 4, title: 'Train Chatbot', icon: '🤖', action: 'trainChatbot', color: '#F59E0B' },
    { id: 5, title: 'WhatsApp Broadcast', icon: '📢', action: 'whatsappBroadcast', color: '#25D366' },
    { id: 6, title: 'UAE Pass Users', icon: '🆔', action: 'viewUaePassUsers', color: '#ce1126' },
  ];

  const recentActivities = data?.recentActivities || [];

  return (
    <div className="overview-tab">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card-tab" style={{ '--accent-color': stat.color } as React.CSSProperties}>
            <div className="stat-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-change" style={{ color: stat.change.startsWith('+') ? '#22C55E' : '#EF4444' }}>
                {stat.change}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="quick-action-btn"
              style={{ '--action-color': action.color } as React.CSSProperties}
              onClick={() => onQuickAction?.(action.action)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-row">
        <div className="chart-card">
          <h3>Revenue Trend (2024)</h3>
          <div className="simple-chart">
            {[1.2, 1.8, 1.5, 2.2, 1.9, 2.5, 2.1, 2.8, 2.4, 3.0, 2.7, 3.2].map((value, i) => (
              <div key={`revenue-month-${i}`} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${(value / 3.5) * 100}%`, background: `linear-gradient(to top, #DC2626, #F87171)` }}
                />
                <span className="chart-label">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span>Revenue in Millions (AED)</span>
          </div>
        </div>

        <div className="chart-card">
          <h3>Property Distribution</h3>
          <div className="pie-chart-placeholder">
            <div className="pie-segments">
              <div className="pie-segment" style={{ '--segment-color': '#DC2626', '--segment-percent': '45%' } as React.CSSProperties}>
                <span>Apartments 45%</span>
              </div>
              <div className="pie-segment" style={{ '--segment-color': '#3B82F6', '--segment-percent': '25%' } as React.CSSProperties}>
                <span>Villas 25%</span>
              </div>
              <div className="pie-segment" style={{ '--segment-color': '#22C55E', '--segment-percent': '15%' } as React.CSSProperties}>
                <span>Townhouses 15%</span>
              </div>
              <div className="pie-segment" style={{ '--segment-color': '#F59E0B', '--segment-percent': '10%' } as React.CSSProperties}>
                <span>Commercial 10%</span>
              </div>
              <div className="pie-segment" style={{ '--segment-color': '#8B5CF6', '--segment-percent': '5%' } as React.CSSProperties}>
                <span>Land 5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-timeline">
          {recentActivities.map((activity, index) => (
            <div key={`activity-${index}-${activity.timestamp}`} className={`activity-item ${activity.type}`}>
              <div className="activity-dot"></div>
              <div className="activity-content">
                <strong>{activity.title}</strong>
                <p>{activity.description}</p>
                <small>{activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ''}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(OverviewTab);
