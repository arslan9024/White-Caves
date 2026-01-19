/**
 * ConversationList Component
 * 
 * Displays list of active conversations
 * Shows recent messages, unread counts, and contact info
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWhatsAppConversations } from '../../hooks/whatsapp';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e0e0e0;
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #1a1a1a;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  background: #f0f0f0;
  outline: none;

  &:focus {
    background: white;
    border-color: #25d366;
  }

  &::placeholder {
    color: #999;
  }
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;

    &:hover {
      background: #999;
    }
  }
`;

const ConversationItem = styled.div<{ unread?: boolean; selected?: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#f0f0f0' : 'transparent'};

  &:hover {
    background: #f5f5f5;
  }
`;

const Avatar = styled.div<{ bg?: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.bg || '#25d366'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
`;

const ConversationDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContactName = styled.div<{ unread?: boolean }>`
  font-weight: ${props => props.unread ? '600' : '500'};
  color: #1a1a1a;
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessagePreview = styled.div<{ unread?: boolean }>`
  font-size: 13px;
  color: ${props => props.unread ? '#666' : '#999'};
  font-weight: ${props => props.unread ? '500' : '400'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badge = styled.span`
  background: #25d366;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  flex-shrink: 0;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #25d366;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ConversationListProps {
  accountId: string;
  onSelectConversation: (conversationId: string, recipientNumber: string, name: string) => void;
  selectedConversationId?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  accountId,
  onSelectConversation,
  selectedConversationId,
}) => {
  const {
    conversations,
    isLoading,
    loadConversations,
    searchConversations,
  } = useWhatsAppConversations();

  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations on mount or when account changes
  useEffect(() => {
    if (accountId) {
      loadConversations(accountId);
    }
  }, [accountId, loadConversations]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      await searchConversations(query);
    } else {
      await loadConversations(accountId);
    }
  };

  const formatTimestamp = (date: Date | string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    if (messageDay.getTime() === today.getTime()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (messageDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (isLoading && conversations.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Messages</Title>
          <SearchInput
            type="text"
            placeholder="Search conversations..."
            disabled
          />
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Messages</Title>
        <SearchInput
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </Header>

      <List>
        {conversations.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <div>No conversations yet</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>
              Start a new conversation to get started
            </div>
          </EmptyState>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.conversationId}
              selected={conversation.conversationId === selectedConversationId}
              unread={conversation.unreadCount > 0}
              onClick={() =>
                onSelectConversation(
                  conversation.conversationId,
                  conversation.recipientNumber || '',
                  conversation.recipientName || conversation.recipientNumber || 'Unknown'
                )
              }
            >
              <Avatar bg={`hsl(${Math.random() * 360}, 70%, 60%)`}>
                {(conversation.recipientName || conversation.recipientNumber || '?')[0]?.toUpperCase()}
              </Avatar>

              <ConversationDetails>
                <ContactName unread={conversation.unreadCount > 0}>
                  {conversation.recipientName || conversation.recipientNumber}
                </ContactName>
                <MessagePreview unread={conversation.unreadCount > 0}>
                  {conversation.lastMessage || 'No messages yet'}
                </MessagePreview>
              </ConversationDetails>

              {conversation.unreadCount > 0 && (
                <Badge>{conversation.unreadCount}</Badge>
              )}

              <Timestamp>
                {formatTimestamp(conversation.lastMessageTime || new Date())}
              </Timestamp>
            </ConversationItem>
          ))
        )}
      </List>
    </Container>
  );
};
