import styled from 'styled-components';
import { transitions } from '../../../../styles/theme/transitions';

export const FilterDropdownContainer = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
  opacity: ${props => props.$disabled ? 0.5 : 1};
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
`;

export const FilterLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 32px 10px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  transition: ${transitions.hover};

  &:hover {
    border-color: var(--primary);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background: #1e1e2e;
    border-color: #333333;
    color: #e2e8f0;

    &:focus {
      border-color: #D4AF37;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
    }
  }
`;

export const DropdownIcon = styled.span`
  position: absolute;
  right: 10px;
  color: var(--text-secondary);
  pointer-events: none;
  display: flex;
  align-items: center;

  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
  }
`;
