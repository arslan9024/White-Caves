import styled, { keyframes } from 'styled-components';

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
  align-items: center;

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

export const RunButton = styled.button<{ $isRunning: boolean }>`
  background: ${props => props.$isRunning ? 'var(--color-94a3b8, #94A3B8)' : 'var(--color-3b82f6, #3B82F6)'};
  color: var(--white, #FFFFFF);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${props => props.$isRunning ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isRunning ? 'var(--color-94a3b8, #94A3B8)' : 'var(--color-2563eb, #2563EB)'};
  }
`;

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 2rem;
`;

export const StepItem = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--color-f8fafc, #F8FAFC);
  border: 1px solid var(--color-e2e8f0, #E2E8F0);
  border-radius: 8px;
  border-left: 4px solid ${props => {
    switch (props.$status) {
      case 'passed': return 'var(--color-10b981, #10B981)';
      case 'failed': return 'var(--accent-red, #EF4444)';
      case 'running': return 'var(--color-3b82f6, #3B82F6)';
      default: return 'var(--color-cbd5e1, #CBD5E1)';
    }
  }};

  .name {
    font-weight: 600;
    color: var(--color-334155, #334155);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status {
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${props => {
      switch (props.$status) {
        case 'passed': return 'var(--color-15803d, #15803D)';
        case 'failed': return 'var(--color-b91c1c, #B91C1C)';
        case 'running': return 'var(--color-1d4ed8, #1D4ED8)';
        default: return 'var(--color-64748b, #64748B)';
      }
    }};

    ${props => props.$status === 'running' && `
      animation: ${pulse} 1.5s infinite ease-in-out;
    `}
  }
`;

export const LogsContainer = styled.div`
  background: var(--color-1e293b, #1E293B);
  border-radius: 8px;
  padding: 16px;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: var(--color-a7f3d0, #A7F3D0);
  height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: var(--color-0f172a, #0F172A);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-475569, #475569);
    border-radius: 4px;
  }
`;

export const LogLine = styled.div`
  line-height: 1.4;
`;
