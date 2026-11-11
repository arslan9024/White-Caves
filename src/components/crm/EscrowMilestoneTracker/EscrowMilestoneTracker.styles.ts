import styled, { css } from 'styled-components';

export const EscrowTrackerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #090e17;
  color: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-family: inherit;

  [data-theme='light'] & {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

export const EscrowHeaderDeck = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  [data-theme='light'] & {
    border-bottom: 1px solid #e2e8f0;
  }

  .title-group {
    display: flex;
    flex-direction: column;
    gap: 3px;

    h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .subtitle {
      font-size: 0.75rem;
      color: #94a3b8;
    }
  }

  .badges-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const EscrowKpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

export const KpiCard = styled.div<{ $accentColor?: string }>`
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid ${({ $accentColor }) => $accentColor || '#ef4444'};
  padding: 12px 14px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  [data-theme='light'] & {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid ${({ $accentColor }) => $accentColor || '#ef4444'};
  }

  .label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
  }

  .value {
    font-size: 1.15rem;
    font-weight: 800;
    color: #ffffff;

    [data-theme='light'] & {
      color: #0f172a;
    }
  }

  .sub {
    font-size: 0.65rem;
    color: #64748b;
  }
`;

export const StepperTrack = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 16px 0;
  padding: 0 10px;

  &::before {
    content: '';
    position: absolute;
    top: 18px;
    left: 24px;
    right: 24px;
    height: 3px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;

    [data-theme='light'] & {
      background: #e2e8f0;
    }
  }
`;

export const StepNode = styled.button<{ $status: string; $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 2;
  padding: 0;

  .node-icon-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.8rem;
    transition: all 0.2s ease;

    ${({ $status }) =>
      $status === 'cleared'
        ? css`
            background: #10b981;
            color: #ffffff;
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
          `
        : $status === 'under_audit'
        ? css`
            background: #f59e0b;
            color: #ffffff;
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
          `
        : $status === 'in_progress'
        ? css`
            background: #3b82f6;
            color: #ffffff;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
          `
        : css`
            background: #1e293b;
            color: #94a3b8;
            border: 2px solid rgba(255, 255, 255, 0.1);

            [data-theme='light'] & {
              background: #f1f5f9;
              border-color: #cbd5e1;
            }
          `}

    ${({ $isSelected }) =>
      $isSelected &&
      css`
        outline: 3px solid #ef4444;
        outline-offset: 2px;
      `}
  }

  .node-label {
    font-size: 0.68rem;
    font-weight: 700;
    max-width: 90px;
    text-align: center;
    color: ${({ $isSelected }) => ($isSelected ? '#ef4444' : '#94a3b8')};
  }

  .node-pct {
    font-size: 0.62rem;
    font-family: monospace;
    color: #64748b;
  }
`;

export const MilestoneDetailCard = styled.div`
  background: #0d1527;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  [data-theme='light'] & {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;

    .code-title {
      font-size: 0.88rem;
      font-weight: 800;
      color: #ffffff;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }
  }

  .progress-bar-container {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .bar-bg {
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;

      [data-theme='light'] & {
        background: #e2e8f0;
      }
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #10b981);
      transition: width 0.3s ease;
    }
  }

  .actions-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 6px;
  }
`;
