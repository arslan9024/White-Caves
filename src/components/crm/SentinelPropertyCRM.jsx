import React from 'react';
import { Building2, Eye, MapPin, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import './shared/CRMDashboard.css';

const SentinelPropertyCRM = ({ assistant }) => {
  const stats = [
    { label: 'Properties Monitored', value: '342', icon: Building2, trend: '+18 this month' },
    { label: 'Active Alerts', value: '12', icon: AlertCircle, trend: '3 critical' },
    { label: 'Inspections Due', value: '28', icon: Eye, trend: '8 this week' },
    { label: 'Verified Listings', value: '89%', icon: CheckCircle, trend: '+5%' }
  ];

  return (
    <div className="crm-dashboard sentinel-property">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#059669'}20` }}>
            <Eye size={28} style={{ color: assistant?.color || '#059669' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Sentinel'}</h1>
            <p>{assistant?.title || 'Property Monitoring & Verification'}</p>
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
            <h3>Property Alerts</h3>
            <span className="badge urgent">3 Critical</span>
          </div>
          <div className="panel-content">
            {[
              { property: 'Marina Tower Unit 2304', alert: 'Price Drop Detected', severity: 'High', time: '2 hrs ago' },
              { property: 'Palm Jumeirah Villa', alert: 'New Competitor Listing', severity: 'Medium', time: '4 hrs ago' },
              { property: 'Downtown Boulevard', alert: 'Listing Expired', severity: 'High', time: '6 hrs ago' },
              { property: 'Business Bay Office', alert: 'Document Update Needed', severity: 'Low', time: '1 day ago' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.property}</span>
                  <span className="item-meta">{item.alert}</span>
                </div>
                <div className="item-actions">
                  <span className={`priority-badge ${item.severity.toLowerCase()}`}>{item.severity}</span>
                  <span className="time-ago">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>Upcoming Inspections</h3>
            <Clock size={18} />
          </div>
          <div className="panel-content">
            {[
              { property: 'JBR Apartment 1502', date: 'Today, 2:00 PM', type: 'Move-out' },
              { property: 'Dubai Hills Villa', date: 'Tomorrow, 10:00 AM', type: 'Quarterly' },
              { property: 'DIFC Office Suite', date: 'Jan 12, 3:00 PM', type: 'Pre-lease' },
              { property: 'Arabian Ranches', date: 'Jan 14, 11:00 AM', type: 'Annual' }
            ].map((inspection, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{inspection.property}</span>
                  <span className="item-meta">{inspection.date}</span>
                </div>
                <span className="type-badge">{inspection.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Properties by Location</h3>
            <MapPin size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Dubai Marina', count: 78, status: 'Active' },
              { name: 'Downtown Dubai', count: 56, status: 'Active' },
              { name: 'Palm Jumeirah', count: 42, status: 'Active' },
              { name: 'Business Bay', count: 38, status: 'Active' },
              { name: 'JBR', count: 34, status: 'Active' },
              { name: 'Dubai Hills', count: 28, status: 'Active' }
            ].map((location, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{location.name}</span>
                <span className="category-count">{location.count} properties</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentinelPropertyCRM;
