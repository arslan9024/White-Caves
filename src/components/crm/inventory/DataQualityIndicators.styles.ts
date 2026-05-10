import styled from 'styled-components';
import { transitions } from '../../../styles/theme/transitions';
import { typography } from '../../../styles/theme/typography';
import { radius } from '../../../styles/theme/radius';
import { spacing } from '../../../styles/theme/spacing';

export const DataQualityIndicatorsContainer = styled.div`
  background: var(--bg-card);
  border-radius: ${radius.xl};
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
`;

export const IndicatorsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: var(--text-primary);

  h3 {
    font-size: ${typography.sizes.md};
    font-weight: ${typography.weights.semibold};
    margin: 0;
  }

  svg {
    color: #f59e0b;
  }
`;

export const IndicatorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${spacing.md};
`;

export const IndicatorCard = styled.button<{ $accentColor?: string }>`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: ${transitions.hover};
  text-align: left;
  --accent-color: ${props => props.$accentColor || '#E31E24'};

  &:hover {
    border-color: var(--accent-color);
    background: color-mix(in srgb, var(--accent-color) 10%, var(--bg-secondary));
    transform: translateY(-2px);
  }
`;

export const IndicatorIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${radius.xl};
  background: color-mix(in srgb, var(--accent-color) 15%, transparent);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const IndicatorValue = styled.span`
  font-size: ${typography.sizes.xxl};
  font-weight: ${typography.weights.bold};
  color: var(--accent-color);
  line-height: 1;
`;

export const IndicatorLabel = styled.span`
  font-size: ${typography.sizes.sm};
  font-weight: ${typography.weights.semibold};
  color: var(--text-primary);
`;

export const IndicatorDesc = styled.span`
  font-size: 11px;
  color: var(--text-secondary);
`;
