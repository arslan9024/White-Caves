/**
 * Tooltip Component
 * Non-intrusive hover information display
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type TooltipProps = {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ $visible: boolean; $position: string }>`
  position: absolute;
  background: ${theme.colors.dark.bg};
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 4px;
  font-size: ${theme.typography.sizes.xs};
  white-space: nowrap;
  z-index: ${theme.zIndex.tooltip};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
  box-shadow: ${theme.shadows.md};

  ${(props) => {
    const offset = theme.spacing.md;
    switch (props.$position) {
      case 'top':
        return `bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-${offset}); margin-bottom: ${offset};`;
      case 'bottom':
        return `top: 100%; left: 50%; transform: translateX(-50%) translateY(${offset}); margin-top: ${offset};`;
      case 'left':
        return `right: 100%; top: 50%; transform: translateY(-50%) translateX(-${offset}); margin-right: ${offset};`;
      case 'right':
        return `left: 100%; top: 50%; transform: translateY(-50%) translateX(${offset}); margin-left: ${offset};`;
      default:
        return `bottom: 100%; left: 50%; transform: translateX(-50%) translateY(-${offset}); margin-bottom: ${offset};`;
    }
  }}

  &::after {
    content: '';
    position: absolute;
    ${(props) => {
      switch (props.$position) {
        case 'top':
          return `top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: ${theme.colors.dark.bg};`;
        case 'bottom':
          return `bottom: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-bottom-color: ${theme.colors.dark.bg};`;
        case 'left':
          return `left: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-left-color: ${theme.colors.dark.bg};`;
        case 'right':
          return `right: 100%; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-right-color: ${theme.colors.dark.bg};`;
        default:
          return `top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: ${theme.colors.dark.bg};`;
      }
    }}
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 0,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutId = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (delay) {
      timeoutId.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    setVisible(false);
  };

  return (
    <TooltipContainer className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <TooltipContent $visible={visible} $position={position}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
