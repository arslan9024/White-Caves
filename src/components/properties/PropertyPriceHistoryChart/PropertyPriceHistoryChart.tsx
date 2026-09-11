import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const Body = styled.div`padding:16px`;

/* SVG chart */
const ChartWrap = styled.div`position:relative;width:100%;height:180px`;
const ChartSvg = styled.svg`width:100%;height:100%`;

const YLabel = styled.text`font-family:'Inter',sans-serif;font-size:8px;fill:#475569;text-anchor:end`;
const XLabel = styled.text`font-family:'Inter',sans-serif;font-size:7px;fill:#475569;text-anchor:middle`;
const GridLine = styled.line`stroke:rgba(100,116,139,0.1);stroke-width:1`;
const PriceLine = styled.polyline`fill:none;stroke:#3B82F6;stroke-width:2;stroke-linejoin:round;stroke-linecap:round`;
const MALine = styled.polyline`fill:none;stroke:rgba(245,158,11,0.6);stroke-width:1.5;stroke-dasharray:4 3;stroke-linejoin:round`;
const AreaFill = styled.polygon`fill:url(#priceGrad);opacity:.3`;
const TxnDot = styled.circle`fill:#10B981;stroke:#0F172A;stroke-width:1.5;cursor:pointer`;

const TooltipBox = styled.div<{$x:number;$y:number;$show:boolean}>`
  position:absolute;left:${p=>p.$x}px;top:${p=>p.$y}px;transform:translate(-50%,-110%);
  background:rgba(10,18,40,0.98);border:1px solid rgba(59,130,246,0.3);border-radius:8px;
  padding:8px 12px;font-size:.65rem;color:#CBD5E1;pointer-events:none;white-space:nowrap;
  opacity:${p=>p.$show?1:0};transition:opacity .1s;z-index:10;
`;

const LegendRow = styled.div`display:flex;gap:14px;margin-top:10px;flex-wrap:wrap`;
const LegItem = styled.div`display:flex;align-items:center;gap:5px;font-size:.63rem;color:#64748B`;
const LegLine = styled.div<{$color:string;$dashed?:boolean}>`width:16px;height:2px;background:${p=>p.$color};${p=>p.$dashed?'border-top:2px dashed;border-color:inherit;height:0;':''}`

// 36 months of data (Q1 2024 → Q4 2026)
const RAW_PRICES = [
  1680,1710,1740,1720,1760,1790,1800,1840,1820,1870,1900,1920, // 2024
  1950,1980,1960,2000,2040,2080,2060,2100,2130,2170,2200,2240, // 2025
  2280,2320,2300,2350,2380,2420,2440,2480,2450,2500,2540,2580, // 2026
];

const MONTHS_SHORT = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const TXN_DOTS = [2,8,14,20,26,32]; // indices with DLD transactions

const W = 420; const H = 140; const PAD = {t:10,r:10,b:30,l:44};
const cw = W - PAD.l - PAD.r;
const ch = H - PAD.t - PAD.b;
const minP = 1600; const maxP = 2700;
const px = (i:number) => PAD.l + (i/(RAW_PRICES.length-1))*cw;
const py = (v:number) => PAD.t + ch - ((v-minP)/(maxP-minP))*ch;

const movAvg = RAW_PRICES.map((_,i)=>{
  const sl = RAW_PRICES.slice(Math.max(0,i-2),i+3);
  return sl.reduce((a,b)=>a+b,0)/sl.length;
});

const pointsStr = RAW_PRICES.map((v,i)=>`${px(i)},${py(v)}`).join(' ');
const maStr = movAvg.map((v,i)=>`${px(i)},${py(v)}`).join(' ');
const areaStr = `${px(0)},${py(minP)} ` + RAW_PRICES.map((v,i)=>`${px(i)},${py(v)}`).join(' ') + ` ${px(RAW_PRICES.length-1)},${py(minP)}`;

export const PropertyPriceHistoryChart: FC = () => {
  const [tooltip, setTooltip] = useState<{x:number;y:number;v:number;m:string;show:boolean}>({x:0,y:0,v:0,m:'',show:false});

  return (
    <Wrap data-testid="property-price-history-chart">
      <Head>
        <HeadTitle>📈 Price History — Dubai Marina 2BR (AED/sqft)</HeadTitle>
        <div style={{fontSize:'.68rem',color:'#3B82F6',fontWeight:700}}>3-Year DLD Data</div>
      </Head>
      <Body>
        <ChartWrap>
          <ChartSvg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* Y-axis labels & grid */}
            {[1700,1900,2100,2300,2500].map((v,i)=>(
              <g key={i}>
                <GridLine x1={PAD.l} y1={py(v)} x2={W-PAD.r} y2={py(v)}/>
                <YLabel x={PAD.l-3} y={py(v)+3}>AED {(v/1000).toFixed(1)}k</YLabel>
              </g>
            ))}
            {/* X-axis labels (every 3 months) */}
            {RAW_PRICES.map((_,i)=> i%3===0?(
              <XLabel key={i} x={px(i)} y={H-4}>{MONTHS_SHORT[i%12]}{i===0?'\'24':i===12?'\'25':i===24?'\'26':''}</XLabel>
            ):null)}
            {/* Area fill */}
            <AreaFill points={areaStr}/>
            {/* MA line */}
            <MALine points={maStr}/>
            {/* Price line */}
            <PriceLine points={pointsStr}/>
            {/* DLD transaction dots */}
            {TXN_DOTS.map(i=>(
              <TxnDot key={i} cx={px(i)} cy={py(RAW_PRICES[i])} r={5}
                onMouseEnter={e=>{
                  const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect();
                  setTooltip({x:px(i),y:py(RAW_PRICES[i]),v:RAW_PRICES[i],m:`DLD Txn · ${MONTHS_SHORT[i%12]} ${2024+Math.floor(i/12)}`,show:true});
                }}
                onMouseLeave={()=>setTooltip(t=>({...t,show:false}))}
              />
            ))}
          </ChartSvg>
          <TooltipBox $x={tooltip.x} $y={tooltip.y} $show={tooltip.show}>
            <div style={{fontWeight:800,color:'#10B981'}}>AED {tooltip.v.toLocaleString()}/sqft</div>
            <div style={{color:'#64748B',marginTop:2}}>{tooltip.m}</div>
          </TooltipBox>
        </ChartWrap>
        <LegendRow>
          <LegItem><LegLine $color="#3B82F6"/>Price per sqft</LegItem>
          <LegItem><LegLine $color="rgba(245,158,11,0.7)" $dashed/>3-month moving avg</LegItem>
          <LegItem><div style={{width:8,height:8,borderRadius:'50%',background:'#10B981'}}/> DLD Transaction</LegItem>
        </LegendRow>
      </Body>
    </Wrap>
  );
};
export default PropertyPriceHistoryChart;
