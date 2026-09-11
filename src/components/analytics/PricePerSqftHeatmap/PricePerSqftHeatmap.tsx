import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const AreaGrid = styled.div`display:flex;flex-direction:column;gap:6px`;
const AreaRow = styled.div`display:flex;align-items:center;gap:10px`;
const AreaName = styled.div`font-size:.72rem;color:#94A3B8;width:130px;flex-shrink:0`;
const AreaBar = styled.div`flex:1;height:12px;border-radius:6px;background:rgba(30,41,59,0.7);overflow:hidden;cursor:pointer`;
const AreaFill = styled.div<{$pct:number;$selected:boolean}>`height:100%;width:${p=>p.$pct}%;background:${p=>p.$selected?'linear-gradient(90deg,#059669,#10B981)':'rgba(16,185,129,0.4)'};border-radius:6px;transition:all .3s ease`;
const AreaPsf = styled.div`font-size:.68rem;font-weight:700;color:#10B981;width:80px;text-align:right`;

const DetailPanel = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(16,185,129,0.15)`;
const DRow = styled.div`display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(100,116,139,0.08);&:last-child{border:none}`;
const DL = styled.div`font-size:.7rem;color:#64748B`;
const DV = styled.div<{$color?:string}>`font-size:.72rem;font-weight:700;color:${p=>p.$color||'#CBD5E1'}`;

const AREAS = [
  {name:'Palm Jumeirah',psf:3250,yoy:12.4,transactions:142,avgPrice:18200000,pct:100},
  {name:'Downtown Dubai',psf:2840,yoy:9.8,transactions:287,avgPrice:8900000,pct:87},
  {name:'Dubai Marina',psf:1950,yoy:7.2,transactions:412,avgPrice:3200000,pct:60},
  {name:'Business Bay',psf:1680,yoy:11.1,transactions:198,avgPrice:2800000,pct:52},
  {name:'JVC',psf:980,yoy:14.2,transactions:621,avgPrice:1100000,pct:30},
  {name:'Jumeirah',psf:2100,yoy:8.5,transactions:89,avgPrice:22400000,pct:65},
];

export const PricePerSqftHeatmap: FC = () => {
  const [sel, setSel] = useState(0);
  const a = AREAS[sel];

  return (
    <Wrap data-testid="price-per-sqft-heatmap">
      <Head>
        <Title>📊 Price / Sqft Heatmap</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>DLD Q3 2026</div>
      </Head>
      <Body>
        <AreaGrid>
          {AREAS.map((area,i)=>(
            <AreaRow key={i}>
              <AreaName>{area.name}</AreaName>
              <AreaBar onClick={()=>setSel(i)}><AreaFill $pct={area.pct} $selected={sel===i} /></AreaBar>
              <AreaPsf>AED {area.psf.toLocaleString()}/ft²</AreaPsf>
            </AreaRow>
          ))}
        </AreaGrid>

        <DetailPanel>
          <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:700,marginBottom:8}}>📍 {a.name} — Market Deep Dive</div>
          <DRow><DL>Avg Price / Sqft</DL><DV $color="#10B981">AED {a.psf.toLocaleString()}</DV></DRow>
          <DRow><DL>YoY Appreciation</DL><DV $color="#F59E0B">↑ {a.yoy}%</DV></DRow>
          <DRow><DL>Q3 Transactions</DL><DV>{a.transactions}</DV></DRow>
          <DRow><DL>Average Sale Price</DL><DV>AED {(a.avgPrice/1000000).toFixed(1)}M</DV></DRow>
        </DetailPanel>
      </Body>
    </Wrap>
  );
};
export default PricePerSqftHeatmap;
