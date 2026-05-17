import React, { memo } from 'react';
import TaskLifecycleBoard from './TaskLifecycleBoard';
import './AssistantLifecycleTab.css';

interface AssistantLifecycleTabProps {
  /** The assistant ID used to load tasks from Redux */
  assistantId: string;
  /** Assistant accent color — used for progress indicators and action buttons */
  color?: string;
  /** Assistant name shown in the header */
  assistantName?: string;
}

/**
 * AssistantLifecycleTab
 *
 * Drop-in "Lifecycle" tab for any AI assistant CRM component.
 * Renders the full TaskLifecycleBoard (Kanban columns + Notification feed)
 * for the given assistant, using tasks stored in Redux.
 */
const AssistantLifecycleTab = memo(
  ({ assistantId, color = '#E31E24', assistantName }: AssistantLifecycleTabProps) => (
    <div className="alt-wrapper">
      {assistantName && (
        <div className="alt-section-header">
          <span className="alt-section-title">
            Task Lifecycle — <strong>{assistantName}</strong>
          </span>
          <span className="alt-section-hint">
            Advance tasks through stages or expand a card to view the full action log.
          </span>
        </div>
      )}
      <TaskLifecycleBoard
        assistantId={assistantId}
        color={color}
        showNotificationFeed
      />
    </div>
  ),
);

AssistantLifecycleTab.displayName = 'AssistantLifecycleTab';
export default AssistantLifecycleTab;
