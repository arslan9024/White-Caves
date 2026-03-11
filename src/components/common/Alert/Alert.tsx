import React, { FC, ReactNode } from 'react';
import { AlertCircle, InfoIcon, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import {
  AlertContainer,
  AlertHeaderSection,
  AlertIconWrapper,
  AlertHeadingWrapper,
  AlertTitle,
  AlertDescription,
  AlertContent,
  AlertActions,
  AlertCloseButton,
} from './Alert.styles';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  severity?: AlertSeverity;
  title?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  onClose?: () => void;
  closeable?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'filled' | 'outlined' | 'standard';
}

const severityIcons: Record<AlertSeverity, ReactNode> = {
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <InfoIcon size={20} />,
  success: <CheckCircle2 size={20} />,
};

export const Alert: FC<AlertProps> = ({
  severity = 'info',
  title,
  children,
  description,
  onClose,
  closeable = false,
  icon,
  action,
  className = '',
  style,
  variant = 'standard',
}) => {
  return (
    <AlertContainer
      $severity={severity}
      $variant={variant}
      className={className}
      style={style}
      role="alert"
    >
      <AlertHeaderSection>
        <AlertIconWrapper $severity={severity}>
          {icon !== undefined ? icon : severityIcons[severity]}
        </AlertIconWrapper>
        <AlertHeadingWrapper>
          {title && <AlertTitle>{title}</AlertTitle>}
          {(description || children) && (
            <AlertDescription>{description || children}</AlertDescription>
          )}
        </AlertHeadingWrapper>
      </AlertHeaderSection>
      {action && <AlertActions>{action}</AlertActions>}
      {closeable && onClose && (
        <AlertCloseButton onClick={onClose} aria-label="Close alert">
          <X size={18} />
        </AlertCloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert;
