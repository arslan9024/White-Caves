import React, { useState } from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipBox = styled.div<{ $position: string }>`
  position: absolute;
  z-index: 1000;
  background: ${SLATE};
  color: #FFFFFF;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  pointer-events: none;

  ${props => {
    switch (props.$position) {
      case 'bottom':
        return 'top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px;';
      case 'left':
        return 'right: 100%; top: 50%; transform: translateY(-50%); margin-right: 6px;';
      case 'right':
        return 'left: 100%; top: 50%; transform: translateY(-50%); margin-left: 6px;';
      default:
        return 'bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 6px;';
    }
  }}
`;

export const CavesTooltip: React.FC<CavesTooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Wrapper onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && <TooltipBox $position={position}>{content}</TooltipBox>}
    </Wrapper>
  );
};

export default CavesTooltip;
