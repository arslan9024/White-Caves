import React from 'react';
import { History, FileSearch, AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react';
import './shared/CRMDashboard.css';

const HenryAuditCRM = ({ assistant }) => {
  const stats = [
    { label: 'Audit Events Today', value: '1,247', icon: History, trend: 'All recorded' },
    { label: 'Pending Reviews', value: '18', icon: FileSearch, trend: '5 priority' },
    { label: 'Compliance Issues', value: '3', icon: AlertTriangle, trend: '-2 from last week' },
    { label: 'Clean Audits', value: '94%', icon: CheckCircle2, trend: '+2%' }
  ];

  return (
    <div className="crm-dashboard henry-audit">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#6366F1'}20` }}>
            <History size={28} style={{ color: assistant?.color || '#6366F1' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Henry'}</h1>
            <p>{assistant?.title || 'Audit Trail & Activity Logging'}</p>
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
            <h3>Recent Activity Log</h3>
            <Clock size={18} />
          </div>
          <div className="panel-content">
            {[
              { action: 'Contract Signed', user: 'Sarah M.', entity: 'Palm Villa Sale', time: '2 min ago', type: 'Transaction' },
              { action: 'Lead Assigned', user: 'System', entity: 'Ahmed K. → Clara', time: '5 min ago', type: 'Assignment' },
              { action: 'Price Updated', user: 'John D.', entity: 'Marina Apt #405', time: '12 min ago', type: 'Property' },
              { action: 'Document Uploaded', user: 'Mike R.', entity: 'Title Deed Scan', time: '18 min ago', type: 'Document' },
              { action: 'Payment Received', user: 'System', entity: 'AED 50,000', time: '25 min ago', type: 'Finance' }
            ].map((log, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{log.action}</span>
                  <span className="item-meta">{log.user} • {log.entity}</span>
                </div>
                <div className="item-actions">
                  <span className="type-badge">{log.type}</span>
                  <span className="time-ago">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>User Activity Summary</h3>
            <Users size={18} />
          </div>
          <div className="panel-content">
            {[
              { user: 'Sarah Martinez', actions: 156, lastActive: '2 min ago', role: 'Sales Agent' },
              { user: 'John Davidson', actions: 134, lastActive: '5 min ago', role: 'Leasing Agent' },
              { user: 'Mike Roberts', actions: 98, lastActive: '15 min ago', role: 'Property Manager' },
              { user: 'Emma Wilson', actions: 87, lastActive: '1 hr ago', role: 'Finance' }
            ].map((user, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{user.user}</span>
                  <span className="item-meta">{user.role} • {user.actions} actions</span>
                </div>
                <span className="time-ago">{user.lastActive}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Activity by Category</h3>
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Transactions', count: 234, percentage: '28%' },
              { name: 'Lead Management', count: 189, percentage: '23%' },
              { name: 'Document Changes', count: 156, percentage: '19%' },
              { name: 'Property Updates', count: 134, percentage: '16%' },
              { name: 'User Actions', count: 78, percentage: '9%' },
              { name: 'System Events', count: 45, percentage: '5%' }
            ].map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count} events ({category.percentage})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HenryAuditCRM;
