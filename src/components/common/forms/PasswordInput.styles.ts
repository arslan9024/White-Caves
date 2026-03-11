import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

export const Label = styled.label<{ required?: boolean }>`
  font-size: ${theme.typography.sizes.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};
  }
`;

export const Required = styled.span`
  color: ${theme.colors.error};
  margin-left: 4px;
`;

export const Wrapper = styled.div<{
  size?: 'sm' | 'md' | 'lg';
  focused?: boolean;
  error?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  transition: ${theme.transitions.all};
  padding: ${props => {
    switch (props.size) {
      case 'sm':
        return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'lg':
        return `${theme.spacing.md} ${theme.spacing.md}`;
      default:
        return `${theme.spacing.sm} ${theme.spacing.sm}`;
    }
  }};

  &[data-theme='dark'] {
    background: ${theme.colors.dark.bgSecondary};
    border-color: ${theme.colors.dark.border};
  }

  ${props => props.focused && `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);

    &[data-theme='dark'] {
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.2);
    }
  `}

  ${props => props.error && `
    border-color: ${theme.colors.error};
    
    &:focus-within {
      box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.1);
    }

    &[data-theme='dark'] {
      &:focus-within {
        box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.2);
      }
    }
  `}

  ${props => props.disabled && `
    background: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border};
    opacity: 0.6;
    cursor: not-allowed;

    &[data-theme='dark'] {
      background: ${theme.colors.dark.bgTertiary};
      opacity: 0.5;
    }
  `}
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  font-family: inherit;
  width: 100%;
  letter-spacing: 0.15em;

  &::placeholder {
    color: ${theme.colors.text.tertiary};
    letter-spacing: 0;
  }

  &:disabled {
    cursor: not-allowed;
    color: ${theme.colors.text.disabled};
  }

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};

    &::placeholder {
      color: ${theme.colors.dark.textSecondary};
    }

    &:disabled {
      color: ${theme.colors.dark.textSecondary};
    }
  }
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: ${theme.colors.text.secondary};
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${theme.transitions.all};
  width: 32px;
  height: 24px;

  &:hover:not(:disabled) {
    color: ${theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-theme='dark'] {
    color: ${theme.colors.dark.textSecondary};

    &:hover:not(:disabled) {
      color: ${theme.colors.primaryLight};
    }
  }
`;

export const StrengthIndicator = styled.div`
  position: absolute;
  bottom: -22px;
  left: 0;
  right: 0;
  height: 4px;
  background: ${theme.colors.background.tertiary};
  border-radius: 2px;
  overflow: hidden;

  &[data-theme='dark'] {
    background: ${theme.colors.dark.bgTertiary};
  }
`;

export const StrengthBar = styled.div<{ strength: number; color: string }>`
  height: 100%;
  width: ${props => props.strength}%;
  background: ${props => props.color};
  transition: ${theme.transitions.all};
`;

export const StrengthText = styled.span<{ strength: number }>`
  font-size: 12px;
  margin-top: 20px;
  padding-left: 4px;
  color: ${props => {
    switch (props.strength) {
      case 100:
        return theme.colors.success;
      case 67:
        return theme.colors.warning;
      case 34:
        return theme.colors.error;
      default:
        return theme.colors.text.tertiary;
    }
  }};
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${props => {
      switch (props.strength) {
        case 100:
          return theme.colors.successLight;
        case 67:
          return theme.colors.warningLight;
        case 34:
          return theme.colors.errorLight;
        default:
          return theme.colors.dark.textSecondary;
      }
    }};
  }
`;

export const HelperText = styled.span<{ error?: boolean }>`
  font-size: 12px;
  color: ${props => props.error ? theme.colors.error : theme.colors.text.tertiary};
  margin-top: 4px;
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${props => props.error ? theme.colors.errorLight : theme.colors.dark.textSecondary};
  }
`;
