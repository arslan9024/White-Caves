/**
 * AmlPepScreeningFilter — Wave 48 GOAL-026
 * Anti-Money Laundering (AML) high-risk PEP sanction screening filter
 * White Caves Real Estate LLC — Compliance & goAML Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.5; }`;

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

const AmlBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 800;
  color: #EF4444;
  background: rgba(239, 68, 68, 0.12);
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.3);
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(100, 116, 139, 0.25);
  background: rgba(15, 23, 42, 0.8);
  color: #E2E8F0;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  &:focus { border-color: #EF4444; }
`;

const ScreenBtn = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #DC2626, #EF4444);
  color: #FFF;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  &:hover { filter: brightness(1.1); }
`;

const ResultCard = styled.div<{ $risk: 'low' | 'medium' | 'high' }>`
  padding: 16px;
  border-radius: 12px;
  background: ${p => p.$risk === 'high' ? 'rgba(239, 68, 68, 0.08)' : p.$risk === 'medium' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
  border: 1.5px solid ${p => p.$risk === 'high' ? 'rgba(239, 68, 68, 0.35)' : p.$risk === 'medium' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubjectName = styled.div`
  font-size: 0.95rem;
  font-weight: 800;
  color: #FFF;
`;

const RiskBadge = styled.span<{ $risk: 'low' | 'medium' | 'high' }>`
  font-size: 0.72rem;
  font-weight: 900;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${p => p.$risk === 'high' ? '#EF4444' : p.$risk === 'medium' ? '#F59E0B' : '#10B981'};
  color: #FFF;
  animation: ${p => p.$risk === 'high' ? pulse : 'none'} 1.5s ease infinite;
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const WItem = styled.div`
  padding: 8px;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.15);
  text-align: center;
  font-size: 0.68rem;
`;

const WName = styled.div`
  color: #94A3B8;
  font-weight: 700;
`;

const WStatus = styled.div<{ $clean: boolean }>`
  font-weight: 800;
  margin-top: 2px;
  color: ${p => p.$clean ? '#10B981' : '#EF4444'};
`;

export const AmlPepScreeningFilter: FC = () => {
  const [name, setName] = useState('Viktor Morozov');
  const [nationality, setNationality] = useState('Russian Federation');
  const [screening, setScreening] = useState(false);
  const [result, setResult] = useState<{
    subject: string;
    nationality: string;
    risk: 'low' | 'medium' | 'high';
    pepStatus: string;
    sanctionMatches: number;
    unListClean: boolean;
    ofacClean: boolean;
    uaeSanctionClean: boolean;
    interpolClean: boolean;
    goAmlRef: string;
  } | null>({
    subject: 'Viktor Morozov',
    nationality: 'Russian Federation',
    risk: 'medium',
    pepStatus: 'Politically Exposed Person (Tier 2 - Regional Minister)',
    sanctionMatches: 0,
    unListClean: true,
    ofacClean: false,
    uaeSanctionClean: true,
    interpolClean: true,
    goAmlRef: 'SAR-UAE-2026-9042',
  });

  const handleScreen = () => {
    setScreening(true);
    setTimeout(() => {
      setScreening(false);
      setResult({
        subject: name,
        nationality,
        risk: name.toLowerCase().includes('morozov') ? 'medium' : name.toLowerCase().includes('smith') ? 'low' : 'high',
        pepStatus: name.toLowerCase().includes('smith') ? 'Non-PEP' : 'PEP Category 2 Identified',
        sanctionMatches: name.toLowerCase().includes('smith') ? 0 : 1,
        unListClean: true,
        ofacClean: name.toLowerCase().includes('smith'),
        uaeSanctionClean: true,
        interpolClean: true,
        goAmlRef: `SAR-UAE-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      });
    }, 1200);
  };

  return (
    <Wrap data-testid="aml-pep-screening-filter">
      <Head>
        <Title>🛡️ AML & PEP Watchlist Screening</Title>
        <AmlBadge>UAE goAML / FIU</AmlBadge>
      </Head>
      <Body>
        <SearchRow>
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Full Legal Name / Passport Identity" 
          />
          <Select value={nationality} onChange={e => setNationality(e.target.value)}>
            <option value="Russian Federation">Russian Federation</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="China">China</option>
            <option value="United States">United States</option>
            <option value="India">India</option>
          </Select>
          <ScreenBtn onClick={handleScreen} disabled={screening}>
            {screening ? '⏳ Screening...' : '🔍 Screen Subject'}
          </ScreenBtn>
        </SearchRow>

        {result && (
          <ResultCard $risk={result.risk}>
            <ResultHeader>
              <div>
                <SubjectName>{result.subject}</SubjectName>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
                  Nationality: {result.nationality} | Ref: {result.goAmlRef}
                </div>
              </div>
              <RiskBadge $risk={result.risk}>
                {result.risk === 'high' ? 'HIGH RISK (BLOCKED)' : result.risk === 'medium' ? 'MEDIUM RISK (EDD REQUIRED)' : 'LOW RISK (CLEAR)'}
              </RiskBadge>
            </ResultHeader>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>
              👤 PEP Designation: <span style={{ color: result.risk === 'low' ? '#10B981' : '#F59E0B' }}>{result.pepStatus}</span>
            </div>

            <WatchlistGrid>
              <WItem>
                <WName>UN Security Council</WName>
                <WStatus $clean={result.unListClean}>{result.unListClean ? '✓ CLEAR' : '⚠️ MATCH'}</WStatus>
              </WItem>
              <WItem>
                <WName>US OFAC SDN</WName>
                <WStatus $clean={result.ofacClean}>{result.ofacClean ? '✓ CLEAR' : '⚠️ REVIEW'}</WStatus>
              </WItem>
              <WItem>
                <WName>UAE Local Terror List</WName>
                <WStatus $clean={result.uaeSanctionClean}>{result.uaeSanctionClean ? '✓ CLEAR' : '⚠️ MATCH'}</WStatus>
              </WItem>
              <WItem>
                <WName>INTERPOL Red Notice</WName>
                <WStatus $clean={result.interpolClean}>{result.interpolClean ? '✓ CLEAR' : '⚠️ MATCH'}</WStatus>
              </WItem>
            </WatchlistGrid>

            {result.risk === 'medium' && (
              <div style={{ fontSize: '0.7rem', color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: '6px', lineHeight: '1.4' }}>
                ⚠️ <strong>Enhanced Due Diligence (EDD) Mandatory:</strong> Source of Funds (SOF) and Source of Wealth (SOW) declaration required prior to escrow disbursement.
              </div>
            )}
          </ResultCard>
        )}
      </Body>
    </Wrap>
  );
};

export default AmlPepScreeningFilter;
