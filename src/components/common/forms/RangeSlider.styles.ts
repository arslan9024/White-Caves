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

export const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  width: 100%;
`;

export const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${theme.colors.border};
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Thumb styles for Webkit browsers */
  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: none;
    transition: ${theme.transitions.all};

    &:hover {
      background: ${theme.colors.primaryDark};
    }

    &:active {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Thumb styles for Firefox */
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border: none;
    transition: ${theme.transitions.all};

    &:hover {
      background: ${theme.colors.primaryDark};
    }

    &:active {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Track background gradient */
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: ${theme.colors.border};
  }

  &::-moz-range-track {
    background: ${theme.colors.border};
    border-radius: 3px;
    border: none;
  }

  &[data-theme='dark'] {
    background: ${theme.colors.dark.border};

    &::-webkit-slider-thumb {
      background: ${theme.colors.primaryLight};

      &:hover {
        background: ${theme.colors.primary};
      }
    }

    &::-moz-range-thumb {
      background: ${theme.colors.primaryLight};

      &:hover {
        background: ${theme.colors.primary};
      }
    }

    &::-webkit-slider-runnable-track {
      background: ${theme.colors.dark.border};
    }

    &::-moz-range-track {
      background: ${theme.colors.dark.border};
    }
  }
`;

export const ValueDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};

  &[data-theme='dark'] {
    color: ${theme.colors.dark.text};
  }
`;

export const CurrentValue = styled.span`
  font-weight: 600;
  color: ${theme.colors.primary};

  &[data-theme='dark'] {
    color: ${theme.colors.primaryLight};
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
