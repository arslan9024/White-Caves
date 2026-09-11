import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(16,185,129,0.25);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease`;
const Head = styled.div`padding:14px 20px;background:rgba(16,185,129,0.05);border-bottom:1px solid rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:space-between`;
const Title = styled.h3`margin:0;color:#FFF;font-size:.9rem;font-weight:700`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px`;

const RatingGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:6px`;
const RatingCard = styled.div<{$selected:boolean}>`padding:10px;border-radius:9px;cursor:pointer;text-align:center;background:${p=>p.$selected?'rgba(16,185,129,0.1)':'rgba(15,23,42,0.6)'};border:2px solid ${p=>p.$selected?'rgba(16,185,129,0.4)':'rgba(100,116,139,0.12)'};transition:all .15s`;
const RatingEmoji = styled.div`font-size:1.5rem;margin-bottom:4px`;
const RatingLabel = styled.div<{$selected:boolean}>`font-size:.65rem;font-weight:700;color:${p=>p.$selected?'#10B981':'#64748B'}`;

const StarRow = styled.div`display:flex;gap:4px;justify-content:center`;
const Star = styled.div<{$filled:boolean}>`font-size:1.6rem;cursor:pointer;transition:transform .1s;&:hover{transform:scale(1.2)};color:${p=>p.$filled?'#F59E0B':'rgba(245,158,11,0.2)'}`;

const TextArea = styled.textarea`width:100%;padding:10px 14px;border-radius:9px;border:1px solid rgba(16,185,129,0.2);background:rgba(15,23,42,0.8);color:#E2E8F0;font-size:.78rem;font-weight:600;resize:none;height:80px;outline:none;font-family:'Inter',sans-serif;box-sizing:border-box;&:focus{border-color:#10B981}`;

const SubmitBtn = styled.button<{$done:boolean}>`width:100%;padding:12px;border-radius:10px;border:none;background:${p=>p.$done?'rgba(16,185,129,0.1)':'linear-gradient(90deg,#059669,#10B981)'};color:${p=>p.$done?'#10B981':'#FFF'};font-size:.85rem;font-weight:800;cursor:pointer;transition:all .2s`;

const RATINGS = [
  {emoji:'😍',label:'Excellent'},
  {emoji:'😊',label:'Good'},
  {emoji:'😐',label:'Neutral'},
  {emoji:'😕',label:'Poor'},
  {emoji:'😤',label:'Frustrated'},
  {emoji:'🤩',label:'Outstanding'},
];

export const ClientSatisfactionSurvey: FC = () => {
  const [mood, setMood] = useState<number|null>(null);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => { if(mood!==null||stars>0) setSubmitted(true); };

  return (
    <Wrap data-testid="client-satisfaction-survey">
      <Head>
        <Title>⭐ Client Satisfaction Survey</Title>
        <div style={{fontSize:'.7rem',color:'#10B981',fontWeight:700}}>NPS Powered</div>
      </Head>
      <Body>
        {submitted ? (
          <div style={{textAlign:'center',padding:'24px 16px'}}>
            <div style={{fontSize:'3rem',marginBottom:12}}>🙏</div>
            <div style={{fontSize:'.9rem',fontWeight:700,color:'#10B981',marginBottom:6}}>Thank you for your feedback!</div>
            <div style={{fontSize:'.75rem',color:'#64748B'}}>Your response has been recorded. We'll improve based on your experience.</div>
          </div>
        ) : (
          <>
            <div style={{fontSize:'.8rem',fontWeight:700,color:'#CBD5E1',textAlign:'center'}}>How was your experience with White Caves Real Estate?</div>

            <RatingGrid>
              {RATINGS.map((r,i)=>(
                <RatingCard key={i} $selected={mood===i} onClick={()=>setMood(i)}>
                  <RatingEmoji>{r.emoji}</RatingEmoji>
                  <RatingLabel $selected={mood===i}>{r.label}</RatingLabel>
                </RatingCard>
              ))}
            </RatingGrid>

            <div>
              <div style={{fontSize:'.7rem',color:'#64748B',fontWeight:600,textAlign:'center',marginBottom:8}}>Rate your agent's service</div>
              <StarRow>
                {[1,2,3,4,5].map(s=>(
                  <Star key={s} $filled={s<=(hover||stars)} onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(s)}>★</Star>
                ))}
              </StarRow>
            </div>

            <TextArea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Share your experience, suggestions, or comments..." />

            <SubmitBtn $done={false} onClick={submit} style={{opacity:mood!==null||stars>0?1:0.5}}>
              📤 Submit Feedback
            </SubmitBtn>
          </>
        )}
      </Body>
    </Wrap>
  );
};
export default ClientSatisfactionSurvey;
