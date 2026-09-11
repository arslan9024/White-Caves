import React, { FC, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const countUp = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const barGrow = keyframes`from{width:0}to{width:100%}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const SectionTitle = styled.h2`font-size:1.5rem;font-weight:900;margin:0 0 4px;color:#FFF;text-align:center`;
const SectionSub = styled.p`font-size:.82rem;color:#64748B;margin:0 0 28px;text-align:center`;

const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:16px`;
const StatCard = styled.div<{$color:string}>`
  padding:24px;border-radius:18px;background:rgba(15,23,42,0.8);
  border:1px solid ${p=>p.$color}22;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:${p=>p.$color};animation:${barGrow} 1.5s ease}
`;
const StatIcon = styled.div`font-size:1.6rem;margin-bottom:10px`;
const StatNumber = styled.div<{$color:string}>`font-size:2.2rem;font-weight:900;color:${p=>p.$color};line-height:1;animation:${countUp} .6s ease`;
const StatUnit = styled.span`font-size:1rem;font-weight:700;margin-left:4px`;
const StatLabel = styled.div`font-size:.75rem;color:#94A3B8;margin-top:6px;font-weight:600`;
const StatChange = styled.div<{$up:boolean}>`font-size:.68rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'};margin-top:4px`;

interface Stat {
  icon: string;
  value: string;
  unit: string;
  label: string;
  change: string;
  up: boolean;
  color: string;
}

const STATS: Stat[] = [
  {icon:'📊',value:'2,847',unit:'',label:'Transactions Completed YTD',change:'↑ +18.4% vs 2025',up:true,color:'#3B82F6'},
  {icon:'💰',value:'186',unit:'B',label:'Total Sales Volume (AED)',change:'↑ +22.1% vs 2025',up:true,color:'#10B981'},
  {icon:'⏱️',value:'14.2',unit:'days',label:'Average Days to Close',change:'↓ -2.4d faster',up:true,color:'#F59E0B'},
  {icon:'⭐',value:'4.9',unit:'★',label:'Average Client Rating',change:'↑ 100+ reviews',up:true,color:'#EC4899'},
  {icon:'🏗️',value:'24',unit:'',label:'Off-Plan Projects Represented',change:'↑ +6 new Q3',up:true,color:'#8B5CF6'},
  {icon:'🌍',value:'41',unit:'+',label:'Nationalities Served',change:'↑ Truly global',up:true,color:'#14B8A6'},
  {icon:'🤝',value:'500',unit:'+',label:'Families Helped',change:'↑ +80 this year',up:true,color:'#F97316'},
  {icon:'🏆',value:'8',unit:'yrs',label:'Years of Excellence in Dubai',change:'Est. 2018',up:true,color:'#EAB308'},
];

export const MarketStatsAnimatedBoard: FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),200);return()=>clearTimeout(t);},[]);

  return (
    <Wrap data-testid="market-stats-animated-board">
      <SectionTitle>By the Numbers</SectionTitle>
      <SectionSub>White Caves Real Estate — performance that speaks for itself</SectionSub>
      <StatsGrid>
        {STATS.map((s,i)=>(
          <StatCard key={i} $color={s.color} style={{animationDelay:`${i*.08}s`}}>
            <StatIcon>{s.icon}</StatIcon>
            {visible && (
              <StatNumber $color={s.color} style={{animationDelay:`${i*.1}s`}}>
                {s.value}<StatUnit>{s.unit}</StatUnit>
              </StatNumber>
            )}
            <StatLabel>{s.label}</StatLabel>
            <StatChange $up={s.up}>{s.change}</StatChange>
          </StatCard>
        ))}
      </StatsGrid>
    </Wrap>
  );
};
export default MarketStatsAnimatedBoard;
