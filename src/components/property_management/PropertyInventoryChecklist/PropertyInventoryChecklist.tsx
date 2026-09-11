import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 4px;font-size:1.1rem;font-weight:800;color:#E2E8F0`;
const Sub = styled.p`margin:0 0 24px;font-size:.75rem;color:#94A3B8`;

const RoomGroup = styled.div`margin-bottom:24px;border:1px solid rgba(100,116,139,0.2);border-radius:12px;overflow:hidden`;
const RHead = styled.div`background:rgba(30,41,59,0.6);padding:12px 16px;font-size:.85rem;font-weight:800;color:#E2E8F0;border-bottom:1px solid rgba(100,116,139,0.2)`;

const CheckItem = styled.div`display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid rgba(100,116,139,0.1);&:last-child{border:none}`;
const IName = styled.div`font-size:.8rem;color:#CBD5E1;font-weight:600`;

const StatusGroup = styled.div`display:flex;gap:8px`;
const SBtn = styled.button<{$active:boolean, $type:'ok'|'dmg'}>`
  padding:6px 12px;border-radius:6px;border:1px solid ${p=>p.$active?(p.$type==='ok'?'#10B981':'#EF4444'):'rgba(100,116,139,0.3)'};
  background:${p=>p.$active?(p.$type==='ok'?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)'):'transparent'};
  color:${p=>p.$active?(p.$type==='ok'?'#10B981':'#EF4444'):'#94A3B8'};
  font-size:.7rem;font-weight:700;cursor:pointer;
`;
const PhotoBtn = styled.button`padding:6px 12px;border-radius:6px;border:1px dashed rgba(100,116,139,0.5);background:transparent;color:#94A3B8;font-size:.7rem;cursor:pointer`;

export const PropertyInventoryChecklist: FC = () => {
  return (
    <Wrap data-testid="property-inventory-checklist">
      <Title>📋 Move-In Inventory Inspection</Title>
      <Sub>Apt 1402, Marina Heights</Sub>
      
      <RoomGroup>
        <RHead>Master Bedroom</RHead>
        <CheckItem>
          <IName>Walls & Paint</IName>
          <StatusGroup>
            <SBtn $active={true} $type="ok">Good</SBtn>
            <SBtn $active={false} $type="dmg">Damaged</SBtn>
            <PhotoBtn>+ Photo</PhotoBtn>
          </StatusGroup>
        </CheckItem>
        <CheckItem>
          <IName>Doors & Locks</IName>
          <StatusGroup>
            <SBtn $active={true} $type="ok">Good</SBtn>
            <SBtn $active={false} $type="dmg">Damaged</SBtn>
            <PhotoBtn>+ Photo</PhotoBtn>
          </StatusGroup>
        </CheckItem>
      </RoomGroup>

      <RoomGroup>
        <RHead>Kitchen</RHead>
        <CheckItem>
          <IName>Appliances (Fridge/Oven)</IName>
          <StatusGroup>
            <SBtn $active={false} $type="ok">Good</SBtn>
            <SBtn $active={true} $type="dmg">Damaged</SBtn>
            <PhotoBtn style={{borderColor:'#38BDF8',color:'#38BDF8'}}>1 Photo Attached</PhotoBtn>
          </StatusGroup>
        </CheckItem>
      </RoomGroup>
    </Wrap>
  );
};
export default PropertyInventoryChecklist;
