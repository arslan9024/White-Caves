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

export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--color-f8fafc, #F8FAFC);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    font-size: 0.8rem;
    color: var(--color-64748b, #64748B);
    font-weight: 500;
  }

  .value {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-1e293b, #1E293B);

    &.mono {
      font-family: monospace;
      color: var(--accent-gold, #D4AF37);
      font-size: 1.1rem;
    }
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const StatusCard = styled.div`
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--white, #FFFFFF);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;

  .days-left {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1;
    color: var(--color-dc2626, #DC2626);
  }

  .days-label {
    font-size: 0.85rem;
    color: var(--color-64748b, #64748B);
    text-transform: uppercase;
    font-weight: 700;
  }
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
    color: var(--color-1e293b, #1E293B);
    border: 1px solid var(--color-cbd5e1, #CBD5E1);

    &:hover {
      background: var(--color-f8fafc, #F8FAFC);
    }
  `}
`;

export const Checklist = styled.div`
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;
  padding: 1.25rem;
  background: var(--white, #FFFFFF);

  h4 {
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
    color: var(--color-1e293b, #1E293B);
  }

  .check-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    font-size: 0.85rem;
    color: var(--color-475569, #475569);
    border-bottom: 1px solid var(--color-f1f5f9, #F1F5F9);

    &:last-child {
      border-bottom: none;
    }

    svg {
      flex-shrink: 0;
    }

    &.ready {
      color: var(--color-065f46, #065F46);
    }

    &.missing {
      color: var(--color-b91c1c, #B91C1C);
    }
  }
`;
