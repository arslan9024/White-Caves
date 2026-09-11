import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(139,92,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(139,92,246,0.05);border-bottom:1px solid rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const ScoreRing = styled.div<{$score:number}>`
  width:100px;height:100px;border-radius:50%;margin:0 auto;
  background:conic-gradient(
    ${p=>p.$score>=75?'#10B981':p.$score>=50?'#F59E0B':'#EF4444'} ${p=>p.$score*3.6}deg,
    rgba(30,41,59,0.8) 0deg
  );
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 24px ${p=>p.$score>=75?'rgba(16,185,129,0.3)':p.$score>=50?'rgba(245,158,11,0.25)':'rgba(239,68,68,0.25)'};
`;
const ScoreInner = styled.div`width:72px;height:72px;border-radius:50%;background:#0F172A;display:flex;align-items:center;justify-content:center;flex-direction:column`;
const ScoreNum = styled.div<{$score:number}>`font-size:1.4rem;font-weight:900;color:${p=>p.$score>=75?'#10B981':p.$score>=50?'#F59E0B':'#EF4444'}`;
const ScoreLabel = styled.div`font-size:.55rem;color:#64748B;font-weight:700`;

const FactorGrid = styled.div`display:flex;flex-direction:column;gap:8px`;
const FactorRow = styled.div`display:flex;align-items:center;gap:10px`;
const FactorLabel = styled.div`font-size:.72rem;color:#94A3B8;width:140px;flex-shrink:0`;
const FactorBar = styled.div`flex:1;height:8px;border-radius:4px;background:rgba(30,41,59,0.7);overflow:hidden`;
const FactorFill = styled.div<{$pct:number;$color:string}>`height:100%;width:${p=>p.$pct}%;background:${p=>p.$color};border-radius:4px;transition:width .5s ease`;
const FactorVal = styled.div`font-size:.68rem;font-weight:700;color:#CBD5E1;width:36px;text-align:right`;

const FACTORS = [
  {label:'Payment History',pct:95,color:'#10B981'},
  {label:'Credit Utilization',pct:62,color:'#F59E0B'},
  {label:'Credit Age',pct:78,color:'#10B981'},
  {label:'Loan Variety',pct:55,color:'#F59E0B'},
  {label:'New Inquiries',pct:85,color:'#10B981'},
];

const Score = Math.round(FACTORS.reduce((a,f)=>a+f.pct,0)/FACTORS.length);

export const MortgageCreditScorePanel: FC = () => {
  const [revealed, setRevealed] = useState(true);

  return (
    <Wrap data-testid="mortgage-credit-score-panel">
      <Head>
        <Title>💳 Mortgage Credit Score Panel</Title>
        <div style={{fontSize:'.7rem',color:'#8B5CF6',fontWeight:700}}>Al Etihad Bureau</div>
      </Head>
      <Body>
        <ScoreRing $score={Score}>
          <ScoreInner>
            {revealed ? (
              <>
                <ScoreNum $score={Score}>{Score}</ScoreNum>
                <ScoreLabel>{Score>=75?'EXCELLENT':Score>=50?'GOOD':'FAIR'}</ScoreLabel>
              </>
            ) : (
              <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:700}}>Hidden</div>
            )}
          </ScoreInner>
        </ScoreRing>

        <div style={{textAlign:'center',fontSize:'.72rem',color:'#64748B'}}>
          Al Etihad Credit Bureau Score · Updated: Sep 2026
        </div>

        <FactorGrid>
          {FACTORS.map((f,i) => (
            <FactorRow key={i}>
              <FactorLabel>{f.label}</FactorLabel>
              <FactorBar><FactorFill $pct={f.pct} $color={f.color} /></FactorBar>
              <FactorVal>{f.pct}</FactorVal>
            </FactorRow>
          ))}
        </FactorGrid>

        <div style={{padding:'10px 14px',borderRadius:'9px',background:'rgba(139,92,246,0.07)',border:'1px solid rgba(139,92,246,0.2)',fontSize:'.72rem',color:'#94A3B8'}}>
          💡 Score {Score} qualifies for UAE bank mortgage up to <strong style={{color:'#10B981'}}>AED 4.2M</strong> at rates from 3.25%.
        </div>
      </Body>
    </Wrap>
  );
};
export default MortgageCreditScorePanel;
