import React, { useState } from 'react';
import { 
  Users, TrendingUp, DollarSign, Target, BarChart3,
  Phone, Mail, Calendar, Clock, CheckCircle, AlertCircle,
  ArrowUp, ArrowDown, Filter, Search, Plus, Eye
} from 'lucide-react';
import './AssistantDashboard.css';

const PIPELINE_STAGES = [
  { id: 'new', label: 'New Lead', count: 24, value: 'AED 45.2M' },
  { id: 'qualified', label: 'Qualified', count: 18, value: 'AED 38.5M' },
  { id: 'viewing', label: 'Property Viewing', count: 12, value: 'AED 28.1M' },
  { id: 'negotiation', label: 'Negotiation', count: 8, value: 'AED 22.4M' },
  { id: 'documentation', label: 'Documentation', count: 5, value: 'AED 15.8M' },
  { id: 'closing', label: 'Closing', count: 3, value: 'AED 9.2M' }
];

const DEALS = [
  { id: 1, property: 'Villa 348 - DAMAC Hills 2', client: 'Ahmed Al Rashid', value: 2500000, stage: 'negotiation', probability: 85, agent: 'Sarah Johnson', daysInStage: 5 },
  { id: 2, property: 'Apartment 1205 - Marina', client: 'James Wilson', value: 1800000, stage: 'viewing', probability: 60, agent: 'Mohammed Ali', daysInStage: 3 },
  { id: 3, property: 'Townhouse 56 - Springs', client: 'Maria Santos', value: 3200000, stage: 'documentation', probability: 95, agent: 'Aisha Khan', daysInStage: 2 },
  { id: 4, property: 'Penthouse 2501 - Downtown', client: 'Robert Chen', value: 8500000, stage: 'qualified', probability: 45, agent: 'Omar Malik', daysInStage: 7 },
  { id: 5, property: 'Villa 112 - Palm Jumeirah', client: 'Sophie Laurent', value: 12000000, stage: 'negotiation', probability: 75, agent: 'Sarah Johnson', daysInStage: 4 }
];

const AGENTS = [
  { id: 1, name: 'Sarah Johnson', deals: 8, value: 'AED 24.5M', conversion: 68, avatar: '👩‍💼' },
  { id: 2, name: 'Mohammed Ali', deals: 6, value: 'AED 18.2M', conversion: 55, avatar: '👨‍💼' },
  { id: 3, name: 'Aisha Khan', deals: 5, value: 'AED 15.8M', conversion: 72, avatar: '👩‍💻' },
  { id: 4, name: 'Omar Malik', deals: 4, value: 'AED 12.1M', conversion: 48, avatar: '👨‍💻' }
];

const SophiaSalesCRM = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedStage, setSelectedStage] = useState(null);

  return (
    <div className="assistant-dashboard sophia">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)' }}>
          <Users size={28} />
        </div>
        <div className="assistant-info">
          <h2>Sophia - Sales Pipeline Manager</h2>
          <p>Manages sales pipeline, lead assignments, deal tracking, and sales performance analytics</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Target size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">70</span>
            <span className="stat-label">Active Deals</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 12%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 159M</span>
            <span className="stat-label">Pipeline Value</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 8%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">62%</span>
            <span className="stat-label">Win Rate</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 5%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">18 days</span>
            <span className="stat-label">Avg. Cycle</span>
          </div>
          <span className="stat-change negative"><ArrowDown size={14} /> 3 days</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['pipeline', 'deals', 'agents', 'forecasting'].map(tab => (
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
        {activeTab === 'pipeline' && (
          <div className="pipeline-view">
            <div className="pipeline-stages">
              {PIPELINE_STAGES.map((stage, index) => (
                <div 
                  key={stage.id} 
                  className={`pipeline-stage ${selectedStage === stage.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStage(stage.id)}
                >
                  <div className="stage-header">
                    <span className="stage-name">{stage.label}</span>
                    <span className="stage-count">{stage.count}</span>
                  </div>
                  <div className="stage-value">{stage.value}</div>
                  <div className="stage-bar">
                    <div 
                      className="stage-fill" 
                      style={{ width: `${(stage.count / 24) * 100}%` }}
                    />
                  </div>
                  {index < PIPELINE_STAGES.length - 1 && <div className="stage-arrow">→</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="deals-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search deals..." />
              </div>
              <button className="add-btn"><Plus size={16} /> Add Deal</button>
            </div>
            <div className="deals-table">
              <div className="table-header">
                <span>Property</span>
                <span>Client</span>
                <span>Value</span>
                <span>Stage</span>
                <span>Probability</span>
                <span>Agent</span>
                <span>Actions</span>
              </div>
              {DEALS.map(deal => (
                <div key={deal.id} className="table-row">
                  <span className="property-name">{deal.property}</span>
                  <span>{deal.client}</span>
                  <span className="value">AED {(deal.value / 1000000).toFixed(1)}M</span>
                  <span className={`stage-badge ${deal.stage}`}>{deal.stage}</span>
                  <span className={`probability ${deal.probability >= 70 ? 'high' : deal.probability >= 50 ? 'medium' : 'low'}`}>
                    {deal.probability}%
                  </span>
                  <span>{deal.agent}</span>
                  <span className="actions">
                    <button className="action-btn"><Eye size={14} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="agents-view">
            <h3>Agent Performance</h3>
            <div className="agent-cards">
              {AGENTS.map(agent => (
                <div key={agent.id} className="agent-card">
                  <div className="agent-avatar">{agent.avatar}</div>
                  <div className="agent-info">
                    <h4>{agent.name}</h4>
                    <div className="agent-stats">
                      <span><Target size={12} /> {agent.deals} deals</span>
                      <span><DollarSign size={12} /> {agent.value}</span>
                      <span><TrendingUp size={12} /> {agent.conversion}% conv.</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="forecasting-view">
            <h3>Sales Forecast</h3>
            <div className="forecast-summary">
              <div className="forecast-card">
                <h4>This Month</h4>
                <div className="forecast-value">AED 28.5M</div>
                <div className="forecast-target">Target: AED 30M</div>
                <div className="forecast-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '95%' }} />
                  </div>
                  <span>95%</span>
                </div>
              </div>
              <div className="forecast-card">
                <h4>This Quarter</h4>
                <div className="forecast-value">AED 85.2M</div>
                <div className="forecast-target">Target: AED 100M</div>
                <div className="forecast-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '85%' }} />
                  </div>
                  <span>85%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SophiaSalesCRM;
