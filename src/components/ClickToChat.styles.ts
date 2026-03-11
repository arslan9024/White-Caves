import styled from 'styled-components';
import { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ClickToChatContainer = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
`;

export const ChatTrigger = styled.button<{ expanded?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.expanded 
    ? 'var(--text-secondary, #6b7280)' 
    : 'linear-gradient(135deg, #25D366, #128C7E)'};
  color: white;
  border: none;
  border-radius: ${props => props.expanded ? '50%' : '50px'};
  padding: ${props => props.expanded ? '0.75rem' : '0.75rem 1.25rem'};
  cursor: pointer;
  box-shadow: ${props => props.expanded 
    ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
    : '0 4px 20px rgba(37, 211, 102, 0.4)'};
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.expanded 
      ? '0 6px 16px rgba(0, 0, 0, 0.2)' 
      : '0 6px 28px rgba(37, 211, 102, 0.5)'};
  }
`;

export const ChatLabel = styled.span`
  white-space: nowrap;
  transition: all 0.3s ease;
`;

export const WhatsAppIconSmall = styled.svg`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
`;

export const ChatPopup = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 340px;
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: ${slideUp} 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: var(--card-bg, #252542);
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
`;

export const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
`;

export const ChatHeaderTitle = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
`;

export const OnlineStatus = styled.div<{ $isOnline?: boolean }>`
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${props => props.$isOnline ? '#90EE90' : '#ffa500'};
    border-radius: 50%;
    display: inline-block;
  }
`;

export const CloseChat = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

export const ChatBody = styled.div`
  padding: 1rem;
`;

export const WelcomeMessage = styled.div`
  background: var(--bg-secondary, #f0f0f0);
  padding: 0.75rem;
  border-radius: 12px;
  margin-bottom: 1rem;

  @media (prefers-color-scheme: dark) {
    background: var(--bg-tertiary, #1a1a2e);
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-primary, #1a1a2e);

    @media (prefers-color-scheme: dark) {
      color: var(--text-primary, #ffffff);
    }
  }
`;

export const QuickMessages = styled.div`
  margin-bottom: 1rem;
`;

export const QuickLabel = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 0.5rem 0;
`;

export const QuickMessageBtn = styled.button`
  display: inline-block;
  background: var(--bg-secondary, #f0f0f0);
  border: 1px solid var(--border-color, #e0e0e0);
  color: var(--text-primary, #1a1a2e);
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: var(--bg-tertiary, #1a1a2e);
    border-color: var(--border-color, #3a3a5a);
    color: var(--text-primary, #ffffff);
  }

  &:hover {
    background: var(--primary-color, #c41e3a);
    border-color: var(--primary-color, #c41e3a);
    color: white;
  }
`;

export const CustomMessageForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

export const MessageInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-primary, #1a1a2e);
  background: var(--bg-secondary, #f0f0f0);
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: var(--bg-tertiary, #1a1a2e);
    border-color: var(--border-color, #3a3a5a);
    color: var(--text-primary, #ffffff);
  }

  &:focus {
    outline: none;
    border-color: #25D366;
    background: white;

    @media (prefers-color-scheme: dark) {
      background: #2a2a4a;
    }
  }

  &::placeholder {
    color: var(--text-secondary, #6b7280);
  }
`;

export const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #25D366;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #128C7E;
    transform: scale(1.05);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ContactAppsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 12px;
`;

export const ChatAppBtn = styled.button<{ $appColor?: string }>`
  padding: 10px;
  background: ${props => props.$appColor || '#25D366'};
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;
