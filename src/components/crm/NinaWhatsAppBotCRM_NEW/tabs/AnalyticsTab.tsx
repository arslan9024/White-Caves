import React from 'react';
import { BarChart3, TrendingUp, Zap, Clock, Activity, AlertCircle } from 'lucide-react';

interface Bot {
  name: string;
  responseRate: number;
  avgResponseTime: string;
  uptime: string;
}

interface AnalyticsData {
  getTotalMessagesProcessed: () => number;
  getAverageResponseRate: () => number;
  getConnectedBotCount: () => number;
  bots: Bot[];
}

interface AnalyticsTabProps {
  data: AnalyticsData;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ data }) => {
  const { getTotalMessagesProcessed, getAverageResponseRate, getConnectedBotCount, bots } = data;

  const totalMessages = getTotalMessagesProcessed();
  const avgResponseRate = getAverageResponseRate();
  const connectedBots = getConnectedBotCount();
  const totalBots = bots.length;

  const stats = [
    { label: 'Total Messages Processed', value: totalMessages, icon: Activity, color: '#3b82f6' },
    { label: 'Average Response Rate', value: `${avgResponseRate}%`, icon: TrendingUp, color: '#10b981' },
    { label: 'Connected Bots', value: connectedBots, icon: Zap, color: '#10b981' },
    { label: 'Total Bots', value: totalBots, icon: BarChart3, color: '#f59e0b' }
  ];

  const botPerformance = bots.filter(b => b.responseRate > 0).map(bot => ({
    name: bot.name,
    responseRate: bot.responseRate,
    avgTime: parseFloat(bot.avgResponseTime),
    uptime: parseFloat(bot.uptime)
  }));

  return (
    <div className="analytics-tab">
      <div className="tab-header">
        <h3>Performance Analytics</h3>
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

      <div className="analytics-section">
        <h4>Bot Performance</h4>
        <div className="performance-table">
          <div className="table-header">
            <div className="col name">Bot Name</div>
            <div className="col metric">Response Rate</div>
            <div className="col metric">Avg Response Time</div>
            <div className="col metric">Uptime</div>
          </div>
          <div className="table-body">
            {botPerformance.map(bot => (
              <div key={bot.name} className="table-row">
                <div className="col name">{bot.name}</div>
                <div className="col metric">
                  <span className={bot.responseRate > 95 ? 'good' : 'warning'}>
                    {bot.responseRate}%
                  </span>
                </div>
                <div className="col metric">{bot.avgTime.toFixed(1)}s</div>
                <div className="col metric">
                  <span className={bot.uptime > 95 ? 'good' : 'warning'}>
                    {bot.uptime.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-section">
        <h4>Health Status</h4>
        <div className="health-checks">
          <div className="health-item good">
            <span className="indicator"></span>
            <span>All communication systems operational</span>
          </div>
          {connectedBots < totalBots && (
            <div className="health-item warning">
              <AlertCircle size={16} />
              <span>{totalBots - connectedBots} bot(s) disconnected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
