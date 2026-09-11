import styled from 'styled-components';

export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--white, #FFFFFF);
  border-radius: 12px;
  border: 1px solid var(--text-secondary, #E2E8F0);
  padding: 1.5rem;
  font-family: ${props => props.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"};
  direction: ${props => props.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRtl ? 'right' : 'left'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const WidgetHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-1e293b, #1E293B);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary, #64748B);
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const StatCard = styled.div<{ $type: 'total' | 'active' | 'warning' }>`
  background: ${props => 
    props.$type === 'total' ? 'var(--color-f8fafc, #F8FAFC)' : 
    props.$type === 'active' ? 'var(--color-ecfdf5, #ECFDF5)' : 
    'var(--color-fffbeb, #FFFBEB)'};
  border: 1px solid ${props => 
    props.$type === 'total' ? 'var(--color-e2e8f0, #E2E8F0)' : 
    props.$type === 'active' ? 'var(--color-a7f3d0, #A7F3D0)' : 
    'var(--color-fde68a, #FDE68A)'};
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    color: ${props => 
      props.$type === 'total' ? 'var(--color-64748b, #64748B)' : 
      props.$type === 'active' ? 'var(--color-10b981, #10B981)' : 
      'var(--color-f59e0b, #F59E0B)'};
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-64748b, #64748B);
      text-transform: uppercase;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-1e293b, #1E293B);
      line-height: 1.2;
    }
  }
`;

export const ControlsBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  .search-box {
    flex: 1;
    min-width: 250px;
    position: relative;

    input {
      width: 100%;
      padding: 10px 12px 10px 36px;
      border-radius: 8px;
      border: 1px solid var(--text-secondary, #CBD5E1);
      font-size: 0.9rem;
      background: var(--white, #FFFFFF);

      &:focus {
        outline: none;
        border-color: var(--accent-gold, #D4AF37);
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
      }
    }

    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-94a3b8, #94A3B8);
    }
  }

  .filter-group {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 8px 16px;
      border: 1px solid var(--text-secondary, #CBD5E1);
      background: var(--white, #FFFFFF);
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-64748b, #64748B);
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: var(--color-1e293b, #1E293B);
        color: var(--white, #FFFFFF);
        border-color: var(--color-1e293b, #1E293B);
      }

      &:hover:not(.active) {
        background: var(--color-f1f5f9, #F1F5F9);
      }
    }
  }
`;

export const TrackerTable = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--color-e2e8f0, #E2E8F0);

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--color-e2e8f0, #E2E8F0);
  }

  th {
    background: var(--color-f8fafc, #F8FAFC);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-64748b, #64748B);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    font-size: 0.9rem;
    color: var(--color-334155, #334155);
    background: var(--white, #FFFFFF);
    vertical-align: middle;

    .broker-name {
      font-weight: 700;
      color: var(--color-1e293b, #1E293B);
    }

    .brn {
      font-family: monospace;
      color: var(--color-64748b, #64748B);
      background: var(--color-f1f5f9, #F1F5F9);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const StatusBadge = styled.span<{ $status: 'active' | 'expiring' | 'expired' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  
  background: ${props => 
    props.$status === 'active' ? 'var(--color-d1fae5, #D1FAE5)' : 
    props.$status === 'expiring' ? 'var(--color-fef3c7, #FEF3C7)' : 
    'var(--color-fee2e2, #FEE2E2)'};
    
  color: ${props => 
    props.$status === 'active' ? 'var(--color-065f46, #065F46)' : 
    props.$status === 'expiring' ? 'var(--color-92400e, #92400E)' : 
    'var(--color-991b1b, #991B1B)'};
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;

  ${props => props.$variant === 'primary' ? `
    background: var(--accent-gold, #D4AF37);
    color: var(--white, #FFFFFF);
    border: none;

    &:hover {
      background: var(--color-b8962e, #B8962E);
    }
  ` : `
    background: var(--white, #FFFFFF);
    color: var(--color-64748b, #64748B);
    border: 1px solid var(--color-cbd5e1, #CBD5E1);

    &:hover {
      background: var(--color-f8fafc, #F8FAFC);
      color: var(--color-1e293b, #1E293B);
    }
  `}
`;
