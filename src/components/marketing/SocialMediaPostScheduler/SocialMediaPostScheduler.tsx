import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between`;
const AddBtn = styled.button`background:#EC4899;color:#FFF;border:none;border-radius:6px;padding:6px 12px;font-weight:700;font-size:.8rem;cursor:pointer`;

const CalGrid = styled.div`display:grid;grid-template-columns:repeat(7,1fr);gap:8px;margin-bottom:8px`;
const DayHead = styled.div`text-align:center;font-size:.65rem;color:#94A3B8;font-weight:700;text-transform:uppercase`;

const CalBody = styled.div`display:grid;grid-template-columns:repeat(7,1fr);gap:8px`;
const DayCell = styled.div<{$active?:boolean}>`aspect-ratio:1;background:rgba(30,41,59,0.5);border:1px solid ${p=>p.$active?'#EC4899':'rgba(100,116,139,0.2)'};border-radius:8px;padding:8px;position:relative`;
const DateNum = styled.div<{$active?:boolean}>`font-size:.75rem;font-weight:800;color:${p=>p.$active?'#EC4899':'#64748B'};margin-bottom:4px`;

const PostDot = styled.div<{$color:string}>`width:100%;height:14px;background:${p=>p.$color}20;border-left:2px solid ${p=>p.$color};border-radius:2px;margin-bottom:4px;font-size:.5rem;color:${p=>p.$color};display:flex;align-items:center;padding-left:4px;white-space:nowrap;overflow:hidden`;

export const SocialMediaPostScheduler: FC = () => {
  return (
    <Wrap data-testid="social-media-post-scheduler">
      <Title><span>🗓️ Social Media Scheduler</span><AddBtn>+ New Post</AddBtn></Title>
      
      <CalGrid>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><DayHead key={d}>{d}</DayHead>)}
      </CalGrid>

      <CalBody>
        {Array.from({length:14}).map((_, i) => {
          const date = i + 1;
          const isToday = date === 9;
          return (
            <DayCell key={i} $active={isToday}>
              <DateNum $active={isToday}>{date}</DateNum>
              {date === 9 && <PostDot $color="#EC4899">IG Reels</PostDot>}
              {date === 11 && <PostDot $color="#3B82F6">FB Carousel</PostDot>}
              {date === 14 && <><PostDot $color="#EC4899">IG Story</PostDot><PostDot $color="#14B8A6">TikTok</PostDot></>}
            </DayCell>
          );
        })}
      </CalBody>
    </Wrap>
  );
};
export default SocialMediaPostScheduler;
