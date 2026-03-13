import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Search, Calendar, Clock, Play, Pause, CheckCircle, 
  AlertCircle, RefreshCw, Settings, ChevronDown, ChevronUp,
  FileText, TrendingUp, Send, Zap
} from 'lucide-react';
import { addExecutiveSuggestion } from '../../../store/slices/aiAssistantDashboardSlice';

const RESEARCH_TEMPLATES = {
  clara: {
    name: 'Clara',
    department: 'sales',
    topics: [
      'Lead conversion tools and CRM automation',
      'Sales pipeline optimization strategies',
      'Dubai real estate buyer behavior trends',
      'Competitor pricing analysis'
    ]
  },
  olivia: {
    name: 'Olivia',
    department: 'marketing',
    topics: [
      'Real estate marketing trends UAE',
      'Social media engagement strategies',
      'Content performance benchmarks',
      'Competitor advertising analysis'
    ]
  },
  nancy: {
    name: 'Nancy',
    department: 'operations',
    topics: [
      'HR technology and automation tools',
      'UAE job market trends',
      'Employee engagement best practices',
      'Remote work policies in real estate'
    ]
  },
  theodora: {
    name: 'Theodora',
    department: 'finance',
    topics: [
      'Payment processing innovations',
      'Cash flow optimization strategies',
      'Real estate financing trends UAE',
      'Invoice automation tools'
    ]
  },
  laila: {
    name: 'Laila',
    department: 'compliance',
    topics: [
      'UAE real estate regulations updates',
      'KYC/AML best practices',
      'RERA compliance requirements',
      'Dubai Land Department policies'
    ]
  },
  mary: {
    name: 'Mary',
    department: 'operations',
    topics: [
      'Inventory management automation',
      'Property data accuracy tools',
      'Developer portal integrations',
      'Off-plan property tracking systems'
    ]
  },
  linda: {
    name: 'Linda',
    department: 'communications',
    topics: [
      'WhatsApp Business API updates',
      'Customer messaging automation',
      'Chatbot conversation optimization',
      'Multi-channel communication tools'
    ]
  },
  nina: {
    name: 'Nina',
    department: 'communications',
    topics: [
      'Customer service automation trends',
      'Support ticket management tools',
      'FAQ chatbot improvements',
      'Customer satisfaction benchmarks'
    ]
  }
};

const SCHEDULE_OPTIONS = [
  { value: 'weekly', label: 'Weekly', days: 7 },
  { value: 'biweekly', label: 'Bi-Weekly', days: 14 },
  { value: 'monthly', label: 'Monthly', days: 30 }
];

const WeeklyResearchModule = ({ 
  assistantId = 'clara',
  lastResearch = null,
  schedule = 'weekly',
  isActive = true,
  onScheduleChange,
  onToggle,
  compact = false
}) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState(
    RESEARCH_TEMPLATES[assistantId]?.topics || []
  );
  
  const template = RESEARCH_TEMPLATES[assistantId] || RESEARCH_TEMPLATES.clara;
  
  const getNextResearchDate = useCallback(() => {
    if (!lastResearch) return 'Not scheduled';
    const lastDate = new Date(lastResearch);
    const scheduleOption = SCHEDULE_OPTIONS.find(s => s.value === schedule);
    const nextDate = new Date(lastDate.getTime() + (scheduleOption?.days || 7) * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = nextDate - now;
    if (diff < 0) return 'Overdue';
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `In ${days}d ${hours}h`;
    return `In ${hours}h`;
  }, [lastResearch, schedule]);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleRunResearch = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      const suggestionTypes = ['process_improvement', 'new_opportunity', 'cost_saving', 'risk_alert'];
      const priorities = ['low', 'medium', 'high'];
      
      dispatch(addExecutiveSuggestion({
        fromAssistant: assistantId,
        assistantDepartment: template.department,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        type: suggestionTypes[Math.floor(Math.random() * suggestionTypes.length)],
        title: `${template.name}'s Weekly Research Finding`,
        analysis: `Automated research completed on ${selectedTopics.length} topics. Key insights identified for strategic review.`,
        dataPoints: selectedTopics.slice(0, 2).map(t => `Research: ${t}`),
        projectedImpact: 'Strategic insight for executive review',
        confidence: 0.7 + Math.random() * 0.25
      }));
    }, 2000);
  }, [dispatch, assistantId, template, selectedTopics]);

  const toggleTopic = useCallback((topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  }, []);

  if (compact && !isExpanded) {
    return (
      <div className="research-module compact" onClick={() => setIsExpanded(true)}>
        <div className="compact-header">
          <Search size={14} />
          <span>Weekly Research</span>
          <span className={`status-badge ${isActive ? 'active' : 'paused'}`}>
            {isActive ? 'Active' : 'Paused'}
          </span>
          <ChevronDown size={14} />
        </div>
      </div>
    );
  }

  return (
    <div className="research-module">
      <div className="module-header" onClick={() => compact && setIsExpanded(!isExpanded)}>
        <div className="header-left">
          <Search size={18} className="module-icon" />
          <div className="header-text">
            <h4>Weekly Research Module</h4>
            <span className="subtitle">Automated intelligence gathering for {template.name}</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            className={`toggle-btn ${isActive ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          {compact && (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
        </div>
      </div>

      <div className="module-content">
        <div className="schedule-section">
          <div className="schedule-info">
            <div className="info-item">
              <Calendar size={14} />
              <span className="label">Schedule:</span>
              <select 
                value={schedule} 
                onChange={(e) => onScheduleChange?.(e.target.value)}
                className="schedule-select"
              >
                {SCHEDULE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="info-item">
              <Clock size={14} />
              <span className="label">Last Run:</span>
              <span className="value">{formatTimeAgo(lastResearch)}</span>
            </div>
            <div className="info-item">
              <Zap size={14} />
              <span className="label">Next Run:</span>
              <span className="value">{getNextResearchDate()}</span>
            </div>
          </div>
        </div>

        <div className="topics-section">
          <div className="topics-header">
            <FileText size={14} />
            <span>Research Topics</span>
            <span className="topic-count">{selectedTopics.length} selected</span>
          </div>
          <div className="topics-list">
            {template.topics.map(topic => (
              <div 
                key={topic} 
                className={`topic-item ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                onClick={() => toggleTopic(topic)}
              >
                <span className="topic-checkbox">
                  {selectedTopics.includes(topic) ? <CheckCircle size={12} /> : null}
                </span>
                <span className="topic-text">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-section">
          <button 
            className={`action-btn primary ${isRunning ? 'running' : ''}`}
            onClick={handleRunResearch}
            disabled={isRunning || selectedTopics.length === 0}
          >
            {isRunning ? (
              <>
                <RefreshCw size={14} className="spinning" />
                Researching...
              </>
            ) : (
              <>
                <Search size={14} />
                Run Research Now
              </>
            )}
          </button>
          <button className="action-btn secondary">
            <Send size={14} />
            Send to Zoe
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyResearchModule;
