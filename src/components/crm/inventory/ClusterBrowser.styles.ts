import styled from 'styled-components';
import { colors } from '../../../styles/theme/colors';
import { typography } from '../../../styles/theme/typography';
import { transitions } from '../../../styles/theme/transitions';
import { radius } from '../../../styles/theme/radius';
import { spacing } from '../../../styles/theme/spacing';

export const ClusterBrowserContainer = styled.div`
  background: var(--bg-card);
  border-radius: ${radius.xl};
  padding: ${spacing.md};
  margin-bottom: 20px;
  border: 1px solid var(--border-color);

  @media (prefers-color-scheme: dark) {
    background: #1a1a2e;
    border-color: #333333;
  }
`;

export const ClusterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: var(--text-primary);

  svg {
    flex-shrink: 0;
  }
`;

export const ClusterTitle = styled.h3`
  font-size: ${typography.sizes.base};
  font-weight: ${typography.weights.semibold};
  margin: 0;
  flex: 1;
  color: var(--text-primary);
`;

export const ClusterCount = styled.span`
  font-size: ${typography.sizes.xs};
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 4px 10px;
  border-radius: ${radius.xl};
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    background: #333333;
    color: #a0aec0;
  }
`;

export const ClusterGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.sm};
`;

export const ClusterChip = styled.button<{ $active?: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: ${typography.sizes.xs};
  font-weight: ${typography.weights.medium};
  background: ${props => props.$active ? 'var(--primary)' : 'var(--bg-secondary)'};
  border: 1px solid ${props => props.$active ? 'var(--primary)' : 'var(--border-color)'};
  color: ${props => props.$active ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  transition: ${transitions.hover};

  &:hover {
    border-color: var(--primary);
    background: ${props => props.$active ? 'var(--primary)' : 'rgba(212, 175, 55, 0.05)'};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (prefers-color-scheme: dark) {
    background: ${props => props.$active ? colors.primary : '#333333'};
    border-color: ${props => props.$active ? colors.primary : '#444444'};
    color: ${props => props.$active ? 'white' : '#e2e8f0'};

    &:hover {
      background: ${props => props.$active ? colors.primaryDark : 'rgba(212, 175, 55, 0.15)'};
    }
  }
`;