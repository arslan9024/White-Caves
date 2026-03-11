import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary, #111827);
`;

export const Required = styled.span`
  color: #DC2626;
  margin-left: 2px;
`;

export const Wrapper = styled.div<{
  size?: string;
  focused?: boolean;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  iconLeft?: boolean;
  iconRight?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-surface, #F9FAFB);
  border: 1px solid var(--color-border, #E5E7EB);
  border-radius: var(--radius-sm, 6px);
  transition: all 0.2s ease;

  ${props => {
    switch (props.size) {
      case 'sm':
        return 'height: 32px;';
      case 'lg':
        return 'height: 48px;';
      default:
        return 'height: 40px;';
    }
  }}

  ${props => props.focused && `
    border-color: #DC2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  `}

  ${props => props.error && `
    border-color: #EF4444;

    ${props.focused && `
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    `}
  `}

  ${props => props.success && `
    border-color: #10B981;

    ${props.focused && `
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    `}
  `}

  ${props => props.disabled && `
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-border-light, #F3F4F6);
  `}

  ${props => props.iconLeft && `
    padding-left: 0;
  `}

  ${props => props.iconRight && `
    padding-right: 0;
  `}
`;

export const Input = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 14px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text-primary, #111827);
  font-family: inherit;

  &::placeholder {
    color: var(--color-text-muted, #9CA3AF);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export const InputLarge = styled(Input)`
  font-size: 16px;
`;

export const Icon = styled.span<{ position?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted, #9CA3AF);
  pointer-events: none;
  padding: 0 12px;

  svg {
    width: 18px;
    height: 18px;
  }

  ${props => {
    if (props.position === 'right') return 'right: 0;';
    return 'left: 0;';
  }}
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
`;

export const Action = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: none;
  border: none;
  color: var(--color-text-muted, #9CA3AF);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--color-surface-hover, #F3F4F6);
    color: var(--color-text-secondary, #6B7280);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const StatusIcon = styled.span<{ type?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.type) {
      case 'error':
        return '#EF4444';
      case 'success':
        return '#10B981';
      default:
        return 'inherit';
    }
  }};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 18px;
  padding: 0 2px;
`;

export const HelperText = styled.span<{ type?: string }>`
  font-size: 12px;
  color: ${props => {
    switch (props.type) {
      case 'error':
        return '#EF4444';
      case 'success':
        return '#10B981';
      default:
        return 'var(--color-text-secondary, #6B7280)';
    }
  }};
  margin-top: 4px;
`;

export const CharCount = styled.span`
  font-size: 12px;
  color: var(--color-text-muted, #9CA3AF);
`;

// Textarea variant
export const TextareaInput = styled(Input).attrs({ as: 'textarea' })`
  resize: vertical;
  min-height: 100px;
  padding: 12px 14px;
  font-family: inherit;
  line-height: 1.5;
`;

// Select variant
export const SelectInput = styled(Input).attrs({ as: 'select' })`
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px;
  padding-right: 36px;
  cursor: pointer;

  &::-ms-expand {
    display: none;
  }

  option {
    color: var(--color-text-primary, #111827);
    background: white;
  }
`;

// Validation states
export const ValidInput = styled(Input)`
  border-color: #10B981;

  &:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

export const ErrorInput = styled(Input)`
  border-color: #EF4444;

  &:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

// Responsive styles
export const ResponsiveInput = styled(Input)`
  @media (max-width: 640px) {
    font-size: 16px; // Prevents zoom on iOS
  }
`;
