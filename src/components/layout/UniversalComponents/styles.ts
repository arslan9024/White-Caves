import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const TimeDisplayContainer = styled.div<{ $isVisible?: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: var(--z-toast, 810);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.4s ease, transform 0.4s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: translateX(${props => props.$isVisible ? 0 : '-20px'});
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};

  &:hover {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: 80px;
    left: 16px;
  }
`;

const statusPulseKeyframes = `
  @keyframes statusPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.9); }
  }
`;

export const ConnectionStatus = styled.span<{ $isOnline?: boolean }>`
  ${statusPulseKeyframes}
  
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: default;

  ${props => props.$isOnline ? `
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
    
    &::before {
      background: #22c55e;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
    }
  ` : `
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    
    &::before {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
      animation: none;
    }
  `}

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    ${props => props.$isOnline && 'animation: statusPulse 2s infinite;'}
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 6px 12px;
    font-size: 0.65rem;
  }
`;
