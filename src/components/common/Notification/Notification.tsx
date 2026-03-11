import React from 'react';
import { FC, ReactNode } from 'react';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
// TODO: Move to Notification.styles once created
import styled from 'styled-components';

const NotificationContainer = styled.div<{ $type?: NotificationType }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  background-color: ${({ $type, theme }) => {
    if (!$type) return '#ffffff';
    const colors: Record<NotificationType, string> = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6',
      warning: '#f59e0b',
    };
    return colors[$type];
  }};
`;

const NotificationContent = styled.div`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 16px;
`;

const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificationBody = styled.div``;
const NotificationTitle = styled.h4``;
const NotificationMessage = styled.p``;
const NotificationClose = styled.button``;
const NotificationDismiss = styled(X)`
  cursor: pointer;
`;

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  id?: string;
  type?: NotificationType;
  title?: ReactNode;
  message?: ReactNode;
  onClose?: () => void;
  closeable?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const notificationIcons: Record<NotificationType, ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export const Notification: FC<NotificationProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  closeable = true,
  icon,
  action,
  className = '',
  style,
}) => {
  return (
    <NotificationContainer $type={type} className={className} style={style}>
      <NotificationContent>
        {icon ? (
          <NotificationIcon>{icon}</NotificationIcon>
        ) : (
          <NotificationIcon>{notificationIcons[type]}</NotificationIcon>
        )}
        <NotificationBody>
          {title && <NotificationTitle>{title}</NotificationTitle>}
          {message && <NotificationMessage>{message}</NotificationMessage>}
        </NotificationBody>
      </NotificationContent>
      {action && <div>{action}</div>}
      {closeable && onClose && (
        <NotificationClose onClick={onClose}>
          <NotificationDismiss size={16} />
        </NotificationClose>
      )}
    </NotificationContainer>
  );
};

export default Notification;
