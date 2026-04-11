import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, shadows } = theme;

// Bot feature accent (cyan/teal)
const botAccent = '#06b6d4';
const botAccentDark = '#0891b2';
const botGradient = `linear-gradient(135deg, ${botAccent} 0%, ${botAccentDark} 100%)`;

/* ============================================================================
 * Bot Components Styled Components
 * Dark-themed bot management + chat UI with cyan accent
 * ============================================================================ */

export const BotSessionManager = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

export const ManagerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  h3 {
    color: #fff;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;

    h3 {
      font-size: 1rem;
    }
  }
`;

export const CreateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: ${botGradient};
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
  }
`;

export const BotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const BotCard = styled.div<{
  $selected?: boolean;
  $status?: 'connected' | 'disconnected' | 'pending';
}>`
  background: ${(props) =>
    props.$selected ? `rgba(6, 182, 212, 0.1)` : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${(props) =>
    props.$selected ? botAccent : 'rgba(255, 255, 255, 0.1)'};
  border-left: ${(props) => {
    if (props.$status === 'connected') return `3px solid ${colors.success}`;
    if (props.$status === 'disconnected') return `3px solid ${colors.error}`;
    if (props.$status === 'pending') return `3px solid ${colors.warning}`;
    return '3px solid transparent';
  }};
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const BotHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 0.75rem;
`;

export const BotName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 600;
  flex: 1;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

export const BotActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const ActionBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const StatusIndicator = styled.span<{ $status?: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case 'connected':
        return colors.success;
      case 'disconnected':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return '#64748b';
    }
  }};
  flex-shrink: 0;
`;

export const BotMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #64748b;

  span:last-child {
    font-weight: 500;
    color: #94a3b8;
  }
`;

// ============================================================================
// Message/Chat Styles
// ============================================================================

export const ChatContainer = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

export const Message = styled.div<{ $isBot?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.$isBot ? 'flex-start' : 'flex-end')};
  align-items: flex-end;
  gap: 0.5rem;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MessageContent = styled.div<{ $isBot?: boolean }>`
  background: ${(props) =>
    props.$isBot ? 'rgba(255, 255, 255, 0.05)' : botGradient};
  border: ${(props) =>
    props.$isBot ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: ${(props) => (props.$isBot ? '#cbd5e1' : '#fff')};
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 70%;
  word-wrap: break-word;

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }
`;

export const ChatInput = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.5rem;
  }
`;

export const InputField = styled.input`
  flex: 1;
  padding: 0.625rem 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${botAccent};
    background: rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: #64748b;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
  }
`;

export const SendBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${botGradient};
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
