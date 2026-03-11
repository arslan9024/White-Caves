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

export const Switch = styled.span<{ checked?: boolean; disabled?: boolean }>`
  display: inline-block;
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.checked ? theme.colors.primary : theme.colors.border};
  transition: ${theme.transitions.all};
  flex-shrink: 0;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: white;
    transition: ${theme.transitions.all};
  }

  ${HiddenCheckbox}:focus ~ & {
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &[data-theme='dark'] {
    background: ${props => props.checked ? theme.colors.primaryLight : theme.colors.dark.border};

    &::before {
      background: ${theme.colors.dark.bg};
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

export const HelperText = styled.span`
  font-size: 12px;
  color: ${theme.colors.text.tertiary};
  margin-top: 4px;
  margin-left: 52px;
  transition: ${theme.transitions.all};

  &[data-theme='dark'] {
    color: ${theme.colors.dark.textSecondary};
  }
`;
