import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setSelectedAssistant,
  selectSelectedAssistant,
  selectFilteredAssistants,
  selectAssistantNotifications,
  clearNotifications,
  setActiveContext,
} from '../../../redux/slices/relationalSidebarSlice';
import {
  fetchAssistants,
  fetchContextualData,
} from '../../../store/thunks/relationalSidebarThunks';
import {
  getDefaultAssistant,
  getContextsForAssistant,
} from '../../../utils/relationalSidebarUtils';
import { BaseSidebar, SidebarSection, SidebarItem } from '../../shared/sidebars';

// Styled Components
const RightSidebarContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props: { theme?: { colors?: { sidebarBg?: string } } }) =>
    props.theme?.colors?.sidebarBg || '#1a1a1a'};
  border-left: 1px solid
    ${(props: { theme?: { colors?: { border?: string } } }) =>
      props.theme?.colors?.border || '#333'};
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
    background: ${(props: { theme?: { colors?: { scrollbar?: string } } }) =>
      props.theme?.colors?.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props: { theme?: { colors?: { scrollbarHover?: string } } }) =>
        props.theme?.colors?.scrollbarHover || '#777'};
    }
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

const ContextsContainer = styled.div`
  padding: 8px 16px;
  border-top: 1px solid
    ${(props: { theme?: { colors?: { border?: string } } }) =>
      props.theme?.colors?.border || '#333'};
  margin-top: 8px;
`;

