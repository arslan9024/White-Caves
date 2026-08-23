import React, { FC, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;

const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;
const Grid2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const Label = styled.label`font-size: 0.72rem; color: #94A3B8; font-weight: 600;`;
const Input = styled.input`padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; width: 100%; box-sizing: border-box; outline: none; &:focus { border-color: #EF4444; }`;
const Select = styled.select`padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; width: 100%; outline: none; &:focus { border-color: #EF4444; }`;

const ReportCard = styled.div`padding: 16px; border-radius: 12px; background: rgba(15,23,42,0.7); border: 1px solid rgba(239,68,68,0.18);`;
const ReportTitle = styled.div`font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B; margin-bottom: 12px;`;
const SummaryGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;`;
const SummaryItem = styled.div`text-align: center;`;
const SummaryVal = styled.div`font-size: 1rem; font-weight: 900; color: #EF4444;`;
const SummaryLab = styled.div`font-size: 0.65rem; color: #64748B; margin-top: 2px;`;

const CompRow = styled.div`display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(100,116,139,0.1);`;
const CompAddr = styled.div`flex: 1; font-size: 0.75rem; color: #CBD5E1; font-weight: 600;`;
const CompPrice = styled.div`font-size: 0.75rem; font-weight: 800; color: #94A3B8;`;
const CompDiff = styled.div<{ $positive: boolean }>`font-size: 0.7rem; font-weight: 700; color: ${p => p.$positive ? '#10B981' : '#EF4444'};`;

const GenerateBtn = styled.button`width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(90deg, #EF4444, #F97316); color: #FFF; font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; &:hover { filter: brightness(1.1); transform: translateY(-1px); }`;

const COMPS = [
  { addr: 'Apt 2301, Marina Gate 1', price: 2_150_000, sqft: 1180, diff: -2.3 },
  { addr: 'Apt 1405, Address Marina', price: 2_380_000, sqft: 1250, diff: +7.6 },
  { addr: 'Apt 3102, Princess Tower', price: 1_980_000, sqft: 1090, diff: -10.5 },
  { addr: 'Apt 801, Dubai Gate', price: 2_200_000, sqft: 1200, diff: -0.1 },
];

export const CmaReportGenerator: FC = () => {
  const [subject, setSubject] = useState('Apt 2802, Marina Sky Tower');
  const [askPrice, setAskPrice] = useState('2200000');
  const [sqft, setSqft] = useState('1200');
  const [bedrooms, setBedrooms] = useState('2');
  const [generated, setGenerated] = useState(false);

  const avgComp = COMPS.reduce((a, c) => a + c.price, 0) / COMPS.length;
  const psf = parseInt(askPrice) / parseInt(sqft || '1');

  return (
    <Wrapper data-testid="cma-report-generator">
      <Header>
        <Title>📋 AI Comparative Market Analysis</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>CMA Report Builder</div>
      </Header>
      <Body>
        <Field>
          <Label>Subject Property</Label>
          <Input value={subject} onChange={e => setSubject(e.target.value)} />
        </Field>
        <Grid2>
          <Field><Label>Asking Price (AED)</Label><Input type="number" value={askPrice} onChange={e => setAskPrice(e.target.value)} /></Field>
          <Field><Label>Area (sqft)</Label><Input type="number" value={sqft} onChange={e => setSqft(e.target.value)} /></Field>
          <Field><Label>Bedrooms</Label><Select value={bedrooms} onChange={e => setBedrooms(e.target.value)}><option>1</option><option>2</option><option>3</option><option>4+</option></Select></Field>
          <Field><Label>Price/Sqft</Label><Input readOnly value={`AED ${Math.round(psf).toLocaleString()}`} style={{ color: 'var(--accent-red, #EF4444)' }} /></Field>
        </Grid2>
        <GenerateBtn onClick={() => setGenerated(true)}>🔍 Generate CMA Report</GenerateBtn>

        {generated && (
          <ReportCard>
            <ReportTitle>📊 Comparable Sales Analysis — {bedrooms}BR Dubai Marina</ReportTitle>
            <SummaryGrid>
              <SummaryItem><SummaryVal>AED {Math.round(avgComp / 1000)}k</SummaryVal><SummaryLab>Avg Comp Price</SummaryLab></SummaryItem>
              <SummaryItem><SummaryVal>{((parseInt(askPrice) - avgComp) / avgComp * 100).toFixed(1)}%</SummaryVal><SummaryLab>vs Market Avg</SummaryLab></SummaryItem>
              <SummaryItem><SummaryVal>{COMPS.length}</SummaryVal><SummaryLab>Comps Found</SummaryLab></SummaryItem>
            </SummaryGrid>
            <div style={{ marginTop: '12px' }}>
              {COMPS.map((c, i) => (
                <CompRow key={i}>
                  <CompAddr>{c.addr}</CompAddr>
                  <CompPrice>AED {c.price.toLocaleString()}</CompPrice>
                  <CompDiff $positive={c.diff > 0}>{c.diff > 0 ? '+' : ''}{c.diff.toFixed(1)}%</CompDiff>
                </CompRow>
              ))}
            </div>
          </ReportCard>
        )}
      </Body>
    </Wrapper>
  );
};
export default CmaReportGenerator;
