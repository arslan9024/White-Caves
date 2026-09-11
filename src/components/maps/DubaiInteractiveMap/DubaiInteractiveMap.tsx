import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;height:500px;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:#0F172A;border:1px solid rgba(100,116,139,0.3);border-radius:18px;overflow:hidden;position:relative`;

const MockMapBg = styled.div`position:absolute;inset:0;background:radial-gradient(circle at 30% 70%, rgba(56,189,248,0.1), transparent 50%), radial-gradient(circle at 70% 30%, rgba(16,185,129,0.05), transparent 50%);background-color:#020617;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.1);font-size:2rem;font-weight:900;text-transform:uppercase;letter-spacing:10px;overflow:hidden`;

const GridLine = styled.div`position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);background-size:40px 40px`;

const Cluster = styled.div<{x:number, y:number, $size:number, $color:string}>`
  position:absolute;left:${p=>p.x}%;top:${p=>p.y}%;
  width:${p=>p.$size}px;height:${p=>p.$size}px;
  background:${p=>p.$color}CC;border:2px solid #FFF;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:#FFF;font-weight:800;font-size:.8rem;box-shadow:0 0 20px ${p=>p.$color};
  cursor:pointer;transform:translate(-50%,-50%);transition:transform .2s;
  &:hover{transform:translate(-50%,-50%) scale(1.1)}
`;

const Controls = styled.div`position:absolute;top:20px;left:20px;display:flex;flex-direction:column;gap:8px`;
const CBtn = styled.button`width:40px;height:40px;background:#1E293B;color:#FFF;border:1px solid rgba(255,255,255,0.2);border-radius:8px;font-size:1.2rem;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,0.3)`;

const SearchBox = styled.div`position:absolute;top:20px;right:20px;width:300px;background:#1E293B;border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:12px;box-shadow:0 10px 20px rgba(0,0,0,0.5)`;
const Input = styled.input`width:100%;background:none;border:none;color:#FFF;outline:none;font-size:.9rem;&::placeholder{color:#64748B}`;

export const DubaiInteractiveMap: FC = () => {
  return (
    <Wrap data-testid="dubai-interactive-map">
      <MockMapBg>
        <GridLine />
        Dubai Map Data
        <Cluster x={30} y={60} $size={60} $color="#38BDF8">142</Cluster>
        <Cluster x={60} y={40} $size={80} $color="#F43F5E">315</Cluster>
        <Cluster x={45} y={80} $size={40} $color="#10B981">45</Cluster>
        <Cluster x={75} y={70} $size={50} $color="#F59E0B">88</Cluster>
      </MockMapBg>

      <Controls>
        <CBtn>+</CBtn>
        <CBtn>-</CBtn>
        <CBtn>🎯</CBtn>
      </Controls>

      <SearchBox>
        <Input placeholder="Search areas e.g., 'Dubai Marina'" />
      </SearchBox>
    </Wrap>
  );
};
export default DubaiInteractiveMap;
