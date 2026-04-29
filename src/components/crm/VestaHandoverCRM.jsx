import React, { useState } from 'react';
import { 
  ClipboardCheck, Flag, Key, AlertCircle, Camera,
  Calendar, Users, CheckCircle, Clock, Building,
  ArrowUp, ArrowDown, Filter, Search, Plus, Eye, MessageSquare
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const MILESTONES = [
  { id: 1, project: 'Marina Vista Tower', milestone: 'Foundation Complete', date: '2024-01-15', status: 'completed', progress: 100 },
  { id: 2, project: 'Marina Vista Tower', milestone: 'Structure 50%', date: '2024-04-20', status: 'in_progress', progress: 65 },
  { id: 3, project: 'Business Bay Heights', milestone: 'External Facade', date: '2024-02-28', status: 'upcoming', progress: 0 },
  { id: 4, project: 'Creek Harbour Residences', milestone: 'MEP Installation', date: '2024-03-15', status: 'in_progress', progress: 45 },
  { id: 5, project: 'Palm Gateway', milestone: 'Interior Fit-out', date: '2024-05-01', status: 'upcoming', progress: 0 }
];

const SNAGGING_ITEMS = [
  { id: 1, unit: 'Unit 1205', issue: 'Paint scratches on master bedroom wall', severity: 'minor', status: 'reported', photo: true, developer: 'Emaar' },
  { id: 2, unit: 'Unit 1206', issue: 'AC not cooling properly', severity: 'major', status: 'in_progress', photo: true, developer: 'Emaar' },
  { id: 3, unit: 'Villa 234', issue: 'Missing kitchen cabinet handle', severity: 'minor', status: 'fixed', photo: true, developer: 'DAMAC' },
  { id: 4, unit: 'Unit 1208', issue: 'Water leak under bathroom sink', severity: 'critical', status: 'reported', photo: true, developer: 'Emaar' },
  { id: 5, unit: 'Villa 456', issue: 'Tile crack in living room', severity: 'minor', status: 'in_progress', photo: false, developer: 'DAMAC' }
];

const HANDOVERS = [
  { id: 1, unit: 'Unit 1210 - Marina Vista', client: 'Ahmed Al Rashid', date: '2024-01-25', time: '10:00 AM', status: 'scheduled', documents: 'complete' },
  { id: 2, unit: 'Villa 348 - DAMAC Hills', client: 'James Wilson', date: '2024-01-26', time: '2:00 PM', status: 'scheduled', documents: 'pending_signature' },
  { id: 3, unit: 'Unit 805 - Business Bay', client: 'Maria Santos', date: '2024-01-22', time: '11:00 AM', status: 'completed', documents: 'complete' },
  { id: 4, unit: 'Penthouse 2501', client: 'Robert Chen', date: '2024-02-01', time: '3:00 PM', status: 'scheduled', documents: 'pending' }
];

const VestaHandoverCRM = () => {
  const [activeTab, setActiveTab] = useState('milestones');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'fixed': return '#10B981';
      case 'in_progress': return '#3B82F6';
      case 'upcoming': case 'scheduled': return '#F59E0B';
      case 'reported': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'major': return '#F59E0B';
      case 'minor': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard vesta">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}>
          <ClipboardCheck size={28} />
        </div>
        <div className="assistant-info">
          <h2>Vesta - Project & Snagging Coordinator</h2>
          <p>Tracks construction milestones for off-plan buyers, automates developer communication, and manages digital snagging with image recognition</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.2)', color: '#F97316' }}>
            <Flag size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">45</span>
            <span className="stat-label">Active Projects</span>
          </div>
          <span className="stat-change positive">12 on track</span>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">28</span>
            <span className="stat-label">Open Snags</span>
          </div>
          <span className="stat-change warning">5 critical</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Key size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Handovers This Week</span>
          </div>
          <span className="stat-change positive">4 tomorrow</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">94%</span>
            <span className="stat-label">Resolution Rate</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 3%</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['milestones', 'snagging', 'handovers', 'developer', 'docs'].map(tab => (
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
        {activeTab === 'milestones' && (
          <div className="milestones-view">
            <div className="view-header">
              <h3>Construction Milestones</h3>
              <select>
                <option value="all">All Projects</option>
                <option value="marina">Marina Vista Tower</option>
                <option value="business">Business Bay Heights</option>
              </select>
            </div>
            <div className="milestones-timeline">
              {MILESTONES.map(milestone => (
                <div key={milestone.id} className="milestone-card">
                  <div className="milestone-status" style={{ background: getStatusColor(milestone.status) }} />
                  <div className="milestone-content">
                    <div className="milestone-header">
                      <h4>{milestone.milestone}</h4>
                      <span className="milestone-project">{milestone.project}</span>
                    </div>
                    <div className="milestone-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${milestone.progress}%` }} />
                      </div>
                      <span>{milestone.progress}%</span>
                    </div>
                    <div className="milestone-meta">
                      <span><Calendar size={12} /> {milestone.date}</span>
                      <span className={`status ${milestone.status}`}>{milestone.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'snagging' && (
          <div className="snagging-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search snags..." />
              </div>
              <button className="add-btn"><Plus size={16} /> Report Snag</button>
            </div>
            <div className="snagging-list">
              {SNAGGING_ITEMS.map(snag => (
                <div key={snag.id} className="snag-card">
                  <div className="snag-severity" style={{ background: getSeverityColor(snag.severity) }} />
                  <div className="snag-content">
                    <div className="snag-header">
                      <h4>{snag.unit}</h4>
                      <span className="snag-developer">{snag.developer}</span>
                    </div>
                    <p className="snag-issue">{snag.issue}</p>
                    <div className="snag-meta">
                      <span className="severity-badge" style={{ color: getSeverityColor(snag.severity) }}>
                        {snag.severity}
                      </span>
                      <span className="status-badge" style={{ color: getStatusColor(snag.status) }}>
                        {snag.status.replace('_', ' ')}
                      </span>
                      {snag.photo && <span className="photo-badge"><Camera size={12} /> Photo</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'handovers' && (
          <div className="handovers-view">
            <div className="view-header">
              <h3>Scheduled Handovers</h3>
              <button className="add-btn"><Plus size={16} /> Schedule Handover</button>
            </div>
            <div className="handovers-list">
              {HANDOVERS.map(handover => (
                <div key={handover.id} className="handover-card">
                  <div className="handover-icon" style={{ background: getStatusColor(handover.status) + '20' }}>
                    <Key size={24} style={{ color: getStatusColor(handover.status) }} />
                  </div>
                  <div className="handover-content">
                    <h4>{handover.unit}</h4>
                    <p className="handover-client"><Users size={14} /> {handover.client}</p>
                    <div className="handover-meta">
                      <span><Calendar size={12} /> {handover.date}</span>
                      <span><Clock size={12} /> {handover.time}</span>
                    </div>
                  </div>
                  <div className="handover-status">
                    <span className={`status ${handover.status}`}>{handover.status}</span>
                    <span className={`docs ${handover.documents}`}>Docs: {handover.documents.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'developer' && (
          <div className="developer-view">
            <h3>Developer Communications</h3>
            <div className="empty-state">
              <MessageSquare size={48} />
              <p>Automated developer updates will appear here</p>
              <button className="add-btn"><Plus size={16} /> New Message</button>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="vesta" 
            assistantName="Vesta" 
            assistantColor="#F97316" 
          />
        )}
      </div>
    </div>
  );
};

export default VestaHandoverCRM;
