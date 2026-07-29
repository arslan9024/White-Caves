import React from 'react';
import styled, { keyframes } from 'styled-components';

const RED = '#EF4444';

export interface CavesTickerProps {
  items?: string[];
  speedSeconds?: number;
}

const DEFAULT_ITEMS = [
  '⚡ RERA 2024 UPDATE: All Tenancy Ejari Contracts Require Mandatory 5% VAT Compliance',
  '🏛️ DLD INTEGRATION LIVE: Real-Time Title Deed Verification Active across Dubai Marina & Downtown',
  '📊 MARKET TICKER: DAMAC Hills 2 Average Rental Yield Reaches 8.4% Net ROI',
  '🔐 SECURITY ADVISORY: UAE PDPL Data Protection Safeguards Enforced for All Lead Ingestion',
];

const marquee = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  background: rgba(239, 68, 68, 0.08);
  border-top: 1px solid rgba(239, 68, 68, 0.15);
  border-bottom: 1px solid rgba(239, 68, 68, 0.15);
  padding: 6px 0;
  display: flex;
  align-items: center;
`;

const Track = styled.div<{ $speed: number }>`
  display: flex;
  gap: 32px;
  white-space: nowrap;
  animation: ${marquee} ${props => props.$speed}s linear infinite;
  will-change: transform;

  &:hover {
    animation-play-state: paused;
  }
`;

const TickerItem = styled.span`
  font-size: 0.78rem;
  font-weight: 800;
  color: ${RED};
  letter-spacing: 0.02em;
`;

export const CavesTicker: React.FC<CavesTickerProps> = ({
  items = DEFAULT_ITEMS,
  speedSeconds = 30,
}) => {
  const displayItems = [...items, ...items];

  return (
    <Container>
      <Track $speed={speedSeconds}>
        {displayItems.map((item, idx) => (
          <TickerItem key={idx}>{item}</TickerItem>
        ))}
      </Track>
    </Container>
  );
};

export default CavesTicker;
