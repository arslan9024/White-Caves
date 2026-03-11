import React, { FC, ReactNode } from 'react';
import {
  StatusIndicatorWrapper,
  StatusIndicatorDot,
  StatusIndicatorLabel,
  StatusIndicatorContainer,
  StatusRing,
} from './StatusIndicator.styles';

export type StatusType = 'active' | 'inactive' | 'pending' | 'error' | 'warning' | 'success';

interface StatusIndicatorProps {
  status: StatusType;
  label?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'dot' | 'ring' | 'pulse';
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'medium',
  variant = 'dot',
  className = '',
  style,
  title,
}) => {
  const Content = (
    <StatusIndicatorWrapper
      $size={size}
      $variant={variant}
      className={className}
      style={style}
      title={title}
    >
      {variant === 'ring' ? (
        <StatusRing $status={status} $size={size}>
          <StatusIndicatorDot $status={status} $size={size} $variant={variant} />
        </StatusRing>
      ) : (
        <StatusIndicatorDot $status={status} $size={size} $variant={variant} />
      )}
      {label && <StatusIndicatorLabel $size={size}>{label}</StatusIndicatorLabel>}
    </StatusIndicatorWrapper>
  );

  return Content;
};

interface StatusBadgeProps {
  status: StatusType;
  label?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
  style,
}) => {
  return (
    <StatusIndicatorContainer
      $status={status}
      className={className}
      style={style}
    >
      <StatusIndicatorDot $status={status} $size="small" $variant="dot" />
      {label && <span>{label}</span>}
    </StatusIndicatorContainer>
  );
};

export default StatusIndicator;
