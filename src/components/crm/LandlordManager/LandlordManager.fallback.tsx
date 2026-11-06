// FILE: src/components/crm/LandlordManager/LandlordManager.fallback.tsx
/**
 * White Caves Real Estate LLC - Landlord Manager Failure Boundary
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface LandlordManagerFallbackProps {
  error?: Error | string | null;
  onRetry?: () => void;
  onNavigateHome?: () => void;
}

const FallbackBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 48px 24px;
  background: #111827;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  text-align: center;
  max-width: 600px;
  margin: 40px auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #ef4444;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.5;
  }

  .btn-row {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
`;

const FallbackButton = styled.button<{ $primary?: boolean }>`
  background: ${props => (props.$primary ? '#ef4444' : 'rgba(255, 255, 255, 0.08)')};
  color: #ffffff;
  border: 1px solid ${props => (props.$primary ? '#ef4444' : 'rgba(255, 255, 255, 0.15)')};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$primary ? '#dc2626' : 'rgba(255, 255, 255, 0.15)')};
  }
`;

export const LandlordManagerFallback: FC<LandlordManagerFallbackProps> = ({
  error,
  onRetry,
  onNavigateHome,
}) => {
  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || 'An error occurred loading Landlord Asset records.';

  return (
    <FallbackBox data-testid="landlord-manager-fallback">
      <h2>
        <AlertTriangle size={24} color="#ef4444" />
        <span>Landlord Portal Boundary Interception</span>
      </h2>
      <p>{errorMessage}</p>
      <div className="btn-row">
        {onRetry && (
          <FallbackButton $primary onClick={onRetry}>
            <RefreshCw size={14} /> Retry Gateway
          </FallbackButton>
        )}
        {onNavigateHome && (
          <FallbackButton onClick={onNavigateHome}>
            <Home size={14} /> Return to Portal Home
          </FallbackButton>
        )}
      </div>
    </FallbackBox>
  );
};

export default LandlordManagerFallback;
