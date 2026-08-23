import { describe, it, expect } from 'vitest';
import { SwitchContainer, ModeBtn } from './BinaryThemeSwitcher.style';

describe('BinaryThemeSwitcher.style', () => {
  it('exports styled components SwitchContainer and ModeBtn', () => {
    expect(SwitchContainer).toBeDefined();
    expect(ModeBtn).toBeDefined();
    expect(SwitchContainer.styledComponentId).toBeDefined();
    expect(ModeBtn.styledComponentId).toBeDefined();
  });
});
