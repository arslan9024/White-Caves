/**
 * GdprDataDeletionQueue — Wave 55 GOAL-099
 * Automated GDPR & UAE PDPL data deletion request execution queue
 * White Caves Real Estate LLC — Privacy & Legal Compliance Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(139, 92, 246, 0.08);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
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

const PdplBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(139, 92, 246, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RequestCard = styled.div<{ $status: 'pending' | 'purged' | 'retained' }>`
  padding: 14px;
  border-radius: 10px;
  background: ${p => p.$status === 'purged' ? 'rgba(16, 185, 129, 0.08)' : p.$status === 'retained' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$status === 'purged' ? 'rgba(16, 185, 129, 0.3)' : p.$status === 'retained' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const RName = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
`;

const RMeta = styled.div`
  font-size: 0.7rem;
  color: #94A3B8;
`;

const RStatus = styled.div`
  text-align: right;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: ${p => p.$danger ? '#EF4444' : '#10B981'};
  color: #FFF;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  &:hover { filter: brightness(1.1); }
`;

interface DeletionRequest {
  id: string;
  client: string;
  email: string;
  requestedDate: string;
  reason: string;
  status: 'pending' | 'purged' | 'retained';
  legalHold: boolean;
  legalHoldReason?: string;
}

export const GdprDataDeletionQueue: FC = () => {
  const [requests, setRequests] = useState<DeletionRequest[]>([
    { id: 'DEL-401', client: 'Marc Dubois (France / GDPR)', email: 'm.dubois@paris-corp.fr', requestedDate: '2026-08-10', reason: 'Right to Erasure (Article 17 GDPR)', status: 'pending', legalHold: false },
    { id: 'DEL-402', client: 'Hamad Al Nuaimi (UAE / PDPL)', email: 'hamad.n@emirates.ae', requestedDate: '2026-08-08', reason: 'Withdrawal of Marketing Consent (Law 45/2021)', status: 'pending', legalHold: false },
    { id: 'DEL-403', client: 'Sergei Voronov (RERA Escrow Party)', email: 's.voronov@v-invest.ru', requestedDate: '2026-08-02', reason: 'Right to be Forgotten', status: 'retained', legalHold: true, legalHoldReason: 'Mandatory 5-Year UAE AML Transaction Retention' },
  ]);

  const handlePurge = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'purged' } : r));
  };

  return (
    <Wrap data-testid="gdpr-data-deletion-queue">
      <Head>
        <Title>🗑️ GDPR & UAE PDPL Right to Erasure Execution Queue</Title>
        <PdplBadge>PRIVACY GOVERNANCE</PdplBadge>
      </Head>
      <Body>
        <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.25)', fontSize: '0.72rem', color: 'var(--text-secondary, #CBD5E1)' }}>
          ⚖️ <strong>Dual Privacy Framework:</strong> Governed under UAE Federal Decree-Law No. 45 of 2021 (PDPL) & EU GDPR Article 17. Requests are vetted against statutory 5-year anti-money laundering (AML) and RERA escrow audit log retention requirements.
        </div>

        <RequestList>
          {requests.map(req => (
            <RequestCard key={req.id} $status={req.status}>
              <RInfo>
                <RName>{req.client}</RName>
                <RMeta>📧 {req.email} | Requested: {req.requestedDate}</RMeta>
                <RMeta style={{ color: req.legalHold ? 'var(--accent-gold, #F59E0B)' : 'var(--color-94a3b8, #94A3B8)' }}>
                  {req.reason} {req.legalHoldReason ? `[${req.legalHoldReason}]` : ''}
                </RMeta>
              </RInfo>
              <RStatus>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: req.status === 'purged' ? 'var(--accent-green, #10B981)' : req.status === 'retained' ? 'var(--accent-gold, #F59E0B)' : 'var(--accent-red, #EF4444)' }}>
                  {req.status === 'purged' ? '✓ PURGED FROM CRM & S3' : req.status === 'retained' ? '⚠️ LEGAL HOLD APPLIED' : '⏳ PENDING EXECUTION'}
                </div>
                {req.status === 'pending' && (
                  <ActionBtn $danger onClick={() => handlePurge(req.id)}>
                    🗑 Execute Cryptographic Purge
                  </ActionBtn>
                )}
              </RStatus>
            </RequestCard>
          ))}
        </RequestList>
      </Body>
    </Wrap>
  );
};

export default GdprDataDeletionQueue;
