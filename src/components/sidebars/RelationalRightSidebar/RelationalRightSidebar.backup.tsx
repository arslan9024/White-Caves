import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedAssistant,
  setFilteredAssistants,
  selectSelectedAssistant,
  selectFilteredAssistants,
  selectAssistantNotifications,
  clearNotifications,
  setActiveContext,
} from '../../redux/slices/relationalSidebarSlice';
import {
  filterAssistantsByDepartment,
  filterAssistantsByService,
  getDefaultAssistant,
  getContextsForAssistant,
} from '../../utils/relationalSidebarUtils';
import { BaseSidebar, SidebarSection, SidebarItem } from '../sidebars/shared';

// Styled Components
const RightSidebarContainer = styled.div`
  width: 280px;
  height: 100%;
  background: ${(props) => props.theme.colors.sidebar.background || '#1a1a1a'};
  border-left: 1px solid ${(props) => props.theme.colors.border || '#333'};
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props) => props.theme.colors.scrollbarHover || '#777'};
    }
  }
`;

const AssistantItemStyled = styled(SidebarItem)`
  position: relative;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &.active {
    background-color: ${(props) => props.theme.colors.sidebar.activeBackground || '#2a2a2a'};
    border-left: 3px solid ${(props) => props.theme.colors.primary || '#007bff'};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.sidebar.hoverBackground || '#252525'};
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ef4444;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
`;

const AssistantColorDot = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${(props) => props.color};
`;

const ContextsContainer = styled.div`
  padding: 8px 16px;
  border-top: 1px solid ${(props) => props.theme.colors.border || '#333'};
  margin-top: 8px;
`;

const ContextButton = styled.button`
  display: inline-block;
  padding: 4px 12px;
  margin-right: 4px;
  margin-bottom: 4px;
  background: ${(props) =>
    props.isActive
      ? props.theme.colors.primary || '#007bff'
      : props.theme.colors.sidebar.itemBackground || '#2a2a2a'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover || '#0056b3'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SectionHeader = styled.div`
  padding: 12px 16px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => props.theme.colors.textSecondary || '#999'};
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }
`;

/**
 * RelationalRightSidebar Component
 * Displays filtered AI Assistants based on department/service selection
 * Includes notification badges and context-specific tools
 */
const RelationalRightSidebar = ({
  selectedDepartment,
  selectedService,
  userPermissions = {},
}) => {
  const dispatch = useDispatch();
  const selectedAssistant = useSelector(selectSelectedAssistant);
  const filteredAssistants = useSelector(selectFilteredAssistants);
  const assistantNotifications = useSelector(selectAssistantNotifications);

  // Filter assistants based on department or service selection
  useEffect(() => {
    try {
      let filtered = [];

      if (selectedService) {
        // Filter by service
        filtered = filterAssistantsByService(selectedService, userPermissions);
      } else if (selectedDepartment) {
        // Filter by department
        filtered = filterAssistantsByDepartment(
          selectedDepartment,
          userPermissions
        );
      }

      dispatch(setFilteredAssistants(filtered));

      // Auto-select default assistant if none selected
      if (filtered.length > 0 && !selectedAssistant) {
        const defaultAssistant = getDefaultAssistant(selectedDepartment);
        if (defaultAssistant) {
          dispatch(setSelectedAssistant(defaultAssistant));
        } else {
          dispatch(setSelectedAssistant(filtered[0].id));
        }
      }
    } catch (error) {
      console.error('Error filtering assistants:', error);
    }
  }, [selectedDepartment, selectedService, userPermissions]);

  // Handle assistant selection
  const handleAssistantSelect = (assistantId) => {
    try {
      dispatch(setSelectedAssistant(assistantId));
      // Clear active context when switching assistants
      dispatch(setActiveContext({ context: null }));
    } catch (error) {
      console.error('Error selecting assistant:', error);
    }
  };

  // Handle context selection
  const handleContextSelect = (context) => {
    try {
      dispatch(setActiveContext({ context }));
    } catch (error) {
      console.error('Error selecting context:', error);
    }
  };

  // Handle notification clear
  const handleClearNotifications = (assistantId) => {
    try {
      dispatch(clearNotifications(assistantId));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Get available contexts for selected assistant
  const availableContexts = selectedAssistant
    ? getContextsForAssistant(selectedAssistant)
    : [];

  return (
    <RightSidebarContainer>
      <BaseSidebar
        title="AI Assistants"
        subtitle={`${filteredAssistants.length} available`}
        isCollapsible={true}
      >
        {/* Assistants List */}
        <SectionHeader>Assistants</SectionHeader>
        <SidebarSection>
          {filteredAssistants.length > 0 ? (
            filteredAssistants.map((assistant) => {
              const notificationCount =
                assistantNotifications[assistant.id]?.count || 0;

              return (
                <div key={assistant.id}>
                  <AssistantItemStyled
                    id={assistant.id}
                    label={
                      <>
                        <AssistantColorDot color={assistant.color} />
                        {assistant.name}
                      </>
                    }
                    description={assistant.description}
                    isActive={selectedAssistant === assistant.id}
                    onClick={() => handleAssistantSelect(assistant.id)}
                    icon={assistant.icon}
                  >
                    {notificationCount > 0 && (
                      <NotificationBadge
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearNotifications(assistant.id);
                        }}
                        title={`${notificationCount} notification(s)`}
                      >
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </NotificationBadge>
                    )}
                  </AssistantItemStyled>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '12px 16px', fontSize: '12px', color: '#999' }}>
              No assistants available for this selection
            </div>
          )}
        </SidebarSection>

        {/* Contexts for Selected Assistant */}
        {selectedAssistant && availableContexts.length > 0 && (
          <ContextsContainer>
            <SectionHeader>Context Tools</SectionHeader>
            <div>
              {availableContexts.map((context) => (
                <ContextButton
                  key={context}
                  onClick={() => handleContextSelect(context)}
                  isActive={false}
                  title={`Open ${context} tools`}
                >
                  {context.charAt(0).toUpperCase() +
                    context
                      .slice(1)
                      .replace('-', ' ')}
                </ContextButton>
              ))}
            </div>
          </ContextsContainer>
        )}
      </BaseSidebar>
    </RightSidebarContainer>
  );
};

export default RelationalRightSidebar;
