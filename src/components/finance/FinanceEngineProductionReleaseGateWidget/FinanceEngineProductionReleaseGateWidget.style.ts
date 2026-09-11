import styled from 'styled-components';

export const WidgetContainer = styled.div<{ $isRtl: boolean; $isSigned: boolean }>`
  background: var(--white, #FFFFFF);
  border-radius: 12px;
  border: 2px solid ${props => props.$isSigned ? 'var(--color-10b981, #10B981)' : 'var(--text-secondary, #E2E8F0)'};
  padding: 1.5rem;
  font-family: ${props => props.$isRtl ? "'Tajawal', sans-serif" : "'Inter', sans-serif"};
  direction: ${props => props.$isRtl ? 'rtl' : 'ltr'};
  text-align: ${props => props.$isRtl ? 'right' : 'left'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  ${props => props.$isSigned && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(16, 185, 129, 0.02);
      pointer-events: none;
    }
  `}
`;

export const WidgetHeader = styled.div`
  margin-bottom: 2rem;
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

export const StatusBanner = styled.div<{ $isSigned: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 1rem;
  background: ${props => props.$isSigned ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-f8fafc, #F8FAFC)'};
  border: 1px dashed ${props => props.$isSigned ? 'var(--color-10b981, #10B981)' : 'var(--color-94a3b8, #94A3B8)'};
  border-radius: 8px;
  margin-bottom: 2rem;

  .icon {
    color: ${props => props.$isSigned ? 'var(--color-10b981, #10B981)' : 'var(--color-64748b, #64748B)'};
  }

  .text {
    font-size: 1.1rem;
    font-weight: 800;
    color: ${props => props.$isSigned ? 'var(--color-065f46, #065F46)' : 'var(--color-334155, #334155)'};
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const RequirementsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RequirementItem = styled.div<{ $passed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${props => props.$passed ? 'var(--white, #FFFFFF)' : 'var(--color-f1f5f9, #F1F5F9)'};
  border: 1px solid ${props => props.$passed ? 'var(--color-a7f3d0, #A7F3D0)' : 'var(--color-e2e8f0, #E2E8F0)'};
  border-radius: 6px;

  .icon {
    color: ${props => props.$passed ? 'var(--color-10b981, #10B981)' : 'var(--color-94a3b8, #94A3B8)'};
  }

  .label {
    font-size: 0.9rem;
    font-weight: 500;
    color: ${props => props.$passed ? 'var(--color-1e293b, #1E293B)' : 'var(--color-64748b, #64748B)'};
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' | 'disabled' }>`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: ${props => props.$variant === 'disabled' ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  opacity: ${props => props.$variant === 'disabled' ? 0.6 : 1};

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: var(--accent-gold, #D4AF37);
          color: var(--white, #FFFFFF);
          border: none;
          &:hover { background: var(--color-b8962e, #B8962E); }
        `;
      case 'secondary':
        return `
          background: var(--white, #FFFFFF);
          color: var(--color-1e293b, #1E293B);
          border: 1px solid var(--color-cbd5e1, #CBD5E1);
          &:hover { background: var(--color-f8fafc, #F8FAFC); }
        `;
      case 'disabled':
        return `
          background: var(--color-e2e8f0, #E2E8F0);
          color: var(--color-94a3b8, #94A3B8);
          border: none;
        `;
    }
  }}
`;
