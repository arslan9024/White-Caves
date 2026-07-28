import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Trash2 } from 'lucide-react';
import { useRealTimeKPIs } from '../hooks/useRealTimeKPIs';

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  replies: Comment[];
  isEdited: boolean;
}

interface EntityCommentsProps {
  entityId: string;
  entityType: 'lead' | 'property' | 'contract' | 'task';
  currentUserId: string;
  currentUserName: string;
}

const Container = styled.div`
  background: #f8fafc;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const CommentThread = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(239, 68, 68, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(239, 68, 68, 0.4);
    }
  }
`;

const CommentBubble = styled(motion.div)<{ $isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => (props.$isOwn ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.04)')};
  border-left: 3px solid ${props => (props.$isOwn ? '#ef4444' : 'rgba(15, 23, 42, 0.2)')};
  border-radius: 8px;
  align-self: ${props => (props.$isOwn ? 'flex-end' : 'flex-start')};
  max-width: 85%;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const Author = styled.span`
  font-weight: 600;
  color: #1e293b;
`;

const Timestamp = styled.span`
  color: #64748b;
  font-size: 11px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  transition: color 0.2s;

  &:hover {
    color: #ef4444;
  }
`;

const CommentText = styled.p`
  color: #334155;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  word-wrap: break-word;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(239, 68, 68, 0.2);
`;

const Input = styled.textarea`
  flex: 1;
  background: #ffffff;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #1e293b;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 40px;
  max-height: 120px;

  &:focus {
    outline: none;
    border-color: #ef4444;
    background: #ffffff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SendButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #64748b;
`;

export const EntityComments: React.FC<EntityCommentsProps> = ({
  entityId,
  entityType,
  currentUserId,
  currentUserName,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendComment, isConnected } = useRealTimeKPIs();

  // Load initial comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(`/api/${entityType}/${entityId}/comments`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Failed to load comments', error);
      }
    };

    loadComments();
  }, [entityId, entityType]);

  // Listen for new comments via WebSocket
  useEffect(() => {
    if (!isConnected) return;

    const handleNewComment = (comment: Comment) => {
      if (comment.id && !comments.some(c => c.id === comment.id)) {
        setComments(prev => [...prev, comment]);
      }
    };

    // Subscribe to comments channel
    sendComment(entityId, {
      type: 'subscribe',
      entityId,
      entityType,
    });

    // In production, listen to WebSocket 'comment:new' event
    // For now, this is a placeholder for the real implementation
    window.addEventListener('comment:new', (event: Event) => {
      if (event instanceof CustomEvent) {
        handleNewComment(event.detail);
      }
    });

    return () => {
      window.removeEventListener('comment:new', (event: Event) => {
        if (event instanceof CustomEvent) {
          handleNewComment(event.detail);
        }
      });
    };
  }, [isConnected, entityId, entityType, sendComment, comments]);

  const handleSubmitComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!newComment.trim() || isLoading) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`/api/${entityType}/${entityId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: newComment,
            authorId: currentUserId,
            authorName: currentUserName,
          }),
        });

        if (response.ok) {
          const { comment } = await response.json();
          setComments(prev => [...prev, comment]);

          // Broadcast via WebSocket
          sendComment(entityId, comment);

          setNewComment('');
        }
      } catch (error) {
        console.error('Failed to post comment', error);
      } finally {
        setIsLoading(false);
      }
    },
    [newComment, isLoading, currentUserId, currentUserName, entityId, entityType, sendComment]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        const response = await fetch(`/api/${entityType}/${entityId}/comments/${commentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setComments(prev => prev.filter(c => c.id !== commentId));
        }
      } catch (error) {
        console.error('Failed to delete comment', error);
      }
    },
    [entityId, entityType]
  );

  const commentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Container>
      <Header>
        <MessageCircle size={20} />
        Discussion ({comments.length})
      </Header>

      <CommentThread>
        <AnimatePresence>
          {comments.length === 0 ? (
            <EmptyState>No comments yet. Start the conversation!</EmptyState>
          ) : (
            comments.map(comment => (
              <CommentBubble
                key={comment.id}
                $isOwn={comment.authorId === currentUserId}
                variants={commentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <CommentHeader>
                  <Author>{comment.authorName}</Author>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Timestamp>{new Date(comment.createdAt).toLocaleTimeString()}</Timestamp>
                    {comment.authorId === currentUserId && (
                      <DeleteButton onClick={() => handleDeleteComment(comment.id)} type="button">
                        <Trash2 size={14} />
                      </DeleteButton>
                    )}
                  </div>
                </CommentHeader>
                <CommentText>{comment.content}</CommentText>
                {comment.isEdited && <Timestamp style={{ fontSize: '11px' }}>(edited)</Timestamp>}
              </CommentBubble>
            ))
          )}
        </AnimatePresence>
      </CommentThread>

      <InputContainer onSubmit={handleSubmitComment}>
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          disabled={isLoading || !isConnected}
        />
        <SendButton
          type="submit"
          disabled={!newComment.trim() || isLoading || !isConnected}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send size={16} />
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default EntityComments;
