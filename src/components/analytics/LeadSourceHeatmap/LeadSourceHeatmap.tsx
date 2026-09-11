import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(59,130,246,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(59,130,246,0.05);border-bottom:1px solid rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const KpiGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px`;
const KpiCard = styled.div<{$color:string}>`padding:14px;border-radius:12px;background:rgba(15,23,42,0.7);border:1px solid ${p=>p.$color}22`;
const KpiVal = styled.div<{$color:string}>`font-size:1.1rem;font-weight:900;color:${p=>p.$color}`;
const KpiLab = styled.div`font-size:.65rem;color:#64748B;margin-top:3px`;
const KpiChange = styled.div<{$up:boolean}>`font-size:.63rem;font-weight:700;color:${p=>p.$up?'#10B981':'#EF4444'};margin-top:4px`;

const ChannelList = styled.div`display:flex;flex-direction:column;gap:6px`;
const ChannelRow = styled.div`display:flex;align-items:center;gap:10px`;
const ChannelName = styled.div`font-size:.72rem;color:#94A3B8;width:110px;flex-shrink:0`;
const ChannelBar = styled.div`flex:1;height:10px;border-radius:5px;background:rgba(30,41,59,0.7);overflow:hidden`;
const ChannelFill = styled.div<{$pct:number;$color:string}>`height:100%;width:${p=>p.$pct}%;background:${p=>p.$color};border-radius:5px;transition:width .5s ease`;
const ChannelLeads = styled.div`font-size:.68rem;font-weight:700;color:#CBD5E1;width:32px;text-align:right`;

const CHANNELS = [
  {name:'Property Finder',leads:412,color:'#3B82F6',pct:100},
  {name:'Bayut / Dubizzle',leads:287,color:'#8B5CF6',pct:70},
  {name:'WhatsApp Blast',leads:198,color:'#25D366',pct:48},
  {name:'Instagram / Meta',leads:156,color:'#F59E0B',pct:38},
  {name:'Google Ads',leads:98,color:'#EF4444',pct:24},
  {name:'Referral',leads:89,color:'#10B981',pct:22},
];

export const LeadSourceHeatmap: FC = () => (
  <Wrap data-testid="lead-source-heatmap">
    <Head>
      <Title>🌡️ Lead Source Heatmap</Title>
      <div style={{fontSize:'.7rem',color:'#3B82F6',fontWeight:700}}>Q3 2026</div>
    </Head>
    <Body>
      <KpiGrid>
        <KpiCard $color="#3B82F6"><KpiVal $color="#3B82F6">1,240</KpiVal><KpiLab>Total Leads</KpiLab><KpiChange $up>↑ +18% vs Q2</KpiChange></KpiCard>
        <KpiCard $color="#10B981"><KpiVal $color="#10B981">3.3%</KpiVal><KpiLab>Conversion Rate</KpiLab><KpiChange $up>↑ +0.4pp</KpiChange></KpiCard>
        <KpiCard $color="#F59E0B"><KpiVal $color="#F59E0B">AED 2,840</KpiVal><KpiLab>Cost Per Lead</KpiLab><KpiChange $up={false}>↑ +6% (spend)</KpiChange></KpiCard>
        <KpiCard $color="#8B5CF6"><KpiVal $color="#8B5CF6">14.2 days</KpiVal><KpiLab>Avg Deal Cycle</KpiLab><KpiChange $up>↓ -2d faster</KpiChange></KpiCard>
      </KpiGrid>

      <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600}}>Leads by Channel</div>
      <ChannelList>
        {CHANNELS.map((c,i) => (
          <ChannelRow key={i}>
            <ChannelName>{c.name}</ChannelName>
            <ChannelBar><ChannelFill $pct={c.pct} $color={c.color} /></ChannelBar>
            <ChannelLeads>{c.leads}</ChannelLeads>
          </ChannelRow>
        ))}
      </ChannelList>
    </Body>
  </Wrap>
);
export default LeadSourceHeatmap;
