/**
 * NADIA Dashboard - Main Container Component
 * Orchestrates conversations, messages, and queue management
 * with real-time polling integration
 */

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  fetchConversations,
  fetchMessages,
  fetchQueue,
  selectConversation,
  selectNadiaConversations,
  selectNadiaMessages,
  selectNadiaQueue,
  selectNadiaStats,
  selectSelectedConversationId,
  selectNadiaLoading,
  selectNadiaError,
} from '@/store/slices/nadiaSlice';
import { NADIADashboardContainer, ErrorAlert } from './nadia.styles';
import ConversationListPanel from './ConversationListPanel';
import MessageViewer from './MessageViewer';
import QueueManagerPanel from './QueueManagerPanel';

/**
 * Polling Configuration
 */
const POLLING_INTERVALS = {
  CONVERSATIONS: 3000, // 3 seconds
  MESSAGES: 2000, // 2 seconds
  QUEUE: 5000, // 5 seconds
};

/**
 * NADIADashboard Component
 */
const NADIADashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux selectors
  const conversations = useAppSelector(selectNadiaConversations);
  const messages = useAppSelector(selectNadiaMessages);
  const queue = useAppSelector(selectNadiaQueue);
  const stats = useAppSelector(selectNadiaStats);
  const selectedConversationId = useAppSelector(selectSelectedConversationId);
  const loading = useAppSelector(selectNadiaLoading);
  const error = useAppSelector(selectNadiaError);

  // Local state
  const [isPolling, setIsPolling] = useState(true);
  const pollIntervals = useRef<{
    conversations?: NodeJS.Timeout;
    messages?: NodeJS.Timeout;
    queue?: NodeJS.Timeout;
  }>({});
  const [dismissedError, setDismissedError] = useState(false);

  /**
   * Initialize polling on component mount
   */
  useEffect(() => {
    // Initial data loads
    dispatch(fetchConversations());
    dispatch(fetchQueue());

    // Setup polling intervals
    if (isPolling) {
      pollIntervals.current.conversations = setInterval(() => {
        dispatch(fetchConversations());
      }, POLLING_INTERVALS.CONVERSATIONS);

      pollIntervals.current.queue = setInterval(() => {
        dispatch(fetchQueue());
      }, POLLING_INTERVALS.QUEUE);
    }

    // Cleanup on component unmount
    return () => {
      Object.values(pollIntervals.current).forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [isPolling, dispatch]);

  /**
   * Fetch messages when selected conversation changes
   */
  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    // Immediate fetch
    dispatch(fetchMessages(selectedConversationId));

    // Setup polling for messages
    if (isPolling) {
      pollIntervals.current.messages = setInterval(() => {
        dispatch(fetchMessages(selectedConversationId));
      }, POLLING_INTERVALS.MESSAGES);
    }

    // Cleanup message polling when conversation changes
    return () => {
      if (pollIntervals.current.messages) {
        clearInterval(pollIntervals.current.messages);
      }
    };
  }, [selectedConversationId, isPolling, dispatch]);

  /**
   * Handle conversation selection
   */
  const handleSelectConversation = (conversationId: string) => {
    dispatch(selectConversation(conversationId));
  };

  /**
   * Handle polling toggle
   */
  const handleTogglePolling = () => {
    setIsPolling(!isPolling);
  };

  /**
   * Toggle error dismissal
   */
  const handleDismissError = () => {
    setDismissedError(true);
  };

  /**
   * Get selected conversation object
   */
  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.id === selectedConversationId)
    : null;

  return (
    <NADIADashboardContainer>
      {/* Error Alert */}
      {error && !dismissedError && (
        <ErrorAlert style={{ gridColumn: '1 / -1' }}>
          <span>⚠️ {error}</span>
          <button onClick={handleDismissError} aria-label="Dismiss error">
            ✕
          </button>
        </ErrorAlert>
      )}

      {/* Left Sidebar - Conversation List */}
      <ConversationListPanel
        conversations={conversations}
        selectedId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        loading={loading}
      />

      {/* Center Pane - Message Viewer */}
      <MessageViewer
        conversation={selectedConversation}
        messages={messages}
        loading={loading}
      />

      {/* Right Sidebar - Queue Manager */}
      <QueueManagerPanel
        queue={queue}
        stats={stats}
        loading={loading}
      />

      {/* Polling Status Indicator */}
      <div
        style={{
          gridColumn: '1 / -1',
          fontSize: '12px',
          color: isPolling ? '#22C55E' : '#F97316',
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={handleTogglePolling}
        title="Click to toggle polling"
        role="status"
        aria-live="polite"
      >
        {isPolling ? '🟢 Live polling active' : '🟡 Polling paused'}
      </div>
    </NADIADashboardContainer>
  );
};

NADIADashboard.displayName = 'NADIADashboard';

export default NADIADashboard;
