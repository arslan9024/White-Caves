/**
 * Notification Center Component
 * Bell icon with notification dropdown
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { spacing } from '../../styles/theme/spacing';
import { Badge } from '../design-system';

export type NotificationCenterProps = {
  notifications?: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onViewAll?: () => void;
  className?: string;
};

const NotificationContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const BellButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.primary};
  font-size: 20px;
  cursor: pointer;
  padding: ${spacing.sm};
  position: relative;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.primary};
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

const NotificationBadge = styled(Badge)`
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${theme.spacing.sm};
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.lg};
  min-width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: ${theme.zIndex.dropdown};
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`;

const DropdownHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationItem = styled.div<{ $read: boolean }>`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  background: ${(props) =>
    props.$read ? theme.colors.background.primary : theme.colors.background.secondary};
  cursor: pointer;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};

  &:hover {
    background: ${theme.colors.background.secondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
`;

const NotificationMessage = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.xs};
  margin-bottom: ${theme.spacing.xs};
`;

const NotificationTime = styled.div`
  color: ${theme.colors.text.disabled};
  font-size: ${theme.typography.sizes.xs};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.text.disabled};
  font-size: ${theme.typography.sizes.sm};
`;

const ViewAllButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0;
  cursor: pointer;
  font-weight: ${theme.typography.weights.medium};
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};

  &:hover {
    background: ${theme.colors.primary};
    opacity: 0.9;
  }
`;

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  onMarkAsRead,
  onDismiss,
  onViewAll,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (id: string) => {
    onMarkAsRead?.(id);
  };

  return (
    <NotificationContainer className={className}>
      <BellButton
        onClick={handleBellClick}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={isOpen}
      >
        🔔
        {unreadCount > 0 && <NotificationBadge variant="error">{unreadCount}</NotificationBadge>}
      </BellButton>

      <DropdownMenu $isOpen={isOpen}>
        <DropdownHeader>Notifications</DropdownHeader>

        {notifications.length === 0 ? (
          <EmptyState>No notifications</EmptyState>
        ) : (
          <>
            <NotificationList>
              {notifications.slice(0, 5).map((notif) => (
                <NotificationItem
                  key={notif.id}
                  $read={notif.read}
                  onClick={() => handleNotificationClick(notif.id)}
                  role="button"
                  tabIndex={0}
                >
                  <NotificationTitle>{notif.title}</NotificationTitle>
                  <NotificationMessage>{notif.message}</NotificationMessage>
                  <NotificationTime>{notif.timestamp}</NotificationTime>
                </NotificationItem>
              ))}
            </NotificationList>
            {notifications.length > 5 && (
              <ViewAllButton onClick={onViewAll}>View All Notifications</ViewAllButton>
            )}
          </>
        )}
      </DropdownMenu>

      {isOpen && (
        <Backdrop
          onClick={() => setIsOpen(false)}
          role="presentation"
        />
      )}
    </NotificationContainer>
  );
};

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${theme.zIndex.dropdown - 1};
`;

NotificationCenter.displayName = 'NotificationCenter';

export default NotificationCenter;
