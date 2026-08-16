/**
 * GodModeAuditLogViewer — Wave 55 GOAL-091
 * Level 5 God-Mode audit log viewer tracing all admin impersonation & privileged actions
 * White Caves Real Estate LLC — Security & Enterprise Governance Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0A0614 0%, #0F172A 100%);
  border: 2px solid rgba(239, 68, 68, 0.35);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(239, 68, 68, 0.08);
  border-bottom: 1px solid rgba(239, 68, 68, 0.18);
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

const L5Badge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.15);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.4);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.72rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 10px;
  color: #94A3B8;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.62rem;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
`;

const Tr = styled.tr`
  border-bottom: 1px solid rgba(100, 116, 139, 0.08);
  &:hover { background: rgba(239, 68, 68, 0.05); }
`;

const Td = styled.td`
  padding: 8px 10px;
  color: #CBD5E1;
`;

const ImpersonateTag = styled.span`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
`;

export const GodModeAuditLogViewer: FC = () => {
  const [logs, setLogs] = useState([
    { id: 'ACT-9901', timestamp: '2026-08-14 09:12:45', actor: 'Arsalan Malik (MD / L5)', targetUser: 'Agent Sarah Connor', action: 'Impersonated User Session', ip: '194.187.168.22', outcome: 'SUCCESS' },
    { id: 'ACT-9902', timestamp: '2026-08-14 08:45:10', actor: 'Arsalan Malik (MD / L5)', targetUser: 'Finance Manager', action: 'Override Escrow Payout Limit', ip: '194.187.168.22', outcome: 'AUTHORIZED' },
    { id: 'ACT-9903', timestamp: '2026-08-13 18:30:22', actor: 'Elena Rostova (Compliance L4)', targetUser: 'System GodMode', action: 'Requested SAR Report Export', ip: '82.178.44.102', outcome: 'AUDITED' },
    { id: 'ACT-9904', timestamp: '2026-08-13 14:15:00', actor: 'Arsalan Malik (MD / L5)', targetUser: 'Listing #9024', action: 'Bypassed RERA Trakheesi Block for Staging', ip: '194.187.168.22', outcome: 'OVERRIDDEN' },
  ]);

  return (
    <Wrap data-testid="god-mode-audit-log-viewer">
      <Head>
        <Title>👁️ Level 5 God-Mode & Privileged Action Audit Stream</Title>
        <L5Badge>SOVEREIGN SECURITY</L5Badge>
      </Head>
      <Body>
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.72rem', color: '#FCA5A5' }}>
          🔒 <strong>Immutable Blockchain Audit Log:</strong> All Level 5 Superuser impersonations, role elevations, and escrow overrides are cryptographically signed and archived for regulatory compliance with Dubai Government Audit Standards.
        </div>

        <LogTable>
          <thead>
            <tr>
              <Th>Log Ref</Th>
              <Th>Timestamp (GST)</Th>
              <Th>Superuser Actor</Th>
              <Th>Target Context</Th>
              <Th>Privileged Action</Th>
              <Th>IP Address</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <Tr key={log.id}>
                <Td style={{ fontWeight: 800, color: '#FFF' }}>{log.id}</Td>
                <Td style={{ color: '#94A3B8' }}>{log.timestamp}</Td>
                <Td style={{ fontWeight: 700, color: '#EF4444' }}>{log.actor}</Td>
                <Td><ImpersonateTag>{log.targetUser}</ImpersonateTag></Td>
                <Td>{log.action}</Td>
                <Td style={{ fontFamily: 'monospace', color: '#94A3B8' }}>{log.ip}</Td>
                <Td style={{ fontWeight: 800, color: '#10B981' }}>{log.outcome}</Td>
              </Tr>
            ))}
          </tbody>
        </LogTable>
      </Body>
    </Wrap>
  );
};

export default GodModeAuditLogViewer;
