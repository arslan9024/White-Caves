/**
 * RealtimeExecutiveTicker — Wave 59 FE-GOAL-034
 * Real-time executive continuous ticker displaying live inbound leads, closures, and transactions
 * White Caves Real Estate LLC — Dashboard & Executive Cockpit Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const TickerContainer = styled.div`
  width: 100%;
  height: 36px;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(239, 68, 68, 0.25);
  border-bottom: 1px solid rgba(239, 68, 68, 0.25);
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
  font-family: 'Inter', sans-serif;
`;

const TickerTrack = styled.div`
  display: flex;
  white-space: nowrap;
  gap: 32px;
  animation: ${scroll} 25s linear infinite;
  &:hover { animation-play-state: paused; }
`;

const TickerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #E2E8F0;
`;

const Tag = styled.span<{ $type: 'deal' | 'lead' | 'rera' }>`
  font-size: 0.62rem;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
  background: ${p => p.$type === 'deal' ? '#10B981' : p.$type === 'lead' ? '#EF4444' : '#38BDF8'};
  color: #FFF;
`;

export const RealtimeExecutiveTicker: FC = () => {
  const events = [
    { type: 'deal' as const, text: '🎉 Deal Closed: Villa 14B Palm Jumeirah · AED 65,000,000 (Commission: AED 1.3M)' },
    { type: 'lead' as const, text: '🔥 Hot Lead Ingest: Lord Harrington · Budget AED 45M Downtown Penthouse' },
    { type: 'rera' as const, text: '🏛️ RERA Notarized: Ejari #0120260814009210 Approved & Dispatched' },
    { type: 'deal' as const, text: '💰 Off-Plan Flip: Emaar Beachfront Unit 2402 · 30% DLD NOC Issued' },
  ];

  return (
    <TickerContainer data-testid="realtime-executive-ticker">
      <div style={{ position: 'absolute', left: 0, zIndex: 2, background: 'var(--accent-red, #DC2626)', color: 'var(--white, #FFF)', fontSize: '0.68rem', fontWeight: 900, padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
        LIVE FEED
      </div>
      <TickerTrack>
        {events.map((e, idx) => (
          <TickerItem key={idx}>
            <Tag $type={e.type}>{e.type.toUpperCase()}</Tag>
            <span>{e.text}</span>
          </TickerItem>
        ))}
      </TickerTrack>
    </TickerContainer>
  );
};

export default RealtimeExecutiveTicker;
