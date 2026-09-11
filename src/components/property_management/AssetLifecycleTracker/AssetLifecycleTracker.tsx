import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;

const AssetList = styled.div`display:flex;flex-direction:column;gap:16px`;
const AssetCard = styled.div`background:rgba(30,41,59,0.4);border:1px solid rgba(100,116,139,0.2);border-radius:12px;padding:16px;display:flex;align-items:center;gap:20px`;

const IconBox = styled.div`width:48px;height:48px;background:rgba(15,23,42,0.8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem`;
const Info = styled.div`flex:1`;
const AName = styled.div`font-size:.9rem;font-weight:700;color:#E2E8F0`;
const ASub = styled.div`font-size:.7rem;color:#94A3B8;margin-top:4px`;

const Timeline = styled.div`width:200px`;
const TTitle = styled.div`font-size:.65rem;color:#94A3B8;margin-bottom:6px;display:flex;justify-content:space-between`;
const BarBg = styled.div`width:100%;height:6px;background:rgba(100,116,139,0.2);border-radius:3px;overflow:hidden`;
const BarFill = styled.div<{w:number, $warn:boolean}>`height:100%;width:${p=>p.w}%;background:${p=>p.$warn?'#EF4444':'#10B981'};border-radius:3px`;

export const AssetLifecycleTracker: FC = () => {
  return (
    <Wrap data-testid="asset-lifecycle-tracker">
      <Title>🏗️ Major Asset Lifecycle Tracker</Title>
      
      <AssetList>
        <AssetCard>
          <IconBox>❄️</IconBox>
          <Info>
            <AName>HVAC / AC Chiller Unit</AName>
            <ASub>Installed: Jan 2018 | Lifespan: 10 Years</ASub>
          </Info>
          <Timeline>
            <TTitle><span>Health</span><span>80%</span></TTitle>
            <BarBg><BarFill w={80} $warn={false} /></BarBg>
          </Timeline>
        </AssetCard>

        <AssetCard>
          <IconBox>💧</IconBox>
          <Info>
            <AName>Water Heater (50L)</AName>
            <ASub>Installed: Mar 2021 | Lifespan: 5 Years</ASub>
          </Info>
          <Timeline>
            <TTitle><span>Health</span><span style={{color:'#EF4444'}}>10%</span></TTitle>
            <BarBg><BarFill w={90} $warn={true} /></BarBg>
          </Timeline>
        </AssetCard>
      </AssetList>
    </Wrap>
  );
};
export default AssetLifecycleTracker;
