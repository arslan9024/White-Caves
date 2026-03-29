/**
 * Message Input Component - Message composition interface
 */

import React, { useState, useCallback } from 'react';
import { MessageSender } from '@/types/nadia';
import {
  MessageInputContainer,
  MessageInputControls,
  MessageTypeSelect,
  MessageTextarea,
  MessageInputFooter,
  CharCount,
  SendButton,
} from './nadia.styles';

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (content: string, sender: MessageSender) => void;
  disabled?: boolean;
  loading?: boolean;
}

const MAX_MESSAGE_LENGTH = 500;

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  onSendMessage,
  disabled = false,
  loading = false,
}) => {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<MessageSender>('CUSTOMER');
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle message send
   */
  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validation
      if (!content.trim()) {
        setError('Message cannot be empty');
        return;
      }

      if (content.length > MAX_MESSAGE_LENGTH) {
        setError(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
        return;
      }

      // Send message
      try {
        onSendMessage(content.trim(), messageType);
        setContent(''); // Clear input on success
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
      }
    },
    [content, messageType, onSendMessage, conversationId]
  );

  /**
   * Handle keyboard shortcut (Ctrl+Enter to send)
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !loading && content.trim()) {
          handleSendMessage(e as any);
        }
      }
    },
    [disabled, loading, content, handleSendMessage]
  );

  const charCount = content.length;
  const isWarning = charCount > MAX_MESSAGE_LENGTH * 0.8;
  const isValid = charCount > 0 && charCount <= MAX_MESSAGE_LENGTH;

  return (
    <MessageInputContainer>
      {error && (
        <div
          style={{
            padding: '8px 12px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          role="alert"
        >
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage}>
        <MessageInputControls>
          <MessageTypeSelect
            value={messageType}
            onChange={(e) => setMessageType(e.target.value as MessageSender)}
            disabled={disabled || loading}
            aria-label="Message type"
          >
            <option value="CUSTOMER">Customer Message</option>
            <option value="AGENT">Agent Message</option>
          </MessageTypeSelect>
        </MessageInputControls>

        <MessageTextarea
          placeholder="Type message here... (Ctrl+Enter to send)"
          value={content}
          onChange={(e) => setContent(e.target.value.substring(0, MAX_MESSAGE_LENGTH))}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          rows={3}
          aria-label="Message content"
        />

        <MessageInputFooter>
          <CharCount isWarning={isWarning}>
            {charCount} / {MAX_MESSAGE_LENGTH}
          </CharCount>
          <SendButton
            type="submit"
            disabled={!isValid || disabled || loading}
            aria-label="Send message"
          >
            {loading ? 'Sending...' : 'Send'}
          </SendButton>
        </MessageInputFooter>
      </form>
    </MessageInputContainer>
  );
};

MessageInput.displayName = 'MessageInput';

export default MessageInput;
