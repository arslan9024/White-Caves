import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const Spinner = styled.div<{$spinning:boolean}>`width:16px;height:16px;border:2px solid rgba(16,185,129,0.3);border-top-color:#10B981;border-radius:50%;animation:${p=>p.$spinning?spin:''} .8s linear infinite`;

const DevRow = styled.div`padding:10px 12px;border-radius:9px;background:rgba(15,23,42,0.7);border:1px solid rgba(16,185,129,0.12);display:flex;align-items:flex-start;gap:10px`;
const DevLogo = styled.div`font-size:1.2rem;flex-shrink:0`;
const DevInfo = styled.div`flex:1`;
const DevName = styled.div`font-size:.76rem;font-weight:700;color:#E2E8F0`;
const DevSub = styled.div`font-size:.65rem;color:#64748B;margin-top:2px`;
const DevBadge = styled.div<{$status:'synced'|'syncing'|'error'}>`font-size:.62rem;font-weight:700;padding:2px 8px;border-radius:4px;display:flex;align-items:center;gap:4px;background:${p=>({synced:'rgba(16,185,129,0.15)',syncing:'rgba(245,158,11,0.12)',error:'rgba(239,68,68,0.12)'}[p.$status])};color:${p=>({synced:'#10B981',syncing:'#F59E0B',error:'#EF4444'}[p.$status])}`;

const UnitFeed = styled.div`display:flex;flex-direction:column;gap:5px;max-height:180px;overflow-y:auto;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(16,185,129,0.3);border-radius:2px}`;
const UnitRow = styled.div`display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;padding:6px 10px;border-radius:7px;background:rgba(15,23,42,0.5);border:1px solid rgba(100,116,139,0.08)`;
const UnitId = styled.div`font-size:.65rem;font-weight:700;color:#60A5FA;font-family:'Courier New',monospace`;
const UnitType = styled.div`font-size:.68rem;color:#94A3B8`;
const UnitPrice = styled.div`font-size:.68rem;font-weight:700;color:#10B981;white-space:nowrap`;
const UnitStatus = styled.div<{$avail:boolean}>`font-size:.58rem;font-weight:700;color:${p=>p.$avail?'#10B981':'#EF4444'}`;

const DEVS = [
  {name:'EMAAR Properties',logo:'🏙️',project:'Emaar Beachfront Phase 3',units:112,status:'synced' as const},
  {name:'DAMAC Properties',logo:'🏢',project:'DAMAC Lagoons Villas',units:64,status:'syncing' as const},
  {name:'Nakheel',logo:'🌴',project:'Palm Jebel Ali Residences',units:88,status:'synced' as const},
];

const UNITS = [
  {id:'EBF-3A-401',type:'2BR Apartment',price:'AED 2.8M',avail:true},
  {id:'EBF-3A-402',type:'2BR Apartment',price:'AED 2.9M',avail:false},
  {id:'EBF-3B-501',type:'3BR Apt',price:'AED 4.2M',avail:true},
  {id:'EBF-3B-502',type:'3BR Apt',price:'AED 4.1M',avail:true},
  {id:'DL-V-221',type:'4BR Villa',price:'AED 7.8M',avail:false},
  {id:'PJ-R-101',type:'5BR Mansion',price:'AED 28M',avail:true},
];

export const DeveloperLaunchWebhook: FC = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2 min ago');

  const sync = () => {
    setSyncing(true);
    setTimeout(()=>{setSyncing(false);setLastSync('just now');},2200);
  };

  return (
    <Wrap data-testid="developer-launch-webhook">
      <Head>
        <Title>🔄 Developer Launch Webhook</Title>
        <div style={{display:'flex',alignItems:'center',gap:6}}><Spinner $spinning={syncing}/><div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>Live Sync</div></div>
      </Head>
      <Body>
        {DEVS.map((d,i)=>(
          <DevRow key={i}>
            <DevLogo>{d.logo}</DevLogo>
            <DevInfo>
              <DevName>{d.name}</DevName>
              <DevSub>{d.project} · {d.units} units · Last sync: {lastSync}</DevSub>
            </DevInfo>
            <DevBadge $status={d.status}>
              {d.status==='syncing'&&<div style={{width:8,height:8,border:'2px solid #F59E0B',borderTopColor:'transparent',borderRadius:'50',animation:`${spin} .8s linear infinite`}}/>}
              {({synced:'✓ SYNCED',syncing:'SYNCING...',error:'ERROR'}[d.status])}
            </DevBadge>
          </DevRow>
        ))}

        <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>📋 Live Inventory Feed</div>
        <UnitFeed>
          {UNITS.map((u,i)=>(
            <UnitRow key={i}>
              <UnitId>{u.id}</UnitId>
              <UnitType>{u.type}</UnitType>
              <UnitPrice>{u.price}</UnitPrice>
              <UnitStatus $avail={u.avail}>{u.avail?'AVAIL':'SOLD'}</UnitStatus>
            </UnitRow>
          ))}
        </UnitFeed>

        <button onClick={sync} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:syncing?'rgba(16,185,129,0.08)':'linear-gradient(90deg,#059669,#10B981)',color:syncing?'#10B981':'#FFF',fontSize:'.85rem',fontWeight:800,cursor:'pointer',fontFamily:'Inter,sans-serif',transition:'all .2s'}}>
          {syncing?'⏳ Syncing Developer APIs...':'🔄 Force Sync All Developer Webhooks'}
        </button>
      </Body>
    </Wrap>
  );
};
export default DeveloperLaunchWebhook;
