/**
 * Message Viewer Component - Display conversation thread
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '@/store/store';
import { sendMessage } from '@/store/slices/nadiaSlice';
import { Conversation, Message, MessageSender } from '@/types/nadia';
import {
  MessageViewerContainer,
  MessageViewerHeader,
  MessageViewerHeaderContent,
  MessageViewerContent,
  MessageBubble,
  MessageContent,
  MessageMetadata,
  SentimentBadge,
  EmptyState,
  LoadingSpinner,
} from './nadia.styles';
import MessageInput from './MessageInput';

interface MessageViewerProps {
  conversation: Conversation | null;
  messages: Message[];
  loading?: boolean;
}

const MessageViewer: React.FC<MessageViewerProps> = ({
  conversation,
  messages,
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = React.useState(false);

  /**
   * Auto-scroll to latest message
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * Handle sending a message
   */
  const handleSendMessage = useCallback(
    async (content: string, sender: MessageSender) => {
      if (!conversation) return;

      setSending(true);
      try {
        await dispatch(
          sendMessage({
            conversationId: conversation.id,
            content,
            sender,
          })
        ).unwrap();
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setSending(false);
      }
    },
    [conversation, dispatch]
  );

  /**
   * Format timestamp
   */
  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  /**
   * Get sentiment emoji
   */
  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😠';
      default:
        return '😐';
    }
  };

  if (!conversation) {
    return (
      <MessageViewerContainer>
        <EmptyState>
          <p>Select a conversation to view messages</p>
        </EmptyState>
      </MessageViewerContainer>
    );
  }

  return (
    <MessageViewerContainer>
      {/* Header */}
      <MessageViewerHeader>
        <MessageViewerHeaderContent>
          <h3>{conversation.customerName || conversation.customerPhone}</h3>
          <p>
            {conversation.customerPhone} • Score: {conversation.leadScore}/100 •{' '}
            {conversation.status}
          </p>
        </MessageViewerHeaderContent>
      </MessageViewerHeader>

      {/* Messages */}
      <MessageViewerContent>
        {loading && messages.length === 0 ? (
          <LoadingSpinner />
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{ color: '#9CA3AF' }}>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} sender={message.sender}>
              <MessageContent sender={message.sender}>
                <p style={{ margin: 0, wordBreak: 'break-word' }}>{message.content}</p>
                <MessageMetadata>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.sentiment && (
                    <SentimentBadge sentiment={message.sentiment}>
                      {getSentimentEmoji(message.sentiment)} {message.sentiment}
                    </SentimentBadge>
                  )}
                  {message.intent && (
                    <span
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(79, 70, 229, 0.1)',
                        color: '#4F46E5',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 500,
                      }}
                    >
                      {message.intent}
                    </span>
                  )}
                </MessageMetadata>
              </MessageContent>
            </MessageBubble>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessageViewerContent>

      {/* Message Input */}
      <MessageInput
        conversationId={conversation.id}
        onSendMessage={handleSendMessage}
        disabled={conversation.status === 'CLOSED'}
        loading={sending}
      />
    </MessageViewerContainer>
  );
};

MessageViewer.displayName = 'MessageViewer';

export default MessageViewer;
