import styled, { keyframes } from 'styled-components';

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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  animation: ${modalFadeIn} 0.2s ease;
`;

export const ModalContainer = styled.div<{ $size?: 'small' | 'medium' | 'large' | 'full' }>`
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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

  [data-theme="dark"] & {
    border-color: var(--border-color-dark, #374151);
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
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
  border-radius: 8px;
  color: var(--text-muted, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(220, 38, 38, 0.1);
    color: var(--primary-red, #dc2626);
  }

  &:focus {
    outline: 2px solid var(--primary-red, #dc2626);
    outline-offset: 2px;
  }
`;

export const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
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
