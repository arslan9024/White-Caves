/**
 * ProfileThemeCustomizer — Wave 58 FE-GOAL-030
 * Profile theme customization widget allowing custom accent rings & luxury border styles
 * White Caves Real Estate LLC — Sovereign Profile Suite
 */
import React, { FC, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  color: #94A3B8;
`;

const SwatchBtn = styled.button<{ $color: string; $selected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 2px solid ${p => p.$selected ? '#FFF' : 'transparent'};
  box-shadow: ${p => p.$selected ? `0 0 10px ${p.$color}` : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { transform: scale(1.15); }
`;

export const ProfileThemeCustomizer: FC<{ onAccentChange?: (color: string) => void }> = ({ onAccentChange }) => {
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const palette = ['#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#38BDF8'];

  const selectColor = (c: string) => {
    setSelectedColor(c);
    onAccentChange?.(c);
  };

  return (
    <Container data-testid="profile-theme-customizer">
      <span style={{ fontWeight: 700 }}>Accent Ring Color:</span>
      <div style={{ display: 'flex', gap: '6px' }}>
        {palette.map(c => (
          <SwatchBtn
            key={c}
            $color={c}
            $selected={selectedColor === c}
            onClick={() => selectColor(c)}
            aria-label={`Select accent color ${c}`}
          />
        ))}
      </div>
    </Container>
  );
};

export default ProfileThemeCustomizer;
