/**
 * RightPanelContainer - AI Assistants Panel
 * 
 * Features:
 * - Desktop: Floating right panel (360px)
 * - Tablet: Docking panel (300px)
 * - Mobile: Bottom drawer (slides up)
 * - Search, filter, grouping
 * - AI assistant selection
 * - Keyboard shortcut: Cmd+A / Ctrl+A
 */

import React, { useState, useMemo } from 'react';
import {
  X, Search, Filter, ChevronDown, ChevronRight, Bot
} from 'lucide-react';
import { getAllAssistants } from '../../../config/assistantRegistry';
import './RightPanelContainer.css';

const RightPanelContainer = ({
  isOpen = false,
  onClose = () => {},
  onAssistantSelect = () => {},
  notifications = {},
  isMobile = false,
  isTablet = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    crm: true,
    operations: true,
    technical: false
  });

  const allAssistants = useMemo(() => getAllAssistants(), []);

  // Group assistants by function
  const groupedAssistants = useMemo(() => {
    const groups = {
      crm: {
        label: 'CRM Assistants',
        assistants: allAssistants.filter(a => ['clara', 'sophia', 'mary', 'linda'].includes(a.id))
      },
      operations: {
        label: 'Operations',
        assistants: allAssistants.filter(a => ['nancy', 'daisy', 'theodora'].includes(a.id))
      },
      technical: {
        label: 'Technical',
        assistants: allAssistants.filter(a => ['zoe', 'laila', 'aurora', 'hazel', 'willow'].includes(a.id))
      }
    };
    return groups;
  }, [allAssistants]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Filter assistants by search
  const filteredAssistants = useMemo(() => {
    if (!searchTerm) return groupedAssistants;

    const term = searchTerm.toLowerCase();
    const filtered = {};

    Object.entries(groupedAssistants).forEach(([groupId, group]) => {
      filtered[groupId] = {
        ...group,
        assistants: group.assistants.filter(a =>
          a.name.toLowerCase().includes(term) ||
          a.description.toLowerCase().includes(term)
        )
      };
    });

    return filtered;
  }, [groupedAssistants, searchTerm]);

  if (!isOpen && !isMobile) return null;

  return (
    <div className={`right-panel-container ${isMobile ? 'mobile-drawer' : ''} ${isTablet ? 'tablet-dock' : 'desktop-float'}`}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title">
          <Bot size={20} />
          <span>AI Assistants</span>
        </div>
        <button
          className="panel-close"
          onClick={onClose}
          title="Close (Esc)"
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="panel-search">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search assistants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Assistant List */}
      <div className="panel-content">
        {Object.entries(filteredAssistants).map(([groupId, group]) => {
          if (group.assistants.length === 0) return null;

          return (
            <div key={groupId} className="assistant-group">
              {/* Group Header */}
              <button
                className={`group-header ${expandedGroups[groupId] ? 'expanded' : ''}`}
                onClick={() => toggleGroup(groupId)}
              >
                <span>{group.label}</span>
                <ChevronRight
                  size={16}
                  className={`toggle-icon ${expandedGroups[groupId] ? 'rotated' : ''}`}
                />
              </button>

              {/* Assistants in Group */}
              {expandedGroups[groupId] && (
                <div className="group-assistants">
                  {group.assistants.map(assistant => (
                    <button
                      key={assistant.id}
                      className="assistant-item"
                      onClick={() => {
                        onAssistantSelect(assistant);
                      }}
                      title={assistant.description}
                    >
                      <div className="assistant-avatar">
                        {assistant.emoji || '🤖'}
                      </div>
                      <div className="assistant-info">
                        <div className="assistant-name">{assistant.name}</div>
                        <div className="assistant-role">{assistant.role}</div>
                      </div>
                      {notifications[assistant.id]?.length > 0 && (
                        <div className="notification-badge">
                          {notifications[assistant.id].length}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel Footer */}
      <div className="panel-footer">
        <div className="footer-hint">
          <kbd>Cmd</kbd> + <kbd>A</kbd> to toggle
        </div>
      </div>
    </div>
  );
};

export default RightPanelContainer;
