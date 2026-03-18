/**
 * Alert Component
 * ==============
 * Professional alert component for messages, warnings, and notifications
 */

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import {
  Info, CheckCircle, AlertCircle, XCircle, X,
} from 'lucide-react';
import { AlertProps, AlertType } from './advancedUI.types';

// ============================================================================
// STYLES
// ============================================================================

const AlertContainer = styled.div<{ $type: AlertType; $filled?: boolean }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.3s ease;

  background-color: ${(props) => {
    const colors: Record<AlertType, string> = {
      info: props.$filled ? '#e3f2fd' : '#ffffff',
      success: props.$filled ? '#e8f5e9' : '#ffffff',
      warning: props.$filled ? '#fff3e0' : '#ffffff',
      error: props.$filled ? '#ffebee' : '#ffffff',
    };
    return colors[props.$type];
  }};

  border-color: ${(props) => {
    const colors: Record<AlertType, string> = {
      info: '#90caf9',
      success: '#81c784',
      warning: '#ffb74d',
      error: '#ef9a9a',
    };
    return colors[props.$type];
  }};

  color: ${(props) => {
    const colors: Record<AlertType, string> = {
      info: '#1565c0',
      success: '#2e7d32',
      warning: '#e65100',
      error: '#c62828',
    };
    return colors[props.$type];
  }};
`;

const AlertIcon = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  margin-top: 2px;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const AlertMessage = styled.div`
  font-size: 14px;
  line-height: 1.4;
`;

const AlertDescription = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  line-height: 1.4;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const AlertButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$variant === 'primary' ? 'currentColor' : 'transparent')};
  color: ${(props) => (props.$variant === 'primary' ? 'white' : 'currentColor')};
  border: ${(props) => (props.$variant === 'primary' ? 'none' : '1px solid currentColor')};

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ALERT_ICONS: Record<AlertType, React.ReactNode> = {
  info: <Info size={20} />,
  success: <CheckCircle size={20} />,
  warning: <AlertCircle size={20} />,
  error: <XCircle size={20} />,
};

// ============================================================================
// COMPONENT
// ============================================================================

const Alert: FC<AlertProps> = ({
  type,
  title,
  message,
  description,
  icon,
  closable = true,
  onClose,
  actions = [],
  className = '',
  filled = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AlertContainer
      $type={type}
      $filled={filled}
      className={className}
      role="alert"
    >
      <AlertIcon>
        {icon || ALERT_ICONS[type]}
      </AlertIcon>

      <AlertContent>
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertMessage>{message}</AlertMessage>
        {description && <AlertDescription>{description}</AlertDescription>}

        {actions.length > 0 && (
          <AlertActions>
            {actions.map((action, idx) => (
              <AlertButton
                key={idx}
                $variant={action.variant}
                onClick={action.onClick}
              >
                {action.label}
              </AlertButton>
            ))}
          </AlertActions>
        )}
      </AlertContent>

      {closable && (
        <CloseButton
          onClick={handleClose}
          aria-label="Close alert"
          title="Close"
        >
          <X />
        </CloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert;
