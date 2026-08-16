import React, { FC } from 'react';
import styled from 'styled-components';

const BottomSheetOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2400;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: flex-end;
`;

const SheetContainer = styled.div`
  width: 100%;
  max-height: 80vh;
  background: #1E293B;
  border-top: 3px solid #EF4444;
  border-radius: 20px 20px 0 0;
  padding: 1.5rem;
  color: #FFFFFF;
`;

export const MobileBottomSheetDrawer: FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <BottomSheetOverlay $isOpen={isOpen} data-testid="mobile-bottom-sheet-drawer">
      <SheetContainer>
        <div style={{ width: '40px', height: '4px', background: '#475569', borderRadius: '2px', margin: '0 auto 12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, color: '#EF4444' }}>📱 Mobile Filter Drawer</h4>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8' }}>Swipe gestures & touch target optimization active.</p>
      </SheetContainer>
    </BottomSheetOverlay>
  );
};

export default MobileBottomSheetDrawer;
