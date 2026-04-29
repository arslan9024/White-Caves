/**
 * Alert Component
 * Displays contextual feedback messages
 */

import React, { useState } from 'react';
import { AlertProps } from './types';
import {
  StyledAlert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertMessage,
  AlertActions,
  AlertCloseButton,
} from './Alert.styles';

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      message,
      icon,
      action,
      isDismissible = false,
      onDismiss,
      children,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleDismiss = () => {
      setIsOpen(false);
      onDismiss?.();
    };

    if (!isOpen) return null;

    return (
      <StyledAlert ref={ref} $variant={variant} className={className} role="alert" {...rest}>
        {icon && <AlertIcon className="alert-icon">{icon}</AlertIcon>}

        <AlertContent>
          {title && <AlertTitle>{title}</AlertTitle>}
          {message && <AlertMessage>{message}</AlertMessage>}
          {children && <AlertMessage>{children}</AlertMessage>}
        </AlertContent>

        <AlertActions>
          {action && <div>{action}</div>}
          {isDismissible && (
            <AlertCloseButton onClick={handleDismiss} aria-label="Dismiss alert">
              ✕
            </AlertCloseButton>
          )}
        </AlertActions>
      </StyledAlert>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
