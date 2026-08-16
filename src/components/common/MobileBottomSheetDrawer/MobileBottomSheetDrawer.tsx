/**
 * MobileBottomSheetDrawer — Wave 65 FE-GOAL-091
 * Touch-optimized mobile bottom sheet modal drawer for filters, search criteria, and quick actions
 * White Caves Real Estate LLC — Mobile & UI/UX Suite
 */
import React, { FC, ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;}to{opacity:1;}`;
const slideUp = keyframes`from{transform:translateY(100%);}to{transform:translateY(0);}`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(7, 11, 20, 0.85);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease;
  font-family: 'Inter', sans-serif;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 600px;
  background: #0F172A;
  border-top: 2px solid #EF4444;
  border-radius: 20px 20px 0 0;
  padding: 20px 24px 36px;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8);
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(100, 116, 139, 0.4);
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #FFF;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #94A3B8;
  font-size: 1.1rem;
  cursor: pointer;
  &:hover { color: #FFF; }
`;

export const MobileBottomSheetDrawer: FC<{
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}> = ({
  isOpen,
  title = 'Filter Listings',
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose} data-testid="mobile-bottom-sheet-drawer">
      <Sheet onClick={e => e.stopPropagation()}>
        <DragHandle />
        <Header>
          <Title>{title}</Title>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>
        <div>{children}</div>
      </Sheet>
    </Backdrop>
  );
};

export default MobileBottomSheetDrawer;
