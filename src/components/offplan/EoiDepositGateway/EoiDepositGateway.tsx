/**
 * EoiDepositGateway — Wave 53 GOAL-077
 * Expression of Interest (EOI) deposit collection gateway (AED 50k token lock)
 * White Caves Real Estate LLC — Off-Plan & Launch Day Sales Suite
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

const Tag = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const Select = styled.select`
  padding: 8px 10px;
  border-radius: 7px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const EoiBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const TokenAmount = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: #EF4444;
`;

const PayBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const EoiDepositGateway: FC = () => {
  const [buyerName, setBuyerName] = useState('Maximilian Bauer');
  const [project, setProject] = useState('Emaar Ocean Point, Rashid Yachts & Marina');
  const [unitType, setUnitType] = useState('3BR Waterfront Apartment');
  const [tokenAmountAed, setTokenAmountAed] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / Apple Pay');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Wrap data-testid="eoi-deposit-gateway">
      <Head>
        <Title>🎟️ Launch Day EOI Token & Deposit Collection Gateway</Title>
        <Tag>TOKENIZED ALLOCATION</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Buyer Legal Name</FLabel>
            <Input value={buyerName} onChange={e => setBuyerName(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Developer Launch Project</FLabel>
            <Select value={project} onChange={e => setProject(e.target.value)}>
              <option value="Emaar Ocean Point, Rashid Yachts & Marina">Emaar Ocean Point, Rashid Yachts & Marina</option>
              <option value="Damac Islands Private Lagoons">Damac Islands Private Lagoons</option>
              <option value="Nakheel Palm Crown Mansions">Nakheel Palm Crown Mansions</option>
              <option value="Meraas Central Park Plaza">Meraas Central Park Plaza</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Target Unit Configuration</FLabel>
            <Select value={unitType} onChange={e => setUnitType(e.target.value)}>
              <option value="1BR Luxury Residence">1BR Luxury Residence</option>
              <option value="2BR Premium Corner">2BR Premium Corner</option>
              <option value="3BR Waterfront Apartment">3BR Waterfront Apartment</option>
              <option value="4BR Penthouse / Sky Villa">4BR Penthouse / Sky Villa</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Deposit Method</FLabel>
            <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="Credit Card / Apple Pay">Credit Card / Apple Pay</option>
              <option value="Manager Cheque (Escrow Payable)">Manager Cheque (Escrow Payable)</option>
              <option value="Instant Bank Wire (Central Bank)">Instant Bank Wire (Central Bank)</option>
              <option value="Crypto USDT Escrow">Crypto USDT Escrow</option>
            </Select>
          </Field>
        </FormGrid>

        <EoiBox>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', fontWeight: 700 }}>Refundable EOI Token</div>
            <TokenAmount>AED {Number(tokenAmountAed).toLocaleString()}</TokenAmount>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', fontWeight: 700 }}>Queue Priority</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-green, #10B981)', marginTop: '2px' }}>Tier 1 VIP</div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', fontWeight: 700 }}>Refund Guarantee</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--white, #FFF)', marginTop: '2px' }}>100% Escrow</div>
          </div>
        </EoiBox>

        {submitted ? (
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>✅</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-green, #10B981)' }}>
              EOI Token Received & Priority Queue Locked!
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #CBD5E1)', marginTop: '4px' }}>
              Receipt Ref: EOI-EMAAR-2026-9481 | Token allocated to {buyerName}
            </div>
          </div>
        ) : (
          <PayBtn onClick={() => setSubmitted(true)}>
            🔒 Secure Launch Priority (Lock AED {Number(tokenAmountAed).toLocaleString()} EOI Token)
          </PayBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default EoiDepositGateway;
