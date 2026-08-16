import React, { FC, useState } from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.div<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '64px' : '240px')};
  height: 100vh;
  background: #0F172A;
  border-right: 2px solid #EF4444;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
`;

const ToggleBtn = styled.button`
  background: #EF4444;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  font-weight: 800;
  margin-bottom: 1.5rem;
`;

export const CollapsibleSidebarToggle: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarWrapper $collapsed={collapsed} data-testid="collapsible-sidebar-toggle">
      <ToggleBtn onClick={() => setCollapsed((prev) => !prev)}>
        {collapsed ? '▶' : '◀ Collapse Sidebar'}
      </ToggleBtn>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ padding: '8px 0', fontSize: '0.85rem', fontWeight: 800 }}>🏠 {!collapsed && 'Dashboard'}</div>
        <div style={{ padding: '8px 0', fontSize: '0.85rem', fontWeight: 800 }}>🏢 {!collapsed && 'Properties'}</div>
        <div style={{ padding: '8px 0', fontSize: '0.85rem', fontWeight: 800 }}>👤 {!collapsed && 'Profile'}</div>
      </div>
    </SidebarWrapper>
  );
};

export default CollapsibleSidebarToggle;
