import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:20px;height:400px;position:relative`;

const Canvas = styled.div`width:100%;height:100%;background:radial-gradient(circle, rgba(100,116,139,0.1) 2px, transparent 2px);background-size:20px 20px;position:relative`;

const Node = styled.div<{x:number,y:number,$color:string}>`
  position:absolute;left:${p=>p.x}px;top:${p=>p.y}px;width:160px;
  background:rgba(30,41,59,0.9);border:1px solid ${p=>p.$color};border-radius:12px;
  box-shadow:0 4px 12px rgba(0,0,0,0.2);
`;
const NHead = styled.div<{$color:string}>`background:${p=>p.$color}20;padding:8px 10px;border-bottom:1px solid ${p=>p.$color};font-size:.65rem;font-weight:700;color:#FFF;border-radius:12px 12px 0 0`;
const NBody = styled.div`padding:10px;font-size:.65rem;color:#CBD5E1;line-height:1.4`;

const SVG = styled.svg`position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none`;
const Path = styled.path`fill:none;stroke:rgba(100,116,139,0.5);stroke-width:2;stroke-dasharray:4 4`;

export const WhatsAppBotFlowBuilder: FC = () => {
  return (
    <Wrap data-testid="whatsapp-bot-flow-builder">
      <div style={{position:'absolute',top:16,left:20,zIndex:10,fontSize:'.9rem',fontWeight:800,color:'#E2E8F0'}}>🤖 Bot Flow Canvas</div>
      <Canvas>
        <SVG>
          <Path d="M 170 80 C 220 80, 230 140, 280 140" />
          <Path d="M 440 140 C 490 140, 500 80, 550 80" />
          <Path d="M 440 140 C 490 140, 500 220, 550 220" />
        </SVG>
        
        <Node x={10} y={50} $color="#10B981">
          <NHead $color="#10B981">TRIGGER</NHead>
          <NBody>User sends "Hi", "Hello", or scans QR code.</NBody>
        </Node>

        <Node x={280} y={110} $color="#3B82F6">
          <NHead $color="#3B82F6">MESSAGE</NHead>
          <NBody>Welcome to White Caves! Are you looking to Buy or Rent?</NBody>
        </Node>

        <Node x={550} y={50} $color="#F59E0B">
          <NHead $color="#F59E0B">BRANCH: BUY</NHead>
          <NBody>Show top Off-Plan projects menu.</NBody>
        </Node>
        
        <Node x={550} y={190} $color="#8B5CF6">
          <NHead $color="#8B5CF6">BRANCH: RENT</NHead>
          <NBody>Ask for preferred area and budget.</NBody>
        </Node>
      </Canvas>
    </Wrap>
  );
};
export default WhatsAppBotFlowBuilder;
