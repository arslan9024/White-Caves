import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const blink = keyframes`0%,100%{opacity:1}50%{opacity:.3}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden`;
const Head = styled.div`padding:14px 18px;border-bottom:1px solid rgba(100,116,139,0.1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px`;
const HeadTitle = styled.div`font-size:.85rem;font-weight:700;color:#CBD5E1`;

const InboxList = styled.div`display:flex;flex-direction:column;border-bottom:1px solid rgba(100,116,139,0.1)`;
const ConvRow = styled.div<{$unread:boolean;$active:boolean}>`
  display:flex;align-items:flex-start;gap:10px;padding:10px 14px;cursor:pointer;
  background:${p=>p.$active?'rgba(59,130,246,0.06)':p.$unread?'rgba(37,211,102,0.03)':'transparent'};
  border-bottom:1px solid rgba(100,116,139,0.06);transition:background .1s;
  border-left:3px solid ${p=>p.$active?'#25D366':p.$unread?'#25D366':'transparent'};
  &:hover{background:rgba(37,211,102,0.04)}
`;
const ConvAvatar = styled.div<{$color:string}>`width:36px;height:36px;border-radius:50%;background:${p=>p.$color};display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;position:relative`;
const OnlinePip = styled.div<{$on:boolean}>`position:absolute;bottom:1px;right:1px;width:9px;height:9px;border-radius:50%;background:${p=>p.$on?'#25D366':'transparent'};border:2px solid rgba(15,23,42,0.9)`;
const ConvInfo = styled.div`flex:1;min-width:0`;
const ConvTop = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:2px`;
const ConvName = styled.div<{$unread:boolean}>`font-size:.75rem;font-weight:${p=>p.$unread?800:600};color:${p=>p.$unread?'#E2E8F0':'#94A3B8'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px`;
const ConvTime = styled.div`font-size:.6rem;color:#475569;flex-shrink:0`;
const ConvPreview = styled.div<{$unread:boolean}>`font-size:.67rem;color:${p=>p.$unread?'#94A3B8':'#475569'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`;
const UnreadBadge = styled.div`width:18px;height:18px;border-radius:50%;background:#25D366;font-size:.6rem;font-weight:800;color:#FFF;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px`;

const ThreadWrap = styled.div`padding:12px 14px;max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;&::-webkit-scrollbar{width:3px}&::-webkit-scrollbar-thumb{background:rgba(37,211,102,0.3);border-radius:2px}`;
const Bubble = styled.div<{$mine:boolean}>`
  max-width:72%;align-self:${p=>p.$mine?'flex-end':'flex-start'};padding:9px 13px;border-radius:${p=>p.$mine?'14px 14px 4px 14px':'14px 14px 14px 4px'};
  background:${p=>p.$mine?'#25D366':'rgba(30,41,59,0.9)'};color:${p=>p.$mine?'#FFF':'#CBD5E1'};font-size:.75rem;line-height:1.5;
`;
const BubbleTime = styled.div<{$mine:boolean}>`font-size:.58rem;color:${p=>p.$mine?'rgba(255,255,255,.7)':'#475569'};margin-top:3px;text-align:${p=>p.$mine?'right':'left'}`;
const TickMark = styled.span`font-size:.65rem;color:rgba(255,255,255,.7)`;

const QuickReplies = styled.div`display:flex;gap:5px;flex-wrap:wrap;padding:8px 14px;border-top:1px solid rgba(100,116,139,0.08)`;
const QR = styled.button`padding:4px 10px;border-radius:12px;border:1px solid rgba(37,211,102,0.3);background:transparent;color:#4ADE80;font-size:.65rem;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;&:hover{background:rgba(37,211,102,0.08)}`;

const ComposeRow = styled.div`display:flex;gap:8px;padding:10px 14px;border-top:1px solid rgba(100,116,139,0.1)`;
const ComposeInput = styled.input`flex:1;padding:9px 12px;border-radius:20px;border:1px solid rgba(37,211,102,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;outline:none;font-family:'Inter',sans-serif;&::placeholder{color:#475569}&:focus{border-color:rgba(37,211,102,0.4)}`;
const SendBtn = styled.button`padding:9px 16px;border-radius:20px;border:none;background:#25D366;color:#FFF;font-size:.75rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif`;

const CONVS = [
  {name:'Sheikh Khalid',preview:'Yes, the villa is perfect. When can we...',time:'09:42',unread:3,avatar:'👴',color:'#1a4a2e',online:true},
  {name:'Anna Petrova',preview:'Can you send the floor plan?',time:'09:28',unread:0,avatar:'👩',color:'#1a2050',online:true},
  {name:'James Robertson',preview:'Thank you for showing us the property',time:'08:55',unread:0,avatar:'👨',color:'#102040',online:false},
];

const THREAD = [
  {text:'Good morning! I wanted to follow up on the Palm Jumeirah villa viewing yesterday.',mine:true,time:'09:30',ticks:'✓✓'},
  {text:'Yes, it was absolutely stunning! My wife loved the sea view from the master bedroom.',mine:false,time:'09:35',ticks:''},
  {text:'Wonderful! The developer can offer a flexible payment plan — 20% now, 40% on handover. Shall I send the full project brochure?',mine:true,time:'09:38',ticks:'✓✓'},
  {text:'Yes please. Also, what is the service charge per sqft?',mine:false,time:'09:40',ticks:''},
  {text:'The service charge is AED 18.50/sqft annually. For a 6,200 sqft villa that\'s approximately AED 114,700/year. Competitive for the area!',mine:true,time:'09:42',ticks:'✓✓'},
];

export const WhatsAppInboxPanel: FC = () => {
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState('');
  const [qr, setQr] = useState('');

  return (
    <Wrap data-testid="whatsapp-inbox-panel">
      <Head>
        <HeadTitle style={{color:'#25D366'}}>💬 WhatsApp CRM Inbox</HeadTitle>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#25D366',animation:`${blink} 1.5s ease-in-out infinite`}}/>
          <span style={{fontSize:'.65rem',color:'#25D366',fontWeight:700}}>3 Active Chats</span>
        </div>
      </Head>

      <InboxList>
        {CONVS.map((c,i)=>(
          <ConvRow key={i} $unread={c.unread>0} $active={active===i} onClick={()=>setActive(i)}>
            <ConvAvatar $color={c.color}>{c.avatar}<OnlinePip $on={c.online}/></ConvAvatar>
            <ConvInfo>
              <ConvTop>
                <ConvName $unread={c.unread>0}>{c.name}</ConvName>
                <ConvTime>{c.time}</ConvTime>
              </ConvTop>
              <ConvPreview $unread={c.unread>0}>{c.preview}</ConvPreview>
            </ConvInfo>
            {c.unread>0&&<UnreadBadge>{c.unread}</UnreadBadge>}
          </ConvRow>
        ))}
      </InboxList>

      <ThreadWrap>
        {THREAD.map((m,i)=>(
          <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.mine?'flex-end':'flex-start'}}>
            <Bubble $mine={m.mine}>{m.text}</Bubble>
            <BubbleTime $mine={m.mine}>{m.time} {m.mine&&<TickMark>{m.ticks}</TickMark>}</BubbleTime>
          </div>
        ))}
      </ThreadWrap>

      <QuickReplies>
        {['Send Brochure 📎','Schedule Viewing 📅','Share Payment Plan 💰','DLD Info ℹ️'].map(r=>(
          <QR key={r} onClick={()=>setMsg(r)}>{r}</QR>
        ))}
      </QuickReplies>

      <ComposeRow>
        <ComposeInput placeholder="Type a message..." value={msg||qr} onChange={e=>setMsg(e.target.value)} onFocus={()=>setQr('')}/>
        <SendBtn>Send ↑</SendBtn>
      </ComposeRow>
    </Wrap>
  );
};
export default WhatsAppInboxPanel;
