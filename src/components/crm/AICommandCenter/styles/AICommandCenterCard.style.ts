// FILE: src/components/crm/AICommandCenter/styles/AICommandCenterCard.style.ts
/**
 * White Caves Real Estate LLC - AI Command Center Card Sub-Styles
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const TagList = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const CapabilityTag = styled.span`
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--bg-secondary, #f1f5f9);
  color: var(--text-secondary, #475569);
  font-size: 0.72rem;
  font-weight: 600;
`;

export const MetricsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
  font-size: 0.76rem;
  font-weight: 700;

  .metric-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    span.label {
      color: var(--text-muted, #94a3b8);
      font-size: 0.68rem;
      text-transform: uppercase;
    }

    strong.val {
      color: #0f172a;
    }
  }
`;

export const LaunchBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(239, 68, 68, 0.4);
  }
`;
