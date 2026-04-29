/**
 * Error State Component
 * Displays error message with optional retry button
 */

import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
  gap: 1rem;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin: 1rem;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  color: #dc3545;
`;

const ErrorText = styled.p`
  color: #721c24;
  font-size: 14px;
  margin: 0;
  text-align: center;
  max-width: 400px;
`;

const ErrorTitle = styled.h3`
  color: #721c24;
  margin: 0 0 0.5rem 0;
  font-size: 16px;
`;

const RetryButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }

  &:active {
    background-color: #bd2130;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  retryDisabled?: boolean;
  fullHeight?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  retryDisabled = false,
  fullHeight = false,
}) => {
  return (
    <ErrorContainer style={{ minHeight: fullHeight ? '100vh' : '200px' }}>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Error Loading Data</ErrorTitle>
      <ErrorText>{error}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry} disabled={retryDisabled}>
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};
