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
  focused?: boolean;
  error?: boolean;
  disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  transition: ${theme.transitions.all};
  padding: ${theme.spacing.sm};
  min-height: 40px;

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

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${theme.colors.primary};
  color: white;
  padding: 4px 8px;
  border-radius: ${theme.radius.sm};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;

  &[data-theme='dark'] {
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.dark.bg};
  }
`;

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: ${theme.transitions.all};
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  font-family: inherit;
  min-width: 100px;

  &::placeholder {
    color: ${theme.colors.text.tertiary};
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

export const HelperText = styled.span<{ error?: boolean }>`
  font-size: 12px;
  color: ${props => props.error ? theme.colors.error : theme.colors.text.tertiary};
  margin-top: 4px;
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${props => props.error ? theme.colors.errorLight : theme.colors.dark.textSecondary};
  }
`;
