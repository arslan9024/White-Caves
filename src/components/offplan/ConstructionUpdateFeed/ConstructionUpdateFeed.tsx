import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:350px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;color:#FFF`;
const ImgHeader = styled.div`width:100%;height:200px;background:url('https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&w=600&q=80') center/cover`;

const Content = styled.div`padding:24px`;
const Title = styled.h2`margin:0 0 4px;font-size:1.1rem;font-weight:900`;
const Sub = styled.div`font-size:.8rem;color:#94A3B8;margin-bottom:24px`;

const ProgWrap = styled.div`margin-bottom:24px`;
const PTitle = styled.div`display:flex;justify-content:space-between;font-size:.85rem;font-weight:800;color:#E2E8F0;margin-bottom:8px`;
const Bar = styled.div`width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden`;
const Fill = styled.div<{w:number}>`width:${p=>p.w}%;height:100%;background:#F59E0B`;

const Milestones = styled.ul`margin:0;padding-left:20px;font-size:.85rem;color:#CBD5E1;line-height:1.6`;

export const ConstructionUpdateFeed: FC = () => {
  return (
    <Wrap data-testid="construction-update-feed">
      <ImgHeader />
      <Content>
        <Title>🏗️ Site Update: Q3 2026</Title>
        <Sub>Oasis Towers (Phase 1)</Sub>
        
        <ProgWrap>
          <PTitle><span>Overall Progress</span> <span style={{color:'#F59E0B'}}>42%</span></PTitle>
          <Bar><Fill w={42} /></Bar>
        </ProgWrap>

        <div style={{fontSize:'.8rem',fontWeight:700,color:'#94A3B8',marginBottom:8}}>Recent Milestones:</div>
        <Milestones>
          <li>Foundation & Piling Complete</li>
          <li>Podium Levels 1-4 Poured</li>
          <li>MEP First Fix ongoing on Level 2</li>
        </Milestones>
      </Content>
    </Wrap>
  );
};
export default ConstructionUpdateFeed;
