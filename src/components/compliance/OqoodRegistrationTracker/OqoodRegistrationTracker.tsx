import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(16,185,129,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(16,185,129,0.05); border-bottom: 1px solid rgba(16,185,129,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const OqoodHero = styled.div`
  padding: 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04));
  border: 2px solid rgba(16,185,129,0.2);
  text-align: center;
`;
const OqoodTitle = styled.div`font-size: 1.2rem; font-weight: 900; color: #10B981; margin-bottom: 4px;`;
const OqoodRef = styled.div`font-size: 0.78rem; color: #64748B;`;
const OqoodStatus = styled.div`font-size: 0.8rem; font-weight: 700; color: #34D399; margin-top: 8px;`;

const InfoGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const InfoCard = styled.div`padding: 12px 14px; border-radius: 10px; background: rgba(15,23,42,0.6); border: 1px solid rgba(100,116,139,0.15);`;
const InfoLabel = styled.div`font-size: 0.68rem; color: #64748B; margin-bottom: 4px;`;
const InfoVal = styled.div`font-size: 0.82rem; font-weight: 700; color: #CBD5E1;`;
const InfoGreen = styled.div`font-size: 0.82rem; font-weight: 700; color: #10B981;`;

const ProgressBar = styled.div`height: 6px; background: rgba(30,41,59,0.8); border-radius: 3px; overflow: hidden; margin-top: 8px;`;
const ProgressFill = styled.div<{ $pct: number }>`height: 100%; width: ${p => p.$pct}%; border-radius: 3px; background: linear-gradient(90deg, #10B981, #34D399); transition: width 0.5s ease;`;

const PaymentSchedule = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const PayRow = styled.div<{ $paid: boolean }>`
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: 8px;
  background: ${p => p.$paid ? 'rgba(16,185,129,0.07)' : 'rgba(15,23,42,0.5)'};
  border: 1px solid ${p => p.$paid ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.12)'};
`;
const PayMilestone = styled.div`font-size: 0.75rem; color: #94A3B8; flex: 1;`;
const PayAmount = styled.div`font-size: 0.75rem; font-weight: 800; color: #E2E8F0;`;
const PayStatus = styled.div<{ $paid: boolean }>`font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 5px; background: ${p => p.$paid ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; color: ${p => p.$paid ? '#10B981' : '#F59E0B'};`;

export const OqoodRegistrationTracker: FC = () => {
  const schedule = [
    { milestone: 'Booking Amount (10%)', amount: 200_000, pct: 10, paid: true },
    { milestone: '20% — Foundation Completion', amount: 400_000, pct: 20, paid: true },
    { milestone: '15% — Structure to 5th Floor', amount: 300_000, pct: 15, paid: true },
    { milestone: '15% — Structure to 10th Floor', amount: 300_000, pct: 15, paid: false },
    { milestone: '10% — Façade Completion', amount: 200_000, pct: 10, paid: false },
    { milestone: '10% — Handover', amount: 200_000, pct: 10, paid: false },
    { milestone: '20% — Post-Handover (24 months)', amount: 400_000, pct: 20, paid: false },
  ];
  const paid = schedule.filter(s => s.paid).reduce((a, s) => a + s.pct, 0);

  return (
    <Wrapper data-testid="oqood-registration-tracker">
      <Header>
        <Title>📝 Oqood Off-Plan Registration Tracker</Title>
        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>DLD Interim Registry</div>
      </Header>
      <Body>
        <OqoodHero>
          <OqoodTitle>🏗️ Oqood Registration Active</OqoodTitle>
          <OqoodRef>Ref: OQOOD-2024-{Math.floor(Math.random() * 90000 + 10000)}</OqoodRef>
          <OqoodStatus>✅ Registered with Dubai Land Department — Interim Registry</OqoodStatus>
        </OqoodHero>
        <InfoGrid>
          <InfoCard><InfoLabel>Project</InfoLabel><InfoVal>EMAAR South Heights</InfoVal></InfoCard>
          <InfoCard><InfoLabel>Unit</InfoLabel><InfoVal>Apt 1405, Tower B</InfoVal></InfoCard>
          <InfoCard><InfoLabel>Total Value</InfoLabel><InfoVal>AED 2,000,000</InfoVal></InfoCard>
          <InfoCard><InfoLabel>Completion</InfoLabel><InfoVal>Q3 2027 (est.)</InfoVal></InfoCard>
          <InfoCard><InfoLabel>Paid to Date</InfoLabel><InfoGreen>AED 900,000 ({paid}%)</InfoGreen></InfoCard>
          <InfoCard><InfoLabel>Remaining</InfoLabel><InfoVal>AED {(2_000_000 - 900_000).toLocaleString()}</InfoVal></InfoCard>
        </InfoGrid>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: '6px' }}>
            <span>Payment Progress</span><span style={{ color: '#10B981', fontWeight: 700 }}>{paid}% Paid</span>
          </div>
          <ProgressBar><ProgressFill $pct={paid} /></ProgressBar>
        </div>
        <PaymentSchedule>
          {schedule.map((s, i) => (
            <PayRow key={i} $paid={s.paid}>
              <div style={{ fontSize: '0.75rem' }}>{s.paid ? '✅' : '⏳'}</div>
              <PayMilestone>{s.milestone}</PayMilestone>
              <PayAmount>AED {s.amount.toLocaleString()}</PayAmount>
              <PayStatus $paid={s.paid}>{s.paid ? 'PAID' : 'DUE'}</PayStatus>
            </PayRow>
          ))}
        </PaymentSchedule>
      </Body>
    </Wrapper>
  );
};
export default OqoodRegistrationTracker;
