import React from 'react';
import { Key, ClipboardCheck, Calendar, Package, CheckCircle, AlertCircle } from 'lucide-react';
import './shared/CRMDashboard.css';

const VestaHandoverCRM = ({ assistant }) => {
  const stats = [
    { label: 'Pending Handovers', value: '28', icon: Key, trend: '12 this week' },
    { label: 'Completed Today', value: '5', icon: CheckCircle, trend: 'On target' },
    { label: 'Scheduled', value: '45', icon: Calendar, trend: 'Next 30 days' },
    { label: 'Inspection Pass Rate', value: '92%', icon: ClipboardCheck, trend: '+3%' }
  ];

  return (
    <div className="crm-dashboard vesta-handover">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#F59E0B'}20` }}>
            <Key size={28} style={{ color: assistant?.color || '#F59E0B' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Vesta'}</h1>
            <p>{assistant?.title || 'Property Handover & Inspections'}</p>
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
            <h3>Upcoming Handovers</h3>
            <Calendar size={18} />
          </div>
          <div className="panel-content">
            {[
              { property: 'Marina Tower 2304', type: 'Move-In', date: 'Today, 2:00 PM', tenant: 'Ahmed K.' },
              { property: 'Palm Villa D-24', type: 'Move-Out', date: 'Today, 4:30 PM', tenant: 'Sarah W.' },
              { property: 'Downtown Apt 1502', type: 'Move-In', date: 'Tomorrow, 10:00 AM', tenant: 'Mike R.' },
              { property: 'JBR Suite 801', type: 'Move-Out', date: 'Tomorrow, 2:00 PM', tenant: 'Emma L.' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.property}</span>
                  <span className="item-meta">{item.tenant} • {item.date}</span>
                </div>
                <span className={`type-badge ${item.type.toLowerCase().replace('-', '')}`}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Inspection Checklist Status</h3>
            <ClipboardCheck size={18} />
          </div>
          <div className="panel-content">
            {[
              { property: 'Business Bay Office', items: '48/52', status: 'In Progress', issues: 4 },
              { property: 'Dubai Hills Villa', items: '65/65', status: 'Complete', issues: 0 },
              { property: 'DIFC Tower', items: '32/45', status: 'In Progress', issues: 2 },
              { property: 'Al Barsha Apt', items: '42/42', status: 'Complete', issues: 0 }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.property}</span>
                  <span className="item-meta">{item.items} items checked</span>
                </div>
                <div className="item-actions">
                  <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
                  {item.issues > 0 && <span className="issues-badge">{item.issues} issues</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Handover Packages</h3>
            <Package size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Keys & Access Cards', status: 'Ready', count: 28 },
              { name: 'Welcome Packs', status: 'Preparing', count: 15 },
              { name: 'Utility Transfers', status: 'In Progress', count: 22 },
              { name: 'Security Deposits', status: 'Verified', count: 24 },
              { name: 'Documentation', status: 'Complete', count: 30 },
              { name: 'Maintenance Contacts', status: 'Ready', count: 28 }
            ].map((pkg, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{pkg.name}</span>
                <span className="category-count">{pkg.count} units ({pkg.status})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VestaHandoverCRM;
