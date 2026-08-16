import styled from 'styled-components';
import { motion } from 'framer-motion';

export const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background: #FFFFFF;
  border-bottom: 2px solid #EF4444;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const OverhangingLogoWrapper = styled(motion.div)`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #FFFFFF;
  z-index: 1001;
  cursor: pointer;
  
  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    border-radius: 50%;
  }
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const NavLink = styled(motion.button)<{ $active?: boolean }>`
  background: transparent;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#EF4444' : '#1E293B')};
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #EF4444;
    background: rgba(239, 68, 68, 0.05);
  }
`;

export const ImpersonationSwitch = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: #FFFFFF;
  color: #EF4444;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  
  &:focus {
    border-color: #EF4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
  }
`;
