/**
 * NADIA Components - Styled Components
 * Design system integration with styled-components
 * Now using centralized White Caves theme tokens
 */

import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

const { spacing, radius, shadows, transitions, colors } = theme;

/**
 * Design tokens — bridge from local API to centralized theme.
 * Keeps all tokens.xxx references working while pulling from
 * the single source of truth in styles/theme.
 */
const tokens = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    danger: colors.error,
    warning: colors.warning,
    success: colors.success,
    background: {
      primary: colors.background.primary,
      secondary: colors.background.tertiary,
    },
    surface: {
      primary: colors.background.secondary,
      secondary: colors.background.tertiary,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      tertiary: colors.text.tertiary,
    },
    border: {
      subtle: colors.border,
      light: colors.borderDark,
      dark: '#9CA3AF',
    },
  },
  spacing: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
  },
  borderRadius: {
    sm: radius.sm,
    md: radius.lg,    // nadia md (8px) = theme lg (8px)
    lg: radius.xl,    // nadia lg (12px) = theme xl (12px)
    xl: radius.xxl,   // nadia xl (16px) = theme xxl (16px)
  },
  shadows: {
    sm: shadows.xs,
    md: shadows.md,
    lg: shadows.lg,
  },
  transitions: {
    fast: `${transitions.durations.shortest} ${transitions.easing.easeInOut}`,
    base: `${transitions.durations.short} ${transitions.easing.easeInOut}`,
    slow: `${transitions.durations.complex} ${transitions.easing.easeInOut}`,
  },
};

/**
 * Main Dashboard Container
 */
export const NADIADashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 320px;
  height: 100vh;
  gap: ${tokens.spacing.md};
  background: ${tokens.colors.background.primary};
  padding: ${tokens.spacing.md};
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 280px 1fr 300px;
    gap: ${tokens.spacing.sm};
    padding: ${tokens.spacing.sm};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    height: auto;
  }
`;

/**
 * Left Sidebar - Conversation List
 */
export const ConversationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${tokens.colors.surface.primary};
  border: 1px solid ${tokens.colors.border.subtle};
  border-radius: ${tokens.borderRadius.lg};
  box-shadow: ${tokens.shadows.sm};
  overflow: hidden;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    height: auto;
    max-height: 300px;
  }
`;

export const ConversationListHeader = styled.div`
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.border.subtle};
  background: ${tokens.colors.surface.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${tokens.colors.text.primary};
  }
`;

export const ConversationListScroll = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.border.light};
    border-radius: 4px;

    &:hover {
      background: ${tokens.colors.border.dark};
    }
  }
`;

export const ConversationListItem = styled.div<{ isSelected?: boolean }>`
  padding: ${tokens.spacing.md};
  cursor: pointer;
  border-bottom: 1px solid ${tokens.colors.border.subtle};
  transition: background-color ${tokens.transitions.fast};

  ${(props) =>
    props.isSelected &&
    css`
      background-color: ${tokens.colors.primary}15;
      border-left: 4px solid ${tokens.colors.primary};
      padding-left: calc(${tokens.spacing.md} - 4px);
    `}

  &:hover {
    background-color: ${tokens.colors.surface.secondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ConversationItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${tokens.spacing.sm};
`;

export const ConversationItemName = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  color: ${tokens.colors.text.primary};
`;

export const ConversationItemInfo = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${tokens.colors.text.tertiary};
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${tokens.borderRadius.sm};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.status) {
      case 'ACTIVE':
        return css`
          background-color: #dcfce7;
          color: #166534;
        `;
      case 'PENDING':
        return css`
          background-color: #fef3c7;
          color: #92400e;
        `;
      case 'CLOSED':
        return css`
          background-color: #f3f4f6;
          color: #6b7280;
        `;
      case 'SPAM':
        return css`
          background-color: #fee2e2;
          color: #991b1b;
        `;
      default:
        return css`
          background-color: ${tokens.colors.surface.secondary};
          color: ${tokens.colors.text.primary};
        `;
    }
  }}
`;

export const LeadScoreBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  font-size: 12px;
  color: ${tokens.colors.text.secondary};
`;

