import React from 'react';
import styled from 'styled-components';
import CavesBadge from './CavesBadge';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesKanbanCardProps {
  id: string;
  name: string;
  phone?: string;
  origin?: 'Bayut' | 'Property Finder' | 'Dubizzle' | 'Website' | string;
  slaMinutes?: number;
  assignedBroker?: string;
  stage?: string;
  onClick?: () => void;
}

const CardContainer = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  border: 1.5px solid rgba(239, 68, 68, 0.15);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  cursor: grab;
  transition: all 0.2s ease;
  margin-bottom: 12px;

  &:hover {
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
    border-color: ${RED};
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const OriginTag = styled.span<{ $origin: string }>`
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  background: #F1F5F9;
  color: ${SLATE};
`;

const SlaBadge = styled.span<{ $slaMinutes: number }>`
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  background: ${props => (props.$slaMinutes < 15 ? 'rgba(239, 68, 68, 0.1)' : '#F1F5F9')};
  color: ${props => (props.$slaMinutes < 15 ? RED : '#64748B')};
`;

export const CavesKanbanCard: React.FC<CavesKanbanCardProps> = ({
  name,
  phone,
  origin = 'Website',
  slaMinutes = 10,
  assignedBroker = 'Unassigned',
  stage,
  onClick,
}) => {
  return (
    <CardContainer onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <OriginTag $origin={origin}>📍 {origin}</OriginTag>
        <SlaBadge $slaMinutes={slaMinutes}>⏱️ {slaMinutes}m SLA</SlaBadge>
      </div>

      <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: SLATE, margin: '0 0 4px' }}>{name}</h4>
      {phone && <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #64748B)', margin: '0 0 10px' }}>📞 {phone}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', fontWeight: 700 }}>Broker: {assignedBroker}</span>
        {stage && <CavesBadge status={stage}>{stage}</CavesBadge>}
      </div>
    </CardContainer>
  );
};

export default CavesKanbanCard;
