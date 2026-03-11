import styled from 'styled-components';
import { theme } from '../../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const CheckboxBox = styled.span<{ checked?: boolean; disabled?: boolean; error?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => {
    if (props.error) return theme.colors.error;
    return theme.colors.border;
  }};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.background.secondary};
  transition: ${theme.transitions.all};
  flex-shrink: 0;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  ${HiddenCheckbox}:checked ~ & {
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};

    &::after {
      content: '✓';
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: ${theme.colors.background.secondary};
      font-size: 12px;
      font-weight: bold;
    }
  }

  ${HiddenCheckbox}:focus ~ & {
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &[data-theme='dark'] {
    background: ${theme.colors.dark.bgSecondary};
    border-color: ${props => {
      if (props.error) return theme.colors.errorLight;
      return theme.colors.dark.border;
    }};

    ${HiddenCheckbox}:checked ~ & {
      background: ${theme.colors.primaryLight};
      border-color: ${theme.colors.primaryLight};

      &::after {
        color: ${theme.colors.dark.bg};
      }
    }

    ${HiddenCheckbox}:focus ~ & {
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.2);
    }
  }
`;

export const Label = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  transition: ${theme.transitions.all};
  user-select: none;

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};
  }
`;

export const HelperText = styled.span<{ error?: boolean }>`
  font-size: 12px;
  color: ${props => props.error ? theme.colors.error : theme.colors.text.tertiary};
  margin-top: 4px;
  margin-left: 28px;
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${props => props.error ? theme.colors.errorLight : theme.colors.dark.textSecondary};
  }
`;

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
`;
