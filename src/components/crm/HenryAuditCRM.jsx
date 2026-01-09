import React, { useState } from 'react';
import { 
  BookOpen, Clock, History, FileText, Search,
  Filter, Calendar, Users, Activity, Shield,
  AlertCircle, CheckCircle, Eye, Download, TrendingUp, ArrowUp
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const TIMELINE_EVENTS = [
  { id: 1, type: 'lead_created', entity: 'Lead L-045', user: 'System', timestamp: '2024-01-21 14:32:15', details: 'New lead from WhatsApp', assistant: 'linda' },
  { id: 2, type: 'property_updated', entity: 'Villa 234', user: 'Mary', timestamp: '2024-01-21 14:28:00', details: 'Status changed to Available', assistant: 'mary' },
  { id: 3, type: 'payment_received', entity: 'Invoice INV-2024-089', user: 'Theodora', timestamp: '2024-01-21 14:15:30', details: 'AED 125,000 received', assistant: 'theodora' },
  { id: 4, type: 'contract_signed', entity: 'Lease AGR-2024-012', user: 'Daisy', timestamp: '2024-01-21 13:45:00', details: 'Digital signature completed', assistant: 'daisy' },
  { id: 5, type: 'compliance_check', entity: 'Client C-089', user: 'Laila', timestamp: '2024-01-21 13:30:00', details: 'KYC verification passed', assistant: 'laila' },
  { id: 6, type: 'suggestion_sent', entity: 'Strategy S-012', user: 'Olivia', timestamp: '2024-01-21 12:00:00', details: 'Marketing suggestion to Zoe', assistant: 'olivia' }
];

const AUDIT_LOGS = [
  { id: 1, action: 'USER_LOGIN', user: 'admin@whitecaves.ae', ip: '192.168.1.100', timestamp: '2024-01-21 09:00:00', status: 'success' },
  { id: 2, action: 'DATA_EXPORT', user: 'sarah.agent@whitecaves.ae', ip: '192.168.1.102', timestamp: '2024-01-21 10:15:00', status: 'success' },
  { id: 3, action: 'PERMISSION_CHANGE', user: 'admin@whitecaves.ae', ip: '192.168.1.100', timestamp: '2024-01-21 11:30:00', status: 'success' },
  { id: 4, action: 'FAILED_LOGIN', user: 'unknown@external.com', ip: '45.67.89.123', timestamp: '2024-01-21 12:45:00', status: 'failed' },
  { id: 5, action: 'API_ACCESS', user: 'integration-key-001', ip: 'api.bayut.com', timestamp: '2024-01-21 13:00:00', status: 'success' }
];

const COMPLIANCE_REPORTS = [
  { id: 1, name: 'Monthly Audit Report - January 2024', type: 'Monthly', generated: '2024-01-01', status: 'completed' },
  { id: 2, name: 'RERA Compliance Check Q4 2023', type: 'Quarterly', generated: '2024-01-05', status: 'completed' },
  { id: 3, name: 'Data Privacy Audit', type: 'Annual', generated: '2024-01-15', status: 'in_progress' },
  { id: 4, name: 'Transaction Integrity Report', type: 'Weekly', generated: '2024-01-21', status: 'pending' }
];

const ASSISTANT_COLORS = {
  linda: '#25D366',
  mary: '#3B82F6',
  theodora: '#F59E0B',
  daisy: '#14B8A6',
  laila: '#6366F1',
  olivia: '#EC4899',
  clara: '#EF4444',
  zoe: '#10B981'
};

const HenryAuditCRM = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');

  const getEventIcon = (type) => {
    switch (type) {
      case 'lead_created': return <Users size={16} />;
      case 'property_updated': return <Activity size={16} />;
      case 'payment_received': return <CheckCircle size={16} />;
      case 'contract_signed': return <FileText size={16} />;
      case 'compliance_check': return <Shield size={16} />;
      case 'suggestion_sent': return <TrendingUp size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="assistant-dashboard henry">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
          <BookOpen size={28} />
        </div>
        <div className="assistant-info">
          <h2>Henry - Record Keeper & Timeline Master</h2>
          <p>Centralized memory and audit system. Creates immutable audit trails, enables cross-system analytics, and automates compliance reporting</p>
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
            <span className="stat-value">12,847</span>
            <span className="stat-label">Events Logged</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 342 today</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Shield size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">100%</span>
            <span className="stat-label">Data Integrity</span>
          </div>
          <span className="stat-change positive">Verified</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">24</span>
            <span className="stat-label">AI Assistants</span>
          </div>
          <span className="stat-change">All monitored</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">2</span>
            <span className="stat-label">Anomalies</span>
          </div>
          <span className="stat-change warning">Under review</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['timeline', 'audit', 'reports', 'analytics', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'timeline' && (
          <div className="timeline-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <select>
                  <option value="all">All Assistants</option>
                  <option value="linda">Linda</option>
                  <option value="mary">Mary</option>
                  <option value="clara">Clara</option>
                </select>
                <select>
                  <option value="all">All Types</option>
                  <option value="lead">Leads</option>
                  <option value="property">Properties</option>
                  <option value="payment">Payments</option>
                </select>
              </div>
            </div>
            <div className="timeline-list">
              {TIMELINE_EVENTS.map(event => (
                <div key={event.id} className="timeline-event">
                  <div className="event-time">{event.timestamp.split(' ')[1]}</div>
                  <div className="event-line">
                    <div className="event-dot" style={{ background: ASSISTANT_COLORS[event.assistant] || '#6B7280' }}>
                      {getEventIcon(event.type)}
                    </div>
                  </div>
                  <div className="event-content">
                    <div className="event-header">
                      <span className="event-entity">{event.entity}</span>
                      <span className="event-type">{event.type.replace(/_/g, ' ')}</span>
                    </div>
                    <p className="event-details">{event.details}</p>
                    <div className="event-meta">
                      <span className="event-user">{event.user}</span>
                      <span className="event-date">{event.timestamp.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-view">
            <h3>Security Audit Log</h3>
            <div className="audit-table">
              <table>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>IP Address</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_LOGS.map(log => (
                    <tr key={log.id} className={log.status === 'failed' ? 'failed' : ''}>
                      <td>{log.action}</td>
                      <td>{log.user}</td>
                      <td>{log.ip}</td>
                      <td>{log.timestamp}</td>
                      <td>
                        <span className={`status-badge ${log.status}`}>
                          {log.status === 'success' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-view">
            <h3>Compliance Reports</h3>
            <div className="reports-grid">
              {COMPLIANCE_REPORTS.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-icon">
                    <FileText size={24} />
                  </div>
                  <div className="report-content">
                    <h4>{report.name}</h4>
                    <div className="report-meta">
                      <span>{report.type}</span>
                      <span>{report.generated}</span>
                    </div>
                  </div>
                  <div className="report-actions">
                    <span className={`status-badge ${report.status}`}>{report.status.replace('_', ' ')}</span>
                    {report.status === 'completed' && (
                      <button className="download-btn"><Download size={14} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-view">
            <h3>Timeline Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Events by Assistant</h4>
                <div className="chart-placeholder">Chart coming soon</div>
              </div>
              <div className="analytics-card">
                <h4>Activity Heatmap</h4>
                <div className="chart-placeholder">Chart coming soon</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="henry" 
            assistantName="Henry" 
            assistantColor="#7C3AED" 
          />
        )}
      </div>
    </div>
  );
};

export default HenryAuditCRM;
