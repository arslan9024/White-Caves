// @ts-nocheck
/**
 * Checkbox Component
 * Form input for boolean selection
 */

import React, { forwardRef, memo } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledCheckbox = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid ${theme.colors.border};
  border-radius: 4px;
  background-color: ${theme.colors.background.secondary};
  transition: ${theme.transitions.all};
  cursor: pointer;
  flex-shrink: 0;

  ${HiddenCheckbox}:hover:not(:disabled) ~ & {
    border-color: ${theme.colors.primary};
  }

  ${HiddenCheckbox}:checked ~ & {
    background-color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};

    &::after {
      content: '✓';
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  }

  ${HiddenCheckbox}:disabled ~ & {
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

export const Checkbox = memo(forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, error, className = '', ...rest }, ref) {
    return (
      <div className={className}>
        <Label>
          <HiddenCheckbox ref={ref} type="checkbox" {...rest} />
          <StyledCheckbox />
          {label && <span>{label}</span>}
        </Label>
        {error && <div style={{ color: theme.colors.error, fontSize: '12px', marginTop: '4px' }}>{error}</div>}
      </div>
    );
  }
));

Checkbox.displayName = 'Checkbox';

export default Checkbox;

