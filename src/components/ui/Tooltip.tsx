/**
 * Tooltip Component
 * =================
 * Lightweight tooltip with positioning, animations, and accessibility features.
 */

import React, { useState, useRef, useEffect, useId } from 'react';
import styled from 'styled-components';

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type TooltipTrigger = 'hover' | 'click' | 'focus';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  trigger?: TooltipTrigger;
  delay?: number;
  maxWidth?: number;
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ $isVisible: boolean; $placement: TooltipPlacement }>`
  position: absolute;
  background-color: #1f2937;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  z-index: var(--z-tooltip, 800);
  pointer-events: none;
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  visibility: ${props => (props.$isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease, visibility 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;

    ${props => {
      switch (props.$placement) {
        case 'top':
          return `
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 4px 4px 0 4px;
            border-color: #1f2937 transparent transparent transparent;
          `;
        case 'bottom':
          return `
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0 4px 4px 4px;
            border-color: transparent transparent #1f2937 transparent;
          `;
        case 'left':
          return `
            right: -4px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 4px 0 4px 4px;
            border-color: transparent transparent transparent #1f2937;
          `;
        case 'right':
          return `
            left: -4px;
            top: 50%;
            transform: translateY(-50%);
            border-width: 4px 4px 4px 0;
            border-color: transparent #1f2937 transparent transparent;
          `;
        default:
          return '';
      }
    }}
  }

  ${props => {
    switch (props.$placement) {
      case 'top':
        return 'bottom: 100%; margin-bottom: 8px; left: 50%; transform: translateX(-50%);';
      case 'bottom':
        return 'top: 100%; margin-top: 8px; left: 50%; transform: translateX(-50%);';
      case 'left':
        return 'right: 100%; margin-right: 8px; top: 50%; transform: translateY(-50%);';
      case 'right':
        return 'left: 100%; margin-left: 8px; top: 50%; transform: translateY(-50%);';
      case 'top-left':
        return 'bottom: 100%; margin-bottom: 8px; left: 0;';
      case 'top-right':
        return 'bottom: 100%; margin-bottom: 8px; right: 0;';
      case 'bottom-left':
        return 'top: 100%; margin-top: 8px; left: 0;';
      case 'bottom-right':
        return 'top: 100%; margin-top: 8px; right: 0;';
      default:
        return '';
    }
  }}
`;

const TooltipTriggerStyled = styled.span`
  display: inline-block;
`;

/**
 * Tooltip Component
 * Displays helpful text on hover or click
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  trigger = 'hover',
  delay = 0,
  maxWidth = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Click-outside handler for click-triggered tooltips
  useEffect(() => {
    if (trigger !== 'click' || !isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [trigger, isVisible]);

  const contentElement = (
    <TooltipContent $isVisible={isVisible} $placement={placement} style={{ maxWidth }} role="tooltip" id={tooltipId}>
      {content}
    </TooltipContent>
  );

  if (trigger === 'click') {
    return (
      <TooltipWrapper ref={wrapperRef} onClick={() => setIsVisible(!isVisible)}>
        <TooltipTriggerStyled aria-describedby={isVisible ? tooltipId : undefined}>{children}</TooltipTriggerStyled>
        {contentElement}
      </TooltipWrapper>
    );
  }

  return (
    <TooltipWrapper onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip}>
      <TooltipTriggerStyled aria-describedby={isVisible ? tooltipId : undefined}>{children}</TooltipTriggerStyled>
      {contentElement}
    </TooltipWrapper>
  );
};

export default Tooltip;
