import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  BarChart3, Users, FileText, Calendar, TrendingUp, 
  AlertCircle, CheckCircle, Clock, ArrowRight, Zap
} from 'lucide-react';
import { selectAssistant } from '../../../store/slices/workspaceSlice';
import { AI_ASSISTANTS } from '../../../config/assistantRegistry';
import './DepartmentDashboard.css';

const DEPT_CONFIG = {
  executive: { kpis: ['Revenue MTD', 'Deal Pipeline', 'Team Performance'], primaryMetric: 'AED 24.5M' },
  sales: { kpis: ['Active Leads', 'Conversion Rate', 'Pipeline Value'], primaryMetric: '156 Leads' },
  leasing: { kpis: ['Active Leases', 'Occupancy Rate', 'Renewals Due'], primaryMetric: '342 Leases' },
  property_management: { kpis: ['Properties Managed', 'Maintenance Tasks', 'Tenant Satisfaction'], primaryMetric: '127 Properties' },
  marketing: { kpis: ['Campaign ROI', 'Lead Generation', 'Brand Reach'], primaryMetric: '245K Reach' },
  finance: { kpis: ['Revenue MTD', 'Outstanding Payments', 'Collection Rate'], primaryMetric: 'AED 8.5M' },
  compliance: { kpis: ['Pending KYC', 'AML Alerts', 'Approval Rate'], primaryMetric: '23 Pending' },
  operations: { kpis: ['Active Workflows', 'SLA Compliance', 'Resource Utilization'], primaryMetric: '94% SLA' },
  technology: { kpis: ['System Uptime', 'Active Integrations', 'Support Tickets'], primaryMetric: '99.9% Uptime' },
  hr: { kpis: ['Total Employees', 'Open Positions', 'Retention Rate'], primaryMetric: '103 Staff' }
};

const DEPT_ASSISTANTS = {
  executive: ['zoe'],
  sales: ['clara', 'sophia', 'hunter', 'kairos'],
  leasing: ['daisy', 'nancy'],
  property_management: ['mary', 'nancy'],
  marketing: ['ivy', 'olivia'],
  finance: ['max', 'theodora', 'maven'],
  compliance: ['leo', 'laila'],
  operations: ['marcus', 'henry', 'vesta'],
  technology: ['aurora', 'hazel', 'willow', 'cipher'],
  hr: ['marcus']
};

export default function DepartmentDashboard({ department, pillar }) {
  const dispatch = useDispatch();
  
  if (!department && !pillar) {
    return <div className="no-selection">Select a department to view its dashboard</div>;
  }

  if (pillar) {
    return (
      <div className="pillar-dashboard">
        <div className="pillar-header">
          <h1>Platform Pillar: {pillar.replace(/_/g, ' ')}</h1>
          <p>Dubai-focused real estate operations</p>
        </div>
        <div className="pillar-content">
          <div className="pillar-info-card">
            <h3>About this Pillar</h3>
            <p>This pillar provides centralized management for Dubai real estate operations according to RERA and DLD regulations.</p>
          </div>
        </div>
      </div>
    );
  }

  const deptId = department.id;
  const config = DEPT_CONFIG[deptId] || DEPT_CONFIG.sales;
  const assistantIds = DEPT_ASSISTANTS[deptId] || [];
  const assistants = assistantIds.map(id => AI_ASSISTANTS[id]).filter(Boolean);

  return (
    <div className="department-dashboard">
      <div className="dept-header">
        <div className="dept-title-section">
          <h1 style={{ color: department.color }}>{department.label}</h1>
          <p>CRM Dashboard for {department.label} operations</p>
        </div>
        <div className="primary-metric">
          <span className="metric-value">{config.primaryMetric}</span>
          <span className="metric-label">Primary KPI</span>
        </div>
      </div>

      <div className="dept-kpis">
        {config.kpis.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <BarChart3 size={20} className="kpi-icon" />
            <span className="kpi-name">{kpi}</span>
            <span className="kpi-status">Active</span>
          </div>
        ))}
      </div>

      <div className="dept-sections">
        <section className="recent-activity">
          <h2><Clock size={18} /> Recent Activity</h2>
          <div className="activity-list">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="activity-item">
                <div className="activity-icon">
                  <CheckCircle size={16} />
                </div>
                <div className="activity-content">
                  <span className="activity-title">Task completed in {department.label}</span>
                  <span className="activity-time">{i * 15} minutes ago</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="assigned-assistants">
          <div className="section-header">
            <h2><Zap size={18} /> AI Assistants</h2>
            <span className="assistant-hint">Click to collaborate</span>
          </div>
          <div className="assistants-grid">
            {assistants.map(assistant => (
              <button
                key={assistant.id}
                className="assistant-card"
                onClick={() => dispatch(selectAssistant(assistant.id))}
                style={{ '--assistant-color': assistant.color }}
              >
                <div className="assistant-avatar" style={{ backgroundColor: `${assistant.color}20` }}>
                  {assistant.avatar}
                </div>
                <div className="assistant-info">
                  <span className="assistant-name">{assistant.name}</span>
                  <span className="assistant-title">{assistant.title}</span>
                </div>
                <ArrowRight size={14} className="assistant-arrow" />
              </button>
            ))}
          </div>
          {assistants.length === 0 && (
            <p className="no-assistants">No AI assistants assigned to this department</p>
          )}
        </section>
      </div>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <FileText size={18} />
            <span>View Reports</span>
          </button>
          <button className="action-btn">
            <Users size={18} />
            <span>Team Members</span>
          </button>
          <button className="action-btn">
            <Calendar size={18} />
            <span>Schedule</span>
          </button>
          <button className="action-btn">
            <TrendingUp size={18} />
            <span>Analytics</span>
          </button>
        </div>
      </section>
    </div>
  );
}
