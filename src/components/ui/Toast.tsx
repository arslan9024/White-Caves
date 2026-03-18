/**
 * Toast Notification Component
 * ===========================
 * Professional toast notification system with multiple positions and types
 */

import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Info, CheckCircle, AlertCircle, XCircle, X, Zap,
} from 'lucide-react';
import { ToastConfig, ToastType, ToastPosition } from './advancedUI.types';

// ============================================================================
// STYLES
// ============================================================================

const ToastContainer = styled.div<{ $position: ToastPosition }>`
  position: fixed;
  z-index: 9999;
  ${(props) => {
    const [vertical, horizontal] = props.$position.split('-');
    return `
      ${vertical === 'top' ? 'top: 20px;' : 'bottom: 20px;'}
      ${horizontal === 'left' ? 'left: 20px;' : horizontal === 'right' ? 'right: 20px;' : 'left: 50%; transform: translateX(-50%);'}
    `;
  }}
  pointer-events: none;

  @media (max-width: 768px) {
    ${(props) => {
      const [vertical] = props.$position.split('-');
      return `
        ${vertical === 'top' ? 'top: 10px;' : 'bottom: 10px;'}
        left: 10px;
        right: 10px;
        transform: none;
      `;
    }}
  }
`;

const ToastItem = styled.div<{
  $type: ToastType;
  $isExiting: boolean;
}>`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  margin-bottom: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-left: 4px solid;
  border-left-color: ${(props) => {
    const colors: Record<ToastType, string> = {
      info: '#2196f3',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    };
    return colors[props.$type];
  }};
  animation: ${(props) => (props.$isExiting ? 'slideOut' : 'slideIn')} 0.3s ease-in-out;
  pointer-events: auto;
  max-width: 400px;

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const ToastIcon = styled.div<{ $type: ToastType }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${(props) => {
    const colors: Record<ToastType, string> = {
      info: '#2196f3',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    };
    return colors[props.$type];
  }};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ToastContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToastMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
`;

const ToastDescription = styled.div`
  font-size: 12px;
  color: #666;
  line-height: 1.3;
`;

const ToastAction = styled.button`
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: #0066cc;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  flex-shrink: 0;

  &:hover {
    color: #0052a3;
    text-decoration: underline;
  }
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #333;
    background-color: #f5f5f5;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ProgressBar = styled.div<{ $duration: number; $type: ToastType }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${(props) => {
    const colors: Record<ToastType, string> = {
      info: '#2196f3',
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
    };
    return colors[props.$type];
  }};
  animation: progress ${(props) => props.$duration}ms linear forwrads;

  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertCircle size={20} />,
  error: <XCircle size={20} />,
};

// ============================================================================
// TOAST ITEM COMPONENT
// ============================================================================

interface ToastItemProps {
  toast: ToastConfig;
  onRemove: (id: string) => void;
}

const ToastItemComponent: FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration === 0) {
      return undefined; // Persistent toast
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onRemove(toast.id);
      }, 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.id, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
      toast.onClose?.();
    }, 300);
  };

  return (
    <ToastItem
      $type={toast.type}
      $isExiting={isExiting}
      role="alert"
      aria-live="polite"
    >
      <ToastIcon $type={toast.type}>
        {toast.icon || TOAST_ICONS[toast.type]}
      </ToastIcon>

      <ToastContent>
        <ToastMessage>{toast.message}</ToastMessage>
        {toast.description && (
          <ToastDescription>{toast.description}</ToastDescription>
        )}
      </ToastContent>

      {toast.action && (
        <ToastAction onClick={toast.action.onClick}>
          {toast.action.label}
        </ToastAction>
      )}

      <CloseButton
        onClick={handleClose}
        aria-label="Close notification"
        title="Close"
      >
        <X />
      </CloseButton>

      {(toast.duration || 0) > 0 && (
        <ProgressBar $duration={toast.duration || 5000} $type={toast.type} />
      )}
    </ToastItem>
  );
};

// ============================================================================
// TOAST CONTAINER COMPONENT
// ============================================================================

interface ToastContainerProps {
  toasts: ToastConfig[];
  onRemove: (id: string) => void;
}

const ToastContainerComponent: FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  // Group toasts by position
  const toastsByPosition: Record<ToastPosition, ToastConfig[]> = {
    'top-left': [],
    'top-center': [],
    'top-right': [],
    'bottom-left': [],
    'bottom-center': [],
    'bottom-right': [],
  };

  toasts.forEach((toast) => {
    const position = toast.position || 'top-right';
    toastsByPosition[position].push(toast);
  });

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) =>
        positionToasts.length > 0 ? (
          <ToastContainer key={position} $position={position as ToastPosition}>
            {positionToasts.map((toast) => (
              <ToastItemComponent
                key={toast.id}
                toast={toast}
                onRemove={onRemove}
              />
            ))}
          </ToastContainer>
        ) : null
      )}
    </>
  );
};

export default ToastContainerComponent;
