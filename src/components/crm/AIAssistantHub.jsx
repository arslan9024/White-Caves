import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users, MessageSquare, Database, Bot, Briefcase,
  ArrowRight, Activity, Zap, Clock, TrendingUp,
  ChevronRight, X, RefreshCw, Bell, Settings,
  Network, GitBranch, Layers, Target, Home,
  DollarSign, Megaphone, Shield, FileText, Users2,
  Star, AlertCircle
} from 'lucide-react';
import {
  selectAllAssistantsArray,
  selectUI,
  selectFavorites,
  selectRecentActivity,
  selectPerformance,
  selectCurrentAssistant,
  selectAssistant,
  addActivity,
  DEPARTMENT_COLORS
} from '../../store/slices/aiAssistantDashboardSlice';
import AIAssistantSelector from './AIAssistantSelector';
import './AIAssistantHub.css';

const ASSISTANT_ICONS = {
  linda: MessageSquare,
  mary: FileText,
  clara: Target,
  nina: Bot,
  nancy: Users2,
  theodora: DollarSign,
  olivia: Megaphone,
  zoe: Briefcase,
  laila: Shield,
  sophia: Users,
  daisy: Home
};

const FEATURE_FLOWS = [
  {
    id: 'whatsapp_lead_capture',
    name: 'WhatsApp Lead Capture',
    source: 'linda',
    target: 'clara',
    description: 'Qualified leads from WhatsApp conversations are automatically transferred to the Leads CRM',
    automationLevel: 'full'
  },
  {
    id: 'lead_property_matching',
    name: 'Lead Property Matching',
    source: 'clara',
    target: 'mary',
    description: 'AI matches qualified leads with suitable properties from the inventory',
    automationLevel: 'semi-auto'
  },
  {
    id: 'bot_conversation_routing',
    name: 'Bot Conversation Routing',
    source: 'nina',
    target: 'linda',
    description: 'Complex conversations from bots are escalated to human agents via Linda',
    automationLevel: 'full'
  },
  {
    id: 'sales_lead_handoff',
    name: 'Sales Lead Handoff',
    source: 'linda',
    target: 'sophia',
    description: 'Hot leads from WhatsApp are handed off to the sales pipeline',
    automationLevel: 'semi-auto'
  },
  {
    id: 'agent_assignment',
    name: 'Agent Assignment',
    source: 'clara',
    target: 'nancy',
    description: 'Leads are assigned to available agents based on HR availability data',
    automationLevel: 'full'
  },
  {
    id: 'financial_tracking',
    name: 'Deal Financial Tracking',
    source: 'sophia',
    target: 'theodora',
    description: 'Closed deals are synced to finance for invoicing and payment tracking',
    automationLevel: 'full'
  },
  {
    id: 'compliance_check',
    name: 'KYC Compliance Check',
    source: 'clara',
    target: 'laila',
    description: 'New leads undergo automated compliance and KYC verification',
    automationLevel: 'semi-auto'
  },
  {
    id: 'leasing_sync',
    name: 'Leasing Property Sync',
    source: 'mary',
    target: 'daisy',
    description: 'Available rental properties are synced to the leasing management system',
    automationLevel: 'full'
  }
];

