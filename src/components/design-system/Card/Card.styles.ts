/**
 * Card Component Styles
 */

import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';
import { CardVariant } from './types';

const getVariantStyles = (variant: CardVariant) => {
  const variants = {
    elevated: css`
      background-color: ${theme.colors.background.secondary};
      border: none;
      box-shadow: ${theme.shadows.md};

      &:hover {
        box-shadow: ${theme.shadows.lg};
      }
    `,
    outlined: css`
      background-color: ${theme.colors.background.secondary};
      border: 1px solid ${theme.colors.border};
      box-shadow: none;

      &:hover {
        border-color: ${theme.colors.primary};
      }
    `,
    filled: css`
      background-color: ${theme.colors.background.tertiary};
      border: none;
      box-shadow: none;
    `,
  };

  return variants[variant] || variants.elevated;
};

export const StyledCard = styled.div<{
  $variant?: CardVariant;
  $isClickable?: boolean;
  $padding?: string;
}>`
  border-radius: ${theme.spacing.xs};
  padding: ${(props) => props.$padding || theme.spacing.lg};
  transition: ${theme.transitions.all};

  ${(props) => getVariantStyles(props.$variant || 'elevated')}

  ${(props) =>
    props.$isClickable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    `}

  @media ${theme.mediaQueries.mobile} {
    padding: ${(props) => props.$padding || theme.spacing.md};
  }
`;

export const CardHeader = styled.div`
  padding-bottom: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
`;

export const CardBody = styled.div`
  flex: 1;
`;

export const CardFooter = styled.div`
  padding-top: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
`;
