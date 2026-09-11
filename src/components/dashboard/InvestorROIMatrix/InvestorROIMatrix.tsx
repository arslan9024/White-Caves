import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:16px`;

const MatrixGrid = styled.div`display:grid;grid-template-columns:80px repeat(4,1fr);gap:2px`;
const RowLabel = styled.div`display:flex;align-items:center;font-size:.62rem;font-weight:700;color:#64748B;padding-right:8px;justify-content:flex-end`;
const ColHeader = styled.div`text-align:center;font-size:.6rem;font-weight:700;color:#64748B;padding:6px 4px`;
const CornerCell = styled.div``;

const YieldCell = styled.div<{$yield:number;$selected:boolean}>`
  border-radius:8px;padding:10px 4px;text-align:center;cursor:pointer;transition:all .15s;
  background:${p=>{
    const y=p.$yield;
    if(y>=9)return'rgba(16,185,129,0.25)';
    if(y>=7)return'rgba(59,130,246,0.18)';
    if(y>=5.5)return'rgba(245,158,11,0.15)';
    return'rgba(239,68,68,0.12)';
  }};
  border:2px solid ${p=>p.$selected?'rgba(255,255,255,0.4)':'transparent'};
  &:hover{filter:brightness(1.2)}
`;
const YieldPct = styled.div<{$yield:number}>`
  font-size:.82rem;font-weight:900;
  color:${p=>p.$yield>=9?'#10B981':p.$yield>=7?'#60A5FA':p.$yield>=5.5?'#F59E0B':'#EF4444'};
`;
const YieldLabel = styled.div`font-size:.55rem;color:#64748B;margin-top:2px`;

const DetailCard = styled.div`margin-top:12px;padding:12px 16px;border-radius:12px;background:rgba(30,41,59,0.6);border:1px solid rgba(100,116,139,0.15)`;
const DetailTitle = styled.div`font-size:.78rem;font-weight:800;color:#CBD5E1;margin-bottom:6px`;
const DetailGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:8px`;
const DItem = styled.div``;
const DVal = styled.div<{$color:string}>`font-size:.8rem;font-weight:800;color:${p=>p.$color}`;
const DLab = styled.div`font-size:.6rem;color:#64748B;margin-top:2px`;

const AREAS = ['Palm Jumeirah','Downtown','Marina','JVC'];
const TYPES = ['Studio','1BR','2BR','3BR+'];
const YIELDS: number[][] = [
  [5.2, 6.1, 7.2, 8.1],   // Palm Jumeirah
  [4.8, 5.9, 6.8, 7.6],   // Downtown
  [6.0, 6.9, 7.8, 9.1],   // Marina  ← JVC best yields
  [7.4, 8.2, 9.3, 10.1],  // JVC
];

export const InvestorROIMatrix: FC = () => {
  const [selected, setSelected] = useState<[number,number]|null>([2,2]);

  const [ar,ac] = selected||[0,0];
  const selYield = selected?YIELDS[ar][ac]:0;

  return (
    <Wrap data-testid="investor-roi-matrix">
      <Head>
        <HeadTitle>📊 Rental Yield Matrix — Dubai 2026</HeadTitle>
        <div style={{display:'flex',gap:6}}>
          {[['9%+','#10B981'],['7-9%','#60A5FA'],['5.5-7%','#F59E0B'],['<5.5%','#EF4444']].map(([l,c])=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:3,fontSize:'.58rem',color:'#64748B'}}>
              <div style={{width:8,height:8,borderRadius:2,background:c as string}}/>
              {l}
            </div>
          ))}
        </div>
      </Head>
      <Body>
        <MatrixGrid>
          <CornerCell/>
          {TYPES.map(t=><ColHeader key={t}>{t}</ColHeader>)}
          {AREAS.map((area,ri)=>(
            <>
              <RowLabel key={`r${ri}`}>{area.split(' ')[0]}</RowLabel>
              {TYPES.map((_,ci)=>(
                <YieldCell key={ci} $yield={YIELDS[ri][ci]} $selected={selected?.[0]===ri&&selected?.[1]===ci}
                  onClick={()=>setSelected([ri,ci])}>
                  <YieldPct $yield={YIELDS[ri][ci]}>{YIELDS[ri][ci]}%</YieldPct>
                  <YieldLabel>net yield</YieldLabel>
                </YieldCell>
              ))}
            </>
          ))}
        </MatrixGrid>

        {selected&&(
          <DetailCard>
            <DetailTitle>{AREAS[ar]} — {TYPES[ac]} · Net Yield: {selYield}%</DetailTitle>
            <DetailGrid>
              <DItem><DVal $color="#10B981">{selYield}%</DVal><DLab>Net Yield</DLab></DItem>
              <DItem><DVal $color="#3B82F6">{(selYield*1.25).toFixed(1)}%</DVal><DLab>Gross Yield</DLab></DItem>
              <DItem><DVal $color="#F59E0B">89%</DVal><DLab>Avg Occupancy</DLab></DItem>
            </DetailGrid>
          </DetailCard>
        )}
      </Body>
    </Wrap>
  );
};
export default InvestorROIMatrix;
