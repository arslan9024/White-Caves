import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between;align-items:center`;
const OptBtn = styled.button`padding:8px 16px;background:linear-gradient(90deg,#F59E0B,#EF4444);color:#FFF;border:none;border-radius:8px;font-weight:800;cursor:pointer`;

const RouteList = styled.div`display:flex;flex-direction:column;position:relative;margin-left:16px;border-left:2px dashed rgba(100,116,139,0.4);padding-left:24px;gap:24px`;

const Stop = styled.div`position:relative`;
const Dot = styled.div`position:absolute;left:-31px;top:2px;width:12px;height:12px;border-radius:6px;background:#0F172A;border:2px solid #38BDF8`;
const Time = styled.div`font-size:.75rem;color:#F59E0B;font-weight:800;margin-bottom:2px`;
const SName = styled.div`font-size:.95rem;font-weight:700;color:#E2E8F0`;
const SClient = styled.div`font-size:.75rem;color:#94A3B8;margin-top:2px`;

const TravelBox = styled.div`position:absolute;left:-45px;top:-20px;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.3);font-size:.65rem;color:#94A3B8;padding:2px 6px;border-radius:4px;font-weight:700`;

export const RouteOptimizer: FC = () => {
  return (
    <Wrap data-testid="route-optimizer">
      <Title><span>🚗 Viewing Route Optimizer</span> <OptBtn>Optimize Route</OptBtn></Title>
      
      <RouteList>
        <Stop>
          <Dot style={{borderColor:'#10B981'}} />
          <Time>10:00 AM</Time>
          <SName>Office (White Caves HQ)</SName>
        </Stop>
        
        <Stop>
          <TravelBox>15m drive</TravelBox>
          <Dot />
          <Time>10:30 AM</Time>
          <SName>Downtown Views - Unit 804</SName>
          <SClient>Client: Sarah Jenkins</SClient>
        </Stop>

        <Stop>
          <TravelBox>22m drive</TravelBox>
          <Dot />
          <Time>11:45 AM</Time>
          <SName>Marina Heights - Apt 1402</SName>
          <SClient>Client: Ahmed Al Maktoum</SClient>
        </Stop>

        <Stop>
          <TravelBox>10m drive</TravelBox>
          <Dot style={{borderColor:'#EF4444'}} />
          <Time>12:30 PM</Time>
          <SName>End: Marina Mall (Lunch)</SName>
        </Stop>
      </RouteList>
    </Wrap>
  );
};
export default RouteOptimizer;
