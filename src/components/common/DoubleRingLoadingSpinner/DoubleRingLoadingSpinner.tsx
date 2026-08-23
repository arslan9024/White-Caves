/**
 * DoubleRingLoadingSpinner — Wave 60 FE-GOAL-048
 * Luxury glowing double-ring SVG loading spinner for asynchronous route hydration and document compilation
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const spinClockwise = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }`;
const spinCounter = keyframes`0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); }`;

const SpinnerWrapper = styled.div<{ $size?: number }>`
  position: relative;
  width: ${p => p.$size || 48}px;
  height: ${p => p.$size || 48}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const OuterRing = styled.div<{ $size?: number }>`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #EF4444;
  border-right-color: #EF4444;
  animation: ${spinClockwise} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.6));
`;

const InnerRing = styled.div<{ $size?: number }>`
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-bottom-color: #FFF;
  border-left-color: #FFF;
  animation: ${spinCounter} 0.9s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

export const DoubleRingLoadingSpinner: FC<{ size?: number; label?: string }> = ({ size = 48, label }) => {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }} data-testid="double-ring-loading-spinner">
      <SpinnerWrapper $size={size}>
        <OuterRing $size={size} />
        <InnerRing $size={size} />
      </SpinnerWrapper>
      {label && <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 700 }}>{label}</span>}
    </div>
  );
};

export default DoubleRingLoadingSpinner;
