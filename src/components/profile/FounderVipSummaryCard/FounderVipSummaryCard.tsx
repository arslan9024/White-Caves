/**
 * FounderVipSummaryCard — Wave 58 FE-GOAL-021
 * Founder & Managing Director VIP executive credentials summary card with 3.5px solid Red border
 * White Caves Real Estate LLC — Sovereign Profile Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Card = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0A0614 0%, #0F172A 100%);
  border: 3.5px solid #EF4444;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.25);
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  animation: ${fadeIn} 0.4s ease;
  @media (max-width: 768px) { flex-direction: column; text-align: center; }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  @media (max-width: 768px) { flex-direction: column; }
`;

const AvatarRing = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #1E293B;
  border: 3px solid #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
`;

const FName = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 900;
  color: #FFF;
`;

const FTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 800;
  color: #EF4444;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
`;

const FMeta = styled.div`
  font-size: 0.75rem;
  color: #94A3B8;
  margin-top: 6px;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  @media (max-width: 768px) { align-items: center; }
`;

const SuperuserBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
`;

export const FounderVipSummaryCard: FC = () => {
  return (
    <Card data-testid="founder-vip-summary-card">
      <LeftSide>
        <AvatarRing>👑</AvatarRing>
        <div>
          <FName>Arsalan Malik</FName>
          <FTitle>Founder, Managing Director & Chief Executive</FTitle>
          <FMeta>
            White Caves Real Estate LLC · DED #1388443 · RERA ORN #44483
          </FMeta>
        </div>
      </LeftSide>
      <RightSide>
        <SuperuserBadge>LEVEL 5 SOVEREIGN SUPERUSER</SuperuserBadge>
        <div style={{ fontSize: '0.72rem', color: 'var(--accent-green, #10B981)', fontWeight: 800 }}>
          ✓ All Administrative & Escrow Gates Unlocked
        </div>
      </RightSide>
    </Card>
  );
};

export default FounderVipSummaryCard;
