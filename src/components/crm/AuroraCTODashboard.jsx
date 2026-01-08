import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Server, Activity, AlertTriangle, CheckCircle, Clock,
  Cpu, HardDrive, Wifi, Database, GitBranch, GitCommit,
  Rocket, Shield, TrendingUp, TrendingDown, RefreshCw,
  Box, Smartphone, Globe, Code, Terminal, Zap,
  BarChart3, AlertCircle, CheckCircle2, XCircle, Timer
} from 'lucide-react';
import './AuroraCTODashboard.css';

const SYSTEM_COMPONENTS = [
  {
    id: 'damac_crm_api',
    name: 'DAMAC CRM API',
    type: 'api',
    status: 'healthy',
    metrics: { cpu: 45, memory: 62, responseTime: 128, uptime: 99.98 }
  },
  {
    id: 'mongodb_cluster',
    name: 'MongoDB Cluster',
    type: 'database',
    status: 'healthy',
    metrics: { cpu: 32, memory: 78, responseTime: 45, uptime: 99.99 }
  },
  {
    id: 'react_frontend',
    name: 'React Frontend',
    type: 'frontend',
    status: 'healthy',
    metrics: { cpu: 15, memory: 41, responseTime: 210, uptime: 99.95 }
  },
  {
    id: 'express_backend',
    name: 'Express Backend',
    type: 'backend',
    status: 'healthy',
    metrics: { cpu: 38, memory: 55, responseTime: 89, uptime: 99.97 }
  },
  {
    id: 'whatsapp_gateway',
    name: 'WhatsApp Gateway',
    type: 'integration',
    status: 'degraded',
    metrics: { cpu: 25, memory: 48, responseTime: 350, uptime: 98.5 }
  },
  {
    id: 'stripe_payments',
    name: 'Payment Gateway',
    type: 'integration',
    status: 'healthy',
    metrics: { cpu: 12, memory: 35, responseTime: 95, uptime: 99.99 }
  }
];

const APPLICATION_PORTFOLIO = [
  {
    appId: 'damac_crm',
    name: 'DAMAC Hills 2 CRM',
    type: 'web',
    environment: 'production',
    health: 98,
    activeUsers: 245,
    lastDeploy: '2 hours ago',
    cost: '$1,250/month',
    stack: ['React 18', 'Redux', 'Node.js', 'MongoDB']
  },
  {
    appId: 'whatsapp_crm',
    name: 'WhatsApp CRM System',
    type: 'web',
    environment: 'production',
    health: 95,
    activeUsers: 189,
    lastDeploy: '1 day ago',
    cost: '$850/month',
    stack: ['React', 'Express', 'WhatsApp API']
  },
  {
    appId: 'property_mobile',
    name: 'Property Manager Mobile',
    type: 'mobile',
    environment: 'production',
    health: 92,
    activeUsers: 78,
    lastDeploy: '1 week ago',
    cost: '$450/month',
    stack: ['React Native', 'Firebase']
  },
  {
    appId: 'analytics_dashboard',
    name: 'Analytics Dashboard',
    type: 'web',
    environment: 'staging',
    health: 88,
    activeUsers: 12,
    lastDeploy: '3 days ago',
    cost: '$320/month',
    stack: ['React', 'D3.js', 'PostgreSQL']
  }
];

const DEVELOPMENT_PROJECTS = [
  {
    projectId: 'whatsapp_v2',
    name: 'WhatsApp CRM v2',
    status: 'development',
    sprint: { current: 5, progress: 78, totalPoints: 89, completedPoints: 69 },
    deployments: { success: 12, failed: 0 },
    issues: { open: 8, critical: 1 },
    nextRelease: 'Jan 15'
  },
  {
    projectId: 'payment_system',
    name: 'Payment System Upgrade',
    status: 'testing',
    sprint: { current: 3, progress: 45, totalPoints: 55, completedPoints: 25 },
    deployments: { success: 5, failed: 1 },
    issues: { open: 15, critical: 3 },
    nextRelease: 'Jan 22'
  },
  {
    projectId: 'mobile_v2',
    name: 'Mobile App V2',
    status: 'planning',
    sprint: { current: 1, progress: 22, totalPoints: 34, completedPoints: 7 },
    deployments: { success: 2, failed: 0 },
    issues: { open: 3, critical: 0 },
    nextRelease: 'Feb 5'
  }
];

