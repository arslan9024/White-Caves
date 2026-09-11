import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const flipIn = keyframes`from{transform:rotateY(90deg);opacity:0}to{transform:rotateY(0deg);opacity:1}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const SectionTitle = styled.h2`font-size:1.5rem;font-weight:900;margin:0 0 6px;color:#FFF;text-align:center`;
const SectionSub = styled.p`font-size:.82rem;color:#64748B;margin:0 0 24px;text-align:center`;

const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px`;

const CardWrap = styled.div`perspective:800px;cursor:pointer`;
const CardInner = styled.div<{$flipped:boolean}>`
  position:relative;width:100%;transition:transform .6s ease;transform-style:preserve-3d;
  transform:${p=>p.$flipped?'rotateY(180deg)':'rotateY(0)'};
`;

const CardFace = styled.div`
  border-radius:18px;overflow:hidden;background:#0F172A;border:1px solid rgba(100,116,139,0.15);
  backface-visibility:hidden;-webkit-backface-visibility:hidden;
`;
const CardBack = styled(CardFace)`
  position:absolute;top:0;left:0;right:0;bottom:0;
  transform:rotateY(180deg);background:rgba(15,23,42,0.97);
  display:flex;flex-direction:column;justify-content:center;padding:20px;
`;

const AvatarWrap = styled.div<{$color:string}>`
  height:140px;display:flex;align-items:center;justify-content:center;
  background:${p=>p.$color};font-size:3.5rem;position:relative;
`;
const OnlineDot = styled.div<{$online:boolean}>`
  position:absolute;bottom:10px;right:50%;transform:translateX(50%);
  width:10px;height:10px;border-radius:50%;border:2px solid #0F172A;
  background:${p=>p.$online?'#10B981':'#64748B'};
`;
const CardBody = styled.div`padding:14px`;
const AgentName = styled.div`font-size:.85rem;font-weight:800;color:#E2E8F0;margin-bottom:3px`;
const AgentSpec = styled.div`font-size:.68rem;font-weight:600;color:#60A5FA;margin-bottom:8px`;
const StatRow = styled.div`display:flex;justify-content:space-between`;
const StatItem = styled.div`text-align:center`;
const StatVal = styled.div`font-size:.82rem;font-weight:900;color:#F59E0B`;
const StatLab = styled.div`font-size:.58rem;color:#64748B;margin-top:1px`;
const LangRow = styled.div`display:flex;gap:4px;flex-wrap:wrap;margin-top:8px`;
const LangTag = styled.div`font-size:.58rem;color:#64748B;background:rgba(30,41,59,0.8);border:1px solid rgba(100,116,139,0.12);padding:2px 6px;border-radius:4px`;

const BackTitle = styled.div`font-size:.78rem;font-weight:900;color:#FFF;margin-bottom:10px`;
const BackList = styled.div`display:flex;flex-direction:column;gap:5px`;
const BackItem = styled.div`font-size:.7rem;color:#94A3B8;display:flex;align-items:center;gap:6px`;

const ContactBtn = styled.a`display:block;margin-top:14px;padding:9px;border-radius:9px;border:none;background:linear-gradient(90deg,#059669,#10B981);color:#FFF;font-size:.75rem;font-weight:800;text-align:center;text-decoration:none;cursor:pointer;&:hover{filter:brightness(1.1)}`;

const AGENTS = [
  {name:'Victoria Chen',spec:'Luxury Sales Director',emoji:'👩',color:'linear-gradient(135deg,#1a0533,#2a0845)',deals:52,volume:'AED 145M',rating:'4.9',langs:['English','Arabic','Mandarin'],online:true,areas:['Palm Jumeirah','Jumeirah Bay'],phone:'+971 50 882 4441'},
  {name:'Ahmed Al Rashidi',spec:'Off-Plan Specialist',emoji:'👨',color:'linear-gradient(135deg,#050d28,#0a1840)',deals:41,volume:'AED 98M',rating:'4.8',langs:['Arabic','English'],online:true,areas:['Downtown','Business Bay','DIFC'],phone:'+971 55 324 8822'},
  {name:'Sarah Thompson',spec:'Tenant & Leasing Expert',emoji:'👩‍💼',color:'linear-gradient(135deg,#021410,#051c14)',deals:67,volume:'AED 42M',rating:'5.0',langs:['English','French'],online:false,areas:['Dubai Marina','JBR','JLT'],phone:'+971 52 776 9901'},
  {name:'Jaime Rodriguez',spec:'Investment Advisor',emoji:'🧑‍💻',color:'linear-gradient(135deg,#180820,#200a28)',deals:34,volume:'AED 72M',rating:'4.7',langs:['English','Spanish','Portuguese'],online:true,areas:['JVC','Dubai Hills','MBR City'],phone:'+971 56 441 2233'},
];

export const AgentTeamShowcaseGrid: FC = () => {
  const [flipped, setFlipped] = useState(new Set<number>());
  const toggle = (i:number)=>setFlipped(prev=>{const n=new Set(prev);n.has(i)?n.delete(i):n.add(i);return n});

  return (
    <Wrap data-testid="agent-team-showcase-grid">
      <SectionTitle>Meet Our Expert Team</SectionTitle>
      <SectionSub>RERA-certified · Dubai's most trusted agents · Hover to connect</SectionSub>
      <Grid>
        {AGENTS.map((a,i)=>(
          <CardWrap key={i} onClick={()=>toggle(i)}>
            <CardInner $flipped={flipped.has(i)}>
              <CardFace>
                <AvatarWrap $color={a.color}>
                  {a.emoji}
                  <OnlineDot $online={a.online}/>
                </AvatarWrap>
                <CardBody>
                  <AgentName>{a.name}</AgentName>
                  <AgentSpec>{a.spec}</AgentSpec>
                  <StatRow>
                    <StatItem><StatVal>{a.deals}</StatVal><StatLab>Deals</StatLab></StatItem>
                    <StatItem><StatVal style={{fontSize:'.72rem'}}>{a.volume}</StatVal><StatLab>Volume</StatLab></StatItem>
                    <StatItem><StatVal>⭐ {a.rating}</StatVal><StatLab>Rating</StatLab></StatItem>
                  </StatRow>
                  <LangRow>{a.langs.map((l,j)=><LangTag key={j}>{l}</LangTag>)}</LangRow>
                </CardBody>
              </CardFace>
              <CardBack>
                <BackTitle>{a.name}</BackTitle>
                <BackList>
                  <BackItem>📍 Areas: {a.areas.join(', ')}</BackItem>
                  <BackItem>📞 {a.phone}</BackItem>
                  <BackItem>🌐 {a.langs.join(' · ')}</BackItem>
                  <BackItem>{a.online?'🟢 Online now':'⬜ Available on request'}</BackItem>
                </BackList>
                <ContactBtn href={`https://wa.me/${a.phone.replace(/\s/g,'')}`}>💬 WhatsApp Now</ContactBtn>
              </CardBack>
            </CardInner>
          </CardWrap>
        ))}
      </Grid>
    </Wrap>
  );
};
export default AgentTeamShowcaseGrid;
