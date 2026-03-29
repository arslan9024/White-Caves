/**
 * Toast Container Component
 * =========================
 * Renders all active toasts from the context with proper positioning,
 * animations, and accessibility features.
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useToast } from '../../context/useToast';
import type { Toast as ToastType } from '../../context/ToastContext';
import { Info, CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const ToastContainerWrapper = styled.div<{ $position: string }>`
  position: fixed;
  pointer-events: none;
  z-index: var(--z-toast, 400);

  ${props => {
    switch (props.$position) {
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-center':
        return 'top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'bottom-center':
        return 'bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px;';
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      default:
        return 'top: 20px; right: 20px;';
    }
  }}
`;

const ToastStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
`;

const ToastItemWrapper = styled.div<{ $type: string; $isExiting: boolean }>`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-left: 4px solid ${props => {
    const colors: Record<string, string> = {
      info: '#2196f3', success: '#4caf50', warning: '#ff9800', error: '#f44336',
    };
    return colors[props.$type] || '#2196f3';
  }};
  animation: ${props => (props.$isExiting ? 'toastSlideOut' : 'toastSlideIn')} 0.3s ease-in-out;
  max-width: 400px;

  @keyframes toastSlideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes toastSlideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;

const ToastIconWrapper = styled.div<{ $type: string }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${props => {
    const colors: Record<string, string> = {
      info: '#2196f3', success: '#4caf50', warning: '#ff9800', error: '#f44336',
    };
    return colors[props.$type] || '#2196f3';
  }};
  svg { width: 20px; height: 20px; }
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  align-self: center;
`;

const ToastActionBtn = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: #0066cc;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { color: #0052a3; text-decoration: underline; }
`;

const ToastCloseBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  border-radius: 4px;
  &:hover { color: #333; background-color: #f5f5f5; }
  svg { width: 16px; height: 16px; }
`;

const ICONS: Record<string, React.ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertCircle size={20} />,
  error: <XCircle size={20} />,
};

/** Single toast item with auto-dismiss */
const SingleToastItem: React.FC<{
  toast: ToastType;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return undefined;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <ToastItemWrapper $type={toast.type} $isExiting={isExiting} role="alert" aria-live="polite">
      <ToastIconWrapper $type={toast.type}>
        {ICONS[toast.type] || ICONS.info}
      </ToastIconWrapper>
      <ToastMessage>{toast.message}</ToastMessage>
      {toast.action && (
        <ToastActionBtn onClick={toast.action.onClick}>
          {toast.action.label}
        </ToastActionBtn>
      )}
      <ToastCloseBtn onClick={handleClose} aria-label="Close notification" title="Close">
        <X />
      </ToastCloseBtn>
    </ToastItemWrapper>
  );
};

/**
 * Toast Container Component
 * Manages rendering of all active toasts
 */
export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ] as const;

  return (
    <>
      {positions.map(position => {
        const toastsAtPosition = toasts.filter(toast => toast.position === position);

        if (toastsAtPosition.length === 0) return null;

        return (
          <ToastContainerWrapper key={position} $position={position}>
            <ToastStack>
              {toastsAtPosition.map(toast => (
                <SingleToastItem
                  key={toast.id}
                  toast={toast}
                  onClose={() => {
                    dismiss(toast.id);
                    toast.onClose?.();
                  }}
                />
              ))}
            </ToastStack>
          </ToastContainerWrapper>
        );
      })}
    </>
  );
};

export default ToastContainer;
