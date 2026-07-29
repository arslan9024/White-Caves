import React from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const Wrapper = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.$disabled ? 0.5 : 1)};
  user-select: none;
`;

const SwitchTrack = styled.div<{ $checked: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  background: ${props => (props.$checked ? RED : '#CBD5E1')};
  position: relative;
  transition: background 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SwitchThumb = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FFFFFF;
  position: absolute;
  top: 3px;
  left: ${props => (props.$checked ? '23px' : '3px')};
  transition: left 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Label = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${SLATE};
`;

export const CavesToggle: React.FC<CavesToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <Wrapper $disabled={disabled}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => !disabled && onChange(e.target.checked)}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <SwitchTrack $checked={checked}>
        <SwitchThumb $checked={checked} />
      </SwitchTrack>
      {label && <Label>{label}</Label>}
    </Wrapper>
  );
};

export default CavesToggle;
