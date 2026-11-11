import styled, { css } from 'styled-components';

export const RadarContainer = styled.div`
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

export const RadarHeader = styled.div`
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

  .title-area {
    display: flex;
    align-items: center;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }

    .statutory-tag {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #ef4444;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const MetricDeck = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
`;

export const MetricTile = styled.div<{ $color: string }>`
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid ${({ $color }) => $color};
  padding: 12px 14px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  [data-theme='light'] & {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid ${({ $color }) => $color};
  }

  .label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .num {
    font-size: 1.2rem;
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

export const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .search-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 6px 10px;
    flex: 1;
    min-width: 220px;
    max-width: 400px;

    [data-theme='light'] & {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
    }

    input {
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 0.75rem;
      width: 100%;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }
  }

  .filter-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
`;

export const FilterPill = styled.button<{ $isActive: boolean }>`
  background: ${({ $isActive }) => ($isActive ? '#ef4444' : '#1e293b')};
  color: #ffffff;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.1)')};
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  [data-theme='light'] & {
    background: ${({ $isActive }) => ($isActive ? '#ef4444' : '#f1f5f9')};
    color: ${({ $isActive }) => ($isActive ? '#ffffff' : '#475569')};
    border-color: ${({ $isActive }) => ($isActive ? '#ef4444' : '#cbd5e1')};
  }
`;

export const PermitTableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;

  [data-theme='light'] & {
    border: 1px solid #e2e8f0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    text-align: left;

    th {
      background: #0f172a;
      padding: 10px 12px;
      font-weight: 800;
      color: #94a3b8;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);

      [data-theme='light'] & {
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        color: #475569;
      }
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: #f1f5f9;

      [data-theme='light'] & {
        border-bottom: 1px solid #f1f5f9;
        color: #1e293b;
      }
    }
  }
`;

export const RiskBadge = styled.span<{ $risk: string }>`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  ${({ $risk }) =>
    $risk === 'critical'
      ? css`
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          color: #ef4444;
        `
      : $risk === 'warning'
      ? css`
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid #f59e0b;
          color: #f59e0b;
        `
      : css`
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid #10b981;
          color: #10b981;
        `}
`;
