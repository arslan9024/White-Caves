// FILE: src/components/crm/RoleManager/RoleManager.fallback.tsx
/**
 * White Caves Real Estate LLC - Role Manager Fallback Error Boundary (Tier 8)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: #111827;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);

  .icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    margin: 0 0 8px;
  }

  p {
    font-size: 13px;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0 0 24px;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-btn {
    background: #ef4444;
    color: #ffffff;
    border: none;
    &:hover {
      background: #dc2626;
    }
  }

  .back-btn {
    background: transparent;
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.15);
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export interface RoleManagerFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  onNavigateBack?: () => void;
}

export const RoleManagerFallback: FC<RoleManagerFallbackProps> = ({
  error,
  onRetry,
  onNavigateBack,
}) => {
  return (
    <FallbackContainer data-testid="role-manager-fallback">
      <div className="icon-wrap">
        <ShieldAlert size={32} />
      </div>
      <h2>Role & RBAC Security Exception</h2>
      <p>
        {error?.message ||
          'An unexpected state verification error occurred while loading the Sovereign Role Matrix. Privilege boundaries remain secured.'}
      </p>
      <div className="actions">
        {onRetry && (
          <button className="retry-btn" onClick={onRetry} data-testid="role-fallback-retry-btn">
            <RefreshCw size={14} /> Retry Authorization
          </button>
        )}
        {onNavigateBack && (
          <button className="back-btn" onClick={onNavigateBack}>
            <ArrowLeft size={14} /> Return to Dashboard
          </button>
        )}
      </div>
    </FallbackContainer>
  );
};
