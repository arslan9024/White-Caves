/**
 * White Caves Real Estate LLC - Entity & Relationship Management Styles
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Styles)
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const RelationshipContainer = styled.div`
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

export const RelationshipHeader = styled.div`
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

  .chain-switcher {
    display: flex;
    gap: 8px;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
    font-size: 1.35rem;
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

export const NodesFlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
`;
