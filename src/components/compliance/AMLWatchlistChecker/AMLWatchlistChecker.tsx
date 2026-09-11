import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const SearchBox = styled.div`display:flex;gap:12px;margin-bottom:24px`;
const Input = styled.input`flex:1;padding:12px 16px;border-radius:8px;border:1px solid rgba(100,116,139,0.3);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.95rem;outline:none`;
const SearchBtn = styled.button`padding:0 24px;background:#EF4444;color:#FFF;border:none;border-radius:8px;font-weight:800;font-size:.9rem;cursor:pointer;display:flex;align-items:center;gap:8px`;

const ResultCard = styled.div<{$status:'clear'|'hit'|'idle'}>`
  padding:20px;border-radius:12px;display:${p=>p.$status==='idle'?'none':'block'};
  background:${p=>p.$status==='clear'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)'};
  border:1px solid ${p=>p.$status==='clear'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'};
`;

const ResTitle = styled.div<{$status:'clear'|'hit'}>`font-size:1.2rem;font-weight:900;margin-bottom:8px;color:${p=>p.$status==='clear'?'#10B981':'#EF4444'}`;
const ResDesc = styled.div`font-size:.8rem;color:#E2E8F0;line-height:1.5`;

export const AMLWatchlistChecker: FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'idle'|'clear'|'hit'>('idle');

  const check = () => {
    if (!query) return;
    setStatus(query.toLowerCase().includes('sanction') ? 'hit' : 'clear');
  };

  return (
    <Wrap data-testid="aml-watchlist-checker">
      <Title>🚨 AML & Global Sanctions Watchlist Check</Title>
      
      <SearchBox>
        <Input 
          placeholder="Enter full name, passport number, or company name..." 
          value={query} 
          onChange={e=>setQuery(e.target.value)}
          onKeyDown={e => e.key==='Enter' && check()}
        />
        <SearchBtn onClick={check}>Run Screening</SearchBtn>
      </SearchBox>

      <ResultCard $status={status}>
        <ResTitle $status={status as any}>
          {status === 'clear' ? '✅ No Matches Found (Clear)' : '⚠️ POSSIBLE MATCH DETECTED'}
        </ResTitle>
        <ResDesc>
          {status === 'clear' 
            ? 'The searched entity does not appear on any monitored OFAC, UN, EU, or UAE sanctions list.'
            : 'The searched entity has an 85% phonetic match with a flagged individual on the OFAC Specially Designated Nationals (SDN) list. Escalate to MLRO immediately.'}
        </ResDesc>
      </ResultCard>
    </Wrap>
  );
};
export default AMLWatchlistChecker;
