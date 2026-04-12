import styled from 'styled-components';
import { typography } from '../../styles/theme/typography';

export const SuspenseLoaderContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
`;

export const SuspenseLoaderOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 2rem;
`;

export const SuspenseLoaderSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

export const SpinnerCircle = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }
`;

export const SpinnerText = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: ${typography.weights.medium};
  letter-spacing: 0.5px;
  animation: pulse-text 1.5s ease-in-out infinite;

  @keyframes pulse-text {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
