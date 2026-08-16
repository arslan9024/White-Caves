/**
 * LuxuryTooltip — Wave 60 FE-GOAL-049
 * Custom luxury tooltip container with subtle directional arrow and glassmorphic styling
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC, useState, ReactNode } from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipBubble = styled.div<{ $position: 'top' | 'bottom' }>`
  position: absolute;
  ${p => p.$position === 'top' ? 'bottom: calc(100% + 8px);' : 'top: calc(100% + 8px);'}
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  color: #FFF;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10000;
  &::after {
    content: '';
    position: absolute;
    ${p => p.$position === 'top' ? 'top: 100%; border-top-color: #0F172A;' : 'bottom: 100%; border-bottom-color: #0F172A;'}
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent;
  }
`;

export const LuxuryTooltip: FC<{ text: string; position?: 'top' | 'bottom'; children: ReactNode }> = ({
  text,
  position = 'top',
  children,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <TooltipWrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      data-testid="luxury-tooltip"
    >
      {children}
      {visible && (
        <TooltipBubble $position={position} role="tooltip">
          {text}
        </TooltipBubble>
      )}
    </TooltipWrapper>
  );
};

export default LuxuryTooltip;
