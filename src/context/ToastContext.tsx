/**
 * Toast Context - Global Toast State Management
 * =============================================
 * Provides centralized toast notification system with queue management,
 * automatic dismissal, and accessibility features.
 */

import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  /**
   * Dismiss a specific toast by ID
   */
  const dismiss = useCallback((id: string) => {
    // Clear associated auto-dismiss timer
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Show a new toast notification
   * Returns the toast ID for programmatic dismissal
   */
  const show = useCallback(
    (config: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  /**
   * Dismiss all currently displayed toasts
   */
  const dismissAll = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const value: ToastContextType = useMemo(() => ({
    toasts,
    show,
    dismiss,
    dismissAll,
  }), [toasts, show, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
