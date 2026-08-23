/**
 * Totp2faSetupCard.style.test.ts
 * AEGIS Turn 66 — Test Coverage Gap remediation (Target 8)
 * Verifies that all styled-component exports from Totp2faSetupCard.style.ts
 * exist and carry the styledComponentId marker (present on every styled-component).
 * NOTE: In Vitest/JSDOM, styled-components resolve as React component objects,
 * not plain functions — typeof checks must use object-presence assertions.
 */

import { describe, it, expect } from 'vitest';
import { CardContainer, QrBox, SecretKeyDisplay, TokenInputGroup } from './Totp2faSetupCard.style';

describe('Totp2faSetupCard.style exports', () => {
  it('exports CardContainer as a styled-component (defined, non-null)', () => {
    expect(CardContainer).toBeDefined();
    expect(CardContainer).not.toBeNull();
  });

  it('CardContainer has styledComponentId marker', () => {
    expect((CardContainer as unknown as { styledComponentId?: string }).styledComponentId).toBeTruthy();
  });

  it('exports QrBox as a styled-component (defined, non-null)', () => {
    expect(QrBox).toBeDefined();
    expect(QrBox).not.toBeNull();
  });

  it('QrBox has styledComponentId marker', () => {
    expect((QrBox as unknown as { styledComponentId?: string }).styledComponentId).toBeTruthy();
  });

  it('exports SecretKeyDisplay as a styled-component (defined, non-null)', () => {
    expect(SecretKeyDisplay).toBeDefined();
    expect(SecretKeyDisplay).not.toBeNull();
  });

  it('SecretKeyDisplay has styledComponentId marker', () => {
    expect((SecretKeyDisplay as unknown as { styledComponentId?: string }).styledComponentId).toBeTruthy();
  });

  it('exports TokenInputGroup as a styled-component (defined, non-null)', () => {
    expect(TokenInputGroup).toBeDefined();
    expect(TokenInputGroup).not.toBeNull();
  });

  it('TokenInputGroup has styledComponentId marker', () => {
    expect((TokenInputGroup as unknown as { styledComponentId?: string }).styledComponentId).toBeTruthy();
  });

  it('all four exports are distinct references', () => {
    expect(CardContainer).not.toBe(QrBox);
    expect(QrBox).not.toBe(SecretKeyDisplay);
    expect(SecretKeyDisplay).not.toBe(TokenInputGroup);
  });
});
