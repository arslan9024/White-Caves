import React from 'react';
import styled from 'styled-components';

const RED = '#EF4444';
const SLATE = '#1E293B';

export interface CavesSliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
}

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  color: ${SLATE};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ValueDisplay = styled.span`
  font-size: 0.95rem;
  font-weight: 900;
  color: ${RED};
`;

const StyledInput = styled.input`
  width: 100%;
  accent-color: ${RED};
  cursor: pointer;
  height: 6px;
  border-radius: 3px;
  background: #E2E8F0;

  &:focus {
    outline: none;
  }
`;

export const CavesSlider: React.FC<CavesSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
}) => {
  const displayVal = formatValue ? formatValue(value) : value.toLocaleString();

  return (
    <SliderContainer>
      {(label || formatValue) && (
        <Header>
          {label && <Label>{label}</Label>}
          <ValueDisplay>{displayVal}</ValueDisplay>
        </Header>
      )}
      <StyledInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </SliderContainer>
  );
};

export default CavesSlider;
