import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(59,130,246,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(59,130,246,0.05); border-bottom: 1px solid rgba(59,130,246,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const PenaltyCard = styled.div<{ $severity: 'low' | 'medium' | 'high' | 'critical' }>`
  padding: 14px 16px;
  border-radius: 12px;
  background: ${p => ({ low: 'rgba(59,130,246,0.06)', medium: 'rgba(245,158,11,0.06)', high: 'rgba(239,68,68,0.06)', critical: 'rgba(127,29,29,0.12)' }[p.$severity])};
  border: 1px solid ${p => ({ low: 'rgba(59,130,246,0.2)', medium: 'rgba(245,158,11,0.2)', high: 'rgba(239,68,68,0.25)', critical: 'rgba(239,68,68,0.5)' }[p.$severity])};
`;
const PenaltyHeader = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;`;
const PenaltyLabel = styled.div`font-size: 0.8rem; font-weight: 700; color: #CBD5E1;`;
const PenaltyFine = styled.div<{ $severity: 'low' | 'medium' | 'high' | 'critical' }>`
  font-size: 0.82rem; font-weight: 900;
  color: ${p => ({ low: '#60A5FA', medium: '#F59E0B', high: '#EF4444', critical: '#FCA5A5' }[p.$severity])};
`;
const PenaltyRef = styled.div`font-size: 0.68rem; color: #64748B; margin-bottom: 4px;`;
const PenaltyDesc = styled.div`font-size: 0.7rem; color: #64748B; line-height: 1.4;`;

const PENALTIES = [
  { label: 'Unlicensed Brokerage Activity', fine: 'AED 50,000', ref: 'Law 85/2006 — Art. 31', desc: 'Practicing real estate brokerage without a valid RERA license. Criminal prosecution possible.', severity: 'critical' as const },
  { label: 'Failure to Register Property Transfer', fine: 'AED 2–10% of Value', ref: 'Law 7/2006 — Art. 25', desc: 'Not registering a property sale/transfer with DLD within 60 days of transaction.', severity: 'high' as const },
  { label: 'False Marketing / Misleading Advertisement', fine: 'AED 20,000', ref: 'Reg. 85/2006 — Art. 16', desc: 'Publishing property listings without valid RERA permit or with false information.', severity: 'high' as const },
  { label: 'AML Reporting Failure (STR)', fine: 'AED 200,000', ref: 'AML Cabinet Decision 10/2019', desc: 'Failure to file a Suspicious Transaction Report (STR) with the Financial Intelligence Unit.', severity: 'critical' as const },
  { label: 'UAE PDPL Data Breach (Unreported)', fine: 'AED 5,000,000', ref: 'UAE PDPL Law 45/2021 — Art. 27', desc: 'Failure to notify the UAEDP Data Protection Office within 72 hours of a personal data breach.', severity: 'critical' as const },
  { label: 'Ejari Non-Registration (Tenancy)', fine: 'AED 10,000', ref: 'Ejari Reg. 26/2010', desc: 'Failure to register a tenancy contract in Ejari within the mandatory timeframe.', severity: 'medium' as const },
  { label: 'Missing SPA Signatures', fine: 'Contract Void', ref: 'UAE Civil Code Art. 138', desc: 'Sale Purchase Agreement without all required party signatures is unenforceable.', severity: 'low' as const },
];

export const ReraPenaltyRegistry: FC = () => (
  <Wrapper data-testid="rera-penalty-registry">
    <Header>
      <Title>⚖️ RERA Penalty & Fine Registry 2024</Title>
      <div style={{ fontSize: '0.7rem', color: 'var(--color-60a5fa, #60A5FA)', fontWeight: 700 }}>Law 85/2006 Reference</div>
    </Header>
    <Body>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', padding: '8px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.15)' }}>
        ⚠️ Reference only — consult a UAE-qualified legal advisor for compliance decisions.
      </div>
      {PENALTIES.map((p, i) => (
        <PenaltyCard key={i} $severity={p.severity}>
          <PenaltyHeader>
            <PenaltyLabel>{p.label}</PenaltyLabel>
            <PenaltyFine $severity={p.severity}>{p.fine}</PenaltyFine>
          </PenaltyHeader>
          <PenaltyRef>📋 {p.ref}</PenaltyRef>
          <PenaltyDesc>{p.desc}</PenaltyDesc>
        </PenaltyCard>
      ))}
    </Body>
  </Wrapper>
);
export default ReraPenaltyRegistry;
