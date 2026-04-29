import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { GroupMessage, GroupConversation, MediaFile } from '../../../types/phase6.types';
import { MediaUploadComponent } from './MediaUploadComponent';

interface GroupMessagingComponentProps {
  conversation: GroupConversation;
  messages: GroupMessage[];
  currentUserId: string;
  onSendMessage: (content: string, attachments?: MediaFile[]) => Promise<void>;
  onMention?: (userId: string) => void;
  isLoading?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const ParticipantCount = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
`;

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const MessageGroup = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isCurrentUser ? 'flex-end' : 'flex-start')};
  gap: 4px;
`;

const SenderName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  padding: 0 12px;
`;

const MessageBubble = styled.div<{ isCurrentUser: boolean }>`
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${(props) => (props.isCurrentUser ? '#4CAF50' : '#e0e0e0')};
  color: ${(props) => (props.isCurrentUser ? '#fff' : '#333')};
  word-break: break-word;
  font-size: 14px;
  line-height: 1.4;

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: #999;
  padding: 0 12px;
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const TextInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  max-height: 120px;
  min-height: 40px;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AttachmentToggle = styled.button`
  padding: 10px;
  background-color: transparent;
  color: #4caf50;
  border: 1px solid #4caf50;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  gap: 12px;

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.5;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-top: 12px;
`;

const MediaThumbnail = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

export const GroupMessagingComponent: React.FC<GroupMessagingComponentProps> = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
  onMention,
  isLoading = false,
}) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<MediaFile[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() && attachments.length === 0) {
      return;
    }

    setIsSending(true);
    try {
      await onSendMessage(messageText, attachments.length > 0 ? attachments : undefined);
      setMessageText('');
      setAttachments([]);
      setShowMediaUpload(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSendMessage();
    }
  };

  const handleMediaUploadComplete = (file: MediaFile) => {
    setAttachments([...attachments, file]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>{conversation.name}</HeaderTitle>
        <ParticipantCount>
          {conversation.participants.length} participant
          {conversation.participants.length !== 1 ? 's' : ''}
        </ParticipantCount>
      </Header>

      <MessageContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No messages yet. Start the conversation!</p>
          </EmptyState>
        ) : (
          messages.map((msg) => (
            <MessageGroup key={msg.id} isCurrentUser={msg.senderId === currentUserId}>
              {msg.senderId !== currentUserId && (
                <SenderName>{msg.senderName}</SenderName>
              )}
              <MessageBubble isCurrentUser={msg.senderId === currentUserId}>
                {msg.content}
                {msg.mediaAttachments && msg.mediaAttachments.length > 0 && (
                  <MediaGrid>
                    {msg.mediaAttachments.map((media) =>
                      media.type === 'image' ? (
                        <MediaThumbnail
                          key={media.id}
                          src={media.thumbnailUrl || media.url}
                          alt={media.name}
                        />
                      ) : null
                    )}
                  </MediaGrid>
                )}
              </MessageBubble>
              <Timestamp>{new Date(msg.timestamp).toLocaleTimeString()}</Timestamp>
            </MessageGroup>
          ))
        )}
        <div ref={messageEndRef} />
      </MessageContainer>

      <InputContainer>
        {showMediaUpload && (
          <div>
            <MediaUploadComponent
              onUploadComplete={handleMediaUploadComplete}
              conversationId={conversation.id}
              maxSize={52428800}
              multiple={true}
            />
          </div>
        )}

        {attachments.length > 0 && (
          <MediaGrid>
            {attachments.map((file, index) => (
              <div key={file.id} style={{ position: 'relative' }}>
                {file.type === 'image' && (
                  <MediaThumbnail src={file.url} alt={file.name} />
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </MediaGrid>
        )}

        <MessageInputWrapper>
          <TextInput
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Ctrl+Enter to send)"
            disabled={isLoading || isSending}
          />
          <AttachmentToggle
            onClick={() => setShowMediaUpload(!showMediaUpload)}
            disabled={isSending}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </AttachmentToggle>
          <SendButton
            onClick={handleSendMessage}
            disabled={isLoading || isSending || (!messageText.trim() && attachments.length === 0)}
          >
            {isSending ? 'Sending...' : 'Send'}
          </SendButton>
        </MessageInputWrapper>
      </InputContainer>
    </Container>
  );
};

export default GroupMessagingComponent;
