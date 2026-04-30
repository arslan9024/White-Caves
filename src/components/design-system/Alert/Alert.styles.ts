// @ts-nocheck
/**
 * Alert Component Styles
 */

import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';
import { AlertVariant } from './types';

const getVariantStyles = (variant: AlertVariant) => {
  const variants = {
    success: css`
      background-color: rgba(56, 142, 60, 0.08);
      border-color: ${theme.colors.success};
      color: ${theme.colors.text.primary};

      .alert-icon {
        color: ${theme.colors.success};
      }
    `,
    warning: css`
      background-color: rgba(245, 127, 23, 0.08);
      border-color: ${theme.colors.warning};
      color: ${theme.colors.text.primary};

      .alert-icon {
        color: ${theme.colors.warning};
      }
    `,
    error: css`
      background-color: rgba(198, 40, 40, 0.08);
      border-color: ${theme.colors.error};
      color: ${theme.colors.text.primary};

      .alert-icon {
        color: ${theme.colors.error};
      }
    `,
    info: css`
      background-color: rgba(2, 136, 209, 0.08);
      border-color: ${theme.colors.info};
      color: ${theme.colors.text.primary};

      .alert-icon {
        color: ${theme.colors.info};
      }
    `,
  };

  return variants[variant] || variants.info;
};

export const StyledAlert = styled.div<{ $variant?: AlertVariant }>`
  display: flex;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  border-radius: ${theme.spacing.xs};
  border: 1px solid;
  ${(props) => getVariantStyles(props.$variant || 'info')}
  
  @media ${theme.mediaQueries.mobile} {
    padding: ${theme.spacing.sm};
  }
`;

export const AlertIcon = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const AlertContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const AlertTitle = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  font-size: ${theme.typography.sizes.sm};
`;

export const AlertMessage = styled.div`
  font-size: ${theme.typography.sizes.sm};
  line-height: ${theme.typography.lineHeights.normal};
`;

export const AlertActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-shrink: 0;
`;

export const AlertCloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

