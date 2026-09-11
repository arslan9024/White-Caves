import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;overflow:hidden`;
const BoardScroll = styled.div`display:flex;gap:12px;overflow-x:auto;padding:4px 0 12px;&::-webkit-scrollbar{height:4px}&::-webkit-scrollbar-thumb{background:rgba(59,130,246,0.3);border-radius:2px}`;

const Column = styled.div<{$color:string}>`
  min-width:210px;max-width:210px;border-radius:16px;
  background:rgba(15,23,42,0.7);border:1px solid ${p=>p.$color}20;
  display:flex;flex-direction:column;flex-shrink:0;overflow:hidden;
`;
const ColHead = styled.div<{$color:string}>`
  padding:10px 14px;border-bottom:1px solid ${p=>p.$color}20;
  background:${p=>p.$color}08;
`;
const ColTitle = styled.div<{$color:string}>`font-size:.72rem;font-weight:800;color:${p=>p.$color};margin-bottom:2px`;
const ColMeta = styled.div`font-size:.62rem;color:#475569`;
const ColWip = styled.div<{$over:boolean}>`font-size:.58rem;font-weight:700;padding:1px 6px;border-radius:3px;display:inline-block;background:${p=>p.$over?'rgba(239,68,68,0.15)':'rgba(100,116,139,0.1)'};color:${p=>p.$over?'#EF4444':'#64748B'}`;

const CardList = styled.div`padding:8px;display:flex;flex-direction:column;gap:6px;min-height:100px`;

const LeadCard = styled.div<{$priority:'high'|'medium'|'low'}>`
  padding:10px 12px;border-radius:10px;background:rgba(30,41,59,0.8);
  border:1px solid ${p=>({high:'rgba(239,68,68,0.25)',medium:'rgba(245,158,11,0.2)',low:'rgba(100,116,139,0.12)'}[p.$priority])};
  cursor:grab;transition:all .15s;&:hover{border-color:rgba(59,130,246,0.3);transform:translateY(-1px)}
`;
const CardTop = styled.div`display:flex;align-items:center;gap:7px;margin-bottom:6px`;
const CardAvatar = styled.div<{$color:string}>`width:26px;height:26px;border-radius:50%;background:${p=>p.$color};display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0`;
const CardName = styled.div`font-size:.72rem;font-weight:700;color:#CBD5E1;flex:1`;
const PriorityDot = styled.div<{$priority:'high'|'medium'|'low'}>`width:7px;height:7px;border-radius:50%;flex-shrink:0;background:${p=>({high:'#EF4444',medium:'#F59E0B',low:'#64748B'}[p.$priority])}`;
const CardBudget = styled.div`font-size:.7rem;font-weight:800;color:#F59E0B;margin-bottom:4px`;
const CardMeta = styled.div`font-size:.62rem;color:#64748B`;
const SourceTag = styled.div<{$color:string}>`font-size:.58rem;font-weight:700;padding:2px 6px;border-radius:4px;background:${p=>p.$color}15;color:${p=>p.$color};display:inline-block;margin-top:4px`;

