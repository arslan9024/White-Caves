import React from 'react';
import { Server, Activity, CheckCircle, AlertTriangle, Users, Box } from 'lucide-react';

interface CTOStats {
  systemHealth: number;
  totalAssistants: number;
  activeAssistants: number;
  totalModules: number;
  productionModules: number;
}

interface OverviewTabProps {
  stats: CTOStats;
  systemStatus: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, systemStatus }) => {
  return (
    <div className="overview-view">
      <h3>Executive Overview</h3>
      
      <div className="system-status">
        <div className="status-card primary">
          <div className="status-header">
            <Activity size={20} />
            <span>System Status</span>
          </div>
          <div className="status-value">
            <span className={`badge status-${systemStatus}`}>
              {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
            </span>
          </div>
          <div className="status-detail">
            {stats.systemHealth.toFixed(0)}% Components Healthy
          </div>
        </div>
      </div>

      <div className="overview-metrics">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
            <Users size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-label">AI Assistants</span>
            <span className="metric-value">{stats.totalAssistants}</span>
            <span className="metric-detail">{stats.activeAssistants} Active</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Box size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Platform Modules</span>
            <span className="metric-value">{stats.totalModules}</span>
            <span className="metric-detail">{stats.productionModules} Production</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>
            <CheckCircle size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-label">System Health</span>
            <span className="metric-value">{stats.systemHealth.toFixed(1)}%</span>
            <span className="metric-detail">All Components</span>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metrics-section">
          <h4><Server size={16} /> Key Metrics</h4>
          <div className="metrics-list">
            <div className="metric-row">
              <span className="label">Total Assistants:</span>
              <span className="value">{stats.totalAssistants}</span>
            </div>
            <div className="metric-row">
              <span className="label">Platform Modules:</span>
              <span className="value">{stats.totalModules}</span>
            </div>
            <div className="metric-row">
              <span className="label">Production Ready:</span>
              <span className="value">{stats.productionModules}</span>
            </div>
            <div className="metric-row">
              <span className="label">System Health:</span>
              <span className="value">{stats.systemHealth.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
