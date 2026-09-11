import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const Grid = styled.div`display:grid;grid-template-columns:repeat(2,1fr);gap:16px`;
const ResCard = styled.div`background:rgba(30,41,59,0.5);border:1px solid rgba(100,116,139,0.3);border-radius:12px;overflow:hidden;cursor:pointer;transition:all .2s;&:hover{border-color:rgba(139,92,246,0.5)}`;

const Thumb = styled.div`width:100%;aspect-ratio:16/9;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:2rem`;
const Info = styled.div`padding:16px`;
const RTitle = styled.div`font-size:.85rem;font-weight:800;color:#E2E8F0;margin-bottom:4px`;
const RType = styled.div`font-size:.7rem;color:#8B5CF6;font-weight:700;text-transform:uppercase`;

export const TrainingResourceLibrary: FC = () => {
  return (
    <Wrap data-testid="training-resource-library">
      <Title>📚 Training & Sales Enablement</Title>
      
      <Grid>
        <ResCard>
          <Thumb>▶️</Thumb>
          <Info>
            <RType>Video Tutorial (12 mins)</RType>
            <RTitle>Mastering the New Lead Router Workflow</RTitle>
          </Info>
        </ResCard>
        
        <ResCard>
          <Thumb>📄</Thumb>
          <Info>
            <RType>PDF Script</RType>
            <RTitle>Cold Calling Script: Off-Plan Investors</RTitle>
          </Info>
        </ResCard>
      </Grid>
    </Wrap>
  );
};
export default TrainingResourceLibrary;
