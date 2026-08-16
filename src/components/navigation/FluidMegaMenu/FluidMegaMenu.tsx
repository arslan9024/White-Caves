import React, { FC, useState } from 'react';
import styled from 'styled-components';

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MegaDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 540px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border: 2px solid #EF4444;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'grid' : 'none')};
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  z-index: 1000;
  margin-top: 8px;
`;

export const FluidMegaMenu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MenuWrapper
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-testid="fluid-mega-menu"
    >
      <button
        style={{
          background: 'none',
          border: 'none',
          color: '#FFF',
          fontWeight: 800,
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}
      >
        Properties Navigation ▼
      </button>

      <MegaDropdown $isOpen={isOpen}>
        <div>
          <h5 style={{ margin: '0 0 6px', color: '#EF4444' }}>Residential</h5>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Palm Luxury Villas</span>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Downtown Penthouses</span>
        </div>
        <div>
          <h5 style={{ margin: '0 0 6px', color: '#EF4444' }}>Commercial</h5>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Business Bay Offices</span>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>Retail Spaces</span>
        </div>
        <div>
          <h5 style={{ margin: '0 0 6px', color: '#EF4444' }}>Off-Plan</h5>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>EMAAR Launches</span>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block' }}>DAMAC Islands</span>
        </div>
      </MegaDropdown>
    </MenuWrapper>
  );
};

export default FluidMegaMenu;
