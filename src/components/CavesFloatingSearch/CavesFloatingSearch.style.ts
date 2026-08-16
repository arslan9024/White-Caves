import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SearchPill = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid #EF4444;
  border-radius: 9999px;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.15);
  cursor: pointer;
  outline: none;
  font-family: 'Inter', sans-serif;
  transition: all 0.25s ease-in-out;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(239, 68, 68, 0.25);
    transform: translateY(-2px);
  }
`;

export const SearchText = styled.span`
  color: #1E293B;
  font-weight: 600;
  font-size: 0.9rem;
`;

export const SearchShortcut = styled.span`
  background: #1E293B;
  color: #FFFFFF;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;
