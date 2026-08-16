/**
 * LandFeasibilityStudyGenerator — Wave 54 GOAL-088
 * Land plot development feasibility study generator (Plot Area, FAR, GFA, BUA, and Construction CapEx)
 * White Caves Real Estate LLC — Commercial & Advisory Suite
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

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  text-align: center;
`;

const RCard = styled.div`
  padding: 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.15);
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RVal = styled.div`
  font-size: 1rem;
  font-weight: 900;
  color: #EF4444;
`;

const CapExSummary = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LandFeasibilityStudyGenerator: FC = () => {
  const [plotAreaSqft, setPlotAreaSqft] = useState('35000');
  const [farRatio, setFarRatio] = useState('4.5');
  const [landPriceAed, setLandPriceAed] = useState('65000000');
  const [constructionRateSqft, setConstructionRateSqft] = useState('650');
  const [zoningUsage, setZoningUsage] = useState('G+18 Residential & Retail');

  const plot = Number(plotAreaSqft) || 1;
  const far = Number(farRatio) || 1;
  const landPrice = Number(landPriceAed) || 0;
  const constrRate = Number(constructionRateSqft) || 1;

  const gfaSqft = plot * far; // Gross Floor Area
  const buaSqft = gfaSqft * 1.35; // Built Up Area (including parking, MEP, common)
  const totalConstructionCapEx = buaSqft * constrRate;
  const totalProjectCost = landPrice + totalConstructionCapEx;
  const estGrossDevelopmentValue = gfaSqft * 1850; // AED 1850/sqft exit sales rate
  const developerNetProfit = estGrossDevelopmentValue - totalProjectCost;
  const roiPct = totalProjectCost > 0 ? (developerNetProfit / totalProjectCost) * 100 : 0;

  return (
    <Wrap data-testid="land-feasibility-study-generator">
      <Head>
        <Title>📐 Land Plot Feasibility & GFA/BUA Architectural Math</Title>
        <Tag>DEVELOPER ADVISORY</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>Plot Area (SqFt)</FLabel>
            <Input type="number" value={plotAreaSqft} onChange={e => setPlotAreaSqft(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Floor Area Ratio (FAR)</FLabel>
            <Input type="number" step="0.1" value={farRatio} onChange={e => setFarRatio(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Land Acquisition Cost (AED)</FLabel>
            <Input type="number" value={landPriceAed} onChange={e => setLandPriceAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Zoning & Height Permitted</FLabel>
            <Select value={zoningUsage} onChange={e => setZoningUsage(e.target.value)}>
              <option value="G+4 Low Rise Boutique">G+4 Low Rise Boutique</option>
              <option value="G+18 Residential & Retail">G+18 Residential & Retail</option>
              <option value="G+45 High Rise Iconic Tower">G+45 High Rise Iconic Tower</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Construction Cost / BUA SqFt</FLabel>
            <Input type="number" value={constructionRateSqft} onChange={e => setConstructionRateSqft(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Authority Jurisdiction</FLabel>
            <Input value="Dubai Municipality (DM) / DDA" readOnly style={{ color: '#94A3B8' }} />
          </Field>
        </FormGrid>

        <ResultsGrid>
          <RCard>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Permitted GFA</div>
            <RVal>{Math.round(gfaSqft).toLocaleString()} SqFt</RVal>
          </RCard>
          <RCard>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Total BUA (1.35x)</div>
            <RVal style={{ color: '#E2E8F0' }}>{Math.round(buaSqft).toLocaleString()} SqFt</RVal>
          </RCard>
          <RCard>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Total Dev Cost</div>
            <RVal>AED {(totalProjectCost / 1000000).toFixed(1)}M</RVal>
          </RCard>
          <RCard>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8' }}>Projected Net Profit</div>
            <RVal style={{ color: '#10B981' }}>AED {(developerNetProfit / 1000000).toFixed(1)}M</RVal>
          </RCard>
        </ResultsGrid>

        <CapExSummary>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFF' }}>
              Projected Developer Return on Investment (ROI): <span style={{ color: '#10B981', fontSize: '0.9rem' }}>{roiPct.toFixed(1)}%</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>
              Exit Sales Value (GDV): AED {(estGrossDevelopmentValue / 1000000).toFixed(1)}M (based on AED 1,850/sqft average)
            </div>
          </div>
          <button style={{ padding: '8px 16px', background: '#10B981', border: 'none', borderRadius: '6px', color: '#FFF', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>
            📥 Export Feasibility PDF
          </button>
        </CapExSummary>
      </Body>
    </Wrap>
  );
};

export default LandFeasibilityStudyGenerator;
