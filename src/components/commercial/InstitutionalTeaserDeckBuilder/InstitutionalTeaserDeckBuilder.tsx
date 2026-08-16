/**
 * InstitutionalTeaserDeckBuilder — Wave 54 GOAL-090
 * Institutional investor portfolio Teaser deck builder & blind investment memorandum compiler
 * White Caves Real Estate LLC — Commercial & Institutional Capital Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0A0614 0%, #0F172A 100%);
  border: 2px solid rgba(139, 92, 246, 0.35);
  border-radius: 18px;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.4s ease;
`;

const Head = styled.div`
  padding: 14px 20px;
  background: rgba(139, 92, 246, 0.08);
  border-bottom: 1px solid rgba(139, 92, 246, 0.18);
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
  color: #A78BFA;
  background: rgba(139, 92, 246, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(139, 92, 246, 0.3);
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
  &:focus { border-color: #8B5CF6; }
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
  &:focus { border-color: #8B5CF6; }
`;

const MemoSummary = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.25);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  text-align: center;
`;

const MVal = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: #A78BFA;
`;

const CompileBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #7C3AED, #8B5CF6);
  color: #FFF;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const InstitutionalTeaserDeckBuilder: FC = () => {
  const [dealName, setDealName] = useState('Project Phoenix — Prime Commercial Freehold Portfolio');
  const [portfolioSizeAed, setPortfolioSizeAed] = useState('480000000');
  const [netOperatingIncomeAed, setNetOperatingIncomeAed] = useState('36000000');
  const [waultYears, setWaultYears] = useState('6.8');
  const [confidentialityMode, setConfidentialityMode] = useState('Blind Teaser (No Entity Names Disclosed)');
  const [compiled, setCompiled] = useState(false);

  const price = Number(portfolioSizeAed) || 1;
  const noi = Number(netOperatingIncomeAed) || 0;
  const capRate = ((noi / price) * 100).toFixed(2);

  return (
    <Wrap data-testid="institutional-teaser-deck-builder">
      <Head>
        <Title>🏛️ Institutional Investment Teaser & Confidential Memorandum Compiler</Title>
        <Tag>SOVEREIGN FUND DECK</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field style={{ gridColumn: 'span 2' }}>
            <FLabel>Transaction / Project Code Name</FLabel>
            <Input value={dealName} onChange={e => setDealName(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Aggregate Portfolio Asking (AED)</FLabel>
            <Input type="number" value={portfolioSizeAed} onChange={e => setPortfolioSizeAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Annual Net Operating Income (NOI)</FLabel>
            <Input type="number" value={netOperatingIncomeAed} onChange={e => setNetOperatingIncomeAed(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Portfolio WAULT (Years)</FLabel>
            <Input type="number" step="0.1" value={waultYears} onChange={e => setWaultYears(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Teaser Disclosure Mode</FLabel>
            <Select value={confidentialityMode} onChange={e => setConfidentialityMode(e.target.value)}>
              <option value="Blind Teaser (No Entity Names Disclosed)">Blind Teaser (No Entity Names Disclosed)</option>
              <option value="Full Confidential Information Memorandum (CIM)">Full Confidential Information Memorandum (CIM)</option>
              <option value="Executive Summary 2-Pager">Executive Summary 2-Pager</option>
            </Select>
          </Field>
        </FormGrid>

        <MemoSummary>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Portfolio Valuation</div>
            <MVal>AED {(price / 1000000).toFixed(1)}M</MVal>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>Net Initial Yield (Cap Rate)</div>
            <MVal style={{ color: '#10B981' }}>{capRate}%</MVal>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>WAULT Duration</div>
            <MVal style={{ color: '#FFF' }}>{waultYears} Years</MVal>
          </div>
        </MemoSummary>

        {compiled ? (
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center', color: '#10B981', fontWeight: 800, fontSize: '0.82rem' }}>
            ✓ Blind Institutional Teaser Deck Compiled & Stored in Confidential Escrow Vault!
          </div>
        ) : (
          <CompileBtn onClick={() => setCompiled(true)}>
            📑 Compile Blind Institutional Investment Deck (PDF)
          </CompileBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default InstitutionalTeaserDeckBuilder;
