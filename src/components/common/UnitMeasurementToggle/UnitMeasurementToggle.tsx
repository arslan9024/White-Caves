/**
 * UnitMeasurementToggle — Wave 57 FE-GOAL-017
 * Imperial vs Metric unit measurement toggle (SqFt <-> SqM) with smooth transition
 * White Caves Real Estate LLC — Spatial & International Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(100, 116, 139, 0.25);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
  font-family: 'Inter', sans-serif;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: 999px;
  border: none;
  background: ${p => p.$active ? '#EF4444' : 'transparent'};
  color: ${p => p.$active ? '#FFF' : '#94A3B8'};
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { color: #FFF; }
`;

export const UnitMeasurementToggle: FC<{ onUnitChange?: (unit: 'SqFt' | 'SqM') => void }> = ({ onUnitChange }) => {
  const [unit, setUnit] = useState<'SqFt' | 'SqM'>('SqFt');

  const toggle = (u: 'SqFt' | 'SqM') => {
    setUnit(u);
    onUnitChange?.(u);
  };

  return (
    <Container data-testid="unit-measurement-toggle">
      <ToggleBtn $active={unit === 'SqFt'} onClick={() => toggle('SqFt')}>
        SqFt
      </ToggleBtn>
      <ToggleBtn $active={unit === 'SqM'} onClick={() => toggle('SqM')}>
        SqM
      </ToggleBtn>
    </Container>
  );
};

export default UnitMeasurementToggle;
