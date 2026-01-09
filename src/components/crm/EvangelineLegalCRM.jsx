import React from 'react';
import { Scale, FileCheck, AlertTriangle, BookOpen, Shield, Gavel } from 'lucide-react';
import './shared/CRMDashboard.css';

const EvangelineLegalCRM = ({ assistant }) => {
  const stats = [
    { label: 'Active Contracts', value: '156', icon: FileCheck, trend: '+12 this week' },
    { label: 'Pending Reviews', value: '23', icon: Scale, trend: '5 urgent' },
    { label: 'Risk Alerts', value: '8', icon: AlertTriangle, trend: '-3 from last week' },
    { label: 'Compliance Score', value: '94%', icon: Shield, trend: '+2%' }
  ];

  return (
    <div className="crm-dashboard evangeline-legal">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#8B5CF6'}20` }}>
            <Scale size={28} style={{ color: assistant?.color || '#8B5CF6' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Evangeline'}</h1>
            <p>{assistant?.title || 'Legal & Contract Intelligence'}</p>
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
            <h3>Contract Review Queue</h3>
            <span className="badge urgent">5 Urgent</span>
          </div>
          <div className="panel-content">
            {[
              { name: 'Sale Agreement - Al Barsha Villa', type: 'Purchase', priority: 'High', deadline: '2 hours' },
              { name: 'Tenancy Contract - Marina Heights', type: 'Lease', priority: 'Medium', deadline: '1 day' },
              { name: 'Developer Agreement - Palm Jumeirah', type: 'Off-Plan', priority: 'High', deadline: '3 hours' },
              { name: 'Property Management - JBR Tower', type: 'Service', priority: 'Low', deadline: '3 days' }
            ].map((contract, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{contract.name}</span>
                  <span className="item-meta">{contract.type}</span>
                </div>
                <div className="item-actions">
                  <span className={`priority-badge ${contract.priority.toLowerCase()}`}>{contract.priority}</span>
                  <span className="deadline">{contract.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Regulatory Updates</h3>
            <Gavel size={18} />
          </div>
          <div className="panel-content">
            {[
              { title: 'RERA Fee Structure Update 2024', date: 'Jan 5', status: 'New' },
              { title: 'DLD Registration Requirements', date: 'Jan 3', status: 'Updated' },
              { title: 'Ejari System Changes', date: 'Dec 28', status: 'Reviewed' },
              { title: 'Foreign Ownership Laws', date: 'Dec 20', status: 'Active' }
            ].map((update, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{update.title}</span>
                  <span className="item-meta">{update.date}</span>
                </div>
                <span className={`status-badge ${update.status.toLowerCase()}`}>{update.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Legal Knowledge Base</h3>
            <BookOpen size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Property Purchase', docs: 45 },
              { name: 'Tenancy Laws', docs: 32 },
              { name: 'DLD Procedures', docs: 28 },
              { name: 'RERA Compliance', docs: 24 },
              { name: 'Dispute Resolution', docs: 18 },
              { name: 'Tax Regulations', docs: 15 }
            ].map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.docs} documents</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvangelineLegalCRM;
