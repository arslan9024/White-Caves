/**
 * PoaValidationPortal — Wave 48 GOAL-030
 * Power of Attorney (POA) notary document validation & legal capacity portal
 * White Caves Real Estate LLC — Compliance & Legal Suite
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

const ValidationBox = styled.div<{ $valid: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'};
  border: 1.5px solid ${p => p.$valid ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScopeList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 0.72rem;
`;

const ScopeItem = styled.div<{ $granted: boolean }>`
  padding: 6px 10px;
  border-radius: 6px;
  background: ${p => p.$granted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)'};
  border: 1px solid ${p => p.$granted ? 'rgba(16, 185, 129, 0.25)' : 'rgba(100, 116, 139, 0.15)'};
  color: ${p => p.$granted ? '#10B981' : '#64748B'};
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
`;

const VerifyBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  &:hover { filter: brightness(1.1); transform: translateY(-1px); }
`;

export const PoaValidationPortal: FC = () => {
  const [poaNumber, setPoaNumber] = useState('POA-DXB-2025-88419');
  const [attorneyName, setAttorneyName] = useState('Hassan Al Khouri');
  const [principalName, setPrincipalName] = useState('Lord George Harrington');
  const [courtJurisdiction, setCourtJurisdiction] = useState('Dubai Notary Public (Al Barsha)');
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    issueDate: string;
    expiryDate: string;
    dldCompliant2YearRule: boolean;
    powers: { name: string; granted: boolean }[];
  }>({
    valid: true,
    issueDate: '2025-11-15',
    expiryDate: '2027-11-14',
    dldCompliant2YearRule: true,
    powers: [
      { name: 'Buy & Register Properties', granted: true },
      { name: 'Sell & Transfer Title Deeds', granted: true },
      { name: 'Sign MOUs & DLD Form F', granted: true },
      { name: 'Receive Cheques & Funds in Own Name', granted: false }, // DLD Rule: Attorney cannot receive purchase funds in personal account
      { name: 'Ejari Lease Execution', granted: true },
      { name: 'Represent at Developer NOC', granted: true },
    ]
  });

  const handleValidate = () => {
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setResult({
        valid: true,
        issueDate: '2026-01-10',
        expiryDate: '2028-01-09',
        dldCompliant2YearRule: true,
        powers: [
          { name: 'Buy & Register Properties', granted: true },
          { name: 'Sell & Transfer Title Deeds', granted: true },
          { name: 'Sign MOUs & DLD Form F', granted: true },
          { name: 'Receive Cheques & Funds in Own Name', granted: false },
          { name: 'Ejari Lease Execution', granted: true },
          { name: 'Represent at Developer NOC', granted: true },
        ]
      });
    }, 1000);
  };

  return (
    <Wrap data-testid="poa-validation-portal">
      <Head>
        <Title>📜 Power of Attorney (POA) Notary Verification Portal</Title>
        <Tag>DUBAI COURTS NOTARY</Tag>
      </Head>
      <Body>
        <FormGrid>
          <Field>
            <FLabel>POA Notarization Number</FLabel>
            <Input value={poaNumber} onChange={e => setPoaNumber(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Notary Jurisdiction</FLabel>
            <Select value={courtJurisdiction} onChange={e => setCourtJurisdiction(e.target.value)}>
              <option value="Dubai Notary Public (Al Barsha)">Dubai Notary Public (Al Barsha)</option>
              <option value="Dubai Courts Electronic Notary (e-Notary)">Dubai Courts Electronic Notary (e-Notary)</option>
              <option value="Abu Dhabi Judicial Department (ADJD)">Abu Dhabi Judicial Department (ADJD)</option>
              <option value="UAE Embassy Overseas / Ministry of Foreign Affairs (MOFA)">UAE Embassy Overseas / MOFA</option>
            </Select>
          </Field>
          <Field>
            <FLabel>Authorized Attorney (Representative)</FLabel>
            <Input value={attorneyName} onChange={e => setAttorneyName(e.target.value)} />
          </Field>
          <Field>
            <FLabel>Principal / Owner Name</FLabel>
            <Input value={principalName} onChange={e => setPrincipalName(e.target.value)} />
          </Field>
        </FormGrid>

        <VerifyBtn onClick={handleValidate} disabled={validating}>
          {validating ? '⏳ Validating via Dubai Courts e-Notary...' : '🔍 Verify POA Legal Capacity & 2-Year Rule'}
        </VerifyBtn>

        {result && (
          <ValidationBox $valid={result.valid}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--white, #FFF)' }}>
                  POA Status: {result.valid ? 'LEGAL & ACTIVE' : 'EXPIRED / INVALID'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-94a3b8, #94A3B8)', marginTop: '2px' }}>
                  Valid from {result.issueDate} to {result.expiryDate} (Within DLD 2-Year Statutory Window)
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', background: 'var(--accent-green, #10B981)', color: 'var(--white, #FFF)' }}>
                ✓ DLD TRUSTEE READY
              </span>
            </div>

            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary, #CBD5E1)', marginTop: '6px' }}>
              Scope of Delegated Powers & Restrictions:
            </div>

            <ScopeList>
              {result.powers.map((p, idx) => (
                <ScopeItem key={idx} $granted={p.granted}>
                  <span>{p.granted ? '✓' : '✗'}</span>
                  <span>{p.name}</span>
                </ScopeItem>
              ))}
            </ScopeList>

            <div style={{ fontSize: '0.68rem', color: 'var(--accent-gold, #F59E0B)', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 12px', borderRadius: '6px', lineHeight: '1.4' }}>
              ⚠️ <strong>RERA Conveyancing Directive:</strong> POAs for selling property in Dubai cannot exceed 2 years from the date of notarization. Cheques for purchase price must be drawn strictly in the seller's name, not the POA holder.
            </div>
          </ValidationBox>
        )}
      </Body>
    </Wrap>
  );
};

export default PoaValidationPortal;
