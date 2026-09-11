import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)}70%{box-shadow:0 0 0 10px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}`;

const Wrap = styled.div`width:300px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid rgba(56,189,248,0.3);border-radius:18px;overflow:hidden;padding:24px;color:#FFF;position:relative`;

const RingWrap = styled.div`display:flex;justify-content:center;margin-bottom:24px`;
const ScoreRing = styled.div`width:120px;height:120px;border-radius:60px;background:#0F172A;border:4px solid #10B981;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:${pulse} 2s infinite`;
const ScoreVal = styled.div`font-size:2.5rem;font-weight:900;color:#10B981;line-height:1`;
const ScoreMax = styled.div`font-size:.8rem;color:#94A3B8`;

const FactorList = styled.div`display:flex;flex-direction:column;gap:8px`;
const Factor = styled.div`display:flex;justify-content:space-between;font-size:.8rem;background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:6px`;
const FLabel = styled.div`color:#E2E8F0`;
const FScore = styled.div<{$c:string}>`font-weight:800;color:${p=>p.$c}`;

import { useAppSelector } from '../../../store/hooks';

export const LeadScoringAI: FC = () => {
  const activeLeadId = useAppSelector(state => state.leads.activeLeadId);
  const activeLead = useAppSelector(state => state.leads.list.find(l => l.id === activeLeadId));

  const displayScore = activeLead ? activeLead.score : 0;
  const displayName = activeLead ? activeLead.name : 'Unknown';

  return (
    <Wrap data-testid="lead-scoring-ai">
      <div style={{textAlign:'center',marginBottom:16,fontSize:'.9rem',fontWeight:800,color:'#38BDF8',letterSpacing:1,textTransform:'uppercase'}}>
        AI Conversion Propensity
        <div style={{fontSize:'.75rem',color:'#94A3B8',marginTop:4,textTransform:'none',fontWeight:500}}>{displayName}</div>
      </div>
      
      <RingWrap>
        <ScoreRing>
          <ScoreVal>{displayScore}</ScoreVal>
          <ScoreMax>/ 100</ScoreMax>
        </ScoreRing>
      </RingWrap>

      <FactorList>
        <Factor><FLabel>Budget Match</FLabel><FScore $c="#10B981">+25 (Exact Match)</FScore></Factor>
        <Factor><FLabel>Engagement</FLabel><FScore $c="#10B981">+18 (Opened 3 Emails)</FScore></Factor>
        <Factor><FLabel>Timeline</FLabel><FScore $c="#F59E0B">+10 (Moving in 3 months)</FScore></Factor>
        <Factor><FLabel>Missing Info</FLabel><FScore $c="#EF4444">-5 (No phone number)</FScore></Factor>
      </FactorList>
      
      <div style={{textAlign:'center',fontSize:'.75rem',color:'#64748B',marginTop:16}}>Based on WhiteCaves predictive model v2.4</div>
    </Wrap>
  );
};
export default LeadScoringAI;
