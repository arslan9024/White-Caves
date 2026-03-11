import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  min-height: 200px;

  p {
    margin: 0;
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid var(--bg-tertiary, #f3f3f3);
  border-top: 3px solid var(--primary-color, #3498db);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
