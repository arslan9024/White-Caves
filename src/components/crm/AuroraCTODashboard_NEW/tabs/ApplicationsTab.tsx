import React, { useState } from 'react';
import { Rocket, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface SystemComponent {
  id: string | number;
  name: string;
  type: string;
  status: string;
}

interface ApplicationsTabProps {
  systemComponents: SystemComponent[];
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ systemComponents }) => {
  const [deploymentFilter, setDeploymentFilter] = useState<string>('all');

  const applications = [
    { id: 1, name: 'White Caves Frontend', version: '2.4.1', status: 'deployed', deployedAt: '2026-03-05 14:32', health: 99.95 },
    { id: 2, name: 'DAMAC CRM API', version: '1.8.5', status: 'deployed', deployedAt: '2026-03-04 09:15', health: 99.98 },
    { id: 3, name: 'MongoDB Atlas Cluster', version: '7.0.2', status: 'deployed', deployedAt: '2026-02-28 16:45', health: 99.99 },
    { id: 4, name: 'WhatsApp Bot Service', version: '3.2.0', status: 'deployed', deployedAt: '2026-03-03 11:20', health: 99.92 },
    { id: 5, name: 'Redis Cache Layer', version: '7.2.0', status: 'deployed', deployedAt: '2026-03-01 08:00', health: 99.99 }
  ];

  return (
    <div className="applications-view">
      <h3>Applications & Deployments</h3>
      
      <div className="deployments-header">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${deploymentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDeploymentFilter('all')}
          >
            All ({applications.length})
          </button>
          <button
            className={`filter-btn ${deploymentFilter === 'deployed' ? 'active' : ''}`}
            onClick={() => setDeploymentFilter('deployed')}
          >
            Deployed ({applications.filter(a => a.status === 'deployed').length})
          </button>
        </div>
      </div>

      <div className="applications-grid">
        {applications.map(app => (
          <div key={app.id} className={`app-card status-${app.status}`}>
            <div className="app-header">
              <div className="app-icon">
                <Rocket size={20} />
              </div>
              <div className="app-title">
                <h4>{app.name}</h4>
                <span className="version">v{app.version}</span>
              </div>
              <span className={`status-badge status-${app.status}`}>
                {app.status}
              </span>
            </div>

            <div className="app-details">
              <div className="detail-row">
                <span className="label">Deployed:</span>
                <span className="value">{app.deployedAt}</span>
              </div>
              <div className="detail-row">
                <span className="label">Health:</span>
                <span className={`value health-${app.health >= 99.9 ? 'excellent' : 'good'}`}>
                  {app.health}%
                </span>
              </div>
            </div>

            <div className="app-actions">
              <button className="btn-view">View Logs</button>
              <button className="btn-manage">Manage</button>
            </div>
          </div>
        ))}
      </div>

      <div className="deployment-history">
        <h4>Recent Deployments</h4>
        <div className="timeline">
          {[...applications].sort((a, b) => new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime()).slice(0, 3).map(app => (
            <div key={app.id} className="timeline-item">
              <div className="timeline-marker">
                <CheckCircle size={16} style={{ color: 'var(--success-color)' }} />
              </div>
              <div className="timeline-content">
                <span className="app-name">{app.name}</span>
                <span className="time">{app.deployedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTab;
