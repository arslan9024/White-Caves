/**
 * AccessCardApprovalWorkflow — Wave 52 GOAL-066
 * Building access card request & approval workflow for tenants
 * White Caves Real Estate LLC — Asset Management & IoT Facilities Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 2px solid rgba(16, 185, 129, 0.25);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(16, 185, 129, 0.06);
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
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
  background: rgba(16, 185, 129, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReqCard = styled.div<{ $approved: boolean }>`
  padding: 14px;
  border-radius: 10px;
  background: ${p => p.$approved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$approved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(100, 116, 139, 0.2)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RName = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #FFF;
`;

const RDetail = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #10B981;
  color: #FFF;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
`;

export const AccessCardApprovalWorkflow: FC = () => {
  const [requests, setRequests] = useState([
    { id: 'AC-301', tenant: 'Sir Jonathan Hayes', unit: 'Penthouse 4001, Marina Gate', cardType: 'Parking Barrier RFID Tag & Keycard (x2)', feeAed: 400, approved: false },
    { id: 'AC-302', tenant: 'Dr. Fatima Al Nuaimi', unit: 'Villa 12B, Palm Jumeirah', cardType: 'Biometric Gate Access Pass', feeAed: 200, approved: true },
    { id: 'AC-303', tenant: 'Alexander Sterling', unit: 'Apartment 1204, Downtown Views', cardType: 'Service Elevator Access Fob', feeAed: 150, approved: false },
  ]);

  const approveRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, approved: true } : r));
  };

  return (
    <Wrap data-testid="access-card-approval-workflow">
      <Head>
        <Title>🪪 Building Access Card & RFID Barrier Permit Workflow</Title>
        <Tag>SECURITY INTEGRATION</Tag>
      </Head>
      <Body>
        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
          Digital tenant access card request queue linked to building security RFID controllers, automatically verifying active Ejari status before credential issuance.
        </div>

        <ReqList>
          {requests.map(req => (
            <ReqCard key={req.id} $approved={req.approved}>
              <RInfo>
                <RName>{req.tenant} <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>({req.unit})</span></RName>
                <RDetail>💳 Requested: {req.cardType} | Admin Fee: AED {req.feeAed}</RDetail>
              </RInfo>
              <div>
                {req.approved ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981' }}>✓ ISSUED & ACTIVE</span>
                ) : (
                  <ActionBtn onClick={() => approveRequest(req.id)}>
                    ✓ Authorize RFID Card
                  </ActionBtn>
                )}
              </div>
            </ReqCard>
          ))}
        </ReqList>
      </Body>
    </Wrap>
  );
};

export default AccessCardApprovalWorkflow;
