import styled from 'styled-components';
import { transitions } from '../../../../styles/theme/transitions';
import { typography } from '../../../../styles/theme/typography';
import { radius } from '../../../../styles/theme/radius';

export const FilterPanelContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: ${radius.xl};
  padding: 20px;
  margin-bottom: 20px;
`;

export const FilterPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
`;

export const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${typography.sizes.md};
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const ActiveCount = styled.span`
  background: var(--primary);
  color: white;
  font-size: 11px;
  font-weight: ${typography.weights.semibold};
  padding: 2px 8px;
  border-radius: 10px;
`;

export const ClearFiltersBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: ${radius.md};
  color: var(--text-secondary);
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.medium};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    background: rgba(212, 175, 55, 0.08);
    border-color: var(--primary);
    color: var(--primary);
  }
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;