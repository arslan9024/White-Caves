/**
 * DepartmentAssignmentBadge — Wave 58 FE-GOAL-027
 * Department assignment badge matrix with Level 5 Superuser universal access indicator
 * White Caves Real Estate LLC — Sovereign Profile Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-family: 'Inter', sans-serif;
`;

const DeptTag = styled.span<{ $active?: boolean }>`
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${p => p.$active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.12)'};
  border: 1px solid ${p => p.$active ? 'rgba(239, 68, 68, 0.4)' : 'rgba(100, 116, 139, 0.2)'};
  color: ${p => p.$active ? '#EF4444' : '#94A3B8'};
`;

const SuperuserPill = styled.span`
  font-size: 0.7rem;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, #10B981, #059669);
  color: #FFF;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
`;

export const DepartmentAssignmentBadge: FC = () => {
  const departments = [
    'Executive Council',
    'Conveyancing & RERA Legal',
    'VIP UHNW Concierge',
    'Commercial Advisory',
    'Off-Plan Development',
    'IoT Facilities Asset Mgmt',
  ];

  return (
    <BadgeContainer data-testid="department-assignment-badge">
      <SuperuserPill>👑 ALL DEPARTMENTS (SUPERUSER)</SuperuserPill>
      {departments.map((d, idx) => (
        <DeptTag key={idx} $active={true}>
          {d}
        </DeptTag>
      ))}
    </BadgeContainer>
  );
};

export default DepartmentAssignmentBadge;