const ContextButton = styled.button<{ isActive?: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  margin-right: 4px;
  margin-bottom: 4px;
  background: ${({ isActive, theme }) =>
    isActive
      ? String((theme as any)?.colors?.primary ?? '#007bff')
      : String((theme as any)?.colors?.sidebarItemBg ?? '#2a2a2a')};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props: { theme?: { colors?: { primaryHover?: string } } }) =>
      props.theme?.colors?.primaryHover || '#0056b3'};
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
  color: ${(props: { theme?: { colors?: { textSecondary?: string } } }) =>
    props.theme?.colors?.textSecondary || '#999'};
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }
`;

// Loading skeleton
const SkeletonItem = styled.div`
  height: 40px;
  background: linear-gradient(90deg, #2a2a2a 25%, #1f1f1f 50%, #2a2a2a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin: 8px 16px;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Error container
const ErrorContainer = styled.div`
  padding: 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  margin: 12px 16px;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-bottom: 12px;
  word-break: break-word;
`;

const RetryButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #dc2626;
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

interface RelationalRightSidebarProps {
  selectedDepartment?: string | null;
  selectedService?: string | null;
  userPermissions?: Record<string, boolean>;
}

/**
 * RelationalRightSidebar Component
 * Displays filtered AI Assistants based on department/service selection
 * Includes notification badges and context-specific tools
 * Redux Integration: Uses fetchAssistants thunk to load data from API
 */
const RelationalRightSidebar: React.FC<RelationalRightSidebarProps> = ({
  selectedDepartment = null,
  selectedService = null,
  userPermissions: _userPermissions = {},
}): JSX.Element => {
  const dispatch = useDispatch<any>();
  const selectedAssistant = useSelector(selectSelectedAssistant) as string | null;
  const filteredAssistants = useSelector(selectFilteredAssistants) as Array<{
    id: string;
    name?: string;
    icon?: React.ReactNode;
  }>;
  const assistantNotifications = useSelector(selectAssistantNotifications) as Record<
    string,
    { count?: number; messages?: unknown[] }
  >;

  // Redux selectors for loading/error states
  const assistantLoading = useSelector(
    (state: { relationalSidebar?: { assistantLoading?: boolean } }) =>
      state.relationalSidebar?.assistantLoading ?? false
  );
  const assistantError = useSelector(
    (state: { relationalSidebar?: { assistantError?: string | null } }) =>
      state.relationalSidebar?.assistantError ?? null
  );

  // Fetch assistants when department or service changes
  useEffect(() => {
    try {
      if (selectedDepartment || selectedService) {
        console.warn('[RelationalRightSidebar] Fetching assistants with filters:', {
          department: selectedDepartment,
          service: selectedService,
        });

        const filters: Record<string, string> = {};
        if (selectedDepartment) filters.department = selectedDepartment;
        if (selectedService) filters.service = selectedService;

        dispatch(fetchAssistants(filters as any) as any);
      }
    } catch (error) {
      console.error('[RelationalRightSidebar] Error fetching assistants:', error);
    }
  }, [selectedDepartment, selectedService, dispatch]);

  // Auto-select default assistant when assistants load
  useEffect(() => {
    if (!selectedAssistant && filteredAssistants.length > 0) {
      const defaultAssistant = getDefaultAssistant(selectedDepartment || '');
      if (defaultAssistant) {
        console.warn('[RelationalRightSidebar] Setting default assistant:', defaultAssistant);
        dispatch(setSelectedAssistant(defaultAssistant));
      } else {
        console.warn('[RelationalRightSidebar] Setting first assistant as default');
        dispatch(setSelectedAssistant(filteredAssistants[0].id));
      }
    }
  }, [filteredAssistants, selectedAssistant, selectedDepartment, dispatch]);

  // Handle assistant selection
  const handleAssistantSelect = (assistantId: string): void => {
    try {
      console.warn('[RelationalRightSidebar] Selected assistant:', assistantId);
      dispatch(setSelectedAssistant(assistantId));
      // Clear active context when switching assistants
      dispatch(setActiveContext({ context: null }));
    } catch (error) {
      console.error('Error selecting assistant:', error);
    }
  };

  // Handle context selection
  const handleContextSelect = (context: string): void => {
    try {
      if (selectedAssistant) {
        console.warn(
          '[RelationalRightSidebar] Selected context:',
          context,
          'for assistant:',
          selectedAssistant
        );
        dispatch(setActiveContext({ context }));
        // Optionally fetch context-specific data
        dispatch(fetchContextualData({ assistantId: selectedAssistant, context } as any) as any);
      }
    } catch (error) {
      console.error('Error selecting context:', error);
    }
  };

  // Handle notification clear
  const handleClearNotifications = (assistantId: string): void => {
    try {
      console.warn('[RelationalRightSidebar] Clearing notifications for:', assistantId);
      dispatch(clearNotifications(assistantId));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Handle retry on error
  const handleRetry = (): void => {
    console.warn('[RelationalRightSidebar] Retrying assistants fetch...');
    const filters: Record<string, string> = {};
    if (selectedDepartment) filters.department = selectedDepartment;
    if (selectedService) filters.service = selectedService;
    dispatch(fetchAssistants(filters as any) as any);
  };

  // Handle assistant action (message, assign, more)
  const _handleAssistantAction = (action: string, assistantId: string): void => {
    try {
      console.warn(
        '[RelationalRightSidebar] Assistant action:',
        action,
        'for assistant:',
        assistantId
      );
      switch (action) {
        case 'message':
          console.warn('Opening message interface for assistant:', assistantId);
          // TODO: Open message dialog/modal
          break;
        case 'assign':
          console.warn('Opening task assignment dialog for assistant:', assistantId);
          // TODO: Open assign task dialog/modal
          break;
        case 'more':
          console.warn('Opening more options menu for assistant:', assistantId);
          // TODO: Open context menu with more actions
          break;
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Error handling assistant action:', error);
    }
  };

  // Get available contexts for selected assistant
  const availableContexts = selectedAssistant ? getContextsForAssistant(selectedAssistant) : [];

  return (
    <RightSidebarContainer>
      <BaseSidebar name="relational-right-sidebar" title="AI Assistants" icon="🤖" position="right">
        {/* Loading State */}
        {assistantLoading && (
          <div>
            {[1, 2, 3].map(i => (
              <SkeletonItem key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Error State */}
        {assistantError && !assistantLoading && (
          <ErrorContainer>
            <ErrorText>Failed to load assistants: {assistantError}</ErrorText>
            <RetryButton onClick={handleRetry}>Retry</RetryButton>
          </ErrorContainer>
        )}

        {/* Assistants List */}
        {!assistantLoading && !assistantError && (
          <>
            <SectionHeader>Assistants ({filteredAssistants.length})</SectionHeader>
            <SidebarSection
              id="assistants-list"
              title="Available"
              sidebarName="relational-right-sidebar"
            >
              {filteredAssistants.length > 0 ? (
                filteredAssistants.map(assistant => {
                  const notificationCount = assistantNotifications[assistant.id]?.count || 0;

                  return (
                    <div key={assistant.id} style={{ position: 'relative' }}>
                      <SidebarItem
                        id={assistant.id}
                        label={`${assistant.name || assistant.id}`}
                        isSelected={selectedAssistant === assistant.id}
                        onClick={() => handleAssistantSelect(assistant.id)}
                        icon={assistant.icon || '🤖'}
                        sidebarName="relational-right-sidebar"
                      />
                      {notificationCount > 0 && (
                        <NotificationBadge
                          onClick={e => {
                            e.stopPropagation();
                            handleClearNotifications(assistant.id);
                          }}
                          title={`${notificationCount} notification(s) - Click to clear`}
                        >
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </NotificationBadge>
                      )}
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
                  {availableContexts.map((context: string) => (
                    <ContextButton
                      key={context}
                      onClick={() => handleContextSelect(context)}
                      isActive={false}
                      title={`Open ${context} tools`}
                    >
                      {context.charAt(0).toUpperCase() + context.slice(1).replace('-', ' ')}
                    </ContextButton>
                  ))}
                </div>
              </ContextsContainer>
            )}
          </>
        )}
      </BaseSidebar>
    </RightSidebarContainer>
  );
};

export default RelationalRightSidebar;
