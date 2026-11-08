// FILE: src/components/crm/DealManager/DealManager.styles.ts
/**
 * White Caves Real Estate LLC - Deal Management Styles (Tier 3)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const DealContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 24px 32px;
  background-color: transparent;
  color: #f1f5f9;

  [data-theme='light'] & {
    color: #0f172a;
  }
`;

export const DealHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  .title-group {
    h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px 0;
      display: flex;
      align-items: center;
      gap: 10px;

      [data-theme='light'] & {
        color: #0f172a;
      }
    }
    p {
      font-size: 0.85rem;
      color: #94a3b8;
      margin: 0;

      [data-theme='light'] & {
        color: #64748b;
      }
    }
  }

  .actions {
    display: flex;
    gap: 12px;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const MetricCard = styled.div<{ $accentColor: string }>`
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 4px solid ${props => props.$accentColor};
  border-radius: 10px;
  padding: 16px 20px;
  backdrop-filter: blur(8px);

  [data-theme='light'] & {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 4px solid ${props => props.$accentColor};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 6px;

    [data-theme='light'] & {
      color: #64748b;
    }
  }

  .value {
    font-size: 1.4rem;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: baseline;
    gap: 6px;

    [data-theme='light'] & {
      color: #0f172a;
    }

    .sub {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;

      [data-theme='light'] & {
        color: #94a3b8;
      }
    }
  }
`;

export const DealFilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;

  [data-theme='light'] & {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  }

  .search-input {
    flex: 1;
    min-width: 240px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 6px 12px;

    [data-theme='light'] & {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
    }

    input {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 0.85rem;
      width: 100%;
      outline: none;

      [data-theme='light'] & {
        color: #0f172a;
      }

      &::placeholder {
        color: #64748b;
      }
    }
  }

  .filter-group {
    display: flex;
    gap: 8px;
  }
`;

export const DealsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;
