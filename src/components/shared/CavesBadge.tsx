import React from 'react';
import styled, { css } from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export type CavesBadgeStatus = 'Available' | 'Active' | 'Leased' | 'Assigned' | 'UnderMaintenance' | string;

export interface CavesBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: CavesBadgeStatus;
  children?: React.ReactNode;
}

const getBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized.includes('available') || normalized.includes('active') || normalized.includes('ready')) {
    return css`
      background: rgba(239, 68, 68, 0.1);
      color: ${RED};
      border: 1px solid rgba(239, 68, 68, 0.3);
    `;
  }
  if (normalized.includes('leased') || normalized.includes('assigned') || normalized.includes('sold')) {
    return css`
      background: #F1F5F9;
      color: ${SLATE};
      border: 1px solid #CBD5E1;
    `;
  }
  if (normalized.includes('maintenance') || normalized.includes('pending') || normalized.includes('reserved')) {
    return css`
      background: #FEF3C7;
      color: #D97706;
      border: 1px solid #FDE68A;
    `;
  }
  return css`
    background: rgba(239, 68, 68, 0.08);
    color: ${RED};
    border: 1px solid rgba(239, 68, 68, 0.2);
  `;
};

const StyledBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
  letter-spacing: 0.02em;

  ${props => getBadgeStyle(props.$status)}
`;

const Dot = styled.span<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

export const CavesBadge: React.FC<CavesBadgeProps> = ({ status = 'Active', children, ...props }) => {
  return (
    <StyledBadge $status={status} {...props}>
      <Dot $status={status} />
      <span>{children || status}</span>
    </StyledBadge>
  );
};

export default CavesBadge;
