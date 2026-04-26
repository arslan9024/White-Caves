/**
 * Conversation List Panel - Display and filter conversations
 */

import React, { useState, useMemo } from 'react';
import { Conversation } from '@/types/nadia';
import {
  ConversationListContainer,
  ConversationListHeader,
  ConversationListScroll,
  ConversationListItem,
  ConversationItemHeader,
  ConversationItemName,
  ConversationItemInfo,
  StatusBadge,
  LeadScoreBar,
  ScoreBarFill,
  UnreadBadge,
  LoadingSpinner,
  EmptyState,
} from './nadia.styles';

interface ConversationListPanelProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  loading?: boolean;
}

interface FilterOptions {
  status: 'ALL' | Conversation['status'];
  sortBy: 'leadScore' | 'updatedAt';
}

const ConversationListPanel: React.FC<ConversationListPanelProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
  loading = false,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    sortBy: 'leadScore',
  });

  /**
   * Filter and sort conversations
   */
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Filter by status
    if (filters.status !== 'ALL') {
      result = result.filter((c) => c.status === filters.status);
    }

    // Sort
    if (filters.sortBy === 'leadScore') {
      result.sort((a, b) => b.leadScore - a.leadScore);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    return result;
  }, [conversations, filters]);

  return (
    <ConversationListContainer>
      {/* Header with filters */}
      <ConversationListHeader>
        <h2>Conversations ({filteredConversations.length})</h2>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status: e.target.value as FilterOptions['status'],
            }))
          }
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #D1D5DB',
            fontSize: '12px',
            cursor: 'pointer',
            background: 'white',
          }}
          aria-label="Filter by conversation status"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="CLOSED">Closed</option>
          <option value="SPAM">Spam</option>
        </select>
      </ConversationListHeader>

      {/* List content */}
      <ConversationListScroll>
        {loading && conversations.length === 0 ? (
          <LoadingSpinner />
        ) : filteredConversations.length === 0 ? (
          <EmptyState>
            <p>No conversations found</p>
          </EmptyState>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              isSelected={conversation.id === selectedId}
              onClick={() => onSelectConversation(conversation.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectConversation(conversation.id);
                }
              }}
              aria-selected={conversation.id === selectedId}
            >
              {/* Name and status row */}
              <ConversationItemHeader>
                <div>
                  <ConversationItemName>
                    {conversation.customerName || conversation.customerPhone}
                  </ConversationItemName>
                  <ConversationItemInfo>{conversation.customerPhone}</ConversationItemInfo>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <StatusBadge status={conversation.status}>
                    {conversation.status}
                  </StatusBadge>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <UnreadBadge>{conversation.unreadCount}</UnreadBadge>
                  )}
                </div>
              </ConversationItemHeader>

              {/* Last message preview */}
              {conversation.lastMessage && (
                <ConversationItemInfo style={{ marginBottom: '8px' }}>
                  {conversation.lastMessage.substring(0, 50)}
                  {conversation.lastMessage.length > 50 ? '...' : ''}
                </ConversationItemInfo>
              )}

              {/* Lead score bar */}
              <LeadScoreBar>
                <span>Score:</span>
                <ScoreBarFill score={conversation.leadScore} />
                <span>{conversation.leadScore}/100</span>
              </LeadScoreBar>
            </ConversationListItem>
          ))
        )}
      </ConversationListScroll>
    </ConversationListContainer>
  );
};

ConversationListPanel.displayName = 'ConversationListPanel';

export default ConversationListPanel;
