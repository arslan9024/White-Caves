/**
 * CommissionAcceleratorEngine — Wave 53 GOAL-073
 * Developer commission split accelerator engine (50/50 base to 70/30 top tier)
 * White Caves Real Estate LLC — Off-Plan Sales Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const glow = keyframes`0%,100%{box-shadow:0 0 8px rgba(239,68,68,0.2)}50%{box-shadow:0 0 20px rgba(239,68,68,0.4)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:16px;`;

const TierBar = styled.div`display:flex;border-radius:10px;overflow:hidden;height:36px;`;
const TierSegment = styled.div<{$pct:number;$color:string;$active:boolean}>`width:${p=>p.$pct}%;background:${p=>p.$color};display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:800;color:#FFF;transition:all 0.5s ease;filter:${p=>p.$active?'brightness(1.2)':'brightness(0.6)'};cursor:pointer;&:hover{filter:brightness(1.3);}`;

const Field = styled.div`display:flex;flex-direction:column;gap:4px;`;
const FLabel = styled.label`font-size:0.68rem;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;`;
const Input = styled.input`padding:9px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:0.82rem;font-weight:600;width:100%;box-sizing:border-box;outline:none;&:focus{border-color:#EF4444;}`;
const Select = styled.select`padding:9px 12px;border-radius:8px;border:1px solid rgba(100,116,139,0.25);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:0.82rem;font-weight:600;width:100%;outline:none;&:focus{border-color:#EF4444;}`;

const SplitCard = styled.div<{$tier:number}>`padding:16px;border-radius:14px;background:${p=>p.$tier>=3?'rgba(239,68,68,0.08)':'rgba(15,23,42,0.7)'};border:1.5px solid ${p=>p.$tier>=3?'rgba(239,68,68,0.3)':'rgba(100,116,139,0.15)'};animation:${p=>p.$tier>=3?css`${glow} 2.5s ease infinite`:'none'};`;
const SplitRow = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;`;
const SplitLabel = styled.div`font-size:0.8rem;font-weight:700;color:#E2E8F0;`;
const TierBadge = styled.div<{$tier:number}>`padding:3px 12px;border-radius:999px;font-size:0.68rem;font-weight:800;background:${p=>p.$tier>=3?'rgba(239,68,68,0.15)':p.$tier===2?'rgba(245,158,11,0.12)':'rgba(100,116,139,0.12)'};color:${p=>p.$tier>=3?'#EF4444':p.$tier===2?'#F59E0B':'#94A3B8'};`;

const SplitBars = styled.div`display:flex;border-radius:8px;overflow:hidden;height:28px;margin-bottom:10px;`;
const AgencyFill = styled.div<{$pct:number}>`width:${p=>p.$pct}%;background:linear-gradient(90deg,#DC2626,#EF4444);display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:800;color:#FFF;transition:width 0.5s ease;`;
const DevFill = styled.div<{$pct:number}>`flex:1;background:rgba(30,41,59,0.8);display:flex;align-items:center;justify-content:center;font-size:0.68rem;font-weight:800;color:#64748B;`;

const MetricGrid = styled.div`display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;`;
const Metric = styled.div`padding:12px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid rgba(100,116,139,0.15);text-align:center;`;
const MetricVal = styled.div<{$red?:boolean;$green?:boolean}>`font-size:1rem;font-weight:900;color:${p=>p.$red?'#EF4444':p.$green?'#10B981':'#E2E8F0'};`;
const MetricLab = styled.div`font-size:0.62rem;color:#64748B;margin-top:3px;`;

const TIERS = [
  { label:'Base', minUnits:0, agencySplit:50, devSplit:50, color:'#334155' },
  { label:'Silver', minUnits:3, agencySplit:55, devSplit:45, color:'#64748B' },
  { label:'Gold', minUnits:6, agencySplit:60, devSplit:40, color:'#D97706' },
  { label:'Platinum', minUnits:10, agencySplit:70, devSplit:30, color:'#EF4444' },
];

export const CommissionAcceleratorEngine: FC = () => {
  const [developer, setDeveloper] = useState('EMAAR');
  const [unitsSold, setUnitsSold] = useState('7');
  const [unitPrice, setUnitPrice] = useState('2500000');
  const [devCommPct, setDevCommPct] = useState('5');

  const sold = parseInt(unitsSold)||0;
  const price = parseFloat(unitPrice)||0;
  const devCommRate = parseFloat(devCommPct)||5;

  const tier = TIERS.filter(t=>sold>=t.minUnits).pop()!;
  const tierIdx = TIERS.indexOf(tier);

  const totalCommission = price * (devCommRate/100);
  const agencyEarnings = totalCommission * (tier.agencySplit/100);
  const devRetains = totalCommission * (tier.devSplit/100);
  const ytdVolume = sold * price;
  const ytdEarnings = sold * agencyEarnings;
  const nextTier = TIERS[Math.min(tierIdx+1,TIERS.length-1)];
  const unitsToNextTier = nextTier.minUnits - sold;

  return (
    <Wrap data-testid="commission-accelerator-engine">
      <Head>
        <Title>🚀 Commission Accelerator Engine</Title>
        <div style={{fontSize:'0.68rem',color:'var(--accent-red, #EF4444)',fontWeight:700}}>{tier.label} Tier</div>
      </Head>
      <Body>
        <div>
          <FLabel style={{marginBottom:'8px',display:'block'}}>Tier Progress</FLabel>
          <TierBar>
            {TIERS.map((t,i)=>(
              <TierSegment key={i} $pct={25} $color={t.color} $active={i<=tierIdx}>
                {t.label}
              </TierSegment>
            ))}
          </TierBar>
          <div style={{fontSize:'0.65rem',color:'var(--text-secondary, #64748B)',marginTop:'4px',textAlign:'right'}}>
            {unitsToNextTier>0?`${unitsToNextTier} more units to reach ${nextTier.label}`:'🏆 Maximum tier achieved!'}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <Field><FLabel>Developer</FLabel>
            <Select value={developer} onChange={e=>setDeveloper(e.target.value)}>
              <option>EMAAR</option><option>DAMAC</option><option>NAKHEEL</option><option>MERAAS</option>
            </Select>
          </Field>
          <Field><FLabel>Developer Comm. %</FLabel><Input type="number" value={devCommPct} onChange={e=>setDevCommPct(e.target.value)} step="0.5"/></Field>
          <Field><FLabel>Units Sold (YTD)</FLabel><Input type="number" value={unitsSold} onChange={e=>setUnitsSold(e.target.value)}/></Field>
          <Field><FLabel>Unit Sale Price (AED)</FLabel><Input type="number" value={unitPrice} onChange={e=>setUnitPrice(e.target.value)}/></Field>
        </div>

        <SplitCard $tier={tierIdx}>
          <SplitRow>
            <SplitLabel>{tier.label} Tier — Commission Split</SplitLabel>
            <TierBadge $tier={tierIdx}>{tier.agencySplit}/{tier.devSplit}</TierBadge>
          </SplitRow>
          <SplitBars>
            <AgencyFill $pct={tier.agencySplit}>White Caves {tier.agencySplit}%</AgencyFill>
            <DevFill $pct={tier.devSplit}>{developer} {tier.devSplit}%</DevFill>
          </SplitBars>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem'}}>
            <div><span style={{color:'var(--accent-red, #EF4444)',fontWeight:800}}>Agency earns: AED {Math.round(agencyEarnings).toLocaleString()}</span> <span style={{color:'#64748B'}}>per unit</span></div>
            <div style={{color:'var(--text-secondary, #64748B)'}}>Dev retains: AED {Math.round(devRetains).toLocaleString()}</div>
          </div>
        </SplitCard>

        <MetricGrid>
          <Metric><MetricVal $green>AED {(ytdEarnings/1000).toFixed(0)}K</MetricVal><MetricLab>YTD Earnings</MetricLab></Metric>
          <Metric><MetricVal>{sold}</MetricVal><MetricLab>Units Sold</MetricLab></Metric>
          <Metric><MetricVal>AED {(ytdVolume/1e6).toFixed(1)}M</MetricVal><MetricLab>Sales Volume</MetricLab></Metric>
        </MetricGrid>
      </Body>
    </Wrap>
  );
};

export default CommissionAcceleratorEngine;
