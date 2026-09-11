import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;padding:24px;color:#FFF`;
const Header = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:20px`;
const Title = styled.h2`margin:0;font-size:1.2rem;font-weight:800;display:flex;align-items:center;gap:8px`;

const TourBox = styled.div`width:100%;aspect-ratio:16/9;background:#1E293B;border-radius:16px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 50px rgba(0,0,0,0.5)`;
const MockScene = styled.div`position:absolute;inset:0;background:radial-gradient(circle at center, #334155, #0F172A);display:flex;align-items:center;justify-content:center`;
const PlayBtn = styled.div`width:80px;height:80px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.3);border-radius:40px;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;backdrop-filter:blur(4px);transition:all .2s;&:hover{transform:scale(1.1);background:rgba(255,255,255,0.2)}`;

const Controls = styled.div`position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:12px;background:rgba(0,0,0,0.6);padding:12px 24px;border-radius:30px;backdrop-filter:blur(10px)`;
const CBtn = styled.button`background:none;border:none;color:#FFF;font-size:1.2rem;cursor:pointer;opacity:0.7;&:hover{opacity:1}`;

export const VirtualTourViewer: FC = () => {
  return (
    <Wrap data-testid="virtual-tour-viewer">
      <Header>
        <Title><span>👓 3D Virtual Tour</span></Title>
        <div style={{fontSize:'.8rem',color:'#94A3B8'}}>Powered by Matterport</div>
      </Header>

      <TourBox>
        <MockScene>
          <PlayBtn>▶️</PlayBtn>
        </MockScene>
        <Controls>
          <CBtn>⬅️</CBtn>
          <CBtn>⬆️</CBtn>
          <CBtn>⬇️</CBtn>
          <CBtn>➡️</CBtn>
          <div style={{width:1,background:'rgba(255,255,255,0.2)',margin:'0 8px'}}></div>
          <CBtn>🔍</CBtn>
        </Controls>
      </TourBox>
    </Wrap>
  );
};
export default VirtualTourViewer;
