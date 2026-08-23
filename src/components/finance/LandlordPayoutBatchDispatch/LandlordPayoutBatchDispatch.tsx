/**
 * LandlordPayoutBatchDispatch — Wave 50 GOAL-048
 * Landlord monthly net payout automated bank transfer batch dispatch engine
 * White Caves Real Estate LLC — Property Management & Finance Suite
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

const PayoutTag = styled.span`
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const SCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SKey = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
`;

const SVal = styled.div`
  font-size: 1.1rem;
  font-weight: 900;
  color: #10B981;
`;

const PayoutTable = styled.table`
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
  &:hover { background: rgba(16, 185, 129, 0.04); }
`;

const Td = styled.td`
  padding: 8px 10px;
  color: #CBD5E1;
`;

const DispatchBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #059669, #10B981);
  color: #FFF;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const LandlordPayoutBatchDispatch: FC = () => {
  const [payouts, setPayouts] = useState([
    { id: 'PO-701', landlord: 'Dr. Tariq Al Qasimi', property: 'Villa 14B, Palm Jumeirah', grossRent: 450000, mgmtFee: 22500, maintenance: 8400, netPayout: 419100, iban: 'AE12 0330...9011', status: 'READY' },
    { id: 'PO-702', landlord: 'Elena Rostova', property: 'Penthouse 3201, Downtown Dubai', grossRent: 320000, mgmtFee: 16000, maintenance: 0, netPayout: 304000, iban: 'AE89 0240...4421', status: 'READY' },
    { id: 'PO-703', landlord: 'Sir Richard Sterling', property: 'Apartment 1404, Dubai Marina', grossRent: 160000, mgmtFee: 8000, maintenance: 3200, netPayout: 148800, iban: 'AE44 0110...7710', status: 'READY' },
  ]);

  const [dispatched, setDispatched] = useState(false);

  const totalGross = payouts.reduce((acc, p) => acc + p.grossRent, 0);
  const totalNet = payouts.reduce((acc, p) => acc + p.netPayout, 0);
  const totalFees = totalGross - totalNet;

  const handleDispatch = () => {
    setDispatched(true);
    setPayouts(prev => prev.map(p => ({ ...p, status: 'DISPATCHED' })));
  };

  return (
    <Wrap data-testid="landlord-payout-batch-dispatch">
      <Head>
        <Title>💸 Landlord Monthly Net Payout Automated Batch Dispatch</Title>
        <PayoutTag>CENTRAL BANK WPS BATCH</PayoutTag>
      </Head>
      <Body>
        <SummaryGrid>
          <SCard>
            <SKey>Total Batch Net Payout</SKey>
            <SVal>AED {totalNet.toLocaleString()}</SVal>
          </SCard>
          <SCard>
            <SKey>Agency PM Fees Deducted</SKey>
            <SVal style={{ color: 'var(--accent-red, #EF4444)' }}>AED {totalFees.toLocaleString()}</SVal>
          </SCard>
          <SCard>
            <SKey>Accounts in Batch</SKey>
            <SVal style={{ color: 'var(--white, #FFF)' }}>{payouts.length} Landlords</SVal>
          </SCard>
        </SummaryGrid>

        <PayoutTable>
          <thead>
            <tr>
              <Th>Payout Ref</Th>
              <Th>Landlord</Th>
              <Th>Property</Th>
              <Th>Gross Rent</Th>
              <Th>Deductions</Th>
              <Th>Net Payout (AED)</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <Tr key={p.id}>
                <Td style={{ fontWeight: 800, color: 'var(--white, #FFF)' }}>{p.id}</Td>
                <Td>{p.landlord}</Td>
                <Td style={{ color: 'var(--color-94a3b8, #94A3B8)' }}>{p.property}</Td>
                <Td>AED {p.grossRent.toLocaleString()}</Td>
                <Td style={{ color: 'var(--accent-red, #EF4444)' }}>- AED {(p.mgmtFee + p.maintenance).toLocaleString()}</Td>
                <Td style={{ fontWeight: 800, color: 'var(--accent-green, #10B981)' }}>AED {p.netPayout.toLocaleString()}</Td>
                <Td>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: p.status === 'DISPATCHED' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: p.status === 'DISPATCHED' ? 'var(--accent-green, #10B981)' : 'var(--accent-gold, #F59E0B)' }}>
                    {p.status}
                  </span>
                </Td>
              </Tr>
            ))}
          </tbody>
        </PayoutTable>

        {dispatched ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: 'var(--accent-green, #10B981)', fontWeight: 800, fontSize: '0.85rem' }}>
            ✓ Batch Wire Transfer of AED {totalNet.toLocaleString()} Transmitted to Corporate Bank API!
          </div>
        ) : (
          <DispatchBtn onClick={handleDispatch}>
            🚀 Transmit Automated Landlord Payout Batch (AED {totalNet.toLocaleString()})
          </DispatchBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default LandlordPayoutBatchDispatch;
