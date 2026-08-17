/**
 * LanguageSwitcherPill.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Crisp White / Deep Slate color palette.
 */

import styled from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  align-items: center;
  background: var(--bg-card, rgba(15, 23, 42, 0.85));
  border: 1px solid var(--border-color, rgba(239, 68, 68, 0.25));
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const LangBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 999px;
  border: none;
  background: ${p => (p.$active ? '#EF4444' : 'transparent')};
  color: ${p => (p.$active ? '#FFFFFF' : 'var(--text-muted, #94A3B8)')};
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: #FFFFFF;
    background: ${p => (p.$active ? '#EF4444' : 'rgba(239, 68, 68, 0.15)')};
  }

  .flag {
    font-size: 0.85rem;
    line-height: 1;
  }
`;
