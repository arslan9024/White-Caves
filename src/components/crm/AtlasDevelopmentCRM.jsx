import React from 'react';
import { Rocket, Code, GitBranch, Bug, Server, Zap } from 'lucide-react';
import './shared/CRMDashboard.css';

const AtlasDevelopmentCRM = ({ assistant }) => {
  const stats = [
    { label: 'Active Sprints', value: '3', icon: Rocket, trend: '2 on track' },
    { label: 'Open Issues', value: '47', icon: Bug, trend: '-8 this week' },
    { label: 'Deployments', value: '156', icon: Server, trend: 'This month' },
    { label: 'System Uptime', value: '99.8%', icon: Zap, trend: '30-day avg' }
  ];

  return (
    <div className="crm-dashboard atlas-development">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#7C3AED'}20` }}>
            <Rocket size={28} style={{ color: assistant?.color || '#7C3AED' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Atlas'}</h1>
            <p>{assistant?.title || 'Development & Infrastructure'}</p>
          </div>
        </div>
      </div>

      <div className="crm-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="crm-content-grid">
        <div className="crm-panel">
          <div className="panel-header">
            <h3>Active Development</h3>
            <Code size={18} />
          </div>
          <div className="panel-content">
            {[
              { feature: 'AI Assistant Dashboard', status: 'In Progress', progress: '75%', priority: 'High' },
              { feature: 'Payment Gateway v2', status: 'Testing', progress: '90%', priority: 'High' },
              { feature: 'Mobile App Redesign', status: 'In Progress', progress: '45%', priority: 'Medium' },
              { feature: 'Analytics Dashboard', status: 'Planning', progress: '15%', priority: 'Medium' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.feature}</span>
                  <span className="item-meta">{item.status} • {item.progress}</span>
                </div>
                <span className={`priority-badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Recent Deployments</h3>
            <GitBranch size={18} />
          </div>
          <div className="panel-content">
            {[
              { version: 'v2.4.1', env: 'Production', time: '2 hours ago', status: 'Success' },
              { version: 'v2.4.1-rc2', env: 'Staging', time: '5 hours ago', status: 'Success' },
              { version: 'v2.4.0', env: 'Production', time: '2 days ago', status: 'Success' },
              { version: 'v2.3.9-hotfix', env: 'Production', time: '4 days ago', status: 'Success' }
            ].map((deploy, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{deploy.version}</span>
                  <span className="item-meta">{deploy.env} • {deploy.time}</span>
                </div>
                <span className={`status-badge ${deploy.status.toLowerCase()}`}>{deploy.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>System Services Status</h3>
            <Server size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'API Gateway', status: 'Operational', uptime: '99.9%' },
              { name: 'Database Cluster', status: 'Operational', uptime: '99.8%' },
              { name: 'CDN', status: 'Operational', uptime: '100%' },
              { name: 'Auth Service', status: 'Operational', uptime: '99.9%' },
              { name: 'Payment Service', status: 'Operational', uptime: '99.7%' },
              { name: 'Search Engine', status: 'Operational', uptime: '99.5%' }
            ].map((service, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{service.name}</span>
                <span className="category-count">{service.status} ({service.uptime})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtlasDevelopmentCRM;
