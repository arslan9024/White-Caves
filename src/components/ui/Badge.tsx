/**
 * Badge Component
 * ==============
 * Professional badge component for labels, counters, and status indicators
 */

import React, { FC, CSSProperties } from 'react';
import styled from 'styled-components';
import { X, AlertCircle } from 'lucide-react';
import { BadgeProps, BadgeVariant, BADGE_VARIANTS } from './advancedUI.types';

// ============================================================================
// STYLES
// ============================================================================

const BadgeContainer = styled.span<{
  $variant: BadgeVariant;
  $size: string;
  $shape: string;
  $dotOnly?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${(props) => (props.$dotOnly ? '0' : '4px 12px')};
  background-color: ${(props) => BADGE_VARIANTS[props.$variant].colors.background};
  color: ${(props) => BADGE_VARIANTS[props.$variant].colors.text};
  border: 1px solid ${(props) => BADGE_VARIANTS[props.$variant].colors.border};
  border-radius: ${(props) => {
    switch (props.$shape) {
      case 'pill':
        return '20px';
      case 'square':
        return '0px';
      default:
        return '4px';
    }
  }};
  font-size: ${(props) => {
    switch (props.$size) {
      case 'small':
        return '11px';
      case 'large':
        return '14px';
      default:
        return '12px';
    }
  }};
  font-weight: 600;
  white-space: nowrap;
  animation: ${(props) => (props.$dotOnly ? 'pulse 2s infinite' : 'none')};
  transition: all 0.2s ease;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const DotIndicator = styled.span<{ $variant: BadgeVariant }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: ${(props) => BADGE_VARIANTS[props.$variant].colors.background};
  border-radius: 50%;
  border: 1px solid ${(props) => BADGE_VARIANTS[props.$variant].colors.border};
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background-color: inherit;
  border-radius: 10px;
  font-weight: 700;
  font-size: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  cursor: pointer;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TooltipText = styled.span`
  position: relative;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 10px;
    background-color: #333;
    color: white;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    z-index: var(--z-tooltip, 800);
    pointer-events: none;
  }

  &:hover::before {
    content: '';
    position: absolute;
    bottom: 120%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
    z-index: var(--z-tooltip, 800);
    pointer-events: none;
  }
`;

// ============================================================================
// COMPONENT
// ============================================================================

const Badge: FC<BadgeProps> = ({
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  children,
  icon,
  closable = false,
  onClose,
  className = '',
  count,
  dotOnly = false,
  pulse = false,
  tooltip,
}) => {
  const badgeStyle: CSSProperties = pulse && !dotOnly ? { animation: 'pulse 2s infinite' } : {};

  const content = (
    <>
      {icon && !dotOnly && <span>{icon}</span>}
      {dotOnly ? (
        <DotIndicator $variant={variant} />
      ) : (
        <span>{children}</span>
      )}
      {count !== undefined && <CountBadge>{count}</CountBadge>}
      {closable && (
        <CloseButton
          onClick={onClose}
          aria-label="Remove badge"
          title="Remove"
        >
          <X size={14} />
        </CloseButton>
      )}
    </>
  );

  return (
    <BadgeContainer
      $variant={variant}
      $size={size}
      $shape={shape}
      $dotOnly={dotOnly}
      className={className}
      style={badgeStyle}
      title={tooltip}
      data-tooltip={tooltip}
      role="status"
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {tooltip && !dotOnly ? (
        <TooltipText data-tooltip={tooltip}>{content}</TooltipText>
      ) : (
        content
      )}
    </BadgeContainer>
  );
};

export default Badge;
