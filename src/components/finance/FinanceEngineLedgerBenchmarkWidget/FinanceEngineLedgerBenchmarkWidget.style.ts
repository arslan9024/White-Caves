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
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary, #64748B);
  }
`;

export const StatusBanner = styled.div<{ $status: 'idle' | 'running' | 'complete'; $isPass: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 700;
  
  ${props => {
    if (props.$status === 'idle') {
      return `
        background: var(--color-f8fafc, #F8FAFC);
        color: var(--color-475569, #475569);
        border: 1px dashed var(--color-94a3b8, #94A3B8);
      `;
    }
    if (props.$status === 'running') {
      return `
        background: var(--color-eff6ff, #EFF6FF);
        color: var(--color-2563eb, #2563EB);
        border: 1px solid var(--color-bfdbfe, #BFDBFE);
      `;
    }
    return props.$isPass ? `
      background: var(--color-ecfdf5, #ECFDF5);
      color: var(--color-059669, #059669);
      border: 1px solid var(--color-a7f3d0, #A7F3D0);
    ` : `
      background: var(--color-fef2f2, #FEF2F2);
      color: var(--color-dc2626, #DC2626);
      border: 1px solid var(--color-fecaca, #FECACA);
    `;
  }}
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const MetricCard = styled.div<{ $highlight?: boolean; $isPass?: boolean }>`
  background: ${props => props.$highlight ? (props.$isPass ? 'var(--color-ecfdf5, #ECFDF5)' : 'var(--color-fef2f2, #FEF2F2)') : 'var(--color-f8fafc, #F8FAFC)'};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.$highlight ? (props.$isPass ? 'var(--color-a7f3d0, #A7F3D0)' : 'var(--color-fecaca, #FECACA)') : 'var(--color-e2e8f0, #E2E8F0)'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  .label {
    font-size: 0.75rem;
    color: var(--color-64748b, #64748B);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${props => props.$highlight ? (props.$isPass ? 'var(--color-059669, #059669)' : 'var(--color-dc2626, #DC2626)') : 'var(--color-1e293b, #1E293B)'};
  }
`;

export const ActionButton = styled.button<{ $isRunning: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${props => props.$isRunning ? 'not-allowed' : 'pointer'};
  background: var(--accent-red, #EF4444);
  color: var(--white, #FFFFFF);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  opacity: ${props => props.$isRunning ? 0.7 : 1};

  &:hover {
    background: ${props => props.$isRunning ? 'var(--accent-red, #EF4444)' : 'var(--color-dc2626, #DC2626)'};
  }
`;
