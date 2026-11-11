// FILE: src/components/crm/AIAssistantFeatureMap.tsx
/**
 * White Caves Real Estate LLC - AI Assistant Hub Feature Map & Feed Sub-Views
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { Network, ArrowRight, Activity, Zap, Users, AlertCircle } from 'lucide-react';
import type { AIAssistant } from '../../store/slices/aiAssistant/types';
import { ASSISTANT_ICONS, FEATURE_FLOWS } from './AIAssistantHub.data';
import { ASSISTANT_PROGRESS_SUMMARY } from '../../config/assistantImplementationProgress';

export interface AIAssistantFeatureMapViewProps {
  assistants: AIAssistant[];
  selectedFlow: string | null;
  onSelectFlow: (flowId: string | null) => void;
}

export const AIAssistantFeatureMapView: FC<AIAssistantFeatureMapViewProps> = ({
  assistants,
  selectedFlow,
  onSelectFlow,
}) => {
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
              onClick={() => onSelectFlow(selectedFlow === flow.id ? null : flow.id)}
            >
              <div className="flow-header">
                <h4>{flow.name}</h4>
                <span className={`automation-badge ${flow.automationLevel}`}>
                  {flow.automationLevel === 'full' ? 'Automated' : 'Semi-Auto'}
                </span>
              </div>

              <div className="flow-visual">
                <div
                  className="flow-node source"
                  style={{ background: sourceAssistant?.colorScheme }}
                >
                  <SourceIcon size={18} />
                  <span>{flow.source}</span>
                </div>
                <div className="flow-arrow">
                  <ArrowRight size={20} />
                </div>
                <div
                  className="flow-node target"
                  style={{ background: targetAssistant?.colorScheme }}
                >
                  <TargetIcon size={18} />
                  <span>{flow.target}</span>
                </div>
              </div>

              {selectedFlow === flow.id && <p className="flow-description">{flow.description}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface AIAssistantActivityFeedViewProps {
  activities: any[];
  assistants: AIAssistant[];
  formatTime: (ts: string) => string;
  getStatusColor: (type: string) => string;
}

export const AIAssistantActivityFeedView: FC<AIAssistantActivityFeedViewProps> = ({
  activities,
  assistants,
  formatTime,
  getStatusColor,
}) => (
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
              style={{ background: assistant?.colorScheme || 'var(--text-secondary)' }}
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

export interface AIAssistantQuickStatsViewProps {
  assistantsCount: number;
  activeTasks: number;
  criticalAlertsCount: number;
}

export const AIAssistantQuickStatsView: FC<AIAssistantQuickStatsViewProps> = ({
  assistantsCount,
  activeTasks,
  criticalAlertsCount,
}) => (
  <div className="quick-stats-bar">
    <div className="stat-card">
      <div className="stat-icon" style={{ background: 'var(--primary-color)' }}>
        <Users size={20} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{assistantsCount}</span>
        <span className="stat-label">AI Assistants</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon" style={{ background: 'var(--green-500, #10B981)' }}>
        <Activity size={20} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{ASSISTANT_PROGRESS_SUMMARY.complete}</span>
        <span className="stat-label">Complete</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon" style={{ background: 'var(--error-color, #EF4444)' }}>
        <AlertCircle size={20} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{ASSISTANT_PROGRESS_SUMMARY.incomplete}</span>
        <span className="stat-label">Incomplete</span>
      </div>
    </div>

    <div className="stat-card">
      <div className="stat-icon" style={{ background: 'var(--accent-color, #8B5CF6)' }}>
        <Zap size={20} />
      </div>
      <div className="stat-info">
        <span className="stat-value">{activeTasks}</span>
        <span className="stat-label">Active Tasks</span>
      </div>
    </div>

    {criticalAlertsCount > 0 && (
      <div className="stat-card alert">
        <div className="stat-icon" style={{ background: 'var(--error-color, #EF4444)' }}>
          <AlertCircle size={20} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{criticalAlertsCount}</span>
          <span className="stat-label">Alerts</span>
        </div>
      </div>
    )}
  </div>
);
