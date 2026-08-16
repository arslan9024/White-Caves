/**
 * FitOutCostEstimator — Wave 54 GOAL-083
 * Commercial & Retail fit-out cost estimator (Shell & Core vs Semi-Fitted vs Turnkey Grade A)
 * White Caves Real Estate LLC — Commercial & Corporate Suite
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
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
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

const CostBreakdown = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const CItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CKey = styled.div`
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 700;
`;

const CVal = styled.div`
  font-size: 1.15rem;
  font-weight: 900;
  color: #EF4444;
`;

export const FitOutCostEstimator: FC = () => {
  const [areaSqft, setAreaSqft] = useState('3200');
  const [propertyType, setPropertyType] = useState('Commercial Office');
  const [tier, setTier] = useState<'standard' | 'premium' | 'luxury'>('premium');

  const sqft = Number(areaSqft) || 1;
  const ratePerSqft = tier === 'standard' ? 180 : tier === 'premium' ? 320 : 550;

  const mepCost = sqft * (ratePerSqft * 0.35);
  const civilCost = sqft * (ratePerSqft * 0.40);
  const itFurnitureCost = sqft * (ratePerSqft * 0.25);
  const totalCost = sqft * ratePerSqft;
  const authorityApprovalFees = 28000; // Dubai Municipality & Civil Defense
  const grandTotal = totalCost + authorityApprovalFees;

  return (
    <Wrap data-testid="fit-out-cost-estimator">
      <Head>
        <Title>📐 Retail & Commercial Fit-Out Cost Calculator</Title>
        <Tag>DM & CIVIL DEFENSE COMPLIANT</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Total Area (SqFt)</FLabel>
            <Input type="number" value={areaSqft} onChange={e => setAreaSqft(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Asset Category</FLabel>
            <Select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
              <option value="Commercial Office">Commercial Office</option>
              <option value="Retail Boutique / Shop">Retail Boutique / Shop</option>
              <option value="F&B Restaurant / Lounge">F&B Restaurant / Lounge</option>
              <option value="Medical Clinic / Wellness">Medical Clinic / Wellness</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Fit-Out Specification Tier</FLabel>
            <Select value={tier} onChange={e => setTier(e.target.value as any)}>
              <option value="standard">Standard Cat-A (AED 180/sqft)</option>
              <option value="premium">Corporate Grade A (AED 320/sqft)</option>
              <option value="luxury">Luxury Bespoke (AED 550/sqft)</option>
            </Select>
          </Field>
        </FormGrid>

        <CostBreakdown>
          <CItem>
            <CKey>Total Estimated Fit-Out</CKey>
            <CVal>AED {Math.round(grandTotal).toLocaleString()}</CVal>
          </CItem>
          <CItem>
            <CKey>Cost Per SqFt</CKey>
            <CVal style={{ color: '#10B981' }}>AED {Math.round(grandTotal / sqft)} / sqft</CVal>
          </CItem>
          <CItem>
            <CKey>Approvals & NOCs</CKey>
            <CVal style={{ color: '#FFF' }}>AED {authorityApprovalFees.toLocaleString()}</CVal>
          </CItem>
        </CostBreakdown>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.72rem', color: '#94A3B8' }}>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.6)', borderRadius: '6px' }}>
            <div>⚡ MEP & HVAC (35%)</div>
            <div style={{ fontWeight: 800, color: '#E2E8F0', marginTop: '2px' }}>AED {Math.round(mepCost).toLocaleString()}</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.6)', borderRadius: '6px' }}>
            <div>🧱 Civil, Glass & Ceilings (40%)</div>
            <div style={{ fontWeight: 800, color: '#E2E8F0', marginTop: '2px' }}>AED {Math.round(civilCost).toLocaleString()}</div>
          </div>
          <div style={{ padding: '8px', background: 'rgba(15,23,42,0.6)', borderRadius: '6px' }}>
            <div>💻 IT, AV & Joinery (25%)</div>
            <div style={{ fontWeight: 800, color: '#E2E8F0', marginTop: '2px' }}>AED {Math.round(itFurnitureCost).toLocaleString()}</div>
          </div>
        </div>
      </Body>
    </Wrap>
  );
};

export default FitOutCostEstimator;
