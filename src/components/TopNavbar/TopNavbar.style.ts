import styled from 'styled-components';
import { motion } from 'framer-motion';

export const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 68px;
  background: var(--bg-card, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 2px solid #EF4444;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const OverhangingLogoWrapper = styled(motion.div)`
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 64px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #EF4444;
  z-index: 1001;
  cursor: pointer;
  
  img {
    width: 85%;
    height: 85%;
    object-fit: contain;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #22C55E;
    border: 2px solid #FFFFFF;
    box-shadow: 0 0 8px #22C55E;
  }
`;

export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 900px) {
    gap: 0.4rem;
  }
`;

export const NavLink = styled(motion.button)<{ $active?: boolean }>`
  background: ${({ $active }) =>
    $active ? 'rgba(239, 68, 68, 0.12)' : 'transparent'};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(239, 68, 68, 0.35)' : 'transparent')};
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#EF4444' : 'var(--text-primary, #1E293B)')};
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: #EF4444;
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
    transform: translateY(-1px);
  }
`;

export const RoleBadge = styled.span<{ $level: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $level }) => ($level === 5 ? '#EF4444' : $level >= 3 ? '#1E293B' : 'rgba(239, 68, 68, 0.12)')};
  color: ${({ $level }) => ($level >= 3 ? '#FFFFFF' : '#EF4444')};
  border: 1px solid ${({ $level }) => ($level === 5 ? '#EF4444' : 'rgba(239, 68, 68, 0.3)')};
  box-shadow: ${({ $level }) => ($level === 5 ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none')};
  cursor: default;

  @media (max-width: 1100px) {
    display: none;
  }
`;

export const ThemeToggleBtn = styled.button`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #EF4444;
  transition: all 0.2s ease;

  &:hover {
    background: #EF4444;
    color: #FFFFFF;
    transform: rotate(15deg) scale(1.05);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;
