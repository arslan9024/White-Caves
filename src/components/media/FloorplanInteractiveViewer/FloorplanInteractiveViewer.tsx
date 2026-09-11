import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;display:flex;height:500px`;

const PlanArea = styled.div`flex:2;position:relative;background:#1E293B;display:flex;align-items:center;justify-content:center;border-right:1px solid rgba(255,255,255,0.1)`;
const MockPlan = styled.div`width:80%;height:80%;border:2px solid rgba(255,255,255,0.2);position:relative`;

const RoomZone = styled.div<{x:number,y:number,w:number,h:number,$active?:boolean}>`
  position:absolute;left:${p=>p.x}%;top:${p=>p.y}%;width:${p=>p.w}%;height:${p=>p.h}%;
  background:${p=>p.$active?'rgba(56,189,248,0.3)':'rgba(255,255,255,0.05)'};
  border:1px solid ${p=>p.$active?'#38BDF8':'rgba(255,255,255,0.2)'};
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:.8rem;color:${p=>p.$active?'#FFF':'#94A3B8'};font-weight:700;transition:all .2s;
  &:hover{background:rgba(56,189,248,0.2)}
`;

const InfoPanel = styled.div`flex:1;background:#0F172A;padding:32px;color:#FFF;display:flex;flex-direction:column`;
const RTitle = styled.h3`margin:0 0 16px;font-size:1.4rem;font-weight:900;color:#38BDF8`;
const RDesc = styled.p`font-size:.9rem;color:#CBD5E1;line-height:1.6;margin-bottom:24px`;
const RDim = styled.div`font-size:1.1rem;font-weight:800;color:#E2E8F0;background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;text-align:center`;

export const FloorplanInteractiveViewer: FC = () => {
  return (
    <Wrap data-testid="floorplan-interactive-viewer">
      <PlanArea>
        <MockPlan>
          <RoomZone x={0} y={0} w={60} h={50} $active={true}>Master Bedroom</RoomZone>
          <RoomZone x={60} y={0} w={40} h={50}>En-Suite Bath</RoomZone>
          <RoomZone x={0} y={50} w={100} h={50}>Living / Dining</RoomZone>
        </MockPlan>
      </PlanArea>

      <InfoPanel>
        <div style={{fontSize:'.75rem',color:'#94A3B8',textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>Selected Room</div>
        <RTitle>Master Bedroom</RTitle>
        <RDesc>Spacious master suite featuring floor-to-ceiling windows with direct views of the Burj Khalifa, a walk-in closet, and premium hardwood flooring.</RDesc>
        <RDim>8.5m × 6.2m</RDim>
      </InfoPanel>
    </Wrap>
  );
};
export default FloorplanInteractiveViewer;
