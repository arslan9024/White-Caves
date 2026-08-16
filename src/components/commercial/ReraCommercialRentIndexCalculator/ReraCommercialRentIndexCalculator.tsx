/**
 * ReraCommercialRentIndexCalculator — Wave 54 GOAL-087
 * Commercial lease renewal indexation calculator based on RERA commercial rent index & Decree 43/2013
 * White Caves Real Estate LLC — Commercial & Corporate Leasing Suite
 */
import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { apiClient } from '../../../services/apiClient';

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
  &:disabled { opacity: 0.7; cursor: not-allowed; border-color: rgba(100, 116, 139, 0.15); }
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

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const ResultCard = styled.div<{ $increaseAllowed: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$increaseAllowed ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
  border: 1.5px solid ${p => p.$increaseAllowed ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'};
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
  transition: all 0.3s ease;
`;

const RVal = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
  color: #FFF;
`;

export const ReraCommercialRentIndexCalculator: FC = () => {
  const [currentRentAed, setCurrentRentAed] = useState('240000');
  const [commercialZone, setCommercialZone] = useState('Business Bay - Commercial Office');
  
  const [result, setResult] = useState({
    benchmark: 320000,
    maxIncreasePct: 0,
    allowableIncreaseAed: 0,
    maxAllowableRent: 240000,
    diffPct: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCalculation = async () => {
      setLoading(true);
      try {
        const query = `
          query CalculateRera($zone: String!, $currentRentAed: Float!) {
            calculateReraCommercialRent(zone: $zone, currentRentAed: $currentRentAed) {
              benchmark
              maxIncreasePct
              allowableIncreaseAed
              maxAllowableRent
            }
          }
        `;
        const res = await apiClient.post<{ data?: any }>('/graphql', {
          query,
          variables: { zone: commercialZone, currentRentAed: Number(currentRentAed) || 1 }
        });
        
        if (res?.data?.calculateReraCommercialRent) {
          const data = res.data.calculateReraCommercialRent;
          const current = Number(currentRentAed) || 1;
          const diffPct = ((data.benchmark - current) / data.benchmark) * 100;
          setResult({ ...data, diffPct });
        }
      } catch (e) {
        console.error('Failed to fetch RERA index', e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCalculation, 500);
    return () => clearTimeout(timer);
  }, [commercialZone, currentRentAed]);

  return (
    <Wrap data-testid="rera-commercial-rent-index-calculator">
      <Head>
        <Title>⚖️ RERA Commercial Rent Indexation & Cap Calculator</Title>
        <Tag>DECREE 43/2013 STATUTORY</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Commercial Community</FLabel>
            <Select value={commercialZone} onChange={e => setCommercialZone(e.target.value)}>
              <option value="Business Bay - Commercial Office">Business Bay - Commercial Office</option>
              <option value="Downtown Dubai - Grade A Corporate">Downtown Dubai - Grade A Corporate</option>
              <option value="DIFC Non-Freezone Gate Precinct">DIFC Non-Freezone Gate Precinct</option>
              <option value="Jumeirah Lakes Towers (JLT) Commercial">Jumeirah Lakes Towers (JLT) Commercial</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Current Annual Rent (AED)</FLabel>
            <Input type="number" value={currentRentAed} onChange={e => setCurrentRentAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>RERA Benchmark Average (AED)</FLabel>
            <Input type="number" value={result.benchmark} disabled readOnly />
          </Field>
        </FormGrid>

        <ResultGrid style={{ opacity: loading ? 0.6 : 1 }}>
          <ResultCard $increaseAllowed={result.maxIncreasePct > 0}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              Max Permissible Rent Increase
            </div>
            <RVal style={{ color: result.maxIncreasePct > 0 ? '#EF4444' : '#10B981' }}>
              {loading ? '...' : `+${result.maxIncreasePct}%`}
            </RVal>
            <div style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
              {result.diffPct > 10 
                ? `Rent is ${result.diffPct.toFixed(1)}% below RERA benchmark` 
                : 'Rent is within 10% of benchmark (0% Increase Allowed)'}
            </div>
          </ResultCard>

          <ResultCard $increaseAllowed={false}>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
              Maximum Legal Renewal Rent
            </div>
            <RVal style={{ color: '#10B981' }}>
              {loading ? '...' : `AED ${Math.round(result.maxAllowableRent).toLocaleString()}`}
            </RVal>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Max allowable increase: +AED {Math.round(result.allowableIncreaseAed).toLocaleString()} / year
            </div>
          </ResultCard>
        </ResultGrid>

        <div style={{ fontSize: '0.68rem', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 12px', borderRadius: '6px', lineHeight: '1.4' }}>
          ⚖️ <strong>Dubai Decree No. 43 of 2013 Directives:</strong> Landlords must provide minimum 90-day statutory notice before lease expiry to enforce allowable RERA rent index adjustments.
        </div>
      </Body>
    </Wrap>
  );
};

export default ReraCommercialRentIndexCalculator;
