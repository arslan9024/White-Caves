import React from 'react';
import { FC, ReactNode } from 'react';
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  NotificationContainer,
  NotificationContent,
  NotificationIcon,
  NotificationBody,
  NotificationTitle,
  NotificationMessage,
  NotificationClose,
  NotificationDismiss,
} from './Notification.styles';

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
