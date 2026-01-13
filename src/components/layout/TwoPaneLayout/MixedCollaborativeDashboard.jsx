import React, { useMemo } from 'react';
import { 
  Zap, Activity, Link2, ArrowRight, CheckCircle, 
  AlertCircle, Clock, Target, Workflow, Database,
  Code, BarChart3, Users, FileText, MessageSquare
} from 'lucide-react';
import { AI_ASSISTANTS, DEPARTMENTS } from '../../../config/assistantRegistry';
import './MixedCollaborativeDashboard.css';

const SHARED_FUNCTIONS = {
  sales: {
    clara: ['lead_scoring', 'lead_qualification', 'pipeline_management'],
    sophia: ['deal_tracking', 'revenue_forecasting', 'commission_calculation'],
    hunter: ['property_matching', 'client_recommendations'],
    kairos: ['follow_up_scheduling', 'task_automation']
  },
  leasing: {
    daisy: ['tenant_onboarding', 'lease_management', 'renewal_tracking'],
    nancy: ['property_inspection', 'maintenance_coordination']
  },
  compliance: {
    leo: ['kyc_verification', 'aml_screening', 'risk_assessment', 'str_filing'],
    laila: ['document_verification', 'regulatory_compliance']
  },
  finance: {
    max: ['invoice_processing', 'payment_tracking', 'financial_reporting'],
    theodora: ['commission_calculation', 'revenue_allocation'],
    maven: ['budget_analysis', 'expense_tracking']
  },
  marketing: {
    ivy: ['campaign_management', 'lead_generation', 'content_scheduling'],
    olivia: ['market_analytics', 'competitor_analysis']
  },
  operations: {
    marcus: ['workflow_automation', 'resource_allocation', 'sla_monitoring'],
    henry: ['event_coordination', 'scheduling'],
    vesta: ['quality_assurance', 'performance_monitoring']
  },
  technology: {
    aurora: ['system_monitoring', 'documentation', 'knowledge_base'],
    hazel: ['ui_components', 'design_system'],
    willow: ['data_management', 'integration_support'],
    cipher: ['security_monitoring', 'access_control']
  },
  executive: {
    zoe: ['executive_insights', 'strategic_recommendations', 'kpi_dashboard']
  }
};

const COMMON_EVENTS = [
  { id: 'lead_created', label: 'Lead Created', icon: Target },
  { id: 'deal_updated', label: 'Deal Status Changed', icon: Activity },
  { id: 'document_uploaded', label: 'Document Uploaded', icon: FileText },
  { id: 'task_completed', label: 'Task Completed', icon: CheckCircle },
  { id: 'alert_triggered', label: 'Alert Triggered', icon: AlertCircle }
];

