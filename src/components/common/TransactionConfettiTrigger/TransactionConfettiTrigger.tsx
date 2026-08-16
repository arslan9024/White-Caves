/**
 * TransactionConfettiTrigger — Wave 64 FE-GOAL-085
 * Luxury deal closure & contract signature celebration confetti trigger widget
 * White Caves Real Estate LLC — Animation & Micro-Interactions Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pop = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
`;

const Banner = styled.div`
  pointer-events: auto;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border: 2px solid #10B981;
  border-radius: 20px;
  padding: 24px 36px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.3);
  animation: ${pop} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 900;
  color: #FFF;
  span { color: #10B981; }
`;

const Sub = styled.p`
  margin: 8px 0 16px;
  font-size: 0.85rem;
  color: #94A3B8;
`;

const DismissBtn = styled.button`
  padding: 8px 24px;
  border-radius: 999px;
  border: none;
  background: #10B981;
  color: #FFF;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
`;

export const TransactionConfettiTrigger: FC<{ dealTitle?: string; dealAmount?: string; onDismiss?: () => void }> = ({
  dealTitle = 'Villa 14B Palm Jumeirah',
  dealAmount = 'AED 65,000,000',
  onDismiss,
}) => {
  return (
    <Wrap data-testid="transaction-confetti-trigger">
      <Banner>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎉</div>
        <Title><span>TRANSACTION CLOSED</span></Title>
        <Sub>
          {dealTitle} has been legally executed for <strong>{dealAmount}</strong>!
        </Sub>
        <DismissBtn onClick={onDismiss}>
          ✓ Continue to Conveyancing
        </DismissBtn>
      </Banner>
    </Wrap>
  );
};

export default TransactionConfettiTrigger;