export const ScoreBarFill = styled.div<{ score: number }>`
  width: 100px;
  height: 4px;
  background: ${tokens.colors.border.subtle};
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => props.score}%;
    background: ${(props) =>
      props.score >= 75
        ? tokens.colors.success
        : props.score >= 50
          ? tokens.colors.warning
          : tokens.colors.danger};
    transition: width ${tokens.transitions.base};
  }
`;

export const UnreadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${tokens.colors.danger};
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`;

/**
 * Center Pane - Message Viewer
 */
export const MessageViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${tokens.colors.surface.primary};
  border: 1px solid ${tokens.colors.border.subtle};
  border-radius: ${tokens.borderRadius.lg};
  box-shadow: ${tokens.shadows.sm};
  overflow: hidden;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

export const MessageViewerHeader = styled.div`
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.border.subtle};
  background: ${tokens.colors.surface.secondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MessageViewerHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${tokens.colors.text.primary};
  }

  p {
    margin: 0;
    font-size: 13px;
    color: ${tokens.colors.text.secondary};
  }
`;

export const MessageViewerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${tokens.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.border.light};
    border-radius: 4px;

    &:hover {
      background: ${tokens.colors.border.dark};
    }
  }
`;

export const MessageBubble = styled.div<{ sender: 'CUSTOMER' | 'AGENT' }>`
  display: flex;
  flex-direction: ${(props) => (props.sender === 'CUSTOMER' ? 'row' : 'row-reverse')};
  align-items: flex-end;
  gap: ${tokens.spacing.sm};
`;

export const MessageContent = styled.div<{ sender: 'CUSTOMER' | 'AGENT' }>`
  max-width: 70%;
  background: ${(props) =>
    props.sender === 'CUSTOMER'
      ? tokens.colors.primary
      : tokens.colors.surface.secondary};
  color: ${(props) => (props.sender === 'CUSTOMER' ? 'white' : tokens.colors.text.primary)};
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.lg};
  word-break: break-word;
  box-shadow: ${tokens.shadows.sm};

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

export const MessageMetadata = styled.div`
  font-size: 12px;
  color: ${tokens.colors.text.tertiary};
  display: flex;
  gap: ${tokens.spacing.sm};
  align-items: center;
  margin-top: ${tokens.spacing.xs};
`;

export const SentimentBadge = styled.span<{ sentiment?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  padding: 2px 8px;
  background: ${(props) => {
    switch (props.sentiment) {
      case 'POSITIVE':
        return '#dcfce7';
      case 'NEGATIVE':
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${(props) => {
    switch (props.sentiment) {
      case 'POSITIVE':
        return '#166534';
      case 'NEGATIVE':
        return '#991b1b';
      default:
        return '#6b7280';
    }
  }};
  border-radius: ${tokens.borderRadius.sm};
  font-size: 11px;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${tokens.colors.text.tertiary};
  text-align: center;
  padding: ${tokens.spacing.lg};

  p {
    margin: 0;
    font-size: 14px;
  }
`;

/**
 * Message Input
 */
export const MessageInputContainer = styled.div`
  padding: ${tokens.spacing.md};
  border-top: 1px solid ${tokens.colors.border.subtle};
  background: ${tokens.colors.surface.secondary};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
`;

export const MessageInputControls = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
  align-items: center;
`;

export const MessageTypeSelect = styled.select`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border: 1px solid ${tokens.colors.border.light};
  border-radius: ${tokens.borderRadius.md};
  background: ${tokens.colors.surface.primary};
  color: ${tokens.colors.text.primary};
  font-size: 13px;
  cursor: pointer;
  transition: border-color ${tokens.transitions.fast};

  &:hover {
    border-color: ${tokens.colors.border.dark};
  }

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px ${tokens.colors.primary}10;
  }
`;

export const MessageTextarea = styled.textarea`
  padding: ${tokens.spacing.md};
  border: 1px solid ${tokens.colors.border.light};
  border-radius: ${tokens.borderRadius.md};
  background: ${tokens.colors.surface.primary};
  color: ${tokens.colors.text.primary};
  font-family: inherit;
  font-size: 14px;
  resize: none;
  max-height: 150px;
  transition: border-color ${tokens.transitions.fast};

  &:hover {
    border-color: ${tokens.colors.border.dark};
  }

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px ${tokens.colors.primary}10;
  }

  &:disabled {
    background: ${tokens.colors.surface.secondary};
    cursor: not-allowed;
  }
