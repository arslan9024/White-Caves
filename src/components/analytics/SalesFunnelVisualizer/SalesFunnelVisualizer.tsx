import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const FunnelWrap = styled.div`display:flex;flex-direction:column;gap:4px;align-items:center`;
const FunnelStage = styled.div<{$width:number;$color:string;$active:boolean}>`
  width:${p=>p.$width}%;padding:10px;border-radius:8px;text-align:center;cursor:pointer;
  background:${p=>p.$active?`${p.$color}18`:`${p.$color}08`};
  border:2px solid ${p=>p.$active?p.$color+`60`:p.$color+`20`};
  transition:all .15s;
`;
const StageLabel = styled.div<{$color:string}>`font-size:.74rem;font-weight:700;color:${p=>p.$color}`;
const StageCount = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const StagePct = styled.div<{$color:string}>`font-size:.7rem;font-weight:900;color:${p=>p.$color};margin-top:2px`;

const DetailCard = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(16,185,129,0.15)`;
const DetailRow = styled.div`display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(100,116,139,0.08);&:last-child{border:none}`;
const DL = styled.div`font-size:.7rem;color:#64748B`;
const DV = styled.div`font-size:.7rem;font-weight:700;color:#CBD5E1`;

const STAGES = [
  {label:'Leads',count:1240,color:'#60A5FA',width:100},
  {label:'Qualified',count:620,color:'#818CF8',width:88},
  {label:'Site Visit',count:287,color:'#A78BFA',width:74},
  {label:'Offer Made',count:142,color:'#C084FC',width:58},
  {label:'Under Offer',count:78,color:'#E879F9',width:44},
  {label:'Closed',count:41,color:'#10B981',width:30},
];

export const SalesFunnelVisualizer: FC = () => {
  const [active, setActive] = useState(5);
  const s = STAGES[active];
  const convRate = ((STAGES[active].count / STAGES[0].count) * 100).toFixed(1);

  return (
    <Wrap data-testid="sales-funnel-visualizer">
      <Head>
        <Title>🔻 Sales Funnel Visualizer</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>Q3 2026</div>
      </Head>
      <Body>
        <FunnelWrap>
          {STAGES.map((st,i) => (
            <FunnelStage key={i} $width={st.width} $color={st.color} $active={active===i} onClick={()=>setActive(i)}>
              <StageLabel $color={st.color}>{st.label}</StageLabel>
              <StageCount>{st.count.toLocaleString()} leads</StageCount>
              <StagePct $color={st.color}>{((st.count/STAGES[0].count)*100).toFixed(1)}%</StagePct>
            </FunnelStage>
          ))}
        </FunnelWrap>

        <DetailCard>
          <DetailRow><DL>Stage</DL><DV style={{color:s.color}}>{s.label}</DV></DetailRow>
          <DetailRow><DL>Leads in Stage</DL><DV>{s.count.toLocaleString()}</DV></DetailRow>
          <DetailRow><DL>Overall Conversion</DL><DV style={{color:'#10B981'}}>{convRate}%</DV></DetailRow>
          <DetailRow><DL>Drop-off from Previous</DL><DV style={{color:'#EF4444'}}>{active>0?`${(100-(s.count/STAGES[active-1].count)*100).toFixed(1)}%`:'—'}</DV></DetailRow>
        </DetailCard>
      </Body>
    </Wrap>
  );
};
export default SalesFunnelVisualizer;
