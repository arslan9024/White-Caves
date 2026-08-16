/**
 * QuickActionFabPanel — Wave 59 FE-GOAL-037
 * Floating Action Button (FAB) executive speed dial panel for New Lead, New Listing, and Send Invoice modals
 * White Caves Real Estate LLC — Dashboard & Productivity Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const Container = styled.div`
  position: fixed;
  bottom: 84px;
  right: 28px;
  z-index: 9998;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  font-family: 'Inter', sans-serif;
`;

const FabList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  animation: ${slideUp} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
`;

const FabItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  color: #FFF;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
  &:hover {
    background: #EF4444;
    transform: scale(1.05);
  }
`;

const MainFab = styled.button<{ $open: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #DC2626, #EF4444);
  color: #FFF;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.25s ease;
  transform: ${p => p.$open ? 'rotate(45deg)' : 'rotate(0)'};
  &:hover { transform: ${p => p.$open ? 'rotate(45deg) scale(1.05)' : 'scale(1.05)'}; }
`;

export const QuickActionFabPanel: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Container data-testid="quick-action-fab-panel">
      {open && (
        <FabList>
          <FabItem onClick={() => { alert('Opening New Inbound Lead Modal...'); setOpen(false); }}>
            <span>👤</span>
            <span>+ Create VIP Lead</span>
          </FabItem>
          <FabItem onClick={() => { alert('Opening Form A / Listing Creator...'); setOpen(false); }}>
            <span>🏠</span>
            <span>+ New Property Listing</span>
          </FabItem>
          <FabItem onClick={() => { alert('Opening VAT Invoice & Escrow Dispatch...'); setOpen(false); }}>
            <span>💳</span>
            <span>+ Dispatch Tax Invoice</span>
          </FabItem>
        </FabList>
      )}

      <MainFab $open={open} onClick={() => setOpen(!open)} aria-label="Executive Quick Actions">
        +
      </MainFab>
    </Container>
  );
};

export default QuickActionFabPanel;
