import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { colors, spacing, typography, borderRadius, shadows } from '../../../design-tokens';

const ErrorBannerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
  padding: ${spacing[3]} ${spacing[4]};
  background: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
  border-radius: ${borderRadius.md};
  color: ${colors.error[700]};
  box-shadow: ${shadows.sm};

  p {
    flex: 1;
    margin: 0;
    ${typography.presets.body};
  }

  button {
    min-height: 38px;
    padding: 0 ${spacing[3]};
    border: 0;
    border-radius: 999px;
    background: ${colors.primary[500]};
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${colors.primary[600]};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.span`
  font-size: 1.2rem;
`;

interface DashboardErrorBannerProps {
  message: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export const DashboardErrorBanner: FC<DashboardErrorBannerProps> = ({
  message,
  onRetry,
  children,
}) => (
  <ErrorBannerContainer>
    <ErrorIcon aria-hidden="true">⚠️</ErrorIcon>
    <p>{message}</p>
    {children}
    {onRetry && <button onClick={onRetry}>Retry Operations</button>}
  </ErrorBannerContainer>
);

export default DashboardErrorBanner;
