// FILE: src/components/crm/BrokerManager/BrokerManager.fallback.tsx
/**
 * White Caves Real Estate LLC - Broker Manager Failure Boundary
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface BrokerManagerFallbackProps {
  error?: Error | string | null;
  onRetry?: () => void;
}

const Box = styled.div`
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
  }
`;

const RetryBtn = styled.button`
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #dc2626;
  }
`;

export const BrokerManagerFallback: FC<BrokerManagerFallbackProps> = ({ error, onRetry }) => {
  const msg =
    typeof error === 'string' ? error : error?.message || 'Error loading Broker Workspace.';
  return (
    <Box data-testid="broker-manager-fallback">
      <h2>
        <AlertTriangle size={24} color="#ef4444" />
        <span>Broker Portal Boundary Interception</span>
      </h2>
      <p>{msg}</p>
      {onRetry && (
        <RetryBtn onClick={onRetry}>
          <RefreshCw size={14} /> Retry Workspace
        </RetryBtn>
      )}
    </Box>
  );
};

export default BrokerManagerFallback;
