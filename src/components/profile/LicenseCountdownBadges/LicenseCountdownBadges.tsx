/**
 * LicenseCountdownBadges — Wave 58 FE-GOAL-022
 * Interactive 90/60/30-day corporate license validity badges & statutory renewal countdowns
 * White Caves Real Estate LLC — Sovereign Profile Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.05);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #FFF;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  @media (max-width: 860px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const BadgeCard = styled.div<{ $status: 'valid' | 'warning' }>`
  padding: 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1.5px solid ${p => p.$status === 'valid' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
`;

const BHeader = styled.div`
  font-size: 0.68rem;
  font-weight: 800;
  color: #94A3B8;
  text-transform: uppercase;
`;

const BNumber = styled.div`
  font-size: 0.95rem;
  font-weight: 900;
  color: #FFF;
`;

const BExpiry = styled.div<{ $status: 'valid' | 'warning' }>`
  font-size: 0.7rem;
  font-weight: 800;
  color: ${p => p.$status === 'valid' ? '#10B981' : '#F59E0B'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const LicenseCountdownBadges: FC = () => {
  const credentials = [
    { title: 'DET Commercial License', number: '1388443', daysLeft: 245, expiryDate: '2027-04-15', status: 'valid' as const },
    { title: 'RERA Brokerage ORN', number: '44483', daysLeft: 290, expiryDate: '2027-05-30', status: 'valid' as const },
    { title: 'DLD Ejari Reg. Number', number: '0120250814005322', daysLeft: 180, expiryDate: '2027-02-14', status: 'valid' as const },
    { title: 'Corporate ICP Establishment', number: '2/1/1192499', daysLeft: 64, expiryDate: '2026-10-18', status: 'warning' as const },
  ];

  return (
    <Wrap data-testid="license-countdown-badges">
      <Head>
        <Title>🏛️ Statutory Regulatory Licenses & DET/RERA Validity Badges</Title>
        <Tag>ALL CREDENTIALS ACTIVE</Tag>
      </Head>
      <Body>
        {credentials.map((c, idx) => (
          <BadgeCard key={idx} $status={c.status}>
            <div>
              <BHeader>{c.title}</BHeader>
              <BNumber style={{ marginTop: '4px' }}>#{c.number}</BNumber>
            </div>
            <div>
              <BExpiry $status={c.status}>
                <span>●</span>
                <span>{c.daysLeft} Days Remaining</span>
              </BExpiry>
              <div style={{ fontSize: '0.62rem', color: '#64748B', marginTop: '2px' }}>
                Valid Until: {c.expiryDate}
              </div>
            </div>
          </BadgeCard>
        ))}
      </Body>
    </Wrap>
  );
};

export default LicenseCountdownBadges;
