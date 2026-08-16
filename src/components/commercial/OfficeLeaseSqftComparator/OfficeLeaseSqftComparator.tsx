/**
 * OfficeLeaseSqftComparator — Wave 54 GOAL-082
 * Commercial office space lease breakdown by SqM / SqFt comparison with service charge & fit-out models
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

const CommercialTag = styled.span`
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

const CompareGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ComparisonBox = styled.div<{ $highlight?: boolean }>`
  padding: 14px;
  border-radius: 12px;
  background: ${p => p.$highlight ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.7)'};
  border: 1px solid ${p => p.$highlight ? 'rgba(239, 68, 68, 0.35)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BoxHeader = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  color: #FFF;
  display: flex;
  justify-content: space-between;
`;

const PriceDisplay = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: #EF4444;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #94A3B8;
  border-bottom: 1px solid rgba(100, 116, 139, 0.1);
  padding-bottom: 4px;
`;

const MetricVal = styled.span`
  color: #E2E8F0;
  font-weight: 700;
`;

export const OfficeLeaseSqftComparator: FC = () => {
  const [areaSqft, setAreaSqft] = useState('4500');
  const [annualRentAed, setAnnualRentAed] = useState('675000');
  const [serviceChargePerSqft, setServiceChargePerSqft] = useState('28');
  const [parkingSlots, setParkingSlots] = useState('6');
  const [fitoutType, setFitoutType] = useState('Fully Fitted (Grade A)');

  const sqft = Number(areaSqft) || 1;
  const rent = Number(annualRentAed) || 0;
  const scPerSqft = Number(serviceChargePerSqft) || 0;

  const sqMeters = sqft * 0.092903;
  const rentPerSqft = rent / sqft;
  const rentPerSqm = rent / sqMeters;
  const totalServiceCharge = sqft * scPerSqft;
  const totalOccupancyCost = rent + totalServiceCharge;
  const vatAmount = totalOccupancyCost * 0.05;
  const grandTotal = totalOccupancyCost + vatAmount;

  return (
    <Wrap data-testid="office-lease-sqft-comparator">
      <Head>
        <Title>🏢 Commercial Office Lease & SqFt/SqM Comparator</Title>
        <CommercialTag>DIFC & DED COMMERCIAL</CommercialTag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Total Area (SqFt)</FLabel>
            <Input type="number" value={areaSqft} onChange={e => setAreaSqft(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Annual Base Rent (AED)</FLabel>
            <Input type="number" value={annualRentAed} onChange={e => setAnnualRentAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Service Charge (AED/SqFt)</FLabel>
            <Input type="number" value={serviceChargePerSqft} onChange={e => setServiceChargePerSqft(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Fit-Out Condition</FLabel>
            <Select value={fitoutType} onChange={e => setFitoutType(e.target.value)}>
              <option value="Shell & Core">Shell & Core</option>
              <option value="Semi-Fitted">Semi-Fitted (Cat A)</option>
              <option value="Fully Fitted (Grade A)">Fully Fitted (Grade A)</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Allocated Parking Bays</FLabel>
            <Input type="number" value={parkingSlots} onChange={e => setParkingSlots(e.target.value)} />
          </Field>
        </FormGrid>

        <CompareGrid>
          <ComparisonBox>
            <BoxHeader>
              <span>Imperial Unit Metrics (SqFt)</span>
              <span style={{ color: '#EF4444' }}>{sqft.toLocaleString()} SqFt</span>
            </BoxHeader>
            <PriceDisplay>AED {rentPerSqft.toFixed(2)} <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/ SqFt / Yr</span></PriceDisplay>
            <MetricRow>
              <span>Annual Base Rent</span>
              <MetricVal>AED {rent.toLocaleString()}</MetricVal>
            </MetricRow>
            <MetricRow>
              <span>Service Charge Total</span>
              <MetricVal>AED {totalServiceCharge.toLocaleString()}</MetricVal>
            </MetricRow>
            <MetricRow>
              <span>Parking Ratio</span>
              <MetricVal>1 bay : {Math.round(sqft / (Number(parkingSlots) || 1))} SqFt</MetricVal>
            </MetricRow>
          </ComparisonBox>

          <ComparisonBox $highlight>
            <BoxHeader>
              <span>Metric Unit Metrics (SqM)</span>
              <span style={{ color: '#10B981' }}>{sqMeters.toFixed(1)} SqM</span>
            </BoxHeader>
            <PriceDisplay style={{ color: '#10B981' }}>
              AED {rentPerSqm.toFixed(2)} <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/ SqM / Yr</span>
            </PriceDisplay>
            <MetricRow>
              <span>Total Occupancy (Rent + SC)</span>
              <MetricVal>AED {Math.round(totalOccupancyCost).toLocaleString()}</MetricVal>
            </MetricRow>
            <MetricRow>
              <span>UAE 5% VAT</span>
              <MetricVal>AED {Math.round(vatAmount).toLocaleString()}</MetricVal>
            </MetricRow>
            <MetricRow>
              <span>Total Financial Outlay / Yr</span>
              <MetricVal style={{ color: '#10B981', fontWeight: 900 }}>AED {Math.round(grandTotal).toLocaleString()}</MetricVal>
            </MetricRow>
          </ComparisonBox>
        </CompareGrid>
      </Body>
    </Wrap>
  );
};

export default OfficeLeaseSqftComparator;
