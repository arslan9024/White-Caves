/**
 * DashboardViewModeSelector — Wave 59 FE-GOAL-040
 * Executive dashboard density view mode selector (Compact Density vs Expanded Sovereign Deck)
 * White Caves Real Estate LLC — Dashboard Suite
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

const ModeBtn = styled.button<{ $active: boolean }>`
  padding: 4px 14px;
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

export const DashboardViewModeSelector: FC<{ onModeChange?: (mode: 'compact' | 'expanded') => void }> = ({
  onModeChange,
}) => {
  const [mode, setMode] = useState<'compact' | 'expanded'>('expanded');

  const select = (m: 'compact' | 'expanded') => {
    setMode(m);
    onModeChange?.(m);
  };

  return (
    <Container data-testid="dashboard-view-mode-selector">
      <ModeBtn $active={mode === 'compact'} onClick={() => select('compact')}>
        📊 Compact Density
      </ModeBtn>
      <ModeBtn $active={mode === 'expanded'} onClick={() => select('expanded')}>
        🖥️ Expanded Sovereign Deck
      </ModeBtn>
    </Container>
  );
};

export default DashboardViewModeSelector;
