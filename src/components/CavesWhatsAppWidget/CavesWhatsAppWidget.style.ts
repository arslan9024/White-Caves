import styled from 'styled-components';
import { motion } from 'framer-motion';

export const WhatsAppButton = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: #EF4444; /* Corporate Red */
  border: 4px solid #FFFFFF;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
  cursor: pointer;
  outline: none;
  transition: all 0.25s ease-in-out;
  
  &:hover {
    box-shadow: 0 12px 48px rgba(239, 68, 68, 0.6);
    transform: translateY(-2px) scale(1.05);
  }
`;
