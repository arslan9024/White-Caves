/**
 * Toast Context - Global Toast State Management
 * =============================================
 * Provides centralized toast notification system with queue management,
 * automatic dismissal, and accessibility features.
 */

import React, { createContext, ReactNode, useCallback, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface ToastContextType {
  toasts: Toast[];
  show: (config: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast Provider Component
 * Manages toast notifications globally for the entire application
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Show a new toast notification
   * Returns the toast ID for programmatic dismissal
   */
  const show = useCallback(
    (config: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = {
        ...config,
        id,
      };

      setToasts(prev => [...prev, toast]);

      // Auto-dismiss if duration is specified
      if (config.duration && config.duration > 0) {
        const timer = setTimeout(() => {
          dismiss(id);
        }, config.duration);

        // Return cleanup function
        return id;
      }

      return id;
    },
    []
  );

  /**
   * Dismiss a specific toast by ID
   */
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Dismiss all currently displayed toasts
   */
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    toasts,
    show,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
