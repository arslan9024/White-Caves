import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const TagGrid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:8px`;
const TagCard = styled.div<{$selected:boolean;$color:string}>`
  padding:14px 12px;border-radius:12px;cursor:pointer;text-align:center;
  background:${p=>p.$selected?`${p.$color}14`:'rgba(15,23,42,0.6)'};
  border:2px solid ${p=>p.$selected?p.$color+'60':'rgba(100,116,139,0.15)'};
  transition:all .15s;
`;
const TagEmoji = styled.div`font-size:1.5rem;margin-bottom:4px`;
const TagName = styled.div<{$color:string;$selected:boolean}>`font-size:.78rem;font-weight:800;color:${p=>p.$selected?p.$color:'#94A3B8'}`;
const TagDesc = styled.div`font-size:.65rem;color:#475569;margin-top:2px`;

const TagSummary = styled.div`padding:14px;border-radius:12px;background:rgba(15,23,42,0.8);border:1px solid rgba(100,116,139,0.15)`;
const SumRow = styled.div`display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(100,116,139,0.08);&:last-child{border-bottom:none}`;
const SumLabel = styled.div`font-size:.72rem;color:#64748B`;
const SumValue = styled.div<{$color:string}>`font-size:.72rem;font-weight:700;color:${p=>p.$color}`;

const ApplyBtn = styled.button`width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(90deg,#DC2626,#EF4444);color:#FFF;font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s;&:hover{filter:brightness(1.1)}`;

const TAGS = [
  {id:'hot',name:'🔥 HOT',label:'Hot Lead',desc:'Ready to buy / rent now',color:'#EF4444',action:'Priority follow-up within 15 min'},
  {id:'warm',name:'🟡 WARM',label:'Warm Lead',desc:'Interested, comparing options',color:'#F59E0B',action:'Follow up within 24 hours'},
  {id:'cold',name:'🧊 COLD',label:'Cold Lead',desc:'Early stage, just browsing',color:'#60A5FA',action:'Nurture campaign, monthly touch'},
  {id:'investor',name:'💼 INVESTOR',label:'Investor',desc:'ROI-driven, portfolio buyer',color:'#8B5CF6',action:'Send ROI report & yield data'},
  {id:'tenant',name:'🏠 TENANT',label:'Tenant',desc:'Rental inquiries only',color:'#10B981',action:'Route to leasing team'},
  {id:'landlord',name:'🏛️ LANDLORD',label:'Landlord',desc:'Property management / listing',color:'#F97316',action:'Assign to Property Manager'},
];

export const LeadQualificationTagger: FC = () => {
  const [selected, setSelected] = useState<string|null>('hot');
  const [applied, setApplied] = useState(false);

  const tag = TAGS.find(t=>t.id===selected);

  return (
    <Wrap data-testid="lead-qualification-tagger">
      <Head>
        <Title>🏷️ Lead Qualification Tagger</Title>
        <div style={{fontSize:'.7rem',color:'#EF4444',fontWeight:700}}>AI-Powered</div>
      </Head>
      <Body>
        <div style={{fontSize:'.72rem',color:'#64748B',fontWeight:600}}>Select lead classification:</div>
        <TagGrid>
          {TAGS.map(t=>(
            <TagCard key={t.id} $selected={selected===t.id} $color={t.color} onClick={()=>{setSelected(t.id);setApplied(false)}}>
              <TagEmoji>{t.name.split(' ')[0]}</TagEmoji>
              <TagName $color={t.color} $selected={selected===t.id}>{t.label}</TagName>
              <TagDesc>{t.desc}</TagDesc>
            </TagCard>
          ))}
        </TagGrid>

        {tag && (
          <TagSummary>
            <SumRow><SumLabel>Lead: Ahmed Al Farsi</SumLabel><SumValue $color={tag.color}>{tag.label}</SumValue></SumRow>
            <SumRow><SumLabel>Recommended Action</SumLabel><SumValue $color="#94A3B8">{tag.action}</SumValue></SumRow>
            <SumRow><SumLabel>CRM Score</SumLabel><SumValue $color={tag.color}>{({hot:95,warm:65,cold:30,investor:88,tenant:50,landlord:72})[tag.id]}/100</SumValue></SumRow>
          </TagSummary>
        )}

        <ApplyBtn onClick={()=>setApplied(true)} style={{background:tag?`linear-gradient(90deg,${tag.color}cc,${tag.color})`:''}}>
          {applied?`✅ Tagged as "${tag?.label}" — CRM Updated`:`🏷️ Apply "${tag?.label}" Tag to Lead`}
        </ApplyBtn>
      </Body>
    </Wrap>
  );
};
export default LeadQualificationTagger;
