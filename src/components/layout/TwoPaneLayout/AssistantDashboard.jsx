import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  Zap, Activity, Settings, MessageSquare, Database,
  TrendingUp, Clock, CheckCircle, AlertTriangle, ArrowRight,
  Code, Workflow, Target, Users
} from 'lucide-react';
import { selectDepartment } from '../../../store/slices/workspaceSlice';
import { DEPARTMENTS } from '../../../config/assistantRegistry';
import './AssistantDashboard.css';

export default function AssistantDashboard({ assistant }) {
  const dispatch = useDispatch();

  if (!assistant) {
    return <div className="no-selection">Select an AI assistant to view its dashboard</div>;
  }

  const department = DEPARTMENTS[assistant.department];

  return (
    <div className="assistant-dashboard">
      <div className="assistant-header">
        <div className="header-avatar" style={{ backgroundColor: `${assistant.color}20` }}>
          {assistant.avatar}
        </div>
        <div className="header-info">
          <h1 style={{ color: assistant.color }}>{assistant.name}</h1>
          <p className="header-title">{assistant.title}</p>
          <p className="header-desc">{assistant.description}</p>
        </div>
        <div className="header-status">
          <span className="status-indicator online" />
          <span className="status-text">Online</span>
        </div>
      </div>

      <div className="assistant-stats">
        <div className="stat-card">
          <Activity size={20} />
          <div className="stat-info">
            <span className="stat-value">98.5%</span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={20} />
          <div className="stat-info">
            <span className="stat-value">1.2s</span>
            <span className="stat-label">Avg Response</span>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={20} />
          <div className="stat-info">
            <span className="stat-value">2,847</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={20} />
          <div className="stat-info">
            <span className="stat-value">+15%</span>
            <span className="stat-label">This Week</span>
          </div>
        </div>
      </div>

      <div className="assistant-sections">
        <section className="capabilities-section">
          <h2><Zap size={18} /> Capabilities & Functions</h2>
          <div className="capabilities-list">
            {assistant.capabilities?.map((cap, i) => (
              <div key={i} className="capability-item">
                <div className="cap-icon">
                  <Code size={14} />
                </div>
                <div className="cap-content">
                  <span className="cap-name">{cap.replace(/_/g, ' ')}</span>
                  <span className="cap-status">Active</span>
                </div>
              </div>
            )) || (
              <p className="no-caps">No capabilities defined</p>
            )}
          </div>
        </section>

        <section className="department-section">
          <h2><Users size={18} /> Department Integration</h2>
          {department && (
            <button
              className="department-link"
              onClick={() => dispatch(selectDepartment(assistant.department))}
              style={{ '--dept-color': department.color }}
            >
              <div className="dept-indicator" style={{ background: department.color }} />
              <div className="dept-info">
                <span className="dept-name">{department.label}</span>
                <span className="dept-hint">Click to view department + collaborate</span>
              </div>
              <ArrowRight size={16} />
            </button>
          )}
          
          <div className="api-endpoints">
            <h3>API Endpoints</h3>
            <div className="endpoints-list">
              {assistant.apiEndpoints?.map((endpoint, i) => (
                <div key={i} className="endpoint-item">
                  <Database size={14} />
                  <code>{endpoint}</code>
                </div>
              )) || (
                <p className="no-endpoints">No API endpoints defined</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="data-flows-section">
        <h2><Workflow size={18} /> Data Flows</h2>
        <div className="flows-grid">
          <div className="flow-card inputs">
            <h3>Receives Data From</h3>
            <div className="flow-items">
              {assistant.dataFlows?.inputs?.length > 0 ? (
                assistant.dataFlows.inputs.map((id, i) => (
                  <span key={i} className="flow-tag">{id}</span>
                ))
              ) : (
                <span className="no-flow">No inputs configured</span>
              )}
            </div>
          </div>
          <div className="flow-card outputs">
            <h3>Sends Data To</h3>
            <div className="flow-items">
              {assistant.dataFlows?.outputs?.length > 0 ? (
                assistant.dataFlows.outputs.map((id, i) => (
                  <span key={i} className="flow-tag">{id}</span>
                ))
              ) : (
                <span className="no-flow">No outputs configured</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <MessageSquare size={18} />
            <span>Send Message</span>
          </button>
          <button className="action-btn">
            <Target size={18} />
            <span>Run Task</span>
          </button>
          <button className="action-btn">
            <Activity size={18} />
            <span>View Logs</span>
          </button>
          <button className="action-btn">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </section>
    </div>
  );
}
