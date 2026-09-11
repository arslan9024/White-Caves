import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.2rem;font-weight:900;display:flex;align-items:center;gap:8px`;

const MainImage = styled.div`width:100%;aspect-ratio:21/9;background:url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80') center/cover;border-radius:12px;margin-bottom:16px;position:relative`;
const Badge = styled.div`position:absolute;top:16px;left:16px;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);padding:6px 12px;border-radius:20px;font-size:.75rem;font-weight:800;color:#FFF`;

const ThumbGrid = styled.div`display:grid;grid-template-columns:repeat(4,1fr);gap:16px`;
const Thumb = styled.div<{$bg:string}>`aspect-ratio:16/9;background:url(${p=>p.$bg}) center/cover;border-radius:8px;cursor:pointer;transition:all .2s;&:hover{transform:scale(1.02);box-shadow:0 10px 20px rgba(0,0,0,0.5)}`;

export const DroneFootageGallery: FC = () => {
  return (
    <Wrap data-testid="drone-footage-gallery">
      <Title>🚁 Aerial Community Perspectives</Title>
      
      <MainImage>
        <Badge>Downtown Skyline View</Badge>
      </MainImage>

      <ThumbGrid>
        <Thumb $bg="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80" style={{border:'2px solid #38BDF8'}} />
        <Thumb $bg="https://images.unsplash.com/photo-1582653211939-9eb8b512e524?auto=format&fit=crop&w=400&q=80" />
        <Thumb $bg="https://images.unsplash.com/photo-1526404423292-15db8c2334e5?auto=format&fit=crop&w=400&q=80" />
        <div style={{background:'rgba(255,255,255,0.05)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem',fontWeight:800,color:'#38BDF8',cursor:'pointer'}}>
          +12 More
        </div>
      </ThumbGrid>
    </Wrap>
  );
};
export default DroneFootageGallery;
