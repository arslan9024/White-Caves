import { describe, it, expect } from 'vitest';
import { Container, LangBtn } from './LanguageSwitcherPill.style';

describe('LanguageSwitcherPill.style', () => {
  it('exports styled components Container and LangBtn', () => {
    expect(Container).toBeDefined();
    expect(LangBtn).toBeDefined();
    expect(Container.styledComponentId).toBeDefined();
    expect(LangBtn.styledComponentId).toBeDefined();
  });
});
