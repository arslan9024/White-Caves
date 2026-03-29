import React from 'react';
import { TrendingUp, MessageCircle, Users, Zap, Clock, BarChart3 } from 'lucide-react';

interface InsightConversation {
  id: string | number;
  unread: number;
  priority: string;
}

interface InsightsData {
  conversations: InsightConversation[];
}

interface InsightsTabProps {
  data: InsightsData;
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ data }) => {
  const conversations = data?.conversations ?? [];

  const totalConversations = conversations.length;
  const unreadCount = conversations.reduce((sum: number, conv: InsightConversation) => sum + (conv?.unread ?? 0), 0);
  const hotLeadsCount = conversations.filter((c: InsightConversation) => c?.priority === 'hot').length;
  const warmLeadsCount = conversations.filter((c: InsightConversation) => c?.priority === 'warm').length;

  const stats = [
    { label: 'Total Conversations', value: totalConversations, icon: MessageCircle, color: '#3b82f6' },
    { label: 'Unread Messages', value: unreadCount, icon: Zap, color: '#f59e0b' },
    { label: 'Hot Leads', value: hotLeadsCount, icon: TrendingUp, color: '#ef4444' },
    { label: 'Warm Leads', value: warmLeadsCount, icon: Users, color: '#f59e0b' }
  ];

  return (
    <div className="insights-tab">
      <div className="tab-header">
        <h3>Insights & Analytics</h3>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="insights-section">
        <h4>Lead Distribution</h4>
        <div className="distribution-chart">
          <div className="distribution-bar hot" style={{ width: `${totalConversations > 0 ? (hotLeadsCount / totalConversations) * 100 : 0}%` }}>
            <span>{hotLeadsCount} Hot</span>
          </div>
          <div className="distribution-bar warm" style={{ width: `${totalConversations > 0 ? (warmLeadsCount / totalConversations) * 100 : 0}%` }}>
            <span>{warmLeadsCount} Warm</span>
          </div>
          <div className="distribution-bar cold" style={{ width: `${totalConversations > 0 ? ((totalConversations - hotLeadsCount - warmLeadsCount) / totalConversations) * 100 : 0}%` }}>
            <span>{totalConversations - hotLeadsCount - warmLeadsCount} Cold</span>
          </div>
        </div>
      </div>

      <div className="insights-section">
        <h4>Engagement Trends</h4>
        <div className="trend-list">
          <div className="trend-item">
            <Clock size={16} />
            <span>Average response time: 2.5 minutes</span>
          </div>
          <div className="trend-item">
            <BarChart3 size={16} />
            <span>Message frequency: 12 messages/hour</span>
          </div>
        </div>
      </div>
    </div>
  );
};
