import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(255,255,255,0.1);border-radius:18px;overflow:hidden;padding:24px;color:#FFF`;
const Title = styled.h2`margin:0 0 24px;font-size:1.1rem;font-weight:900`;

const Legend = styled.div`display:flex;gap:16px;margin-bottom:24px;font-size:.8rem;color:#94A3B8`;
const LItem = styled.div`display:flex;align-items:center;gap:6px`;
const Dot = styled.div<{$c:string}>`width:12px;height:12px;border-radius:2px;background:${p=>p.$c}`;

const Matrix = styled.div`display:flex;flex-direction:column;gap:8px`;
const FloorRow = styled.div`display:flex;align-items:center;gap:12px`;
const FloorNum = styled.div`width:40px;font-weight:800;font-size:.85rem;color:#94A3B8;text-align:right`;
const Units = styled.div`display:flex;gap:8px`;
const Unit = styled.div<{$s:'avail'|'sold'|'rsv'}>`
  width:40px;height:30px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;cursor:pointer;
  background:${p=>p.$s==='avail'?'#10B981':p.$s==='sold'?'#EF4444':'#F59E0B'};
  color:#FFF;opacity:${p=>p.$s==='sold'?0.4:1};
`;

export const UnitAvailabilityMatrix: FC = () => {
  return (
    <Wrap data-testid="unit-availability-matrix">
      <Title>🏢 Live Availability Matrix</Title>
      
      <Legend>
        <LItem><Dot $c="#10B981" /> Available</LItem>
        <LItem><Dot $c="#F59E0B" /> Reserved</LItem>
        <LItem><Dot $c="#EF4444" /> Sold</LItem>
      </Legend>

      <Matrix>
        <FloorRow>
          <FloorNum>FL 14</FloorNum>
          <Units>
            <Unit $s="sold">01</Unit><Unit $s="sold">02</Unit><Unit $s="avail">03</Unit><Unit $s="avail">04</Unit>
          </Units>
        </FloorRow>
        <FloorRow>
          <FloorNum>FL 12</FloorNum>
          <Units>
            <Unit $s="sold">01</Unit><Unit $s="rsv">02</Unit><Unit $s="avail">03</Unit><Unit $s="sold">04</Unit>
          </Units>
        </FloorRow>
        <FloorRow>
          <FloorNum>FL 10</FloorNum>
          <Units>
            <Unit $s="sold">01</Unit><Unit $s="sold">02</Unit><Unit $s="sold">03</Unit><Unit $s="rsv">04</Unit>
          </Units>
        </FloorRow>
      </Matrix>
    </Wrap>
  );
};
export default UnitAvailabilityMatrix;
