import React, { useState } from 'react';
import { 
  Eye, Wrench, AlertCircle, ClipboardCheck, Activity,
  ThermometerSun, Droplets, Zap, Wifi, Clock, CheckCircle,
  TrendingUp, ArrowUp, ArrowDown, Search, Plus, Users, MapPin
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const PROPERTY_STATUS = [
  { id: 1, property: 'Villa 234 - Cluster A', sensors: 12, alerts: 2, status: 'warning', temp: 24, humidity: 45, lastCheck: '2 hours ago' },
  { id: 2, property: 'Villa 456 - Cluster B', sensors: 10, alerts: 0, status: 'healthy', temp: 23, humidity: 48, lastCheck: '1 hour ago' },
  { id: 3, property: 'Apt 1205 - Marina', sensors: 6, alerts: 1, status: 'warning', temp: 25, humidity: 52, lastCheck: '30 mins ago' },
  { id: 4, property: 'Villa 789 - Cluster C', sensors: 14, alerts: 0, status: 'healthy', temp: 22, humidity: 44, lastCheck: '4 hours ago' },
  { id: 5, property: 'Townhouse 56 - Springs', sensors: 8, alerts: 3, status: 'critical', temp: 28, humidity: 65, lastCheck: '15 mins ago' }
];

const WORK_ORDERS = [
  { id: 'WO-001', property: 'Villa 234', issue: 'AC Unit Not Cooling', priority: 'high', status: 'in_progress', vendor: 'Cool Air LLC', scheduled: '2024-01-22' },
  { id: 'WO-002', property: 'Townhouse 56', issue: 'Water Leak Detected', priority: 'critical', status: 'dispatched', vendor: 'Plumb Pro', scheduled: '2024-01-21' },
  { id: 'WO-003', property: 'Apt 1205', issue: 'Electrical Inspection', priority: 'medium', status: 'pending', vendor: 'ElectriCare', scheduled: '2024-01-25' },
  { id: 'WO-004', property: 'Villa 789', issue: 'Annual HVAC Service', priority: 'low', status: 'scheduled', vendor: 'Cool Air LLC', scheduled: '2024-02-01' }
];

const VENDORS = [
  { id: 1, name: 'Cool Air LLC', specialty: 'HVAC', rating: 4.8, jobs: 156, response: '2 hours', status: 'available' },
  { id: 2, name: 'Plumb Pro', specialty: 'Plumbing', rating: 4.6, jobs: 89, response: '1 hour', status: 'on_job' },
  { id: 3, name: 'ElectriCare', specialty: 'Electrical', rating: 4.9, jobs: 203, response: '3 hours', status: 'available' },
  { id: 4, name: 'General Maintenance', specialty: 'General', rating: 4.5, jobs: 312, response: '4 hours', status: 'available' }
];

const SentinelPropertyCRM = () => {
  const [activeTab, setActiveTab] = useState('monitoring');

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard sentinel">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
          <Eye size={28} />
        </div>
        <div className="assistant-info">
          <h2>Sentinel - Property Monitoring AI</h2>
          <p>IoT integration for property condition monitoring, predictive maintenance scheduling, and emergency response coordination</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#7C3AED' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">156</span>
            <span className="stat-label">Properties Monitored</span>
          </div>
          <span className="stat-change positive">98% uptime</span>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">8</span>
            <span className="stat-label">Active Alerts</span>
          </div>
          <span className="stat-change warning">2 critical</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Wrench size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">23</span>
            <span className="stat-label">Work Orders</span>
          </div>
          <span className="stat-change">12 in progress</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">94%</span>
            <span className="stat-label">SLA Compliance</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 3%</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['monitoring', 'work_orders', 'vendors', 'inspections', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'monitoring' && (
          <div className="monitoring-view">
            <div className="view-header">
              <h3>Real-Time Property Status</h3>
              <div className="status-legend">
                <span className="legend-item"><span style={{ background: '#10B981' }}></span> Healthy</span>
                <span className="legend-item"><span style={{ background: '#F59E0B' }}></span> Warning</span>
                <span className="legend-item"><span style={{ background: '#EF4444' }}></span> Critical</span>
              </div>
            </div>
            <div className="property-grid">
              {PROPERTY_STATUS.map(prop => (
                <div key={prop.id} className="property-monitor-card" style={{ borderColor: getStatusColor(prop.status) }}>
                  <div className="monitor-header">
                    <h4>{prop.property}</h4>
                    <span className="status-indicator" style={{ background: getStatusColor(prop.status) }}></span>
                  </div>
                  <div className="sensor-stats">
                    <div className="sensor-stat">
                      <ThermometerSun size={16} />
                      <span>{prop.temp}°C</span>
                    </div>
                    <div className="sensor-stat">
                      <Droplets size={16} />
                      <span>{prop.humidity}%</span>
                    </div>
                    <div className="sensor-stat">
                      <Wifi size={16} />
                      <span>{prop.sensors} sensors</span>
                    </div>
                  </div>
                  <div className="monitor-footer">
                    {prop.alerts > 0 && (
                      <span className="alerts-badge"><AlertCircle size={12} /> {prop.alerts} alerts</span>
                    )}
                    <span className="last-check"><Clock size={12} /> {prop.lastCheck}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'work_orders' && (
          <div className="work-orders-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search work orders..." />
              </div>
              <button className="add-btn"><Plus size={16} /> New Work Order</button>
            </div>
            <div className="work-orders-list">
              {WORK_ORDERS.map(wo => (
                <div key={wo.id} className="work-order-card">
                  <div className="wo-priority" style={{ background: getPriorityColor(wo.priority) }} />
                  <div className="wo-content">
                    <div className="wo-header">
                      <span className="wo-id">{wo.id}</span>
                      <span className={`wo-status ${wo.status}`}>{wo.status.replace('_', ' ')}</span>
                    </div>
                    <h4>{wo.issue}</h4>
                    <p><MapPin size={12} /> {wo.property}</p>
                    <div className="wo-meta">
                      <span><Users size={12} /> {wo.vendor}</span>
                      <span><Clock size={12} /> {wo.scheduled}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="vendors-view">
            <h3>Vendor Directory</h3>
            <div className="vendors-grid">
              {VENDORS.map(vendor => (
                <div key={vendor.id} className="vendor-card">
                  <div className="vendor-header">
                    <h4>{vendor.name}</h4>
                    <span className={`vendor-status ${vendor.status}`}>{vendor.status.replace('_', ' ')}</span>
                  </div>
                  <p className="vendor-specialty">{vendor.specialty}</p>
                  <div className="vendor-stats">
                    <span>⭐ {vendor.rating}</span>
                    <span>{vendor.jobs} jobs</span>
                    <span>~{vendor.response}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="inspections-view">
            <h3>Scheduled Inspections</h3>
            <div className="empty-state">
              <ClipboardCheck size={48} />
              <p>No inspections scheduled this week</p>
              <button className="add-btn"><Plus size={16} /> Schedule Inspection</button>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="sentinel" 
            assistantName="Sentinel" 
            assistantColor="#7C3AED" 
          />
        )}
      </div>
    </div>
  );
};

export default SentinelPropertyCRM;
