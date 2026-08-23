/**
 * ReserveFundEscrowCalculator — Wave 50 GOAL-046
 * Property management maintenance reserve fund escrow calculator
 * White Caves Real Estate LLC — Asset Management & Finance Suite
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

const InputGrid = styled.div`
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

const EscrowDisplay = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const ECard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const EKey = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
`;

const EVal = styled.div`
  font-size: 1.1rem;
  font-weight: 900;
  color: #EF4444;
`;

const AllocationBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AllocRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.15);
  font-size: 0.75rem;
`;

export const ReserveFundEscrowCalculator: FC = () => {
  const [totalUnits, setTotalUnits] = useState('24');
  const [grossAnnualRental, setGrossAnnualRental] = useState('3600000');
  const [propertyAgeYears, setPropertyAgeYears] = useState('5');
  const [fundStrategy, setFundStrategy] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  const grossRent = Number(grossAnnualRental) || 0;
  const units = Number(totalUnits) || 1;
  const age = Number(propertyAgeYears) || 1;

  // Percentage of gross rent allocated to reserve fund based on age and strategy
  const baseRatePct = fundStrategy === 'conservative' ? 4 : fundStrategy === 'balanced' ? 6 : 8;
  const ageMultiplier = age > 10 ? 1.4 : age > 5 ? 1.2 : 1.0;
  const effectiveRatePct = baseRatePct * ageMultiplier;

  const totalReserveAnnual = (grossRent * effectiveRatePct) / 100;
  const perUnitReserve = totalReserveAnnual / units;
  const monthlyReserve = totalReserveAnnual / 12;

  return (
    <Wrap data-testid="reserve-fund-escrow-calculator">
      <Head>
        <Title>🛡️ Sinking & Reserve Fund Escrow Model</Title>
        <Tag>ASSET GOVERNANCE</Tag>
      </Head>
      <Body>
        <InputGrid>
          <Field>
            <FLabel>Total Units Managed</FLabel>
            <Input type="number" value={totalUnits} onChange={e => setTotalUnits(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Gross Annual Rental Income (AED)</FLabel>
            <Input type="number" value={grossAnnualRental} onChange={e => setGrossAnnualRental(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Building Age (Years)</FLabel>
            <Input type="number" value={propertyAgeYears} onChange={e => setPropertyAgeYears(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Capital Reserve Strategy</FLabel>
            <Select value={fundStrategy} onChange={e => setFundStrategy(e.target.value as any)}>
              <option value="conservative">Conservative (4% Base)</option>
              <option value="balanced">Balanced Standard (6% Base)</option>
              <option value="aggressive">Aggressive / High CapEx (8% Base)</option>
            </Select>
          </Field>
        </InputGrid>

        <EscrowDisplay>
          <ECard>
            <EKey>Annual Reserve Escrow</EKey>
            <EVal>AED {Math.round(totalReserveAnnual).toLocaleString()}</EVal>
          </ECard>
          <ECard>
            <EKey>Per Unit Allocation</EKey>
            <EVal style={{ color: 'var(--accent-green, #10B981)' }}>AED {Math.round(perUnitReserve).toLocaleString()}</EVal>
          </ECard>
          <ECard>
            <EKey>Monthly Escrow Draft</EKey>
            <EVal style={{ color: 'var(--white, #FFF)' }}>AED {Math.round(monthlyReserve).toLocaleString()}</EVal>
          </ECard>
        </EscrowDisplay>

        <AllocationBreakdown>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase' }}>
            Statutory CapEx Reserve Sub-Accounts
          </div>
          <AllocRow>
            <span>❄️ HVAC & Mechanical Plant Replacement (40%)</span>
            <span style={{ fontWeight: 800, color: 'var(--text-secondary, #E2E8F0)' }}>AED {Math.round(totalReserveAnnual * 0.4).toLocaleString()}</span>
          </AllocRow>
          <AllocRow>
            <span>🛗 Elevator & Lift Modernization Fund (25%)</span>
            <span style={{ fontWeight: 800, color: 'var(--text-secondary, #E2E8F0)' }}>AED {Math.round(totalReserveAnnual * 0.25).toLocaleString()}</span>
          </AllocRow>
          <AllocRow>
            <span>🧱 Facade, Waterproofing & Roofing (20%)</span>
            <span style={{ fontWeight: 800, color: 'var(--text-secondary, #E2E8F0)' }}>AED {Math.round(totalReserveAnnual * 0.2).toLocaleString()}</span>
          </AllocRow>
          <AllocRow>
            <span>🚨 Emergency Contingency Escrow (15%)</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-red, #EF4444)' }}>AED {Math.round(totalReserveAnnual * 0.15).toLocaleString()}</span>
          </AllocRow>
        </AllocationBreakdown>
      </Body>
    </Wrap>
  );
};

export default ReserveFundEscrowCalculator;
