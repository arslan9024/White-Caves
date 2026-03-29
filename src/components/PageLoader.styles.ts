import styled, { keyframes } from 'styled-components';

/* ============================================================================
 * Page Loader Styled Components
 * ============================================================================ */

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const PageLoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-primary, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-fullscreen, 700);
  animation: ${fadeIn} 0.3s ease;

  [data-theme='dark'] & {
    background: var(--bg-primary, #1a1a2e);
  }
`;

export const LoaderContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const LoaderLogo = styled.div`
  img {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    animation: ${pulse} 2s ease-in-out infinite;

    @media (max-width: 768px) {
      width: 60px;
      height: 60px;
    }
  }
`;

export const LoaderSpinner = styled.div`
  display: flex;
  justify-content: center;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color, #e0e0e0);
  border-top-color: var(--primary-color, #c41e3a);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  [data-theme='dark'] & {
    border-color: var(--border-color, #3a3a5a);
    border-top-color: var(--primary-color, #c41e3a);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }
`;

export const LoaderMessage = styled.p`
  font-size: 1rem;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  font-weight: 500;

  [data-theme='dark'] & {
    color: var(--text-secondary, #a0a0a0);
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;
