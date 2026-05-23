import React, { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import {
  StatusNotificationContainer,
  StatusNotificationItem,
  StatusIcon,
  StatusContent,
  StatusTitle,
  StatusMessage,
  StatusDismiss,
  StatusProgress,
} from './StatusNotification.styles';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationOptions {
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

interface StatusContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => number;
  removeNotification: (id: number) => void;
  success: (message: string, options?: NotificationOptions) => number;
  error: (message: string, options?: NotificationOptions) => number;
  warning: (message: string, options?: NotificationOptions) => number;
  info: (message: string, options?: NotificationOptions) => number;
  clear: () => void;
}

const StatusContext = createContext<StatusContextValue | null>(null);

export const useStatus = (): StatusContextValue => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};

interface StatusItemProps {
  notification: Notification;
  onDismiss: (id: number) => void;
}

const StatusItem: React.FC<StatusItemProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification.autoClose !== false) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  const getIcon = (): ReactNode => {
    switch (notification.type) {
      case 'success':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        );
      case 'error':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        );
      case 'info':
      default:
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
    }
  };

  return (
    <StatusNotificationItem $type={notification.type}>
      <StatusIcon $type={notification.type}>{getIcon()}</StatusIcon>
      <StatusContent>
        {notification.title && <StatusTitle>{notification.title}</StatusTitle>}
        <StatusMessage>{notification.message}</StatusMessage>
      </StatusContent>
      <StatusDismiss 
        onClick={() => onDismiss(notification.id)}
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </StatusDismiss>
      <StatusProgress 
        $type={notification.type}
        $duration={notification.duration || 5000}
      />
    </StatusNotificationItem>
  );
};

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): number => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message: string, options: NotificationOptions = {}): number => {
    return addNotification({ type: 'success', message, ...options });
  }, [addNotification]);

  const error = useCallback((message: string, options: NotificationOptions = {}): number => {
    return addNotification({ type: 'error', message, ...options });
  }, [addNotification]);

  const warning = useCallback((message: string, options: NotificationOptions = {}): number => {
    return addNotification({ type: 'warning', message, ...options });
  }, [addNotification]);

  const info = useCallback((message: string, options: NotificationOptions = {}): number => {
    return addNotification({ type: 'info', message, ...options });
  }, [addNotification]);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: StatusContextValue = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear
  };

  return (
    <StatusContext.Provider value={value}>
      {children}
      <StatusNotificationContainer>
        {notifications.map(notification => (
          <StatusItem 
            key={notification.id} 
            notification={notification} 
            onDismiss={removeNotification}
          />
        ))}
      </StatusNotificationContainer>
    </StatusContext.Provider>
  );
};

export default StatusProvider;
