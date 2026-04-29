/**
 * Switch Component
 * Toggle between two states
 */

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
};

const HiddenSwitch = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: { width: '40px', height: '24px', toggleSize: '18px' },
    md: { width: '52px', height: '28px', toggleSize: '22px' },
    lg: { width: '64px', height: '32px', toggleSize: '26px' },
  };
  return sizes[size] || sizes.md;
};

const SwitchTrack = styled.span<{ $size?: 'sm' | 'md' | 'lg' }>`
  display: inline-block;
  width: ${(props) => getSizeStyles(props.$size || 'md').width};
  height: ${(props) => getSizeStyles(props.$size || 'md').height};
  background-color: ${theme.colors.border};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: ${theme.transitions.all};

  &::after {
    content: '';
    position: absolute;
    width: ${(props) => getSizeStyles(props.$size || 'md').toggleSize};
    height: ${(props) => getSizeStyles(props.$size || 'md').toggleSize};
    background-color: white;
    border-radius: 50%;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
    transition: ${theme.transitions.all};
    box-shadow: ${theme.shadows.sm};
  }

  ${HiddenSwitch}:checked ~ & {
    background-color: ${theme.colors.primary};

    &::after {
      left: calc(100% - ${(props) => getSizeStyles(props.$size || 'md').toggleSize} - 2px);
    }
  }

  ${HiddenSwitch}:disabled ~ & {
    background-color: ${theme.colors.border};
    cursor: not-allowed;
  }
`;

const SwitchLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
`;

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, size = 'md', className = '', ...rest }, ref) => {
    const switchSize = size as 'sm' | 'md' | 'lg' | undefined;

    return (
      <SwitchLabel className={className}>
        <HiddenSwitch ref={ref} type="checkbox" {...rest} />
        <SwitchTrack $size={switchSize} />
        {label && <span>{label}</span>}
      </SwitchLabel>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
