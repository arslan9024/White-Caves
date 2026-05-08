/**
 * ChatInterface Component
 *
 * Main WhatsApp chat interface with message list and composer
 * Displays conversations and handles real-time messaging
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useWhatsAppConversations } from '../../../hooks/whatsapp';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div<{ bg?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.bg || '#25d366'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
`;

const OnlineStatus = styled.span`
  font-size: 12px;
  color: #999;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

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

const MessageGroup = styled.div<{ isOwn: boolean }>`
  display: flex;
  justify-content: ${props => (props.isOwn ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 8px;
  word-wrap: break-word;
  background: ${props => (props.isOwn ? '#25d366' : '#e5e5ea')};
  color: ${props => (props.isOwn ? 'white' : '#000')};
  font-size: 14px;
  line-height: 1.4;
`;

const MessageTime = styled.span<{ isOwn: boolean }>`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: ${props => (props.isOwn ? 'right' : 'left')};
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  margin: 0;
`;

const MessageComposer = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f5f5f5;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #25d366;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #25d366;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background: #20ba5a;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #25d366;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorAlert = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 20px;
  border-bottom: 1px solid #f5c6cb;
`;

interface ChatInterfaceProps {
  accountId: string;
  conversationId?: string;
  recipientNumber?: string;
  recipientName?: string;
  onBack?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  accountId,
  conversationId,
  recipientNumber,
  recipientName,
  onBack,
}) => {
  const { messages, isLoading, error, loadMessages, sendMessage, clearError } =
    useWhatsAppConversations();

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages on mount or when conversation changes
  useEffect(() => {
    if (accountId && recipientNumber) {
      loadMessages(accountId, recipientNumber, 50);
    }
  }, [accountId, recipientNumber, conversationId, loadMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !accountId || !recipientNumber) {
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(accountId, recipientNumber, messageText.trim());
      setMessageText('');
    } catch {
      // Error handled by hook
    } finally {
      setIsSending(false);
    }
  };

  if (!accountId || !recipientNumber) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyText>Select a conversation to start messaging</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  if (isLoading && messages.length === 0) {
    return (
      <Container>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onBack && <IconButton onClick={onBack}>←</IconButton>}
            <ContactInfo>
              <Avatar>{recipientName?.[0] || '?'}</Avatar>
              <ContactDetails>
                <ContactName>{recipientName || recipientNumber}</ContactName>
                <OnlineStatus>Loading...</OnlineStatus>
              </ContactDetails>
            </ContactInfo>
          </div>
          <HeaderActions>
            <IconButton>📞</IconButton>
            <IconButton>📹</IconButton>
            <IconButton>⋯</IconButton>
          </HeaderActions>
        </Header>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading messages...</p>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && <IconButton onClick={onBack}>←</IconButton>}
          <ContactInfo>
            <Avatar>{recipientName?.[0] || '?'}</Avatar>
            <ContactDetails>
              <ContactName>{recipientName || recipientNumber}</ContactName>
              <OnlineStatus>Active now</OnlineStatus>
            </ContactDetails>
          </ContactInfo>
        </div>
        <HeaderActions>
          <IconButton>📞</IconButton>
          <IconButton>📹</IconButton>
          <IconButton>⋯</IconButton>
        </HeaderActions>
      </Header>

      {error && (
        <ErrorAlert>
          {error}
          <button
            onClick={clearError}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontSize: '18px',
            }}
          >
            ✕
          </button>
        </ErrorAlert>
      )}

      <MessagesList>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👋</EmptyIcon>
            <EmptyText>No messages yet. Start the conversation!</EmptyText>
          </EmptyState>
        ) : (
          messages.map((message, index) => (
            <div key={message.messageId || index}>
              <MessageGroup isOwn={message.direction === 'outgoing'}>
                <div>
                  <MessageBubble isOwn={message.direction === 'outgoing'}>
                    {message.body}
                  </MessageBubble>
                  <MessageTime isOwn={message.direction === 'outgoing'}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </MessageTime>
                </div>
              </MessageGroup>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesList>

      <MessageComposer onSubmit={handleSendMessage}>
        <MessageInput
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          disabled={isSending}
          autoFocus
        />
        <SendButton type="submit" disabled={!messageText.trim() || isSending}>
          {isSending ? '...' : '➤'}
        </SendButton>
      </MessageComposer>
    </Container>
  );
};
