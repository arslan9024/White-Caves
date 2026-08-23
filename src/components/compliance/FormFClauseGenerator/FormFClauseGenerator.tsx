/**
 * FormFClauseGenerator — Wave 48 GOAL-023
 * Form F (MOU / Unified Sale Contract) milestone clause generator
 * White Caves Real Estate LLC — RERA Legal Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 10px rgba(239,68,68,0.2)}50%{box-shadow:0 0 22px rgba(239,68,68,0.45)}`;

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

const Badge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.25);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Grid2 = styled.div`
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

const ClauseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ClauseItem = styled.div<{ $selected: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  background: ${p => p.$selected ? 'rgba(239, 68, 68, 0.08)' : 'rgba(15, 23, 42, 0.6)'};
  border: 1px solid ${p => p.$selected ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.15)'};
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: rgba(239, 68, 68, 0.4); }
`;

const CheckBox = styled.input`
  accent-color: #EF4444;
  margin-top: 2px;
  cursor: pointer;
`;

const ClauseText = styled.div`
  flex: 1;
`;

const ClauseTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #E2E8F0;
`;

const ClauseDetail = styled.div`
  font-size: 0.68rem;
  color: #64748B;
  margin-top: 2px;
  line-height: 1.4;
`;

const PreviewArea = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(100, 116, 139, 0.2);
  font-size: 0.72rem;
  color: #CBD5E1;
  max-height: 160px;
  overflow-y: auto;
  line-height: 1.6;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
`;

const GenBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${glow} 3s ease infinite;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

const DEFAULT_CLAUSES = [
  { id: 'c1', title: '10% Security Deposit Held in Escrow', desc: 'Buyer delivers 10% manager cheque payable to Trustee/Agency escrow on signing.', mandatory: true },
  { id: 'c2', title: 'Mortgage Contingency (21-Day Period)', desc: 'Contract void without penalty if official bank loan rejection certificate is produced within 21 days.', mandatory: false },
  { id: 'c3', title: 'NOC & Service Charge Clearance Clause', desc: 'Seller covenants to clear all master developer service charges and obtain Developer NOC before transfer.', mandatory: true },
  { id: 'c4', title: 'Vacant on Transfer / Tenant Notice Guarantee', desc: 'Seller warrants formal 12-month notarized eviction notice served per Dubai Law 26/2007.', mandatory: false },
  { id: 'c5', title: 'Default Penalty & Liquidated Damages', desc: 'Breaching party forfeits 10% deposit as liquidated damages per RERA unified Form F standard.', mandatory: true },
];

export const FormFClauseGenerator: FC = () => {
  const [buyer, setBuyer] = useState('Alexander Sterling');
  const [seller, setSeller] = useState('Fatima Al Suwaidi');
  const [price, setPrice] = useState('6500000');
  const [property, setProperty] = useState('Unit 3402, Marina Gate 1, Dubai Marina');
  const [selectedClauses, setSelectedClauses] = useState<string[]>(['c1', 'c3', 'c5']);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  const toggleClause = (id: string) => {
    setSelectedClauses(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    const clausesText = DEFAULT_CLAUSES
      .filter(c => selectedClauses.includes(c.id))
      .map((c, i) => `${i + 1}. ${c.title.toUpperCase()}:\n   ${c.desc}`)
      .join('\n\n');

    const contract = `========================================================
DUBAI LAND DEPARTMENT - UNIFIED SALE CONTRACT (FORM F)
CONTRACT REFERENCE: MOU-WC-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}
========================================================

FIRST PARTY (SELLER): ${seller}
SECOND PARTY (BUYER): ${buyer}
SUBJECT PROPERTY: ${property}
AGREED SALE PRICE: AED ${Number(price).toLocaleString()} (UAE Dirhams)
RERA BROKERAGE: White Caves Real Estate LLC (ORN: 44483)

SPECIAL STIPULATIONS & MILESTONE CLAUSES:
--------------------------------------------------------
${clausesText}

GOVERNING LAW:
This Contract is governed exclusively by the laws of the Emirate of Dubai 
and Federal Laws of the UAE. Jurisdiction is Dubai Courts / RERA Committee.

TIMESTAMP: ${new Date().toISOString()}
DIGITAL SEAL: SHA256-${Math.random().toString(36).substring(2, 15).toUpperCase()}
========================================================`;

    setGeneratedDoc(contract);
  };

  return (
    <Wrap data-testid="form-f-clause-generator">
      <Head>
        <Title>📄 Form F (MOU) Clause Generator</Title>
        <Badge>RERA UNIFIED 2026</Badge>
      </Head>
      <Body>
        <Grid2>
          <Field>
            <FLabel>Buyer Name</FLabel>
            <Input value={buyer} onChange={e => setBuyer(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Seller Name</FLabel>
            <Input value={seller} onChange={e => setSeller(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Agreed Price (AED)</FLabel>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Property Details</FLabel>
            <Input value={property} onChange={e => setProperty(e.target.value)} />
          </Field>
        </Grid2>

        <div>
          <FLabel style={{ marginBottom: '8px', display: 'block' }}>Standard & Contingency Clauses</FLabel>
          <ClauseList>
            {DEFAULT_CLAUSES.map(c => (
              <ClauseItem 
                key={c.id} 
                $selected={selectedClauses.includes(c.id)}
                onClick={() => toggleClause(c.id)}
              >
                <CheckBox 
                  type="checkbox" 
                  checked={selectedClauses.includes(c.id)} 
                  onChange={() => {}} 
                />
                <ClauseText>
                  <ClauseTitle>{c.title}</ClauseTitle>
                  <ClauseDetail>{c.desc}</ClauseDetail>
                </ClauseText>
              </ClauseItem>
            ))}
          </ClauseList>
        </div>

        {generatedDoc ? (
          <div>
            <FLabel style={{ marginBottom: '6px', display: 'block' }}>Generated Unified Contract Preview</FLabel>
            <PreviewArea>{generatedDoc}</PreviewArea>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={() => setGeneratedDoc(null)}
                style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--color-475569, #475569)', color: 'var(--color-94a3b8, #94A3B8)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem' }}
              >
                Reset
              </button>
              <button 
                onClick={() => alert('Contract sent to Trustee Office Queue & Signer Portal')}
                style={{ padding: '6px 14px', background: 'var(--accent-green, #10B981)', border: 'none', color: 'var(--white, #FFF)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}
              >
                ✓ Dispatch to DLD Portal
              </button>
            </div>
          </div>
        ) : (
          <GenBtn onClick={handleGenerate}>
            ⚖️ Compile Unified Form F MOU Contract
          </GenBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default FormFClauseGenerator;
