import React, { useState } from 'react';
import { 
  Home, Key, Users, Calendar, FileText, Clock,
  Search, Plus, Filter, CheckCircle, AlertCircle,
  ArrowUp, ArrowDown, Phone, Mail, MapPin, DollarSign
} from 'lucide-react';
import { AssistantDocsTab } from './shared';
import './AssistantDashboard.css';

const ACTIVE_LEASES = [
  { id: 1, unit: 'Apt 1205 - Marina Views', tenant: 'Ahmed Al Rashid', rent: 120000, startDate: '2024-01-15', endDate: '2025-01-14', status: 'active', daysRemaining: 245 },
  { id: 2, unit: 'Villa 48 - Springs', tenant: 'Sarah Johnson', rent: 180000, startDate: '2023-06-01', endDate: '2024-05-31', status: 'expiring_soon', daysRemaining: 30 },
  { id: 3, unit: 'Townhouse 12 - JVC', tenant: 'Mohammed Khan', rent: 95000, startDate: '2024-03-01', endDate: '2025-02-28', status: 'active', daysRemaining: 310 },
  { id: 4, unit: 'Penthouse 501 - Downtown', tenant: 'Maria Santos', rent: 350000, startDate: '2024-02-15', endDate: '2025-02-14', status: 'active', daysRemaining: 280 },
  { id: 5, unit: 'Studio 302 - Discovery', tenant: 'James Wilson', rent: 45000, startDate: '2023-08-01', endDate: '2024-07-31', status: 'renewal_pending', daysRemaining: 15 }
];

const MAINTENANCE_REQUESTS = [
  { id: 1, unit: 'Apt 1205', issue: 'AC not cooling', priority: 'high', status: 'in_progress', created: '2024-01-08' },
  { id: 2, unit: 'Villa 48', issue: 'Leaking faucet', priority: 'medium', status: 'pending', created: '2024-01-07' },
  { id: 3, unit: 'Studio 302', issue: 'Light fixture broken', priority: 'low', status: 'scheduled', created: '2024-01-06' }
];

const RENTAL_INQUIRIES = [
  { id: 1, name: 'Robert Chen', property: '2BR Marina', budget: '100-120K', status: 'viewing_scheduled', date: '2024-01-10' },
  { id: 2, name: 'Sophie Laurent', property: 'Villa Palm', budget: '200-250K', status: 'new', date: '2024-01-09' },
  { id: 3, name: 'Omar Malik', property: 'Studio Downtown', budget: '50-60K', status: 'documents_pending', date: '2024-01-08' }
];

const DaisyLeasingCRM = () => {
  const [activeTab, setActiveTab] = useState('leases');

  return (
    <div className="assistant-dashboard daisy">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)' }}>
          <Home size={28} />
        </div>
        <div className="assistant-info">
          <h2>Daisy - Leasing & Tenant Manager</h2>
          <p>Manages rental properties, tenant communications, lease agreements, and maintenance requests</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#14B8A6' }}>
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">156</span>
            <span className="stat-label">Active Leases</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 8</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Expiring Soon</span>
          </div>
          <span className="stat-change warning">30 days</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 18.5M</span>
            <span className="stat-label">Monthly Revenue</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 5%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">8</span>
            <span className="stat-label">Maintenance</span>
          </div>
          <span className="stat-change">Open</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['leases', 'inquiries', 'maintenance', 'renewals', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'leases' && (
          <div className="leases-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search leases..." />
              </div>
              <button className="add-btn"><Plus size={16} /> New Lease</button>
            </div>
            <div className="leases-table">
              <div className="table-header">
                <span>Unit</span>
                <span>Tenant</span>
                <span>Annual Rent</span>
                <span>End Date</span>
                <span>Days Left</span>
                <span>Status</span>
              </div>
              {ACTIVE_LEASES.map(lease => (
                <div key={lease.id} className="table-row">
                  <span className="unit-name">{lease.unit}</span>
                  <span>{lease.tenant}</span>
                  <span>AED {lease.rent.toLocaleString()}</span>
                  <span>{lease.endDate}</span>
                  <span className={lease.daysRemaining < 60 ? 'warning' : ''}>{lease.daysRemaining}</span>
                  <span className={`status-badge ${lease.status}`}>
                    {lease.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="inquiries-view">
            <h3>Rental Inquiries</h3>
            <div className="inquiry-cards">
              {RENTAL_INQUIRIES.map(inquiry => (
                <div key={inquiry.id} className="inquiry-card">
                  <div className="inquiry-header">
                    <h4>{inquiry.name}</h4>
                    <span className={`status-badge ${inquiry.status}`}>{inquiry.status.replace('_', ' ')}</span>
                  </div>
                  <div className="inquiry-details">
                    <span><Home size={14} /> {inquiry.property}</span>
                    <span><DollarSign size={14} /> {inquiry.budget} AED/year</span>
                    <span><Calendar size={14} /> {inquiry.date}</span>
                  </div>
                  <div className="inquiry-actions">
                    <button><Phone size={14} /> Call</button>
                    <button><Mail size={14} /> Email</button>
                    <button><Calendar size={14} /> Schedule</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="maintenance-view">
            <h3>Maintenance Requests</h3>
            <div className="maintenance-list">
              {MAINTENANCE_REQUESTS.map(request => (
                <div key={request.id} className={`maintenance-card ${request.priority}`}>
                  <div className="maintenance-header">
                    <span className="unit">{request.unit}</span>
                    <span className={`priority-badge ${request.priority}`}>{request.priority}</span>
                  </div>
                  <p className="issue">{request.issue}</p>
                  <div className="maintenance-footer">
                    <span className={`status ${request.status}`}>{request.status.replace('_', ' ')}</span>
                    <span className="date">{request.created}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'renewals' && (
          <div className="renewals-view">
            <h3>Lease Renewals</h3>
            <div className="renewal-summary">
              <div className="renewal-stat">
                <span className="value">12</span>
                <span className="label">Due This Month</span>
              </div>
              <div className="renewal-stat">
                <span className="value">8</span>
                <span className="label">Renewal Sent</span>
              </div>
              <div className="renewal-stat">
                <span className="value">5</span>
                <span className="label">Confirmed</span>
              </div>
              <div className="renewal-stat">
                <span className="value">2</span>
                <span className="label">Moving Out</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && <AssistantDocsTab assistantId="daisy" />}
      </div>
    </div>
  );
};

export default DaisyLeasingCRM;
