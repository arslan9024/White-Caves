import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Wrapper = styled.div`width: 100%; background: linear-gradient(135deg, #0F172A, #1E293B); border: 2px solid rgba(239,68,68,0.25); border-radius: 18px; overflow: hidden; font-family: 'Inter', sans-serif; animation: ${fadeIn} 0.4s ease;`;
const Header = styled.div`padding: 14px 20px; background: rgba(239,68,68,0.05); border-bottom: 1px solid rgba(239,68,68,0.12); display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h3`margin: 0; color: #FFF; font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 8px;`;
const Body = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 14px;`;

const KycForm = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 10px;`;
const Field = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const Label = styled.label`font-size: 0.7rem; color: #94A3B8; font-weight: 600;`;
const Input = styled.input`padding: 8px 10px; border-radius: 7px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.78rem; font-weight: 600; width: 100%; box-sizing: border-box; outline: none; &:focus { border-color: #EF4444; }`;
const Select = styled.select`padding: 8px 10px; border-radius: 7px; border: 1px solid rgba(100,116,139,0.3); background: rgba(15,23,42,0.8); color: #E2E8F0; font-size: 0.78rem; font-weight: 600; width: 100%; outline: none; &:focus { border-color: #EF4444; }`;

const UploadZone = styled.div`
  padding: 16px;
  border-radius: 10px;
  border: 2px dashed rgba(239,68,68,0.3);
  background: rgba(239,68,68,0.04);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: rgba(239,68,68,0.6); background: rgba(239,68,68,0.08); }
`;
const UploadText = styled.div`font-size: 0.78rem; color: #94A3B8;`;

const RiskBand = styled.div<{ $risk: 'low' | 'medium' | 'high' }>`
  padding: 14px 18px;
  border-radius: 12px;
  background: ${p => ({ low: 'rgba(16,185,129,0.08)', medium: 'rgba(245,158,11,0.08)', high: 'rgba(239,68,68,0.08)' }[p.$risk])};
  border: 1px solid ${p => ({ low: 'rgba(16,185,129,0.3)', medium: 'rgba(245,158,11,0.3)', high: 'rgba(239,68,68,0.3)' }[p.$risk])};
  display: flex; align-items: center; justify-content: space-between;
`;
const RiskLabel = styled.div`font-size: 0.85rem; font-weight: 700; color: #CBD5E1;`;
const RiskBadge = styled.div<{ $risk: 'low' | 'medium' | 'high' }>`
  padding: 4px 14px; border-radius: 999px;
  font-size: 0.72rem; font-weight: 800;
  background: ${p => ({ low: 'rgba(16,185,129,0.2)', medium: 'rgba(245,158,11,0.2)', high: 'rgba(239,68,68,0.2)' }[p.$risk])};
  color: ${p => ({ low: '#10B981', medium: '#F59E0B', high: '#EF4444' }[p.$risk])};
`;

const VerifyBtn = styled.button`width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(90deg, #EF4444, #F97316); color: #FFF; font-size: 0.85rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; &:hover { filter: brightness(1.1); transform: translateY(-1px); }`;

const DocList = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const DocRow = styled.div<{ $ok: boolean }>`display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 7px; background: ${p => p.$ok ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)'}; border: 1px solid ${p => p.$ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};`;
const DocLabel = styled.div`font-size: 0.74rem; color: #94A3B8; flex: 1;`;
const DocStatus = styled.div<{ $ok: boolean }>`font-size: 0.7rem; font-weight: 700; color: ${p => p.$ok ? '#10B981' : '#EF4444'};`;

const DOCS = [
  { label: 'Passport / Emirates ID', required: true, ok: true },
  { label: 'Proof of Address (utility bill < 3 months)', required: true, ok: true },
  { label: 'Source of Funds Declaration', required: true, ok: false },
  { label: 'Bank Reference Letter', required: false, ok: true },
  { label: 'PEP & Sanctions Screen (Dow Jones)', required: true, ok: true },
  { label: 'Ultimate Beneficial Owner (UBO) Form', required: true, ok: false },
];

export const AmlKycVerificationPanel: FC = () => {
  const [nationality, setNationality] = useState('UAE');
  const [sourceOfFunds, setSourceOfFunds] = useState('salary');
  const [verified, setVerified] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const highRiskNationalities = ['Iran', 'Syria', 'Yemen', 'Libya', 'Sudan', 'North Korea'];
  const risk = highRiskNationalities.includes(nationality) ? 'high' : sourceOfFunds === 'crypto' ? 'medium' : 'low';

  const handleUploadClick = () => {
    setUploadStatus('Document Uploader: Emirates ID and Passport verified & queued for goAML scan.');
    setTimeout(() => setUploadStatus(''), 4000);
  };

  return (
    <Wrapper data-testid="aml-kyc-verification-panel">
      <Header>
        <Title>🔍 AML / KYC Verification Panel</Title>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>CBUAE AML 2024</div>
      </Header>
      <Body>
        <KycForm>
          <Field><Label>Client Full Name</Label><Input placeholder="Mohammed Al Rashid" /></Field>
          <Field><Label>Nationality / Country</Label>
            <Select value={nationality} onChange={e => setNationality(e.target.value)}>
              <option>UAE</option><option>Saudi Arabia</option><option>UK</option><option>India</option><option>Iran</option><option>Syria</option><option>North Korea</option>
            </Select>
          </Field>
          <Field><Label>Source of Funds</Label>
            <Select value={sourceOfFunds} onChange={e => setSourceOfFunds(e.target.value)}>
              <option value="salary">Employment / Salary</option>
              <option value="business">Business Income</option>
              <option value="investment">Investment Returns</option>
              <option value="inheritance">Inheritance</option>
              <option value="crypto">Cryptocurrency</option>
            </Select>
          </Field>
          <Field><Label>Transaction Amount (AED)</Label><Input placeholder="5,500,000" /></Field>
        </KycForm>

        <UploadZone onClick={handleUploadClick}>
          <div style={{ fontSize: '1.4rem' }}>📁</div>
          <UploadText>Upload KYC Documents (Passport, Emirates ID, Proof of Address)</UploadText>
          {uploadStatus && (
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-green, #10B981)', fontWeight: 700, marginTop: '4px' }}>
              {uploadStatus}
            </div>
          )}
        </UploadZone>

        <DocList>
          {DOCS.map((d, i) => (
            <DocRow key={i} $ok={d.ok}>
              <DocLabel>{d.required ? '🔴' : '🟡'} {d.label}</DocLabel>
              <DocStatus $ok={d.ok}>{d.ok ? '✓ Verified' : '✗ Missing'}</DocStatus>
            </DocRow>
          ))}
        </DocList>

        <VerifyBtn onClick={() => setVerified(true)}>🔒 Run AML Screening</VerifyBtn>

        {verified && (
          <RiskBand $risk={risk}>
            <RiskLabel>AML Risk Classification</RiskLabel>
            <RiskBadge $risk={risk}>
              {risk === 'low' ? '🟢 LOW RISK' : risk === 'medium' ? '🟡 MEDIUM RISK' : '🔴 HIGH RISK — EDD Required'}
            </RiskBadge>
          </RiskBand>
        )}
      </Body>
    </Wrapper>
  );
};
export default AmlKycVerificationPanel;
