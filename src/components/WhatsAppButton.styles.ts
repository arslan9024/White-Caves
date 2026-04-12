import styled from 'styled-components';
import { keyframes } from 'styled-components';
import { transitions } from '../styles/theme/transitions';

const pulse = keyframes`
  0% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 0 rgba(37, 211, 102, 0.7);
  }
  50% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 10px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 0 rgba(37, 211, 102, 0);
  }
`;

export const WhatsAppFloatingBtn = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-toast, 400);
  transition: ${transitions.all};
  animation: ${pulse} 2s infinite;

  &:hover {
    background-color: #128C7E;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
`;

export const WhatsAppIcon = styled.svg`
  width: 32px;
  height: 32px;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;