const RECENT_DEPLOYMENTS = [
  { id: 1, application: 'WhatsApp CRM', version: '2.4.1', environment: 'production', status: 'success', date: new Date(Date.now() - 7200000), changes: ['Bug fixes', 'Performance improvements'] },
  { id: 2, application: 'DAMAC CRM', version: '3.1.2', environment: 'production', status: 'success', date: new Date(Date.now() - 86400000), changes: ['New lead scoring', 'UI updates'] },
  { id: 3, application: 'Analytics Dashboard', version: '1.5.0', environment: 'staging', status: 'success', date: new Date(Date.now() - 259200000), changes: ['Chart updates', 'Data export'] },
  { id: 4, application: 'Payment System', version: '2.0.0-beta', environment: 'testing', status: 'failed', date: new Date(Date.now() - 345600000), changes: ['Stripe integration', 'Refund logic'] },
  { id: 5, application: 'Mobile App', version: '1.8.3', environment: 'production', status: 'rolled_back', date: new Date(Date.now() - 604800000), changes: ['Push notifications'] }
];

const API_ENDPOINTS = [
  { endpoint: '/api/properties', method: 'GET', avgResponseTime: 125, successRate: 99.8, callVolume: 15420 },
  { endpoint: '/api/leads', method: 'POST', avgResponseTime: 89, successRate: 99.9, callVolume: 8934 },
  { endpoint: '/api/whatsapp/send', method: 'POST', avgResponseTime: 245, successRate: 98.5, callVolume: 12567 },
  { endpoint: '/api/payments/process', method: 'POST', avgResponseTime: 312, successRate: 99.7, callVolume: 3421 },
  { endpoint: '/api/users/auth', method: 'POST', avgResponseTime: 156, successRate: 99.95, callVolume: 28934 }
];

const AuroraCTODashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} />;
      case 'degraded': return <AlertTriangle size={16} />;
      case 'down': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getDeploymentStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="deploy-icon success" size={18} />;
      case 'failed': return <XCircle className="deploy-icon failed" size={18} />;
      case 'rolled_back': return <RefreshCw className="deploy-icon rollback" size={18} />;
      default: return <Clock className="deploy-icon" size={18} />;
    }
  };

  const healthyCount = SYSTEM_COMPONENTS.filter(c => c.status === 'healthy').length;
  const degradedCount = SYSTEM_COMPONENTS.filter(c => c.status === 'degraded').length;
  const downCount = SYSTEM_COMPONENTS.filter(c => c.status === 'down').length;

  return (
    <div className="aurora-dashboard">
      <div className="aurora-header">
        <div className="header-left">
          <div className="aurora-avatar">
            <Server size={24} />
          </div>
          <div className="header-info">
            <h2>Aurora - Tech Command Center</h2>
            <p>Chief Technology Officer & Systems Architect</p>
          </div>
        </div>
        <div className="header-right">
          <div className="time-range-selector">
            {['1h', '24h', '7d', '30d'].map(range => (
              <button
                key={range}
                className={`range-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="refresh-btn">
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="aurora-tabs">
        {['overview', 'applications', 'deployments', 'api-performance'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <Activity size={16} />}
            {tab === 'applications' && <Box size={16} />}
            {tab === 'deployments' && <Rocket size={16} />}
            {tab === 'api-performance' && <Zap size={16} />}
            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="overview-content">
          <div className="quick-stats-bar">
            <div className="quick-stat healthy">
              <CheckCircle size={20} />
              <span className="stat-value">{healthyCount}</span>
              <span className="stat-label">Healthy</span>
            </div>
            <div className="quick-stat degraded">
              <AlertTriangle size={20} />
              <span className="stat-value">{degradedCount}</span>
              <span className="stat-label">Degraded</span>
            </div>
            <div className="quick-stat down">
              <XCircle size={20} />
              <span className="stat-value">{downCount}</span>
              <span className="stat-label">Down</span>
            </div>
            <div className="quick-stat info">
              <TrendingUp size={20} />
              <span className="stat-value">99.95%</span>
              <span className="stat-label">Avg Uptime</span>
            </div>
          </div>

          <div className="system-health-grid">
            <h3>System Health Monitor</h3>
            <div className="health-cards">
              {SYSTEM_COMPONENTS.map(component => (
                <div key={component.id} className={`health-card ${component.status}`}>
                  <div className="card-header">
                    <h4>{component.name}</h4>
                    <div className="status-badge" style={{ backgroundColor: getStatusColor(component.status) }}>
                      {getStatusIcon(component.status)}
                      <span>{component.status.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="metrics-row">
                    <div className="metric">
                      <Cpu size={14} />
                      <span className="label">CPU</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${component.metrics.cpu}%`, backgroundColor: component.metrics.cpu > 80 ? '#EF4444' : '#10B981' }}
                        />
                      </div>
                      <span className="value">{component.metrics.cpu}%</span>
                    </div>
                    <div className="metric">
                      <HardDrive size={14} />
                      <span className="label">Memory</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${component.metrics.memory}%`, backgroundColor: component.metrics.memory > 80 ? '#EF4444' : '#10B981' }}
                        />
                      </div>
                      <span className="value">{component.metrics.memory}%</span>
                    </div>
                  </div>
                  <div className="metrics-footer">
                    <div className="footer-stat">
                      <Timer size={12} />
                      <span>{component.metrics.responseTime}ms</span>
                    </div>
                    <div className="footer-stat">
                      <TrendingUp size={12} />
                      <span>{component.metrics.uptime}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="projects-section">
            <h3>Development Projects</h3>
            <div className="projects-table">
              <div className="table-header">
                <span>Project</span>
                <span>Sprint</span>
                <span>Progress</span>
                <span>Deployments</span>
                <span>Issues</span>
                <span>Next Release</span>
              </div>
              {DEVELOPMENT_PROJECTS.map(project => (
                <div key={project.projectId} className="table-row">
                  <span className="project-name">
                    <GitBranch size={14} />
                    {project.name}
                  </span>
                  <span>Sprint {project.sprint.current}</span>
                  <span className="progress-cell">
                    <div className="mini-progress">
                      <div 
                        className="mini-fill" 
                        style={{ 
                          width: `${project.sprint.progress}%`,
                          backgroundColor: project.sprint.progress >= 70 ? '#10B981' : project.sprint.progress >= 40 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </div>
                    <span>{project.sprint.progress}%</span>
                  </span>
                  <span className="deployments-cell">
                    <span className="success-count">{project.deployments.success} ✓</span>
                    <span className="failed-count">{project.deployments.failed} ✗</span>
                  </span>
                  <span className="issues-cell">
                    {project.issues.open} open
                    {project.issues.critical > 0 && (
                      <span className="critical-badge">{project.issues.critical} critical</span>
                    )}
                  </span>
                  <span>{project.nextRelease}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="applications-content">
          <h3>Application Portfolio</h3>
          <div className="app-cards">
            {APPLICATION_PORTFOLIO.map(app => (
              <div key={app.appId} className="app-card">
                <div className="app-header">
                  <div className="app-icon">
                    {app.type === 'web' ? <Globe size={24} /> : <Smartphone size={24} />}
                  </div>
                  <div className="app-info">
                    <h4>{app.name}</h4>
                    <span className={`env-badge ${app.environment}`}>{app.environment}</span>
                  </div>
                  <div className="health-indicator" style={{ color: app.health >= 95 ? '#10B981' : app.health >= 80 ? '#F59E0B' : '#EF4444' }}>
                    {app.health}%
                  </div>
                </div>
                <div className="app-stats">
                  <div className="app-stat">
                    <span className="label">Active Users</span>
                    <span className="value">{app.activeUsers}</span>
                  </div>
                  <div className="app-stat">
                    <span className="label">Last Deploy</span>
                    <span className="value">{app.lastDeploy}</span>
                  </div>
                  <div className="app-stat">
                    <span className="label">Monthly Cost</span>
                    <span className="value">{app.cost}</span>
                  </div>
                </div>
                <div className="tech-stack">
                  {app.stack.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'deployments' && (
        <div className="deployments-content">
          <h3>Recent Deployments</h3>
          <div className="deployment-timeline">
            {RECENT_DEPLOYMENTS.map((deploy, index) => (
              <div key={deploy.id} className={`deployment-item ${deploy.status}`}>
                <div className="timeline-marker">
                  {getDeploymentStatusIcon(deploy.status)}
                  {index < RECENT_DEPLOYMENTS.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="deployment-content">
                  <div className="deployment-header">
                    <h4>{deploy.application}</h4>
                    <span className="version">v{deploy.version}</span>
                    <span className={`status-chip ${deploy.status}`}>{deploy.status}</span>
                  </div>
                  <div className="deployment-meta">
                    <span className="env">{deploy.environment}</span>
                    <span className="date">{deploy.date.toLocaleString()}</span>
                  </div>
                  <div className="deployment-changes">
                    {deploy.changes.map((change, i) => (
                      <span key={i} className="change-tag">{change}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'api-performance' && (
        <div className="api-content">
          <h3>API Performance</h3>
          <div className="api-table">
            <div className="api-header">
              <span>Endpoint</span>
              <span>Method</span>
              <span>Avg Response</span>
              <span>Success Rate</span>
              <span>Call Volume</span>
            </div>
            {API_ENDPOINTS.map((api, index) => (
              <div key={index} className="api-row">
                <span className="endpoint-cell">
                  <Code size={14} />
                  {api.endpoint}
                </span>
                <span className={`method-badge ${api.method.toLowerCase()}`}>{api.method}</span>
                <span className={api.avgResponseTime > 200 ? 'warning' : ''}>{api.avgResponseTime}ms</span>
                <span className={api.successRate < 99 ? 'warning' : 'success'}>{api.successRate}%</span>
                <span>{api.callVolume.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuroraCTODashboard;
