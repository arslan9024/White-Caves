/**
 * Radio Component
 * Form input for single selection from group
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledRadio = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${theme.colors.border};
  border-radius: 50%;
  background-color: ${theme.colors.background.secondary};
  transition: ${theme.transitions.all};
  cursor: pointer;
  flex-shrink: 0;

  ${HiddenRadio}:hover:not(:disabled) ~ & {
    border-color: ${theme.colors.primary};
  }

  ${HiddenRadio}:checked ~ & {
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.background.secondary};

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${theme.colors.primary};
    }
  }

  ${HiddenRadio}:disabled ~ & {
    background-color: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border};
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
`;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className={className}>
        <Label>
          <HiddenRadio ref={ref} type="radio" {...rest} />
          <StyledRadio />
          {label && <span>{label}</span>}
        </Label>
        {error && <div style={{ color: theme.colors.error, fontSize: '12px', marginTop: '4px' }}>{error}</div>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