export default function MixedCollaborativeDashboard({ department, assistant, pillar }) {
  const sharedFunctions = useMemo(() => {
    if (!department || !assistant) return [];
    const deptFunctions = SHARED_FUNCTIONS[department.id] || {};
    return deptFunctions[assistant.id] || [];
  }, [department, assistant]);

  const relatedAssistants = useMemo(() => {
    if (!assistant?.dataFlows) return { inputs: [], outputs: [] };
    return {
      inputs: assistant.dataFlows.inputs?.map(id => AI_ASSISTANTS[id]).filter(Boolean) || [],
      outputs: assistant.dataFlows.outputs?.map(id => AI_ASSISTANTS[id]).filter(Boolean) || []
    };
  }, [assistant]);

  if (!department || !assistant) {
    return (
      <div className="no-selection">
        Select both a department and an AI assistant to view collaborative mode
      </div>
    );
  }

  return (
    <div className="mixed-dashboard">
      <div className="mixed-header">
        <div className="collaboration-visual">
          <div className="collab-entity dept" style={{ '--entity-color': department.color }}>
            <span className="entity-label">{department.label}</span>
            <span className="entity-type">Department</span>
          </div>
          <div className="collab-connector">
            <Link2 size={20} />
            <span>Collaborating</span>
          </div>
          <div className="collab-entity assistant" style={{ '--entity-color': assistant.color }}>
            <div className="entity-avatar">{assistant.avatar}</div>
            <span className="entity-label">{assistant.name}</span>
            <span className="entity-type">{assistant.title}</span>
          </div>
        </div>
      </div>

      <div className="mixed-stats">
        <div className="stat-card highlight">
          <Zap size={24} />
          <div className="stat-content">
            <span className="stat-value">{sharedFunctions.length}</span>
            <span className="stat-label">Shared Functions</span>
          </div>
        </div>
        <div className="stat-card">
          <Workflow size={20} />
          <div className="stat-content">
            <span className="stat-value">{relatedAssistants.inputs.length + relatedAssistants.outputs.length}</span>
            <span className="stat-label">Connected Assistants</span>
          </div>
        </div>
        <div className="stat-card">
          <Activity size={20} />
          <div className="stat-content">
            <span className="stat-value">Active</span>
            <span className="stat-label">Integration Status</span>
          </div>
        </div>
        <div className="stat-card">
          <Clock size={20} />
          <div className="stat-content">
            <span className="stat-value">Real-time</span>
            <span className="stat-label">Data Sync</span>
          </div>
        </div>
      </div>

      <div className="mixed-sections">
        <section className="shared-functions-section">
          <h2><Code size={18} /> Shared Functions & Features</h2>
          <p className="section-desc">
            Functions that {assistant.name} provides to the {department.label} department
          </p>
          <div className="functions-grid">
            {sharedFunctions.length > 0 ? (
              sharedFunctions.map((func, i) => (
                <div key={i} className="function-card">
                  <div className="function-icon" style={{ backgroundColor: `${assistant.color}15`, color: assistant.color }}>
                    <Zap size={16} />
                  </div>
                  <div className="function-content">
                    <span className="function-name">{func.replace(/_/g, ' ')}</span>
                    <span className="function-status">
                      <CheckCircle size={12} /> Enabled
                    </span>
                  </div>
                  <button className="function-action">
                    Configure
                  </button>
                </div>
              ))
            ) : (
              <div className="no-functions">
                <AlertCircle size={20} />
                <p>No shared functions defined between {department.label} and {assistant.name}</p>
                <button className="setup-btn">Setup Integration</button>
              </div>
            )}
          </div>
        </section>

        <section className="events-section">
          <h2><Activity size={18} /> Common Events</h2>
          <p className="section-desc">
            Events that trigger actions between this department and AI assistant
          </p>
          <div className="events-list">
            {COMMON_EVENTS.map(event => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="event-card">
                  <div className="event-icon">
                    <Icon size={16} />
                  </div>
                  <span className="event-label">{event.label}</span>
                  <span className="event-status active">Listening</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="data-flow-section">
        <h2><Database size={18} /> Data Flow Network</h2>
        <div className="flow-visualization">
          <div className="flow-column inputs">
            <h3>Data Sources</h3>
            {relatedAssistants.inputs.length > 0 ? (
              relatedAssistants.inputs.map(a => (
                <div key={a.id} className="flow-node" style={{ '--node-color': a.color }}>
                  <span className="node-avatar">{a.avatar}</span>
                  <span className="node-name">{a.name}</span>
                </div>
              ))
            ) : (
              <span className="no-flow">No input sources</span>
            )}
          </div>
          
          <div className="flow-column center">
            <div className="current-node" style={{ '--node-color': assistant.color }}>
              <span className="node-avatar">{assistant.avatar}</span>
              <span className="node-name">{assistant.name}</span>
              <span className="node-role">Processing</span>
            </div>
          </div>
          
          <div className="flow-column outputs">
            <h3>Outputs To</h3>
            {relatedAssistants.outputs.length > 0 ? (
              relatedAssistants.outputs.map(a => (
                <div key={a.id} className="flow-node" style={{ '--node-color': a.color }}>
                  <span className="node-avatar">{a.avatar}</span>
                  <span className="node-name">{a.name}</span>
                </div>
              ))
            ) : (
              <span className="no-flow">No outputs configured</span>
            )}
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <h2>Collaborative Actions</h2>
        <div className="actions-grid">
          <button className="action-btn primary">
            <MessageSquare size={18} />
            <span>Start Chat with {assistant.name}</span>
          </button>
          <button className="action-btn">
            <Target size={18} />
            <span>Assign Task</span>
          </button>
          <button className="action-btn">
            <BarChart3 size={18} />
            <span>View Reports</span>
          </button>
          <button className="action-btn">
            <Users size={18} />
            <span>Team Workflow</span>
          </button>
        </div>
      </section>
    </div>
  );
}
