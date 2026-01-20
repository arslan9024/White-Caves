/**
 * Enhanced Assistant Item Component
 * Displays assistant with status indicator and notification badge
 */

import React from 'react';
import styled from 'styled-components';

const AssistantItemContainer = styled.div<{ $isActive: boolean; $status: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-right: 3px solid transparent;
  position: relative;

  background-color: ${(props) =>
    props.$isActive ? `rgba(52, 152, 219, 0.1)` : 'transparent'};
  border-right-color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return '#27ae60';
      case 'idle':
        return '#f39c12';
      case 'offline':
        return '#e74c3c';
      default:
        return props.$isActive ? '#3498db' : 'transparent';
    }
  }};

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateX(-4px);
  }

  &:active {
    transform: translateX(-2px);
  }
`;

const AssistantAvatar = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(props) => props.$color}22, ${(props) => props.$color}44);
  border: 2px solid ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.$color};
  flex-shrink: 0;
`;

const AssistantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const AssistantName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #fff;
`;

const StatusBadge = styled.div<{ $status: string }>`
  font-size: 11px;
  font-weight: 400;
  color: ${(props) => {
    switch (props.$status) {
      case 'active':
        return '#27ae60';
      case 'idle':
        return '#f39c12';
      case 'offline':
        return '#e74c3c';
      default:
        return '#999';
    }
  }};
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    display: inline-block;
  }
`;

const NotificationBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e74c3c;
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type AssistantStatus = 'active' | 'idle' | 'offline';

interface AssistantItemProps {
  id: string;
  name: string;
  status?: AssistantStatus;
  notifications?: number;
  isActive: boolean;
  onClick: () => void;
  color?: string;
  avatar?: string;
}

/**
 * Enhanced Assistant Item Component
 * Shows assistant avatar, name, status, and notification badge
 */
export const EnhancedAssistantItem: React.FC<AssistantItemProps> = ({
  id,
  name,
  status = 'idle',
  notifications = 0,
  isActive,
  onClick,
  color = '#3498db',
  avatar,
}) => {
  // Get avatar initials from name
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const statusText = {
    active: 'Active',
    idle: 'Idle',
    offline: 'Offline',
  }[status] || 'Unknown';

  return (
    <AssistantItemContainer
      $isActive={isActive}
      $status={status}
      onClick={onClick}
      title={`${name} - ${statusText}`}
      aria-selected={isActive}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <AssistantAvatar $color={color}>
        {avatar || initials}
      </AssistantAvatar>
      <AssistantInfo>
        <AssistantName>{name}</AssistantName>
        <StatusBadge $status={status}>{statusText}</StatusBadge>
      </AssistantInfo>
      {notifications > 0 && (
        <NotificationBadge title={`${notifications} unread message${notifications !== 1 ? 's' : ''}`}>
          {notifications > 99 ? '99+' : notifications}
        </NotificationBadge>
      )}
    </AssistantItemContainer>
  );
};

export default EnhancedAssistantItem;
