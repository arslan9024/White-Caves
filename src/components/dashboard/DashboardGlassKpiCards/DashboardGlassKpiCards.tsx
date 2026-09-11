import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const pulseRing = keyframes`0%{box-shadow:0 0 0 0 rgba(59,130,246,0.4)}100%{box-shadow:0 0 0 10px rgba(59,130,246,0)}`;

const Row = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;
  font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;
`;

const Card = styled.div<{$color:string;$up:boolean}>`
  padding:20px;border-radius:18px;position:relative;overflow:hidden;
  background:rgba(15,23,42,0.85);
  border:1px solid ${p=>p.$color}25;
  backdrop-filter:blur(20px);
  &::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,${p=>p.$color},transparent);
  }
`;

const GlowBg = styled.div<{$color:string}>`
  position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;
  background:radial-gradient(circle,${p=>p.$color}18 0%,transparent 70%);pointer-events:none;
`;

const CardTop = styled.div`display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px`;
const IconWrap = styled.div<{$color:string}>`
  width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-size:.95rem;background:${p=>p.$color}15;border:1px solid ${p=>p.$color}30;
`;
const DeltaBadge = styled.div<{$up:boolean}>`
  font-size:.62rem;font-weight:800;padding:3px 8px;border-radius:999px;
  background:${p=>p.$up?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.1)'};
  color:${p=>p.$up?'#10B981':'#EF4444'};
`;

const Value = styled.div<{$color:string}>`font-size:1.5rem;font-weight:900;color:${p=>p.$color};line-height:1;margin-bottom:4px`;
const Label = styled.div`font-size:.68rem;color:#64748B;font-weight:600;margin-bottom:10px`;

/* Mini sparkline (SVG bars) */
const SparkWrap = styled.svg`width:100%;height:30px`;

interface Kpi {icon:string;value:string;label:string;delta:string;up:boolean;color:string;spark:number[]}
const KPIS: Kpi[] = [
  {icon:'💰',value:'AED 2.46M',label:'Monthly Revenue',delta:'+8.4%',up:true,color:'#10B981',spark:[40,55,45,60,70,65,80,75,90,85,95,100]},
  {icon:'🤝',value:'41',label:'Deals Closed',delta:'+12%',up:true,color:'#3B82F6',spark:[20,30,25,40,35,50,45,55,60,55,65,70]},
  {icon:'👥',value:'1,240',label:'Active Leads',delta:'+18%',up:true,color:'#8B5CF6',spark:[60,65,70,68,75,80,72,78,85,88,90,95]},
  {icon:'⏱️',value:'14.2d',label:'Avg Deal Cycle',delta:'-2.4d',up:true,color:'#F59E0B',spark:[100,95,88,92,85,80,78,75,72,70,68,65]},
  {icon:'⭐',value:'4.9',label:'Client Rating',delta:'+0.1',up:true,color:'#EC4899',spark:[80,82,85,83,87,89,88,91,90,93,94,96]},
  {icon:'🏗️',value:'28',label:'New Listings',delta:'+6',up:true,color:'#14B8A6',spark:[10,15,18,22,20,25,28,26,30,28,32,35]},
];

const renderSpark = (data:number[],color:string) => {
  const max = Math.max(...data);
  const w = 100/data.length;
  return data.map((v,i)=>(
    <rect key={i} x={i*w+'%'} y={`${(1-v/max)*80}%`} width={`${w*.7}%`} height={`${(v/max)*80}%`}
      fill={color} opacity={.6} rx={2}/>
  ));
};

export const DashboardGlassKpiCards: FC = () => (
  <Row data-testid="dashboard-glass-kpi-cards">
    {KPIS.map((k,i)=>(
      <Card key={i} $color={k.color} $up={k.up}>
        <GlowBg $color={k.color}/>
        <CardTop>
          <IconWrap $color={k.color}>{k.icon}</IconWrap>
          <DeltaBadge $up={k.up}>{k.up?'▲':'▼'} {k.delta}</DeltaBadge>
        </CardTop>
        <Value $color={k.color}>{k.value}</Value>
        <Label>{k.label}</Label>
        <SparkWrap>{renderSpark(k.spark,k.color)}</SparkWrap>
      </Card>
    ))}
  </Row>
);
export default DashboardGlassKpiCards;
