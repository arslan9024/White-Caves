/**
 * QuickViewPropertyDrawer — Wave 57 FE-GOAL-014
 * Quick-view slide-in property drawer triggered on map marker click or card quick-view
 * White Caves Real Estate LLC — Discovery Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;}to{opacity:1;}`;
const slideLeft = keyframes`from{transform:translateX(100%);}to{transform:translateX(0);}`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(7, 11, 20, 0.85);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  justify-content: flex-end;
  animation: ${fadeIn} 0.2s ease;
  font-family: 'Inter', sans-serif;
`;

const Drawer = styled.div`
  width: 100%;
  max-width: 440px;
  height: 100%;
  background: #0F172A;
  border-left: 2px solid rgba(239, 68, 68, 0.35);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: ${slideLeft} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #94A3B8;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover { color: #FFF; }
`;

const Photo = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: #1E293B;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 16px 0;
  border: 1px solid rgba(100, 116, 139, 0.2);
`;

const PTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFF;
`;

const PPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: #EF4444;
  margin-top: 4px;
`;

const DetailBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #EF4444;
  color: #FFF;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 16px;
  &:hover { background: #DC2626; }
`;

export const QuickViewPropertyDrawer: FC<{
  isOpen: boolean;
  onClose: () => void;
  property?: {
    title: string;
    price: string;
    location: string;
    specs: string;
  };
}> = ({
  isOpen,
  onClose,
  property = {
    title: 'Signature Beachfront Villa 14B',
    price: 'AED 65,000,000',
    location: 'Frond N, Palm Jumeirah, Dubai',
    specs: '5 Bedrooms · 6 Bathrooms · 8,450 SqFt · Private Pool',
  },
}) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose} data-testid="quick-view-property-drawer">
      <Drawer onClick={e => e.stopPropagation()}>
        <div>
          <Header>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444' }}>EXCLUSIVE LISTING</span>
            <CloseBtn onClick={onClose}>✕</CloseBtn>
          </Header>

          <Photo>🏝️</Photo>

          <PTitle>{property.title}</PTitle>
          <PPrice>{property.price}</PPrice>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>📍 {property.location}</div>
          <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '8px', lineHeight: 1.4 }}>{property.specs}</div>
        </div>

        <DetailBtn onClick={() => alert(`Navigating to full property detail view...`)}>
          View Full Specifications & 360° VR Tour →
        </DetailBtn>
      </Drawer>
    </Backdrop>
  );
};

export default QuickViewPropertyDrawer;
