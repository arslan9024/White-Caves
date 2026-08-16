/**
 * NavbarLogoRing — Wave 56 FE-GOAL-001
 * 76px circular logo with 3.5px solid Red glowing ring overhanging past navbar bottom border
 * White Caves Real Estate LLC — Navigation & Brand Identity Suite
 */
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2); }
  50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.7), 0 0 45px rgba(239, 68, 68, 0.35); }
`;

const LogoContainer = styled.div`
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #070B14;
  border: 3.5px solid #EF4444;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: ${glow} 3s infinite ease-in-out;
  cursor: pointer;
  transform: translateY(18px);
  z-index: 100;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(18px) scale(1.05);
  }
`;

const LogoGraphic = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  color: #FFF;
  span { color: #EF4444; }
`;

export const NavbarLogoRing: FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <LogoContainer onClick={onClick} data-testid="navbar-logo-ring" aria-label="White Caves Home">
      <LogoGraphic>
        W<span>C</span>
      </LogoGraphic>
    </LogoContainer>
  );
};

export default NavbarLogoRing;
