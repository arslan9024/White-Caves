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

export const ArchitectureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ModuleCard = styled.div<{ $color: string }>`
  background: var(--color-f8fafc, #F8FAFC);
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-top: 4px solid ${props => props.$color};
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .icon-wrapper {
    color: ${props => props.$color};
    background: var(--white, #FFFFFF);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 8px;
  }

  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-1e293b, #1E293B);
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-64748b, #64748B);
    line-height: 1.5;
  }
`;

export const EngineStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 1rem;
  background: var(--color-ecfdf5, #ECFDF5);
  border: 1px solid var(--color-a7f3d0, #A7F3D0);
  border-radius: 8px;
  margin-bottom: 1.5rem;

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-10b981, #10B981);
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
    animation: pulse 2s infinite;
  }

  .status-text {
    font-weight: 700;
    color: var(--color-065f46, #065F46);
    flex-grow: 1;
  }

  .sync-text {
    font-size: 0.85rem;
    color: var(--color-047857, #047857);
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
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

export const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  ${props => props.$variant === 'primary' ? `
    background: var(--color-1e293b, #1E293B);
    color: var(--white, #FFFFFF);
    border: none;

    &:hover {
      background: var(--color-0f172a, #0F172A);
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
