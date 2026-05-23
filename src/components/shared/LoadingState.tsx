/**
 * Loading State Component
 * Displays a loading spinner with optional text
 */

import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
  gap: 1rem;
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '24px';
      case 'lg': return '64px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '24px';
      case 'lg': return '64px';
      default: return '40px';
    }
  }};
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  fullHeight = false,
}) => {
  return (
    <LoadingContainer style={{ minHeight: fullHeight ? '100vh' : '200px' }}>
      <Spinner size={size} />
      {message && <LoadingText>{message}</LoadingText>}
    </LoadingContainer>
  );
};
