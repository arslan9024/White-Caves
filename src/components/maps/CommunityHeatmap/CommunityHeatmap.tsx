import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;height:400px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;position:relative`;

const MapLayer = styled.div`position:absolute;inset:0;background:#1E293B;display:flex;align-items:center;justify-content:center`;
const HeatOverlay = styled.div`position:absolute;inset:0;background:radial-gradient(circle at 40% 50%, rgba(239,68,68,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 30%, rgba(245,158,11,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16,185,129,0.4) 0%, transparent 40%);mix-blend-mode:screen`;

const Legend = styled.div`position:absolute;bottom:20px;right:20px;background:rgba(15,23,42,0.8);border:1px solid rgba(255,255,255,0.1);padding:12px;border-radius:12px;backdrop-filter:blur(10px)`;
const LTitle = styled.div`font-size:.7rem;color:#E2E8F0;font-weight:800;margin-bottom:8px;text-transform:uppercase`;
const GradientBar = styled.div`width:150px;height:8px;background:linear-gradient(90deg, #10B981, #F59E0B, #EF4444);border-radius:4px;margin-bottom:4px`;
const Labels = styled.div`display:flex;justify-content:space-between;font-size:.65rem;color:#94A3B8;font-weight:700`;

const OverlayTitle = styled.div`position:absolute;top:20px;left:20px;background:rgba(15,23,42,0.8);padding:12px 20px;border-radius:12px;color:#FFF;font-weight:900;font-size:1.1rem;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1)`;

export const CommunityHeatmap: FC = () => {
  return (
    <Wrap data-testid="community-heatmap">
      <MapLayer>
        <HeatOverlay />
      </MapLayer>

      <OverlayTitle>🔥 Price PSF Heatmap</OverlayTitle>

      <Legend>
        <LTitle>Avg Price / SqFt (AED)</LTitle>
        <GradientBar />
        <Labels>
          <span>&lt; 1,000</span>
          <span>&gt; 3,500</span>
        </Labels>
      </Legend>
    </Wrap>
  );
};
export default CommunityHeatmap;
