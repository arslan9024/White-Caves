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
  X, Search, ChevronRight, Bot
} from 'lucide-react';
import { getAllAssistants } from '../../../config/assistantRegistry';
import {
  RightPanelRoot,
  PanelHeader,
  PanelTitle,
  PanelCloseButton,
  PanelSearchSection,
  SearchInputWrapper,
  SearchIcon,
  SearchInput,
  SearchClearButton,
  PanelContent,
  AssistantGroup,
  GroupHeaderButton,
  ToggleIcon,
  GroupAssistants,
  AssistantItemButton,
  AssistantAvatar,
  AssistantInfo,
  AssistantName,
  AssistantRole,
  NotificationBadge,
  PanelFooter,
  FooterHint,
  KeyboardKey
} from './styles';

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
    <RightPanelRoot $isMobile={isMobile} $isTablet={isTablet} $isOpen={isOpen}>
      {/* Panel Header */}
      <PanelHeader>
        <PanelTitle>
          <Bot size={20} />
          <span>AI Assistants</span>
        </PanelTitle>
        <PanelCloseButton
          onClick={onClose}
          title="Close (Esc)"
          aria-label="Close panel"
        >
          <X size={20} />
        </PanelCloseButton>
      </PanelHeader>

      {/* Search & Filter */}
      <PanelSearchSection>
        <SearchInputWrapper>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search assistants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <SearchClearButton
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </SearchClearButton>
          )}
        </SearchInputWrapper>
      </PanelSearchSection>

      {/* Assistant List */}
      <PanelContent>
        {Object.entries(filteredAssistants).map(([groupId, group]) => {
          if (group.assistants.length === 0) return null;

          return (
            <AssistantGroup key={groupId}>
              {/* Group Header */}
              <GroupHeaderButton
                $expanded={expandedGroups[groupId]}
                onClick={() => toggleGroup(groupId)}
              >
                <span>{group.label}</span>
                <ToggleIcon $rotated={expandedGroups[groupId]}>
                  <ChevronRight size={16} />
                </ToggleIcon>
              </GroupHeaderButton>

              {/* Assistants in Group */}
              {expandedGroups[groupId] && (
                <GroupAssistants>
                  {group.assistants.map(assistant => (
                    <AssistantItemButton
                      key={assistant.id}
                      $active={false}
                      onClick={() => {
                        onAssistantSelect(assistant);
                      }}
                      title={assistant.description}
                    >
                      <AssistantAvatar>
                        {assistant.emoji || '🤖'}
                      </AssistantAvatar>
                      <AssistantInfo>
                        <AssistantName>{assistant.name}</AssistantName>
                        <AssistantRole>{assistant.role}</AssistantRole>
                      </AssistantInfo>
                      {notifications[assistant.id]?.length > 0 && (
                        <NotificationBadge>
                          {notifications[assistant.id].length}
                        </NotificationBadge>
                      )}
                    </AssistantItemButton>
                  ))}
                </GroupAssistants>
              )}
            </AssistantGroup>
          );
        })}
      </PanelContent>

      {/* Panel Footer */}
      <PanelFooter>
        <FooterHint>
          <KeyboardKey>Cmd</KeyboardKey> + <KeyboardKey>A</KeyboardKey> to toggle
        </FooterHint>
      </PanelFooter>
    </RightPanelRoot>
  );
};

export default RightPanelContainer;
