import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;background:rgba(15,23,42,0.85);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.12);display:flex;align-items:center;justify-content:space-between`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;
const FilterRow = styled.div`display:flex;gap:4px`;
const FilterBtn = styled.button<{$active:boolean}>`padding:3px 10px;border-radius:999px;border:1px solid ${p=>p.$active?'rgba(59,130,246,0.4)':'rgba(100,116,139,0.15)'};background:${p=>p.$active?'rgba(59,130,246,0.1)':'transparent'};color:${p=>p.$active?'#60A5FA':'#64748B'};font-size:.63rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;

const Feed = styled.div`max-height:380px;overflow-y:auto;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;

const TimelineItem = styled.div<{$type:string}>`
  display:flex;gap:12px;padding:12px 18px;border-bottom:1px solid rgba(100,116,139,0.07);
  animation:${fadeIn} .3s ease;transition:background .1s;
  &:hover{background:rgba(59,130,246,0.03)}
`;

const DotCol = styled.div`display:flex;flex-direction:column;align-items:center;gap:0;flex-shrink:0;padding-top:4px`;
const Dot = styled.div<{$color:string}>`width:28px;height:28px;border-radius:50%;background:${p=>p.$color}18;border:2px solid ${p=>p.$color}60;display:flex;align-items:center;justify-content:center;font-size:.72rem;flex-shrink:0`;
const Line = styled.div`width:1px;flex:1;background:rgba(100,116,139,0.15);margin-top:6px`;

const ItemBody = styled.div`flex:1`;
const ItemTitle = styled.div`font-size:.75rem;font-weight:700;color:#CBD5E1;margin-bottom:3px`;
const ItemMeta = styled.div`font-size:.65rem;color:#64748B;line-height:1.4`;
const ItemTime = styled.div`font-size:.62rem;color:#475569;margin-top:4px;font-family:'Courier New',monospace`;

const TypeBadge = styled.div<{$color:string}>`font-size:.58rem;font-weight:700;padding:2px 6px;border-radius:4px;background:${p=>p.$color}15;color:${p=>p.$color};display:inline-block;margin-top:4px`;

const TYPE_META: Record<string,{icon:string;color:string}> = {
  lead:{icon:'👤',color:'#3B82F6'},
  deal:{icon:'🤝',color:'#10B981'},
  viewing:{icon:'🏠',color:'#F59E0B'},
  payment:{icon:'💳',color:'#8B5CF6'},
  whatsapp:{icon:'💬',color:'#25D366'},
  system:{icon:'⚙️',color:'#64748B'},
};

const ACTIVITIES = [
  {type:'deal',title:'Deal Closed — Marina Heights 14B',meta:'AED 2.45M · Buyer: James Rothschild · Agent: Victoria C.',time:'09:42:11'},
  {type:'lead',title:'New Lead Assigned — Sheikh Khalid Al Nahyan',meta:'Source: Property Finder · Budget: AED 45M+ · Palm Jumeirah',time:'09:38:05'},
  {type:'viewing',title:'Viewing Scheduled — Palm Jumeirah Villa 22',meta:'Date: Sun 8 Sep · 11:30 AM · Agent: Ahmed R.',time:'09:30:22'},
  {type:'payment',title:'PDC Cheque Deposited — Unit 7C',meta:'AED 18,500 · Tenant: Rania Al Farsi · Q3 Rent',time:'09:15:44'},
  {type:'whatsapp',title:'WhatsApp Blast Sent — 287 Contacts',meta:'Campaign: DAMAC Lagoons Launch · Open rate: 68%',time:'09:00:00'},
  {type:'deal',title:'Offer Accepted — Business Bay Office 22',meta:'AED 4.1M · Under MOU · SPA signing this week',time:'08:44:32'},
  {type:'lead',title:'Lead Escalated — Response SLA Breached',meta:'James Robertson waiting 28 min · Requires immediate callback',time:'08:30:15'},
  {type:'system',title:'Ejari Renewal Alert — 3 properties expiring',meta:'TRK-2025-8821, 8844, 8891 · Renewal deadline: 10 Sep',time:'08:00:00'},
];

const TYPES = ['All','deal','lead','viewing','payment','whatsapp','system'];

export const DashboardActivityTimeline: FC = () => {
  const [filter, setFilter] = useState('All');
  const filtered = filter==='All'?ACTIVITIES:ACTIVITIES.filter(a=>a.type===filter);

  return (
    <Wrap data-testid="dashboard-activity-timeline">
      <Head>
        <HeadTitle>⚡ Activity Feed</HeadTitle>
        <FilterRow>
          {TYPES.map(t=>(
            <FilterBtn key={t} $active={filter===t} onClick={()=>setFilter(t)}>
              {t==='All'?'All':TYPE_META[t]?.icon+' '+t}
            </FilterBtn>
          ))}
        </FilterRow>
      </Head>
      <Feed>
        {filtered.map((a,i)=>{
          const meta = TYPE_META[a.type];
          return (
            <TimelineItem key={i} $type={a.type}>
              <DotCol>
                <Dot $color={meta.color}>{meta.icon}</Dot>
                {i<filtered.length-1&&<Line/>}
              </DotCol>
              <ItemBody>
                <ItemTitle>{a.title}</ItemTitle>
                <ItemMeta>{a.meta}</ItemMeta>
                <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
                  <ItemTime>{a.time}</ItemTime>
                  <TypeBadge $color={meta.color}>{a.type.toUpperCase()}</TypeBadge>
                </div>
              </ItemBody>
            </TimelineItem>
          );
        })}
      </Feed>
    </Wrap>
  );
};
export default DashboardActivityTimeline;