`;

export const MessageInputFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CharCount = styled.span<{ isWarning?: boolean }>`
  font-size: 12px;
  color: ${(props) =>
    props.isWarning ? tokens.colors.warning : tokens.colors.text.tertiary};
`;

export const SendButton = styled.button`
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  background: ${tokens.colors.primary};
  color: white;
  border: none;
  border-radius: ${tokens.borderRadius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${tokens.transitions.fast};

  &:hover:not(:disabled) {
    background: ${tokens.colors.primary}dd;
    box-shadow: ${tokens.shadows.md};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: ${tokens.colors.border.light};
    cursor: not-allowed;
  }
`;

/**
 * Right Sidebar - Queue Manager
 */
export const QueueManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${tokens.colors.surface.primary};
  border: 1px solid ${tokens.colors.border.subtle};
  border-radius: ${tokens.borderRadius.lg};
  box-shadow: ${tokens.shadows.sm};
  overflow: hidden;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    height: auto;
    max-height: 300px;
  }
`;

export const QueueManagerHeader = styled.div`
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.border.subtle};
  background: ${tokens.colors.surface.secondary};

  h3 {
    margin: 0 0 ${tokens.spacing.md} 0;
    font-size: 16px;
    font-weight: 600;
    color: ${tokens.colors.text.primary};
  }
`;

export const QueueStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${tokens.spacing.sm};
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: ${tokens.spacing.sm} 0;

  span:first-child {
    color: ${tokens.colors.text.secondary};
  }

  span:last-child {
    color: ${tokens.colors.text.primary};
    font-weight: 600;
  }
`;

export const QueueManagerScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${tokens.spacing.md};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.border.light};
    border-radius: 3px;

    &:hover {
      background: ${tokens.colors.border.dark};
    }
  }
`;

export const QueueItemContainer = styled.div`
  background: ${tokens.colors.surface.secondary};
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.md};
  margin-bottom: ${tokens.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const QueueItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${tokens.spacing.sm};
`;

export const QueueItemName = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${tokens.colors.text.primary};
`;

export const QueueItemMeta = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${tokens.colors.text.tertiary};
`;

export const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;

  ${(props) => {
    switch (props.priority) {
      case 'URGENT':
        return css`
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'HIGH':
        return css`
          background: #fef3c7;
          color: #92400e;
        `;
      case 'NORMAL':
        return css`
          background: #dbeafe;
          color: #1e40af;
        `;
      default:
        return css`
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

export const AssignAgentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
`;

export const AssignAgentInput = styled.input`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border: 1px solid ${tokens.colors.border.light};
  border-radius: ${tokens.borderRadius.md};
  background: ${tokens.colors.surface.primary};
  color: ${tokens.colors.text.primary};
  font-size: 12px;
  transition: border-color ${tokens.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${tokens.colors.primary};
    box-shadow: 0 0 0 3px ${tokens.colors.primary}10;
  }
`;

export const AssignButtonSmall = styled.button`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background: ${tokens.colors.secondary};
  color: white;
  border: none;
  border-radius: ${tokens.borderRadius.md};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${tokens.transitions.fast};

  &:hover:not(:disabled) {
    background: ${tokens.colors.secondary}dd;
  }

  &:disabled {
    background: ${tokens.colors.border.light};
    cursor: not-allowed;
  }
`;

/**
 * Loading & Error States
 */
export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.md};
  padding: ${tokens.spacing.lg};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 3px solid ${tokens.colors.border.light};
    border-top-color: ${tokens.colors.primary};
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
`;

export const ErrorAlert = styled.div`
  padding: ${tokens.spacing.md};
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-radius: ${tokens.borderRadius.md};
  font-size: 13px;
  display: flex;
  gap: ${tokens.spacing.sm};
  align-items: flex-start;

  button {
    margin-left: auto;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
  }
`;

export { tokens };