const AIAssistantHub = ({ onSelectAssistant }) => {
  const dispatch = useDispatch();
  const assistants = useSelector(selectAllAssistantsArray);
  const ui = useSelector(selectUI);
  const favorites = useSelector(selectFavorites);
  const activities = useSelector(selectRecentActivity);
  const performance = useSelector(selectPerformance);
  const currentAssistant = useSelector(selectCurrentAssistant);
  
  const [activeView, setActiveView] = useState('overview');
  const [selectedFlow, setSelectedFlow] = useState(null);

  const handleAssistantClick = (assistantId) => {
    dispatch(selectAssistant(assistantId));
    dispatch(addActivity({
      assistantId: assistantId,
      action: 'Dashboard accessed',
      target: assistantId.charAt(0).toUpperCase() + assistantId.slice(1) + ' CRM',
      type: 'info'
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

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'active': return '#3B82F6';
      case 'pending': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'info': return '#6366F1';
      default: return '#64748B';
    }
  };

  const renderAssistantCard = (assistant) => {
    const Icon = ASSISTANT_ICONS[assistant.id] || Users;
    const isFavorite = favorites.includes(assistant.id);
    const isSelected = ui?.selectedAssistant === assistant.id;
    
    return (
      <div 
        key={assistant.id}
        className={`assistant-card ${isSelected ? 'active' : ''}`}
        style={{ '--assistant-color': assistant.colorScheme }}
        onClick={() => handleAssistantClick(assistant.id)}
      >
        <div className="assistant-header">
          <div className="assistant-avatar" style={{ background: assistant.colorScheme }}>
            <Icon size={24} />
          </div>
          <div className="assistant-info">
            <div className="name-row">
              <h3>{assistant.name}</h3>
              {isFavorite && <Star size={14} className="favorite-icon" fill="#F59E0B" color="#F59E0B" />}
            </div>
            <span className="assistant-role">{assistant.title}</span>
            <span className="assistant-department">{assistant.department}</span>
          </div>
          <div className="card-status">
            <span 
              className={`status-dot ${assistant.metrics.systemHealth}`}
              title={assistant.metrics.systemHealth}
            />
          </div>
        </div>
        
        <p className="assistant-description">{assistant.description}</p>
        
        <div className="assistant-stats">
          {assistant.quickStats && (
            <div className="stat-item highlight">
              <span className="stat-value">{assistant.quickStats.today.value}</span>
              <span className="stat-label">{assistant.quickStats.today.label}</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-value">{assistant.metrics.tasksCompleted}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{assistant.metrics.activeUsers}</span>
            <span className="stat-label">Users</span>
          </div>
        </div>
        
        <div className="assistant-capabilities">
          {assistant.capabilities.slice(0, 3).map(cap => (
            <span key={cap} className="capability-tag">
              {cap.replace(/_/g, ' ')}
            </span>
          ))}
          {assistant.capabilities.length > 3 && (
            <span className="capability-tag more">+{assistant.capabilities.length - 3}</span>
          )}
        </div>
        
        <div className="card-footer">
          <button className="open-btn">
            Open Dashboard
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderFeatureMapView = () => {
    return (
      <div className="feature-map-view">
        <div className="map-header">
          <Network size={20} />
          <h3>AI Feature Integration Map</h3>
          <span className="flow-count">{FEATURE_FLOWS.length} Active Flows</span>
        </div>
        
        <div className="flows-grid">
          {FEATURE_FLOWS.map(flow => {
            const SourceIcon = ASSISTANT_ICONS[flow.source] || Users;
            const TargetIcon = ASSISTANT_ICONS[flow.target] || Users;
            const sourceAssistant = assistants.find(a => a.id === flow.source);
            const targetAssistant = assistants.find(a => a.id === flow.target);
            
            return (
              <div 
                key={flow.id}
                className={`flow-card ${selectedFlow === flow.id ? 'selected' : ''}`}
                onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
              >
                <div className="flow-header">
                  <h4>{flow.name}</h4>
                  <span className={`automation-badge ${flow.automationLevel}`}>
                    {flow.automationLevel === 'full' ? 'Automated' : 'Semi-Auto'}
                  </span>
                </div>
                
                <div className="flow-visual">
                  <div className="flow-node source" style={{ background: sourceAssistant?.colorScheme }}>
                    <SourceIcon size={18} />
                    <span>{flow.source}</span>
                  </div>
                  <div className="flow-arrow">
                    <ArrowRight size={20} />
                  </div>
                  <div className="flow-node target" style={{ background: targetAssistant?.colorScheme }}>
                    <TargetIcon size={18} />
                    <span>{flow.target}</span>
                  </div>
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
        <span className="activity-count">{activities.length} recent</span>
      </div>
      
      <div className="activity-list">
        {activities.slice(0, 10).map(activity => {
          const Icon = ASSISTANT_ICONS[activity.assistantId] || Zap;
          const assistant = assistants.find(a => a.id === activity.assistantId);
          
          return (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-icon"
                style={{ background: assistant?.colorScheme || '#64748B' }}
              >
                <Icon size={14} />
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="assistant-name">{assistant?.name || activity.assistantId}</span>
                  <span className="activity-time">{formatTime(activity.timestamp)}</span>
                </div>
                <div className="activity-action">{activity.action}</div>
                <div className="activity-target">{activity.target}</div>
              </div>
              <div 
                className="activity-status"
                style={{ background: getStatusColor(activity.type) }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuickStats = () => (
    <div className="quick-stats-bar">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#3B82F6' }}>
          <Users size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{assistants.length}</span>
          <span className="stat-label">AI Assistants</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#10B981' }}>
          <Activity size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{assistants.filter(a => a.metrics.systemHealth === 'optimal').length}</span>
          <span className="stat-label">Active</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#8B5CF6' }}>
          <Zap size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{performance?.activeTasks || 0}</span>
          <span className="stat-label">Active Tasks</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#F59E0B' }}>
          <Star size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{favorites.length}</span>
          <span className="stat-label">Favorites</span>
        </div>
      </div>
      
      {performance?.criticalAlerts?.length > 0 && (
        <div className="stat-card alert">
          <div className="stat-icon" style={{ background: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{performance.criticalAlerts.length}</span>
            <span className="stat-label">Alerts</span>
          </div>
        </div>
      )}
    </div>
  );

  const groupedAssistants = useMemo(() => {
    return assistants.reduce((acc, assistant) => {
      const dept = assistant.department;
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(assistant);
      return acc;
    }, {});
  }, [assistants]);

  return (
    <div className="ai-assistant-hub">
      <div className="hub-header">
        <div className="header-left">
          <h1>AI Command Center</h1>
          <p>Unified dashboard for all AI assistants</p>
        </div>
        <div className="header-right">
          <AIAssistantSelector onSelectAssistant={onSelectAssistant} compact />
        </div>
      </div>
      
      {renderQuickStats()}
      
      <div className="hub-nav">
        <button 
          className={`nav-btn ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          <Layers size={16} />
          Overview
        </button>
        <button 
          className={`nav-btn ${activeView === 'features' ? 'active' : ''}`}
          onClick={() => setActiveView('features')}
        >
          <Network size={16} />
          Feature Map
        </button>
        <button 
          className={`nav-btn ${activeView === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveView('activity')}
        >
          <Activity size={16} />
          Activity
        </button>
      </div>
      
      <div className="hub-content">
        {activeView === 'overview' && (
          <div className="overview-view">
            {Object.entries(groupedAssistants).map(([department, deptAssistants]) => (
              <div key={department} className="department-section">
                <div className="department-header">
                  <h2>{department.charAt(0).toUpperCase() + department.slice(1)}</h2>
                  <span className="assistant-count">{deptAssistants.length} assistants</span>
                </div>
                <div className="assistants-grid">
                  {deptAssistants.map(assistant => renderAssistantCard(assistant))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeView === 'features' && renderFeatureMapView()}
        
        {activeView === 'activity' && renderActivityFeed()}
      </div>
    </div>
  );
};

export default AIAssistantHub;