interface Lead {name:string;budget:string;meta:string;priority:'high'|'medium'|'low';source:string;sourceColor:string;avatar:string;avatarColor:string}
const STAGES:{label:string;color:string;total:string;wip:number;wipLimit:number;leads:Lead[]}[] = [
  {label:'🔍 New Inquiry',color:'#64748B',total:'AED 0',wip:3,wipLimit:5,leads:[
    {name:'Sheikh Khalid',budget:'AED 45M',meta:'Palm Jumeirah · Villa',priority:'high',source:'WhatsApp',sourceColor:'#25D366',avatar:'🤵',avatarColor:'#1a4a2e'},
    {name:'Anna Petrova',budget:'AED 3.2M',meta:'Dubai Marina · 2BR',priority:'medium',source:'Property Finder',sourceColor:'#E53935',avatar:'👩',avatarColor:'#1a2050'},
    {name:'James Lee',budget:'AED 1.8M',meta:'JVC · 3BR',priority:'low',source:'Website',sourceColor:'#3B82F6',avatar:'👨',avatarColor:'#102040'},
  ]},
  {label:'📞 Contacted',color:'#3B82F6',total:'AED 50M',wip:2,wipLimit:4,leads:[
    {name:'Maria Santos',budget:'AED 2.5M',meta:'Business Bay · 1BR',priority:'medium',source:'Dubizzle',sourceColor:'#F97316',avatar:'👩‍💼',avatarColor:'#2a1020'},
    {name:'Rauf Karimov',budget:'AED 8M',meta:'Downtown · 2BR PH',priority:'high',source:'Referral',sourceColor:'#8B5CF6',avatar:'🧑',avatarColor:'#1a0a30'},
  ]},
  {label:'🏠 Viewing',color:'#F59E0B',total:'AED 30M',wip:2,wipLimit:3,leads:[
    {name:'Charlotte Webb',budget:'AED 4.1M',meta:'DIFC · Studio PH',priority:'high',source:'LinkedIn',sourceColor:'#0077B5',avatar:'👱‍♀️',avatarColor:'#0a2020'},
    {name:'Omar Al Farsi',budget:'AED 25M',meta:'Palm Jumeirah · Villa',priority:'high',source:'Cold Call',sourceColor:'#64748B',avatar:'🧔',avatarColor:'#2a1400'},
  ]},
  {label:'📋 Offer',color:'#8B5CF6',total:'AED 30M',wip:1,wipLimit:2,leads:[
    {name:'Raj Patel',budget:'AED 6.5M',meta:'Dubai Hills · 4BR',priority:'high',source:'Property Finder',sourceColor:'#E53935',avatar:'👨‍💼',avatarColor:'#102030'},
  ]},
  {label:'🤝 Under MOU',color:'#10B981',total:'AED 7M',wip:1,wipLimit:2,leads:[
    {name:'Lisa Chen',budget:'AED 2.45M',meta:'Marina Heights 14B',priority:'high',source:'Referral',sourceColor:'#8B5CF6',avatar:'👩',avatarColor:'#003020'},
  ]},
  {label:'✅ Closed',color:'#16A34A',total:'AED 145M',wip:4,wipLimit:99,leads:[
    {name:'Deals Closed',budget:'This Month: 41',meta:'AED 145M total volume',priority:'low',source:'All Sources',sourceColor:'#10B981',avatar:'🏆',avatarColor:'#002010'},
  ]},
];

export const LeadKanbanBoard: FC = () => (
  <Wrap data-testid="lead-kanban-board">
    <BoardScroll>
      {STAGES.map((stage,si)=>(
        <Column key={si} $color={stage.color}>
          <ColHead $color={stage.color}>
            <ColTitle $color={stage.color}>{stage.label}</ColTitle>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3}}>
              <ColMeta>{stage.leads.length} leads · {stage.total}</ColMeta>
              <ColWip $over={stage.wip>stage.wipLimit}>WIP {stage.wip}/{stage.wipLimit}</ColWip>
            </div>
          </ColHead>
          <CardList>
            {stage.leads.map((lead,li)=>(
              <LeadCard key={li} $priority={lead.priority}>
                <CardTop>
                  <CardAvatar $color={lead.avatarColor}>{lead.avatar}</CardAvatar>
                  <CardName>{lead.name}</CardName>
                  <PriorityDot $priority={lead.priority}/>
                </CardTop>
                <CardBudget>{lead.budget}</CardBudget>
                <CardMeta>{lead.meta}</CardMeta>
                <SourceTag $color={lead.sourceColor}>{lead.source}</SourceTag>
              </LeadCard>
            ))}
          </CardList>
        </Column>
      ))}
    </BoardScroll>
  </Wrap>
);
export default LeadKanbanBoard;
