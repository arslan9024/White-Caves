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

export const InfoCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InfoCard = styled.div`
  background: var(--color-f8fafc, #F8FAFC);
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-64748b, #64748B);
    text-transform: uppercase;
  }

  .value {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--color-1e293b, #1E293B);

    &.mono {
      font-family: monospace;
      color: var(--accent-gold, #D4AF37);
    }
  }
`;

export const WorkflowContainer = styled.div`
  background: var(--white, #FFFFFF);
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StepItem = styled.div<{ $status: 'completed' | 'pending' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.$status === 'completed' ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-f1f5f9, #F1F5F9)'};
  border-radius: 8px;
  border: 1px solid ${props => props.$status === 'completed' ? 'var(--color-a7f3d0, #A7F3D0)' : 'var(--color-e2e8f0, #E2E8F0)'};

  .icon-wrapper {
    color: ${props => props.$status === 'completed' ? 'var(--color-10b981, #10B981)' : 'var(--color-94a3b8, #94A3B8)'};
  }

  .step-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${props => props.$status === 'completed' ? 'var(--color-065f46, #065F46)' : 'var(--color-475569, #475569)'};
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  flex: 1;
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
