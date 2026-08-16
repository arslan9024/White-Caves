import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const AuditList = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const AuditRow = styled.div<{ $type: 'success' | 'warning' | 'error' | 'info' }>`
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: 9px;
  background: rgba(15,23,42,0.7);
  border-left: 3px solid ${p => ({ success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' }[p.$type])};
`;
const AuditIcon = styled.div`font-size: 0.8rem; flex-shrink: 0;`;
const AuditContent = styled.div`flex: 1;`;
const AuditMsg = styled.div`font-size: 0.75rem; font-weight: 700; color: #CBD5E1;`;
const AuditMeta = styled.div`font-size: 0.65rem; color: #475569; margin-top: 2px;`;
const AuditBadge = styled.div<{ $type: 'success' | 'warning' | 'error' | 'info' }>`
  padding: 2px 8px; border-radius: 5px; font-size: 0.62rem; font-weight: 700;
  background: ${p => ({ success: 'rgba(16,185,129,0.15)', warning: 'rgba(245,158,11,0.15)', error: 'rgba(239,68,68,0.15)', info: 'rgba(59,130,246,0.15)' }[p.$type])};
  color: ${p => ({ success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#60A5FA' }[p.$type])};
  flex-shrink: 0; align-self: flex-start;
`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;`;
const StatCard = styled.div<{ $color: string }>`padding: 10px; border-radius: 9px; background: rgba(15,23,42,0.6); border: 1px solid ${p => p.$color}20; text-align: center;`;
const StatNum = styled.div<{ $color: string }>`font-size: 1rem; font-weight: 900; color: ${p => p.$color};`;
const StatLab = styled.div`font-size: 0.6rem; color: #64748B; margin-top: 2px;`;

const LOGS = [
  { type: 'success' as const, msg: 'RERA Form A (Listing Auth) uploaded and verified', meta: 'PROP-2892 — Jan 12, 2026 09:14 AM by Grace Nader', badge: 'FORM-A' },
  { type: 'success' as const, msg: 'AML KYC completed — Mohammed Al Rashid (Passport Verified)', meta: 'CLIENT-8841 — Jan 13, 2026 11:22 AM by Victoria Chen', badge: 'AML-PASS' },
  { type: 'warning' as const, msg: 'DLD NOC pending — Service charge outstanding AED 12,400', meta: 'PROP-2892 — Jan 14, 2026 02:45 PM', badge: 'NOC-HOLD' },
  { type: 'error' as const, msg: 'Broker license expired — BRN-2892 renewal due Jan 01, 2026', meta: 'AGENT: Sarah Mills — URGENT', badge: 'BRN-EXP' },
  { type: 'success' as const, msg: 'Ejari contract registered — TN-2025-88421', meta: 'TENANT-7733 — Jan 15, 2026 10:00 AM', badge: 'EJARI' },
  { type: 'info' as const, msg: 'Oqood interim registration confirmed — EMAAR South Heights', meta: 'BUYER-5512 — Jan 16, 2026 01:30 PM', badge: 'OQOOD' },
  { type: 'warning' as const, msg: 'PDPL consent form unsigned — client WhatsApp marketing on hold', meta: 'CLIENT-9201 — Jan 17, 2026 08:55 AM', badge: 'PDPL' },
  { type: 'success' as const, msg: 'DLD title deed transferred successfully — AED 5,500,000', meta: 'PROP-2892 — Jan 20, 2026 03:00 PM by Trustee Office DNRD', badge: 'TRANSFER' },
];

export const ComplianceAuditTrail: FC = () => {
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'error' | 'info'>('all');

  const counts = {
    success: LOGS.filter(l => l.type === 'success').length,
    warning: LOGS.filter(l => l.type === 'warning').length,
    error: LOGS.filter(l => l.type === 'error').length,
    info: LOGS.filter(l => l.type === 'info').length,
  };

  const filtered = filter === 'all' ? LOGS : LOGS.filter(l => l.type === filter);

  return (
    <Wrapper data-testid="compliance-audit-trail">
      <Header>
        <Title>📋 Compliance Audit Trail</Title>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'success', 'warning', 'error'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '3px 10px', borderRadius: '5px', border: 'none', background: f === filter ? '#EF4444' : 'rgba(100,116,139,0.2)', color: f === filter ? '#FFF' : '#64748B', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </Header>
      <Body>
        <StatsGrid>
          <StatCard $color="#10B981"><StatNum $color="#10B981">{counts.success}</StatNum><StatLab>Passed</StatLab></StatCard>
          <StatCard $color="#F59E0B"><StatNum $color="#F59E0B">{counts.warning}</StatNum><StatLab>Warnings</StatLab></StatCard>
          <StatCard $color="#EF4444"><StatNum $color="#EF4444">{counts.error}</StatNum><StatLab>Critical</StatLab></StatCard>
          <StatCard $color="#60A5FA"><StatNum $color="#60A5FA">{counts.info}</StatNum><StatLab>Info</StatLab></StatCard>
        </StatsGrid>
        <AuditList>
          {filtered.map((log, i) => (
            <AuditRow key={i} $type={log.type}>
              <AuditIcon>{log.type === 'success' ? '✅' : log.type === 'warning' ? '⚠️' : log.type === 'error' ? '🔴' : 'ℹ️'}</AuditIcon>
              <AuditContent>
                <AuditMsg>{log.msg}</AuditMsg>
                <AuditMeta>{log.meta}</AuditMeta>
              </AuditContent>
              <AuditBadge $type={log.type}>{log.badge}</AuditBadge>
            </AuditRow>
          ))}
        </AuditList>
      </Body>
    </Wrapper>
  );
};
export default ComplianceAuditTrail;
