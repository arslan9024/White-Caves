/**
 * DeveloperNocTracker — Wave 48 GOAL-028
 * Master developer NOC processing step tracker (EMAAR, DAMAC, Nakheel)
 * White Caves Real Estate LLC — Conveyancing & Transfer Suite
 */
import React, { FC, useState } from 'react';
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

const DevBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DevSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const DevButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${p => p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.2)'};
  background: ${p => p.$active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.6)'};
  color: ${p => p.$active ? '#FFF' : '#94A3B8'};
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #EF4444; }
`;

const NocOverview = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.2);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const NocField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const NKey = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
`;

const NVal = styled.div`
  font-size: 0.85rem;
  color: #FFF;
  font-weight: 800;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StepItem = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  padding: 10px 14px;
  border-radius: 8px;
  background: ${p => p.$status === 'done' ? 'rgba(16, 185, 129, 0.07)' : p.$status === 'current' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.5)'};
  border: 1px solid ${p => p.$status === 'done' ? 'rgba(16, 185, 129, 0.25)' : p.$status === 'current' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(100, 116, 139, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StepNum = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${p => p.$status === 'done' ? '#10B981' : p.$status === 'current' ? '#EF4444' : '#334155'};
  color: #FFF;
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepLabel = styled.div<{ $status: 'done' | 'current' | 'pending' }>`
  font-size: 0.78rem;
  font-weight: 700;
  color: ${p => p.$status === 'done' ? '#E2E8F0' : p.$status === 'current' ? '#FFF' : '#64748B'};
`;

const StepTag = styled.span<{ $status: 'done' | 'current' | 'pending' }>`
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${p => p.$status === 'done' ? '#10B981' : p.$status === 'current' ? '#EF4444' : '#334155'};
  color: #FFF;
`;

const NOC_TEMPLATES = {
  EMAAR: {
    fee: 'AED 5,250 (incl. VAT)',
    sla: '3-5 Business Days',
    portal: 'Emaar One Portal',
    steps: [
      { name: 'Service Charge Account Statement Clearance', status: 'done' },
      { name: 'Unit Alterations / Modification Inspection Check', status: 'done' },
      { name: 'Seller & Buyer Title Deed / Passport Submission', status: 'current' },
      { name: 'NOC Fee Online Payment Clearance', status: 'pending' },
      { name: 'Digital e-NOC Certificate Issued to DLD Trustee', status: 'pending' },
    ]
  },
  DAMAC: {
    fee: 'AED 3,150 (incl. VAT)',
    sla: '2-4 Business Days',
    portal: 'DAMAC Assist / Hello DAMAC',
    steps: [
      { name: 'Finance & Installment Ledger Audit', status: 'done' },
      { name: 'Service Charge & Chiller Clearance', status: 'current' },
      { name: 'MOU Form F Upload & KYC Verification', status: 'pending' },
      { name: 'NOC Administration Fee Settlement', status: 'pending' },
      { name: 'Official DAMAC Transfer NOC Release', status: 'pending' },
    ]
  },
  NAKHEEL: {
    fee: 'AED 5,000 (incl. VAT)',
    sla: '5-7 Business Days',
    portal: 'Nakheel Online Services',
    steps: [
      { name: 'Master Community Fee Settlement', status: 'done' },
      { name: 'Nakheel Engineering Snag / Non-Objection Check', status: 'done' },
      { name: 'Buyer & Seller Document Submissions', status: 'done' },
      { name: 'Security Cheque Verification', status: 'current' },
      { name: 'Physical / Digital NOC Issuance to Dubai Trustee', status: 'pending' },
    ]
  }
};

export const DeveloperNocTracker: FC = () => {
  const [selectedDev, setSelectedDev] = useState<'EMAAR' | 'DAMAC' | 'NAKHEEL'>('EMAAR');

  const activeTemplate = NOC_TEMPLATES[selectedDev];

  return (
    <Wrap data-testid="developer-noc-tracker">
      <Head>
        <Title>🏢 Master Developer NOC Tracker</Title>
        <DevBadge>CONVEYANCING ENGINE</DevBadge>
      </Head>
      <Body>
        <DevSelector>
          {(['EMAAR', 'DAMAC', 'NAKHEEL'] as const).map(dev => (
            <DevButton 
              key={dev} 
              $active={selectedDev === dev}
              onClick={() => setSelectedDev(dev)}
            >
              {dev}
            </DevButton>
          ))}
        </DevSelector>

        <NocOverview>
          <NocField>
            <NKey>NOC Standard Fee</NKey>
            <NVal>{activeTemplate.fee}</NVal>
          </NocField>
          <NocField>
            <NKey>Expected Turnaround</NKey>
            <NVal>{activeTemplate.sla}</NVal>
          </NocField>
          <NocField>
            <NKey>Processing Portal</NKey>
            <NVal>{activeTemplate.portal}</NVal>
          </NocField>
        </NocOverview>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', marginBottom: '8px' }}>
            {selectedDev} Step-by-Step Approval Protocol
          </div>
          <StepList>
            {activeTemplate.steps.map((step, i) => (
              <StepItem key={i} $status={step.status as any}>
                <StepLeft>
                  <StepNum $status={step.status as any}>
                    {step.status === 'done' ? '✓' : i + 1}
                  </StepNum>
                  <StepLabel $status={step.status as any}>{step.name}</StepLabel>
                </StepLeft>
                <StepTag $status={step.status as any}>
                  {step.status === 'done' ? 'CLEARED' : step.status === 'current' ? 'UNDER REVIEW' : 'PENDING'}
                </StepTag>
              </StepItem>
            ))}
          </StepList>
        </div>
      </Body>
    </Wrap>
  );
};

export default DeveloperNocTracker;
