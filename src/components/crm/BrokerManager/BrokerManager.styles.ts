// FILE: src/components/crm/BrokerManager/BrokerManager.styles.ts
/**
 * White Caves Real Estate LLC - Broker Manager Styled Components
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  padding-bottom: 20px;

  .title-area {
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #94a3b8;
    }
  }

  .badge-area {
    display: flex;
    gap: 8px;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 16px;
`;

export const MetricCard = styled.div<{ $accent?: string }>`
  background: #111827;
  border: 1px solid ${props => props.$accent || 'rgba(239, 68, 68, 0.25)'};
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .value {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
  }

  .sub {
    font-size: 11px;
    color: #64748b;
  }
`;

export const TabsNav = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
  overflow-x: auto;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  background: ${props => (props.$active ? '#ef4444' : 'rgba(255, 255, 255, 0.04)')};
  color: ${props => (props.$active ? '#ffffff' : '#cbd5e1')};
  border: 1px solid ${props => (props.$active ? '#ef4444' : 'rgba(255, 255, 255, 0.08)')};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$active ? '#dc2626' : 'rgba(255, 255, 255, 0.08)')};
    color: #ffffff;
  }
`;

export const SectionCard = styled.div`
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  .section-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th {
    text-align: left;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.03);
    color: #94a3b8;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: #e2e8f0;
    vertical-align: middle;
  }

  tr:hover td {
    background: rgba(239, 68, 68, 0.04);
  }
`;

export const StatusPill = styled.span<{ $variant: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: capitalize;

  ${props => {
    switch (props.$variant) {
      case 'disbursed':
      case 'active':
      case 'within_sla':
      case 'closed':
        return 'background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3);';
      case 'approved':
      case 'contacted':
      case 'viewing_scheduled':
        return 'background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);';
      case 'pending_escrow':
      case 'warning':
      case 'renewal_due':
        return 'background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);';
      case 'breached':
      case 'on_hold':
      case 'suspended':
        return 'background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);';
      default:
        return 'background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.3);';
    }
  }}
`;

export const ActionButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: #ffffff;
  }
`;
