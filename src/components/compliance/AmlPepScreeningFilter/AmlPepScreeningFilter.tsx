import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.3);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.06);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const SearchRow = styled.div`display:grid;grid-template-columns:1fr auto;gap:10px`;
const Input = styled.input`padding:10px 14px;border-radius:9px;border:1px solid rgba(239,68,68,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.8rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#EF4444};&::placeholder{color:#475569}`;
const ScrBtn = styled.button`padding:10px 18px;border-radius:9px;border:none;background:linear-gradient(90deg,#DC2626,#EF4444);color:#FFF;font-size:.78rem;font-weight:800;cursor:pointer;white-space:nowrap;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const ResultCard = styled.div<{$risk:'clear'|'watch'|'hit'}>`
  padding:18px;border-radius:14px;
  background:${p=>({clear:'rgba(16,185,129,0.07)',watch:'rgba(245,158,11,0.07)',hit:'rgba(239,68,68,0.1)'}[p.$risk])};
  border:2px solid ${p=>({clear:'rgba(16,185,129,0.3)',watch:'rgba(245,158,11,0.3)',hit:'rgba(239,68,68,0.4)'}[p.$risk])};
`;
const RiskBadge = styled.div<{$risk:'clear'|'watch'|'hit'}>`
  display:inline-flex;align-items:center;gap:6px;padding:4px 14px;border-radius:999px;
  background:${p=>({clear:'rgba(16,185,129,0.15)',watch:'rgba(245,158,11,0.15)',hit:'rgba(239,68,68,0.2)'}[p.$risk])};
  color:${p=>({clear:'#10B981',watch:'#F59E0B',hit:'#EF4444'}[p.$risk])};
  font-size:.78rem;font-weight:900;margin-bottom:12px;
`;
const DetailRow = styled.div`display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(100,116,139,0.08)`;
const DL = styled.div`font-size:.72rem;color:#64748B`;
const DV = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1`;

const DatabaseList = styled.div`display:flex;flex-wrap:wrap;gap:6px`;
const DbTag = styled.div<{$checked:boolean}>`padding:3px 10px;border-radius:5px;font-size:.65rem;font-weight:700;background:${p=>p.$checked?'rgba(16,185,129,0.12)':'rgba(100,116,139,0.12)'};color:${p=>p.$checked?'#10B981':'#475569'};border:1px solid ${p=>p.$checked?'rgba(16,185,129,0.25)':'rgba(100,116,139,0.2)'}`;

const DATABASES = ['UN Sanctions','OFAC SDN','EU Consolidated','UK HM Treasury','Interpol Red Notice','UAE FIU List','Dow Jones Adverse Media','World-Check'];

const PROFILES: Record<string,(typeof MOCK_RESULT)> = {};
const MOCK_RESULT = { risk: 'hit' as 'hit'|'clear'|'watch', name: 'Test Sanctioned Entity', match: 99, list: 'OFAC SDN List', reason: 'Designated under E.O. 13224 — terrorism financing', nationality: 'Iran', dob: '1975-03-15', passport: 'XA-9812345' };
const MOCK_CLEAR = { risk: 'clear' as 'hit'|'clear'|'watch', name: '', match: 0, list: 'None', reason: 'No adverse records found across all databases', nationality: '', dob: '', passport: '' };

export const AmlPepScreeningFilter: FC = () => {
  const [name, setName] = useState('');
  const [result, setResult] = useState<null | typeof MOCK_RESULT | typeof MOCK_CLEAR>(null);
  const [loading, setLoading] = useState(false);

  const screen = () => {
    if (!name.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      setLoading(false);
      const isHit = name.toLowerCase().includes('sanction') || name.toLowerCase().includes('test');
      setResult(isHit ? { ...MOCK_RESULT, name } : { ...MOCK_CLEAR, name });
    }, 1800);
  };

  return (
    <Wrap data-testid="aml-pep-screening-filter">
      <Head>
        <Title>🔍 AML PEP Sanction Screening</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>CBUAE AML 2024</div>
      </Head>
      <Body>
        <SearchRow>
          <Input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&screen()} placeholder="Enter client full name..." />
          <ScrBtn onClick={screen}>{loading?'🔍 Screening...':'🔍 Screen Now'}</ScrBtn>
        </SearchRow>

        <DatabaseList>
          {DATABASES.map(db=><DbTag key={db} $checked={!!result}>{result?'✓ ':''}{db}</DbTag>)}
        </DatabaseList>

        {result && (
          <ResultCard $risk={result.risk}>
            <RiskBadge $risk={result.risk}>
              {result.risk==='hit'?'🔴 SANCTIONS HIT':result.risk==='watch'?'🟡 WATCH LIST':'🟢 CLEAR — No Match'}
            </RiskBadge>
            <DetailRow><DL>Screened Name</DL><DV>{result.name}</DV></DetailRow>
            {result.risk==='hit' && <>
              <DetailRow><DL>Matched List</DL><DV style={{color:'#EF4444'}}>{result.list}</DV></DetailRow>
              <DetailRow><DL>Match Score</DL><DV style={{color:'#EF4444'}}>{result.match}%</DV></DetailRow>
              <DetailRow><DL>Designation Reason</DL><DV>{result.reason}</DV></DetailRow>
              <DetailRow><DL>Nationality</DL><DV>{result.nationality}</DV></DetailRow>
            </>}
            {result.risk==='clear' && <DetailRow><DL>Result</DL><DV style={{color:'#10B981'}}>✓ {result.reason}</DV></DetailRow>}
          </ResultCard>
        )}
      </Body>
    </Wrap>
  );
};
export default AmlPepScreeningFilter;
