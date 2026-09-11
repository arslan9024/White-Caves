import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px solid rgba(100,116,139,0.15);border-radius:18px;overflow:hidden;padding:24px`;
const Title = styled.h2`margin:0 0 20px;font-size:1.1rem;font-weight:800;color:#E2E8F0;display:flex;justify-content:space-between`;

const Legend = styled.div`display:flex;gap:12px;font-size:.7rem;color:#94A3B8;font-weight:700`;
const LItem = styled.div<{$color:string}>`display:flex;align-items:center;gap:4px;&::before{content:'';width:10px;height:10px;border-radius:3px;background:${p=>p.$color}}`;

const TowerGrid = styled.div`display:flex;flex-direction:column;gap:8px;margin-top:24px`;
const FloorRow = styled.div`display:flex;align-items:center;gap:12px`;
const FloorNum = styled.div`width:40px;font-size:.7rem;color:#64748B;font-weight:800;text-align:right`;

const Unit = styled.div<{$status:'avail'|'res'|'sold'}>`
  flex:1;height:30px;border-radius:4px;display:flex;align-items:center;justify-content:center;
  font-size:.65rem;font-weight:800;cursor:pointer;transition:transform .1s;
  background:${p=>p.$status==='avail'?'rgba(16,185,129,0.2)':p.$status==='res'?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)'};
  color:${p=>p.$status==='avail'?'#10B981':p.$status==='res'?'#F59E0B':'#EF4444'};
  border:1px solid ${p=>p.$status==='avail'?'rgba(16,185,129,0.4)':p.$status==='res'?'rgba(245,158,11,0.4)':'rgba(239,68,68,0.4)'};
  &:hover{transform:scale(1.05)}
`;

export const UnitInventoryMatrix: FC = () => {
  return (
    <Wrap data-testid="unit-inventory-matrix">
      <Title>
        <span>🏢 Tower A - Inventory Matrix</span>
        <Legend>
          <LItem $color="#10B981">Available</LItem>
          <LItem $color="#F59E0B">Reserved / Blocked</LItem>
          <LItem $color="#EF4444">Sold</LItem>
        </Legend>
      </Title>
      
      <TowerGrid>
        {[4, 3, 2, 1].map(floor => (
          <FloorRow key={floor}>
            <FloorNum>FL {floor}</FloorNum>
            <Unit $status={floor===4?'res':floor===2?'sold':'avail'}>{floor}01</Unit>
            <Unit $status={floor%2===0?'sold':'avail'}>{floor}02</Unit>
            <Unit $status={floor===1?'res':'sold'}>{floor}03</Unit>
            <Unit $status="avail">{floor}04</Unit>
          </FloorRow>
        ))}
      </TowerGrid>
    </Wrap>
  );
};
export default UnitInventoryMatrix;
