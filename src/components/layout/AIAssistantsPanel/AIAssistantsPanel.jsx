import React, { useState, useMemo } from 'react';
import {
  X, Search, Filter, Bell, MessageSquare, Settings, Play, Pause,
  ChevronRight, ChevronDown, Building2, Users, Target, Bot, Zap,
  Activity, TrendingUp, Home, Wallet, Megaphone, Briefcase, Shield,
  Server, Palette, Database, Star, Command, Scale, Eye, Clock
} from 'lucide-react';
import { getAllAssistants } from '../../../config/assistantRegistry';
import './AIAssistantsPanel.css';

const ICON_MAP = {
  MessageSquare, Building2, Target, Bot, Users, TrendingUp, Home,
  Wallet, Megaphone, Briefcase, Shield, Server, Palette, Database,
  Scale, Eye, Search, Zap, Activity, Clock, Command, Star
};

const AI_ASSISTANTS = getAllAssistants();

const getAssistantIcon = (assistantId) => {
  const iconMap = {
    linda: MessageSquare,
    nina: Bot,
    mary: Building2,
    nancy: Users,
    daisy: Home,
    sentinel: Eye,
    vesta: Activity,
    juno: Zap,
    clara: Target,
    sophia: TrendingUp,
    hunter: Search,
    kairos: Star,
    theodora: Wallet,
    maven: Briefcase,
    olivia: Megaphone,
    zoe: Command,
    laila: Shield,
    evangeline: Scale,
    aurora: Server,
    hazel: Palette,
    willow: Database,
    henry: Clock,
    cipher: Eye,
    atlas: Building2
  };
  return iconMap[assistantId] || Bot;
};

const AIAssistantsPanel = ({ 
  isOpen, 
  onClose, 
  onAssistantSelect,
  notifications = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedAssistant, setExpandedAssistant] = useState(null);

  const filteredAssistants = useMemo(() => {
    return AI_ASSISTANTS.filter(assistant => {
      const matchesSearch = searchQuery === '' || 
        assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assistant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assistant.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || assistant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const getNotificationCount = (assistantId) => {
    const assistantNotifs = notifications[assistantId] || [];
    return Array.isArray(assistantNotifs) ? assistantNotifs.filter(n => !n.isRead).length : 0;
  };

  const toggleExpand = (assistantId) => {
    setExpandedAssistant(expandedAssistant === assistantId ? null : assistantId);
  };

  const handleAssistantClick = (assistant) => {
    if (onAssistantSelect) {
      onAssistantSelect(assistant);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistants-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Command size={20} />
          <span>AI Assistants</span>
        </div>
        <button className="panel-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="panel-search">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="panel-filters">
        <button 
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All ({AI_ASSISTANTS.length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
          onClick={() => setStatusFilter('active')}
        >
          Active ({AI_ASSISTANTS.filter(a => a.status === 'active').length})
        </button>
        <button 
          className={`filter-btn ${statusFilter === 'idle' ? 'active' : ''}`}
          onClick={() => setStatusFilter('idle')}
        >
          Idle ({AI_ASSISTANTS.filter(a => a.status === 'idle').length})
        </button>
      </div>

      <div className="assistants-list">
        {filteredAssistants.length === 0 ? (
          <div className="no-results">
            <p>No assistants found</p>
          </div>
        ) : (
          filteredAssistants.map(assistant => {
            const Icon = getAssistantIcon(assistant.id);
            const notifCount = getNotificationCount(assistant.id);
            const isExpanded = expandedAssistant === assistant.id;
            
            return (
              <div 
                key={assistant.id} 
                className={`assistant-card ${isExpanded ? 'expanded' : ''}`}
              >
                <button 
                  className="assistant-main"
                  onClick={() => handleAssistantClick(assistant)}
                >
                  <div 
                    className="assistant-avatar"
                    style={{ background: assistant.color || '#D32F2F' }}
                  >
                    <Icon size={18} color="white" />
                  </div>
                  <div className="assistant-details">
                    <div className="assistant-name-row">
                      <span className="assistant-name">{assistant.name}</span>
                      <span className={`status-badge ${assistant.status}`}>
                        {assistant.status}
                      </span>
                    </div>
                    <span className="assistant-title">{assistant.title}</span>
                    <span className="assistant-dept">{assistant.department}</span>
                  </div>
                  {notifCount > 0 && (
                    <span className="notification-badge">{notifCount}</span>
                  )}
                  <button 
                    className="expand-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(assistant.id);
                    }}
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </button>

                {isExpanded && (
                  <div className="assistant-expanded">
                    <div className="capabilities-list">
                      {(assistant.capabilities || []).slice(0, 5).map((cap, idx) => (
                        <span key={idx} className="capability-tag">{cap}</span>
                      ))}
                    </div>
                    <div className="quick-actions">
                      <button 
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssistantClick(assistant);
                        }}
                      >
                        <MessageSquare size={14} />
                        Open
                      </button>
                      <button className="action-btn">
                        <Bell size={14} />
                        Alerts
                      </button>
                      <button className="action-btn">
                        <Settings size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="panel-footer">
        <div className="footer-stats">
          <span className="stat">
            <span className="stat-dot online" />
            {AI_ASSISTANTS.filter(a => a.status === 'active').length} Online
          </span>
          <span className="stat">
            <span className="stat-dot idle" />
            {AI_ASSISTANTS.filter(a => a.status === 'idle').length} Idle
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantsPanel;
