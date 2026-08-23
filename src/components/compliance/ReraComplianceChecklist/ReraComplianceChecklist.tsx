import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const CheckList = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const CheckItem = styled.div<{ $passed: boolean; $critical: boolean }>`
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: 10px;
  background: ${p => p.$passed ? 'rgba(16,185,129,0.06)' : p.$critical ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.06)'};
  border: 1px solid ${p => p.$passed ? 'rgba(16,185,129,0.2)' : p.$critical ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.2)'};
  cursor: pointer; transition: all 0.15s ease;
`;
const CheckIcon = styled.div<{ $passed: boolean; $critical: boolean }>`font-size: 0.9rem; flex-shrink: 0; margin-top: 1px;`;
const CheckText = styled.div`flex: 1;`;
const CheckLabel = styled.div`font-size: 0.78rem; font-weight: 700; color: #CBD5E1;`;
const CheckSub = styled.div`font-size: 0.68rem; color: #64748B; margin-top: 2px; line-height: 1.4;`;
const CriticalTag = styled.span<{ $critical: boolean }>`font-size: 0.62rem; font-weight: 700; padding: 1px 7px; border-radius: 4px; background: ${p => p.$critical ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}; color: ${p => p.$critical ? '#EF4444' : '#F59E0B'};`;

const SummaryRow = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;`;
const SummaryCard = styled.div<{ $color: string }>`padding: 12px; border-radius: 10px; background: rgba(15,23,42,0.6); border: 1px solid ${p => p.$color}20; text-align: center;`;
const SummaryNum = styled.div<{ $color: string }>`font-size: 1.2rem; font-weight: 900; color: ${p => p.$color};`;
const SummaryLab = styled.div`font-size: 0.65rem; color: #64748B; margin-top: 2px;`;

const CHECKS = [
  { id: 1, label: 'RERA Broker Registration Card (BRN)', sub: 'Valid 2025 BRN issued by Dubai Real Estate Institute (DREI)', critical: true, init: true },
  { id: 2, label: 'RERA Form A — Listing Authorization', sub: 'Seller-signed exclusive listing agreement (mandatory per Law 85 of 2006)', critical: true, init: true },
  { id: 3, label: 'DLD NOC — No Objection Certificate', sub: 'Developer or owners association NOC for resale listings', critical: true, init: false },
  { id: 4, label: 'Title Deed Verification (Oqood / DLD)', sub: 'Original title deed cross-checked with DLD land registry system', critical: true, init: true },
  { id: 5, label: 'Anti-Money Laundering (AML) KYC', sub: 'Passport + Emirates ID + source of funds declaration (CBUAE AML 2024)', critical: true, init: false },
  { id: 6, label: 'UAE PDPL Data Privacy Consent', sub: 'Client data processing consent under UAE PDPL Law 45 of 2021', critical: false, init: true },
  { id: 7, label: 'RERA Form B — Buyer Representation', sub: 'Buyer-signed exclusive buyer agency agreement', critical: false, init: false },
  { id: 8, label: 'Ejari Registration (Tenancy Contract)', sub: 'Online Ejari registration with RERA within 2 weeks of contract', critical: false, init: true },
  { id: 9, label: 'DEWA Connection NOC', sub: 'Dubai Electricity & Water Authority connection approval for handover', critical: false, init: false },
  { id: 10, label: 'Service Charge Certificate', sub: 'RERA-approved service charge clearance from Owners Association', critical: false, init: true },
];

export const ReraComplianceChecklist: FC = () => {
  const [passed, setPassed] = useState<Set<number>>(new Set(CHECKS.filter(c => c.init).map(c => c.id)));

  const toggle = (id: number) => setPassed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const criticalTotal = CHECKS.filter(c => c.critical).length;
  const criticalPassed = CHECKS.filter(c => c.critical && passed.has(c.id)).length;
  const nonCriticalPassed = CHECKS.filter(c => !c.critical && passed.has(c.id)).length;

  return (
    <Wrapper data-testid="rera-compliance-checklist">
      <Header>
        <Title>🏛️ RERA 2024 Compliance Checklist</Title>
        <div style={{ fontSize: '0.7rem', color: passed.size === CHECKS.length ? 'var(--accent-green, #10B981)' : 'var(--accent-gold, #F59E0B)', fontWeight: 700 }}>
          {passed.size}/{CHECKS.length} Passed
        </div>
      </Header>
      <Body>
        <SummaryRow>
          <SummaryCard $color="#EF4444"><SummaryNum $color="#EF4444">{criticalPassed}/{criticalTotal}</SummaryNum><SummaryLab>Critical Gates</SummaryLab></SummaryCard>
          <SummaryCard $color="#10B981"><SummaryNum $color="#10B981">{nonCriticalPassed}</SummaryNum><SummaryLab>Advisory Met</SummaryLab></SummaryCard>
          <SummaryCard $color={passed.size === CHECKS.length ? '#10B981' : '#F59E0B'}><SummaryNum $color={passed.size === CHECKS.length ? '#10B981' : '#F59E0B'}>{Math.round((passed.size / CHECKS.length) * 100)}%</SummaryNum><SummaryLab>Compliance Score</SummaryLab></SummaryCard>
        </SummaryRow>
        <CheckList>
          {CHECKS.map(c => (
            <CheckItem key={c.id} $passed={passed.has(c.id)} $critical={c.critical} onClick={() => toggle(c.id)}>
              <CheckIcon $passed={passed.has(c.id)} $critical={c.critical}>
                {passed.has(c.id) ? '✅' : c.critical ? '🔴' : '⚠️'}
              </CheckIcon>
              <CheckText>
                <CheckLabel>{c.label} {c.critical && <CriticalTag $critical>CRITICAL</CriticalTag>}</CheckLabel>
                <CheckSub>{c.sub}</CheckSub>
              </CheckText>
            </CheckItem>
          ))}
        </CheckList>
      </Body>
    </Wrapper>
  );
};
export default ReraComplianceChecklist;
