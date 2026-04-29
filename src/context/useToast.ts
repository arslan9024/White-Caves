/**
 * useToast Hook
 * =============
 * Custom React hook for using the Toast context throughout the application.
 * Provides convenient access to toast notifications with type safety.
 */

import { useContext } from 'react';
import { ToastContext, ToastContextType, Toast, ToastType, ToastPosition } from './ToastContext';

/**
 * Hook to use Toast context
 * Must be used inside a ToastProvider component
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used inside a ToastProvider. ' +
      'Make sure your component is wrapped with <ToastProvider>.'
    );
  }

  return context;
};

/**
 * Convenience hook for showing a success toast
 */
export const useSuccessToast = () => {
  const { show } = useToast();

  return (message: string, duration = 3000) => {
    return show({
      message,
      type: 'success' as ToastType,
      position: 'bottom-right' as ToastPosition,
      duration,
    });
  };
};

/**
 * Convenience hook for showing an error toast
 */
export const useErrorToast = () => {
  const { show } = useToast();

  return (message: string, duration = 4000) => {
    return show({
      message,
      type: 'error' as ToastType,
      position: 'bottom-right' as ToastPosition,
      duration,
    });
  };
};

/**
 * Convenience hook for showing a warning toast
 */
export const useWarningToast = () => {
  const { show } = useToast();

  return (message: string, duration = 3500) => {
    return show({
      message,
      type: 'warning' as ToastType,
      position: 'bottom-right' as ToastPosition,
      duration,
    });
  };
};

/**
 * Convenience hook for showing an info toast
 */
export const useInfoToast = () => {
  const { show } = useToast();

  return (message: string, duration = 3000) => {
    return show({
      message,
      type: 'info' as ToastType,
      position: 'bottom-right' as ToastPosition,
      duration,
    });
  };
};

/**
 * Advanced hook for fine-grained toast control
 * Returns the show function for manual configuration
 */
export const useCustomToast = () => {
  const { show, dismiss, dismissAll } = useToast();

  return {
    show: (config: Omit<Toast, 'id'>) => show(config),
    dismiss: (id: string) => dismiss(id),
    dismissAll: () => dismissAll(),
  };
};
