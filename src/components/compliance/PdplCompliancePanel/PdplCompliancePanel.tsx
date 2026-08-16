import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(139,92,246,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(139,92,246,0.05); border-bottom: 1px solid rgba(139,92,246,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const PolicyGrid = styled.div`display: grid; grid-template-columns: 1fr; gap: 8px;`;
const PolicyCard = styled.div<{ $on: boolean }>`
  display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px;
  border-radius: 10px;
  background: ${p => p.$on ? 'rgba(139,92,246,0.07)' : 'rgba(15,23,42,0.6)'};
  border: 1px solid ${p => p.$on ? 'rgba(139,92,246,0.25)' : 'rgba(100,116,139,0.15)'};
  cursor: pointer; transition: all 0.15s ease;
  &:hover { border-color: rgba(139,92,246,0.3); }
`;
const Toggle = styled.div<{ $on: boolean }>`
  width: 36px; height: 20px; border-radius: 10px;
  background: ${p => p.$on ? '#8B5CF6' : 'rgba(100,116,139,0.3)'};
  position: relative; flex-shrink: 0; margin-top: 2px;
  transition: background 0.2s ease;
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${p => p.$on ? '18px' : '2px'};
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #FFF;
    transition: left 0.2s ease;
  }
`;
const PolicyText = styled.div`flex: 1;`;
const PolicyLabel = styled.div`font-size: 0.8rem; font-weight: 700; color: #CBD5E1;`;
const PolicySub = styled.div`font-size: 0.7rem; color: #64748B; margin-top: 3px; line-height: 1.4;`;
const LawRef = styled.span`font-size: 0.65rem; font-weight: 700; color: #A78BFA; background: rgba(139,92,246,0.12); padding: 1px 7px; border-radius: 4px;`;

const ComplianceMeter = styled.div`padding: 14px; border-radius: 12px; background: rgba(15,23,42,0.7); border: 1px solid rgba(139,92,246,0.18);`;
const MeterTitle = styled.div`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B; margin-bottom: 10px;`;
const MeterTrack = styled.div`height: 10px; border-radius: 5px; background: rgba(30,41,59,0.8); overflow: hidden;`;
const MeterFill = styled.div<{ $pct: number }>`height: 100%; width: ${p => p.$pct}%; border-radius: 5px; background: linear-gradient(90deg, #8B5CF6, #A78BFA); transition: width 0.5s ease;`;
const MeterLabel = styled.div`display: flex; justify-content: space-between; margin-top: 8px;`;
const MeterVal = styled.div`font-size: 0.82rem; font-weight: 900; color: #A78BFA;`;
const MeterSub = styled.div`font-size: 0.7rem; color: #64748B;`;

const POLICIES = [
  { id: 'data_collect', label: 'Lawful Basis for Data Collection', sub: 'Client data collected only for real estate transaction purposes', law: 'UAE PDPL Art. 8', init: true },
  { id: 'consent', label: 'Explicit Marketing Consent', sub: 'WhatsApp/email marketing only with documented opt-in consent', law: 'UAE PDPL Art. 12', init: true },
  { id: 'data_breach', label: 'Data Breach Notification (72hr)', sub: 'Mandatory UAEDP authority notification within 72 hours of breach', law: 'UAE PDPL Art. 27', init: false },
  { id: 'cross_border', label: 'Cross-Border Data Transfer Controls', sub: 'Client PII not transferred outside UAE without adequate safeguards', law: 'UAE PDPL Art. 26', init: true },
  { id: 'retention', label: 'Data Retention & Deletion Policy', sub: 'Client data retained max 5 years post-transaction then purged', law: 'UAE PDPL Art. 14', init: false },
  { id: 'dpo', label: 'Data Protection Officer (DPO) Appointed', sub: 'Designated DPO registered with UAEDP authority', law: 'UAE PDPL Art. 36', init: true },
];

export const PdplCompliancePanel: FC = () => {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(POLICIES.filter(p => p.init).map(p => p.id)));

  const toggle = (id: string) => setEnabled(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const score = Math.round((enabled.size / POLICIES.length) * 100);

  return (
    <Wrapper data-testid="pdpl-compliance-panel">
      <Header>
        <Title>🔒 UAE PDPL Data Privacy Compliance</Title>
        <LawRef>Law 45 / 2021</LawRef>
      </Header>
      <Body>
        <ComplianceMeter>
          <MeterTitle>PDPL Compliance Score</MeterTitle>
          <MeterTrack><MeterFill $pct={score} /></MeterTrack>
          <MeterLabel><MeterVal>{score}% Compliant</MeterVal><MeterSub>{enabled.size}/{POLICIES.length} policies active</MeterSub></MeterLabel>
        </ComplianceMeter>
        <PolicyGrid>
          {POLICIES.map(p => (
            <PolicyCard key={p.id} $on={enabled.has(p.id)} onClick={() => toggle(p.id)}>
              <Toggle $on={enabled.has(p.id)} />
              <PolicyText>
                <PolicyLabel>{p.label} <LawRef>{p.law}</LawRef></PolicyLabel>
                <PolicySub>{p.sub}</PolicySub>
              </PolicyText>
            </PolicyCard>
          ))}
        </PolicyGrid>
      </Body>
    </Wrapper>
  );
};
export default PdplCompliancePanel;
