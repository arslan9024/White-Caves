/**
 * Avatar Component
 * User avatar with initials or image
 */

import React, { memo } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  status?: 'online' | 'offline' | 'away';
  className?: string;
};

const getSizeStyles = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  const sizes = {
    sm: { width: '32px', height: '32px', fontSize: '12px' },
    md: { width: '40px', height: '40px', fontSize: '14px' },
    lg: { width: '56px', height: '56px', fontSize: '18px' },
    xl: { width: '80px', height: '80px', fontSize: '24px' },
  };
  return sizes[size] || sizes.md;
};

const getVariantColor = (variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error') => {
  const colors = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
  };
  return colors[variant] || colors.primary;
};

const AvatarContainer = styled.div<{ $size?: 'sm' | 'md' | 'lg' | 'xl' }>`
  position: relative;
  width: ${(props) => getSizeStyles(props.$size || 'md').width};
  height: ${(props) => getSizeStyles(props.$size || 'md').height};
  flex-shrink: 0;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarInitials = styled.div<{ $size?: 'sm' | 'md' | 'lg' | 'xl'; $variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => getVariantColor(props.$variant || 'primary')};
  color: white;
  font-size: ${(props) => getSizeStyles(props.$size || 'md').fontSize};
  font-weight: ${theme.typography.weights.semibold};
`;

const StatusIndicator = styled.div<{ $status?: 'online' | 'offline' | 'away' }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: ${(props) => {
    if (props.$status === 'online') return theme.colors.success;
    if (props.$status === 'away') return theme.colors.warning;
    return theme.colors.border;
  }};
`;

export const Avatar: React.FC<AvatarProps> = memo(function Avatar({
  src,
  alt = 'Avatar',
  initials = '?',
  size = 'md',
  variant = 'primary',
  status,
  className = '',
}) {
  return (
    <AvatarContainer $size={size} className={className}>
      {src ? (
        <AvatarImage src={src} alt={alt} />
      ) : (
        <AvatarInitials $size={size} $variant={variant}>
          {initials}
        </AvatarInitials>
      )}
      {status && <StatusIndicator $status={status} />}
    </AvatarContainer>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
