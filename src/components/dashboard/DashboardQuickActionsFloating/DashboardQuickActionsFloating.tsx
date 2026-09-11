import React, { FC, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const expandIn = keyframes`from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}`;
const rotateIn = keyframes`from{transform:rotate(45deg)}to{transform:rotate(0deg)}`;

const Fab = styled.button<{$open:boolean}>`
  position:fixed;bottom:80px;right:24px;width:52px;height:52px;border-radius:50%;border:none;
  background:linear-gradient(135deg,#1D4ED8,#3B82F6);color:#FFF;font-size:1.3rem;
  cursor:pointer;z-index:300;box-shadow:0 8px 24px rgba(59,130,246,0.5);
  transition:all .2s;display:flex;align-items:center;justify-content:center;
  transform:${p=>p.$open?'rotate(45deg)':'rotate(0)'};
  &:hover{box-shadow:0 12px 32px rgba(59,130,246,0.6);transform:${p=>p.$open?'rotate(45deg) scale(1.05)':'scale(1.05)'}}
`;

const SubActions = styled.div<{$open:boolean}>`
  position:fixed;bottom:80px;right:24px;z-index:299;
  display:flex;flex-direction:column-reverse;align-items:flex-end;gap:10px;
  pointer-events:${p=>p.$open?'all':'none'};
`;

const SubBtn = styled.button<{$index:number;$open:boolean;$color:string}>`
  display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:24px;border:none;
  background:${p=>p.$color};color:#FFF;font-size:.76rem;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;
  box-shadow:0 4px 16px ${p=>p.$color}40;white-space:nowrap;
  transform-origin:bottom right;
  ${p=>p.$open?css`
    animation:${expandIn} .2s ${p.$index*0.05}s ease both;
    opacity:1;
  `:`opacity:0;transform:scale(0.5)`}
  transition:filter .15s;&:hover{filter:brightness(1.12)}
`;

const Backdrop = styled.div<{$show:boolean}>`
  position:fixed;inset:0;z-index:298;background:rgba(0,0,0,0.4);backdrop-filter:blur(2px);
  opacity:${p=>p.$show?1:0};pointer-events:${p=>p.$show?'all':'none'};transition:opacity .2s;
`;

const ACTIONS = [
  {icon:'👤',label:'New Lead',color:'#3B82F6'},
  {icon:'🏠',label:'Add Listing',color:'#10B981'},
  {icon:'📅',label:'Schedule Viewing',color:'#F59E0B'},
  {icon:'💬',label:'Send WhatsApp',color:'#25D366'},
  {icon:'📄',label:'Upload Document',color:'#8B5CF6'},
  {icon:'📞',label:'Log Call',color:'#EF4444'},
];

export const DashboardQuickActionsFloating: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Backdrop $show={open} onClick={()=>setOpen(false)}/>
      <SubActions $open={open}>
        {/* spacer for fab */}
        <div style={{height:62}}/>
        {ACTIONS.map((a,i)=>(
          <SubBtn key={i} $index={i} $open={open} $color={a.color} onClick={()=>setOpen(false)}>
            <span>{a.icon}</span><span>{a.label}</span>
          </SubBtn>
        ))}
      </SubActions>
      <Fab $open={open} onClick={()=>setOpen(p=>!p)} data-testid="dashboard-quick-actions-floating">
        {open?'✕':'＋'}
      </Fab>
    </>
  );
};
export default DashboardQuickActionsFloating;
