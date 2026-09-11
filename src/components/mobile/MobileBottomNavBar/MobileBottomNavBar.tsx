import React, { FC, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const slideUp = keyframes`from{transform:translateY(100%)}to{transform:translateY(0)}`;

const NavBar = styled.nav`
  position:fixed;bottom:0;left:0;right:0;z-index:500;
  height:68px;background:rgba(10,18,40,0.95);backdrop-filter:blur(24px);
  border-top:1px solid rgba(100,116,139,0.15);
  display:flex;align-items:center;justify-content:space-around;padding:0 8px 8px;
  font-family:'Inter',sans-serif;animation:${slideUp} .3s ease;
`;

const NavItem = styled.button<{$active:boolean}>`
  display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 16px;
  border-radius:14px;border:none;background:${p=>p.$active?'rgba(59,130,246,0.12)':'transparent'};
  cursor:pointer;transition:all .2s;flex:1;position:relative;font-family:'Inter',sans-serif;
  &:hover{background:rgba(59,130,246,0.08)}
`;

const NavIcon = styled.div<{$active:boolean}>`
  font-size:1.25rem;transition:transform .2s;
  transform:${p=>p.$active?'translateY(-2px) scale(1.1)':'translateY(0) scale(1)'};
`;

const NavLabel = styled.div<{$active:boolean}>`
  font-size:.58rem;font-weight:700;
  color:${p=>p.$active?'#60A5FA':'#475569'};
  transition:color .2s;
`;

const ActivePill = styled.div<{$show:boolean}>`
  position:absolute;top:4px;left:50%;transform:translateX(-50%);
  width:20px;height:3px;border-radius:1.5px;background:#3B82F6;
  opacity:${p=>p.$show?1:0};transition:opacity .2s;
`;

const Badge = styled.div`
  position:absolute;top:4px;right:14px;width:16px;height:16px;border-radius:50%;
  background:#EF4444;font-size:.5rem;font-weight:900;color:#FFF;
  display:flex;align-items:center;justify-content:center;border:2px solid rgba(10,18,40,0.95);
`;

const TABS = [
  {icon:'🏠',label:'Home',badge:0},
  {icon:'🔍',label:'Search',badge:0},
  {icon:'❤️',label:'Saved',badge:3},
  {icon:'💬',label:'Messages',badge:7},
  {icon:'👤',label:'Profile',badge:0},
];

export const MobileBottomNavBar: FC = () => {
  const [active, setActive] = useState(0);

  return (
    <NavBar data-testid="mobile-bottom-nav-bar">
      {TABS.map((tab,i)=>(
        <NavItem key={i} $active={active===i} onClick={()=>setActive(i)}>
          <ActivePill $show={active===i}/>
          <NavIcon $active={active===i}>{tab.icon}</NavIcon>
          <NavLabel $active={active===i}>{tab.label}</NavLabel>
          {tab.badge>0&&<Badge>{tab.badge}</Badge>}
        </NavItem>
      ))}
    </NavBar>
  );
};
export default MobileBottomNavBar;
