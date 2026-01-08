import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users, MessageSquare, Database, Bot, Briefcase,
  ArrowRight, Activity, Zap, Clock, TrendingUp,
  ChevronRight, X, RefreshCw, Bell, Settings,
  Network, GitBranch, Layers
} from 'lucide-react';
import {
  selectAllAssistants,
  selectActivities,
  selectStats,
  selectFeatureMap,
  selectNotifications,
  setActiveAssistant,
  addActivity,
  selectActiveAssistant
} from '../../store/slices/aiAssistantsSlice';
import './AIAssistantHub.css';

const ASSISTANT_ICONS = {
  linda: MessageSquare,
  mary: Database,
  clara: Users,
  nina: Bot,
  nancy: Briefcase
};

const AIAssistantHub = ({ onSelectAssistant }) => {
  const dispatch = useDispatch();
  const assistants = useSelector(selectAllAssistants);
  const activities = useSelector(selectActivities);
  const stats = useSelector(selectStats);
  const featureMap = useSelector(selectFeatureMap);
  const notifications = useSelector(selectNotifications);
  const activeAssistant = useSelector(selectActiveAssistant);
  
  const [activeView, setActiveView] = useState('overview');
  const [selectedFlow, setSelectedFlow] = useState(null);

  const handleAssistantClick = (assistantId) => {
    dispatch(setActiveAssistant(assistantId));
    dispatch(addActivity({
      assistant: assistantId,
      action: 'Dashboard accessed',
      target: assistantId.charAt(0).toUpperCase() + assistantId.slice(1) + ' CRM',
      status: 'success'
    }));
    if (onSelectAssistant) {
      onSelectAssistant(assistantId);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--status-success)';
      case 'active': return 'var(--status-info)';
      case 'pending': return 'var(--status-warning)';
      case 'error': return 'var(--status-error)';
      default: return 'var(--text-muted)';
    }
  };

  const renderAssistantCard = (assistant) => {
    const Icon = ASSISTANT_ICONS[assistant.id];
    const assistantStats = stats[assistant.id];
    
    return (
      <div 
        key={assistant.id}
        className={`assistant-card ${activeAssistant === assistant.id ? 'active' : ''}`}
        style={{ '--assistant-color': assistant.color }}
        onClick={() => handleAssistantClick(assistant.id)}
      >
        <div className="assistant-header">
          <div className="assistant-avatar" style={{ background: assistant.color }}>
            <Icon size={24} />
          </div>
          <div className="assistant-info">
            <h3>{assistant.name}</h3>
            <span className="assistant-role">{assistant.role}</span>
          </div>
          <ChevronRight size={20} className="card-arrow" />
        </div>
        
        <p className="assistant-description">{assistant.description}</p>
        
        <div className="assistant-stats">
          {assistantStats && Object.entries(assistantStats).slice(0, 3).map(([key, value]) => (
            <div key={key} className="stat-item">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
        
        <div className="assistant-capabilities">
          {assistant.capabilities.slice(0, 3).map(cap => (
            <span key={cap} className="capability-tag">
              {cap.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderFeatureMapView = () => {
    const flows = Object.values(featureMap);
    
    return (
      <div className="feature-map-view">
        <div className="map-header">
          <Network size={20} />
          <h3>AI Feature Integration Map</h3>
        </div>
        
        <div className="flow-diagram">
          {assistants.map(assistant => {
            const Icon = ASSISTANT_ICONS[assistant.id];
            const outgoingFlows = flows.filter(f => f.sourceAssistant === assistant.id);
            
            return (
              <div key={assistant.id} className="flow-node">
                <div 
                  className="node-circle"
                  style={{ background: assistant.color }}
                >
                  <Icon size={20} />
                </div>
                <span className="node-label">{assistant.name}</span>
                {outgoingFlows.length > 0 && (
                  <div className="node-badge">{outgoingFlows.length}</div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flow-connections">
          <h4><GitBranch size={16} /> Data Flow Connections</h4>
          {flows.map(flow => {
            const sourceAssistant = assistants.find(a => a.id === flow.sourceAssistant);
            const targetAssistant = assistants.find(a => a.id === flow.targetAssistant);
            
            return (
              <div 
                key={flow.id} 
                className={`flow-item ${selectedFlow === flow.id ? 'selected' : ''}`}
                onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
              >
                <div className="flow-endpoints">
                  <span 
                    className="flow-source"
                    style={{ color: sourceAssistant?.color }}
                  >
                    {sourceAssistant?.name}
                  </span>
                  <ArrowRight size={16} />
                  <span 
                    className="flow-target"
                    style={{ color: targetAssistant?.color }}
                  >
                    {targetAssistant?.name}
                  </span>
                </div>
                <div className="flow-details">
                  <span className="flow-name">{flow.name}</span>
                  <span className={`flow-level level-${flow.automationLevel}`}>
                    {flow.automationLevel}
                  </span>
                </div>
                {selectedFlow === flow.id && (
                  <p className="flow-description">{flow.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderActivityFeed = () => (
    <div className="activity-feed">
      <div className="feed-header">
        <Activity size={18} />
        <h3>Live Activity Feed</h3>
        <button className="refresh-btn" onClick={() => {
          dispatch(addActivity({
            assistant: 'linda',
            action: 'System refreshed',
            target: 'All assistants',
            status: 'success'
          }));
        }}>
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="activity-list">
        {activities.slice(0, 10).map(activity => {
          const assistant = assistants.find(a => a.id === activity.assistant);
          const Icon = ASSISTANT_ICONS[activity.assistant];
          
          return (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ background: assistant?.color }}
              >
                <Icon size={14} />
              </div>
              <div className="activity-content">
                <div className="activity-main">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-target">{activity.target}</span>
                </div>
                <div className="activity-meta">
                  <Clock size={12} />
                  <span>{formatTime(activity.timestamp)}</span>
                  <span 
                    className="activity-status"
                    style={{ color: getStatusColor(activity.status) }}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuickStats = () => {
    const totalLeads = stats.clara?.totalLeads || 0;
    const totalProperties = stats.mary?.totalProperties || 0;
    const conversations = stats.linda?.conversations || 0;
    const employees = stats.nancy?.employees || 0;
    
    return (
      <div className="quick-stats">
        <div className="quick-stat">
          <TrendingUp size={20} />
          <div>
            <span className="stat-number">{totalLeads}</span>
            <span className="stat-text">Active Leads</span>
          </div>
        </div>
        <div className="quick-stat">
          <Database size={20} />
          <div>
            <span className="stat-number">{totalProperties.toLocaleString()}</span>
            <span className="stat-text">Properties</span>
          </div>
        </div>
        <div className="quick-stat">
          <MessageSquare size={20} />
          <div>
            <span className="stat-number">{conversations}</span>
            <span className="stat-text">Conversations</span>
          </div>
        </div>
        <div className="quick-stat">
          <Users size={20} />
          <div>
            <span className="stat-number">{employees}</span>
            <span className="stat-text">Team Members</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ai-assistant-hub">
      <div className="hub-header">
        <div className="hub-title">
          <Layers size={24} />
          <div>
            <h2>AI Assistant Command Center</h2>
            <p>Owner-exclusive access to all AI-powered CRM systems</p>
          </div>
        </div>
        
        <div className="hub-actions">
          <div className="view-tabs">
            <button 
              className={activeView === 'overview' ? 'active' : ''}
              onClick={() => setActiveView('overview')}
            >
              Overview
            </button>
            <button 
              className={activeView === 'map' ? 'active' : ''}
              onClick={() => setActiveView('map')}
            >
              Feature Map
            </button>
          </div>
          
          <button className="notifications-btn">
            <Bell size={18} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notif-badge">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {renderQuickStats()}
      
      {activeView === 'overview' ? (
        <div className="hub-content">
          <div className="assistants-grid">
            {assistants.map(renderAssistantCard)}
          </div>
          {renderActivityFeed()}
        </div>
      ) : (
        renderFeatureMapView()
      )}
    </div>
  );
};

export default AIAssistantHub;
