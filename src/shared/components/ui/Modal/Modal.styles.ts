import styled, { keyframes } from 'styled-components';
import { transitions } from '../../../../styles/theme/transitions';
import { typography } from '../../../../styles/theme/typography';
import { radius } from '../../../../styles/theme/radius';

const modalFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const modalSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top, rgba(212, 175, 55, 0.2), rgba(0, 0, 0, 0.72) 60%),
    rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: var(--z-overlay, 600);
  animation: ${modalFadeIn} 0.2s ease;
`;

export const ModalContainer = styled.div<{ $size?: 'small' | 'medium' | 'large' | 'full' }>`
  background: var(--card-bg, #ffffff);
  border-radius: ${radius.xxl};
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(212, 175, 55, 0.22);
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  animation: ${modalSlideUp} 0.3s ease;

  width: 100%;
  max-width: ${props => {
    switch (props.$size) {
      case 'small': return '400px';
      case 'large': return '800px';
      case 'full': return 'calc(100vw - 2rem)';
      default: return '560px'; // medium
    }
  }};

  ${props => props.$size === 'full' && `
    max-height: calc(100vh - 2rem);
  `}

  [data-theme="dark"] & {
    background: var(--card-bg-dark, #1f2937);
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.07), rgba(255, 255, 255, 0));

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary, #1f2937);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const ModalCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: ${radius.lg};
  color: var(--text-muted, #6b7280);
  cursor: pointer;
  transition: ${transitions.hover};
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(212, 175, 55, 0.1);
    color: var(--primary-gold, #D4AF37);
  }

  &:focus {
    outline: 2px solid var(--primary-gold, #D4AF37);
    outline-offset: 2px;
  }
`;

export const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background:
    radial-gradient(circle at top right, rgba(212, 175, 55, 0.06), transparent 38%),
    var(--card-bg, #ffffff);
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color, #e5e7eb);

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;