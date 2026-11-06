// FILE: src/pages/dashboard/AccessDeniedView.tsx
/**
 * White Caves Real Estate LLC - RBAC Access Denied View
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useUserRole, ROLE_LABELS } from '../../context/UserRoleContext';

export interface AccessDeniedViewProps {
  requiredRole?: string;
  onNavigateBack?: () => void;
  onNavigateHome?: () => void;
}

export const AccessDeniedView: FC<AccessDeniedViewProps> = ({
  requiredRole = 'Corporate Directorate (L3+)',
  onNavigateBack,
  onNavigateHome,
}) => {
  const { role, user } = useUserRole();

  const activeLabel = ROLE_LABELS[role] || role;

  return (
    <Container data-testid="rbac-access-denied-view">
      <Card>
        <IconWrap>
          <ShieldAlert size={36} color="#EF4444" />
        </IconWrap>

        <Title>Access Restricted by Sovereign RBAC</Title>
        <Subtitle>
          This corporate department or operational ledger is protected under the White Caves Turing
          Protocol (Law T11: Level 5 RBAC Boundary).
        </Subtitle>

        <InfoTable>
          <InfoRow>
            <InfoKey>Your Active Role:</InfoKey>
            <InfoVal>{activeLabel}</InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Authenticated Identity:</InfoKey>
            <InfoVal>{user?.email || 'Guest User'}</InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Required Authorization:</InfoKey>
            <InfoValHighlight>{requiredRole}</InfoValHighlight>
          </InfoRow>
        </InfoTable>

        <ActionsRow>
          {onNavigateBack && (
            <SecondaryBtn onClick={onNavigateBack} data-testid="access-denied-back-btn">
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </SecondaryBtn>
          )}
          {onNavigateHome && (
            <PrimaryBtn onClick={onNavigateHome} data-testid="access-denied-home-btn">
              <Home size={16} />
              <span>Return to My Portal</span>
            </PrimaryBtn>
          )}
        </ActionsRow>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 24px;
  background-color: #020617;
  color: #ffffff;
`;

const Card = styled.div`
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 14px;
  padding: 36px 32px;
  max-width: 540px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
`;

const IconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0 0 20px;
`;

const InfoTable = styled.div`
  width: 100%;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
`;

const InfoKey = styled.span`
  color: #64748b;
`;

const InfoVal = styled.span`
  color: #f1f5f9;
  font-weight: 600;
`;

const InfoValHighlight = styled.span`
  color: #ef4444;
  font-weight: 700;
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SecondaryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #ffffff;
    border-color: #ffffff;
  }
`;

const PrimaryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ef4444;
  border: none;
  color: #ffffff;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
  }
`;
