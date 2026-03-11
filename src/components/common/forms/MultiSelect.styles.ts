import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
  position: relative;
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
  isOpen?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  border-bottom-left-radius: ${props => props.isOpen ? '0' : theme.radius.md};
  border-bottom-right-radius: ${props => props.isOpen ? '0' : theme.radius.md};
  transition: ${theme.transitions.all};
  padding: ${theme.spacing.sm};
  min-height: 40px;
  cursor: pointer;

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
    pointer-events: none;

    &[data-theme='dark'] {
      background: ${theme.colors.dark.bgTertiary};
      opacity: 0.5;
    }
  `}
`;

export const SelectedItem = styled.span`
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

export const RemoveButton = styled.button`
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

export const Placeholder = styled.span`
  color: ${theme.colors.text.tertiary};
  font-size: ${theme.typography.sizes.sm};
  flex: 1;

  &[data-theme='dark'] {
    color: ${theme.colors.dark.textSecondary};
  }
`;

export const ChevronIcon = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: 16px;
  margin-left: auto;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &[data-theme='dark'] {
    color: ${theme.colors.dark.textSecondary};
  }
`;

export const DropdownList = styled.ul<{ isOpen?: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${theme.colors.background.secondary};
  border: 2px solid ${theme.colors.border};
  border-top: none;
  border-bottom-left-radius: ${theme.radius.md};
  border-bottom-right-radius: ${theme.radius.md};
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &[data-theme='dark'] {
    background: ${theme.colors.dark.bgSecondary};
    border-color: ${theme.colors.dark.border};
  }
`;

export const DropdownItem = styled.li<{ isSelected?: boolean; isDisabled?: boolean }>`
  padding: ${theme.spacing.sm};
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  background: ${props => props.isSelected ? theme.colors.primaryVeryLight : 'transparent'};
  color: ${props => props.isDisabled ? theme.colors.text.disabled : theme.colors.text.primary};
  transition: ${theme.transitions.all};
  font-size: ${theme.typography.sizes.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  opacity: ${props => props.isDisabled ? 0.6 : 1};

  &:hover:not(:disabled) {
    background: ${theme.colors.background.tertiary};
  }

  &[data-theme='dark'] {
    background: ${props => props.isSelected ? 'rgba(211, 47, 47, 0.1)' : 'transparent'};
    color: ${props => props.isDisabled ? theme.colors.dark.textSecondary : theme.colors.dark.text};

    &:hover:not(:disabled) {
      background: ${theme.colors.dark.bgTertiary};
    }
  }
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${theme.colors.primary};

  &:disabled {
    cursor: not-allowed;
  }

  &[data-theme='dark'] {
    accent-color: ${theme.colors.primaryLight};
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
