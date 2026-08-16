import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const tickerSlide = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TickerContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: #0F172A;
  border-top: 1px solid #EF4444;
  border-bottom: 1px solid #EF4444;
  padding: 8px 0;
  color: #FFFFFF;
`;

const TickerTrack = styled.div`
  display: flex;
  white-space: nowrap;
  animation: ${tickerSlide} 25s linear infinite;
`;

const TickerItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  font-size: 0.8rem;
  font-weight: 700;

  .accent {
    color: #EF4444;
  }
`;

export const ExecutiveLiveTicker: FC = () => {
  const items = [
    '🔥 Palm Signature Villa SOLD — AED 120,000,000',
    '📥 New Inbound WhatsApp Lead: Sheikh Zayed Rd Penthouse',
    '📜 Ejari Lease Contract Verified: 0120250814005322',
    '⚡ Lead Auto-Assigned to Nadia (Sales Supervisor)',
  ];

  return (
    <TickerContainer data-testid="executive-live-ticker">
      <TickerTrack>
        {items.concat(items).map((text, idx) => (
          <TickerItem key={idx}>
            <span className="accent">LIVE TICKER:</span> {text}
          </TickerItem>
        ))}
      </TickerTrack>
    </TickerContainer>
  );
};

export default ExecutiveLiveTicker;
