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

export const AlertBanner = styled.div<{ $type: 'warning' | 'danger' }>`
  background: ${props => props.$type === 'warning' ? 'var(--color-fffbeb, #FFFBEB)' : 'var(--color-fef2f2, #FEF2F2)'};
  border-left: 4px solid ${props => props.$type === 'warning' ? 'var(--color-f59e0b, #F59E0B)' : 'var(--color-ef4444, #EF4444)'};
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.9rem;
  color: ${props => props.$type === 'warning' ? 'var(--color-b45309, #B45309)' : 'var(--color-b91c1c, #B91C1C)'};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;
  padding: 1.25rem;
  background: var(--color-f8fafc, #F8FAFC);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 0.85rem;
    color: var(--color-64748b, #64748B);
    font-weight: 500;
  }

  .value {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-1e293b, #1E293B);

    &.highlight {
      font-family: monospace;
      font-size: 1.1rem;
      color: var(--accent-gold, #D4AF37);
      background: var(--white, #FFFFFF);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid var(--color-e2e8f0, #E2E8F0);
    }
  }
`;

export const StatusBadge = styled.span<{ $status: 'active' | 'expiring' | 'expired' | 'compliant' | 'pending' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  
  background: ${props => 
    (props.$status === 'active' || props.$status === 'compliant') ? 'var(--color-d1fae5, #D1FAE5)' : 
    (props.$status === 'expiring' || props.$status === 'pending') ? 'var(--color-fef3c7, #FEF3C7)' : 
    'var(--color-fee2e2, #FEE2E2)'};
    
  color: ${props => 
    (props.$status === 'active' || props.$status === 'compliant') ? 'var(--color-065f46, #065F46)' : 
    (props.$status === 'expiring' || props.$status === 'pending') ? 'var(--color-92400e, #92400E)' : 
    'var(--color-991b1b, #991B1B)'};
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  margin-top: 0.5rem;

  ${props => props.$variant === 'primary' ? `
    background: var(--accent-gold, #D4AF37);
    color: var(--white, #FFFFFF);
    border: none;

    &:hover {
      background: var(--color-b8962e, #B8962E);
    }
  ` : `
    background: var(--white, #FFFFFF);
    color: var(--color-1e293b, #1E293B);
    border: 1px solid var(--color-cbd5e1, #CBD5E1);

    &:hover {
      background: var(--color-f8fafc, #F8FAFC);
    }
  `}
`;

export const ActivityList = styled.div`
  margin-top: 1.5rem;

  h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: var(--color-334155, #334155);
  }

  .activity-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid var(--color-e2e8f0, #E2E8F0);
    gap: 12px;

    &:last-child {
      border-bottom: none;
    }

    .icon-box {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--color-f1f5f9, #F1F5F9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-64748b, #64748B);
    }

    .details {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .desc {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-1e293b, #1E293B);
      }

      .date {
        font-size: 0.75rem;
        color: var(--color-94a3b8, #94A3B8);
      }
    }
  }
`;
