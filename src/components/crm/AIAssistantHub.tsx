// FILE: src/components/crm/AIAssistantHub.tsx
/**
 * White Caves Real Estate LLC - AI Assistant Hub
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Users,
  Bot,
  Activity,
  Zap,
  ChevronRight,
  AlertCircle,
  Network,
  Layers,
  Star,
} from 'lucide-react';
import type { AIAssistant } from '../../store/slices/aiAssistant/types';
import {
  selectAllAssistantsArray,
  selectUI,
  selectFavorites,
  selectRecentActivity,
  selectPerformance,
  selectAssistant,
  addActivity,
} from '../../store/slices/aiAssistantDashboardSlice';
import {
  ASSISTANT_PROGRESS_SUMMARY,
  ASSISTANT_SEQUENCE_PLAN,
} from '../../config/assistantImplementationProgress';
import { ASSISTANT_ICONS } from './AIAssistantHub.data';
import {
  AIAssistantFeatureMapView,
  AIAssistantActivityFeedView,
  AIAssistantQuickStatsView,
} from './AIAssistantFeatureMap';
import './AIAssistantHub.css';

interface AIAssistantHubProps {
  onSelectAssistant?: (assistantId: string) => void;
}

const AIAssistantHub = ({ onSelectAssistant }: AIAssistantHubProps) => {
  const dispatch = useDispatch();
  const assistants = useSelector(selectAllAssistantsArray);
  const ui = useSelector(selectUI);
  const favorites = useSelector(selectFavorites);
  const activities = useSelector(selectRecentActivity);
  const performance = useSelector(selectPerformance);
  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  const handleAssistantClick = (assistantId: string): void => {
    dispatch(selectAssistant(assistantId));
    dispatch(
      addActivity({
        assistantId: assistantId,
        action: 'Dashboard accessed',
        target: assistantId.charAt(0).toUpperCase() + assistantId.slice(1) + ' CRM',
        type: 'info',
      })
    );
    if (onSelectAssistant) {
      onSelectAssistant(assistantId);
    }
  };

  const formatTime = (timestamp: string | number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (type: string): string => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'active':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      case 'info':
        return '#6366F1';
      default:
        return '#64748B';
    }
  };

  const renderAssistantCard = (assistant: AIAssistant) => {
    const Icon = ASSISTANT_ICONS[assistant.id] || Users;
    const isFavorite = favorites.includes(assistant.id);
    const isSelected = ui?.selectedAssistant === assistant.id;

    return (
      <div
        key={assistant.id}
        className={`assistant-card ${isSelected ? 'active' : ''}`}
        style={{ '--assistant-color': assistant.colorScheme } as React.CSSProperties}
        onClick={() => handleAssistantClick(assistant.id)}
      >
        <div className="assistant-header">
          <div className="assistant-avatar" style={{ background: assistant.colorScheme }}>
            <Icon size={24} />
          </div>
          <div className="assistant-info">
            <div className="name-row">
              <h3>{assistant.name}</h3>
              {isFavorite && (
                <Star size={14} className="favorite-icon" fill="#F59E0B" color="#F59E0B" />
              )}
            </div>
            <span className="assistant-role">{assistant.title}</span>
            <span className="assistant-department">{assistant.department}</span>
          </div>
          <div className="card-status">
            <span
              className={`status-dot ${assistant.metrics.systemHealth}`}
              title={String(assistant.metrics.systemHealth)}
            />
          </div>
        </div>

        <p className="assistant-description">{assistant.description}</p>

        <div className="assistant-stats">
          {assistant.quickStats && (
            <div className="stat-item highlight">
              <span className="stat-value">
                {String((assistant.quickStats as unknown as Record<string, unknown>)?.value ?? '')}
              </span>
              <span className="stat-label">
                {String((assistant.quickStats as unknown as Record<string, unknown>)?.label ?? '')}
              </span>
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

  const renderFeatureMapView = () => (
    <AIAssistantFeatureMapView
      assistants={assistants}
      selectedFlow={selectedFlow}
      onSelectFlow={setSelectedFlow}
    />
  );

  const renderActivityFeed = () => (
    <AIAssistantActivityFeedView
      activities={activities}
      assistants={assistants}
      formatTime={formatTime}
      getStatusColor={getStatusColor}
    />
  );

  const renderQuickStats = () => (
    <AIAssistantQuickStatsView
      assistantsCount={assistants.length}
      activeTasks={performance?.activeTasks || 0}
      criticalAlertsCount={performance?.criticalAlerts?.length || 0}
    />
  );

  const renderImplementationSequence = () => (
    <div className="department-section">
      <div className="department-header">
        <h2>Implementation Sequence</h2>
        <span className="assistant-count">{ASSISTANT_SEQUENCE_PLAN.length} pending</span>
      </div>
      <div className="assistants-grid">
        {ASSISTANT_SEQUENCE_PLAN.map((assistantId, index) => {
          const assistant = assistants.find(item => item.id === assistantId);
          return (
            <div key={assistantId} className="assistant-card">
              <div className="assistant-header">
                <div
                  className="assistant-avatar"
                  style={{ background: assistant?.colorScheme || 'var(--primary-color, #E31E24)' }}
                >
                  {index + 1}
                </div>
                <div className="assistant-info">
                  <div className="name-row">
                    <h3>{assistant?.name || assistantId}</h3>
                  </div>
                  <span className="assistant-role">
                    {assistant?.title || 'Assistant upgrade pending'}
                  </span>
                  <span className="assistant-department">{assistant?.department || 'unknown'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const groupedAssistants = useMemo(() => {
    return assistants.reduce<Record<string, AIAssistant[]>>((acc, assistant) => {
      const dept = assistant.department;
      // eslint-disable-next-line security/detect-object-injection
      if (!acc[dept]) acc[dept] = [];
      // eslint-disable-next-line security/detect-object-injection
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
            {renderImplementationSequence()}
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
