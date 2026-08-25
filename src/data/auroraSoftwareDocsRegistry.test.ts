import { describe, it, expect } from 'vitest';
import { AURORA_SOFTWARE_DOCS, AURORA_SOFTWARE_CATEGORIES } from './auroraSoftwareDocsRegistry';

describe('auroraSoftwareDocsRegistry', () => {
  it('contains all software documentation items with valid HTML and metadata', () => {
    expect(AURORA_SOFTWARE_DOCS.length).toBeGreaterThanOrEqual(6);
    expect(AURORA_SOFTWARE_CATEGORIES.length).toBeGreaterThanOrEqual(7);

    const doc01 = AURORA_SOFTWARE_DOCS.find((d) => d.code === 'DOC-SWE-01');
    expect(doc01).toBeDefined();
    expect(doc01?.title).toContain('SRS');
    expect(doc01?.htmlContent).toContain('3.19');
    expect(doc01?.htmlContent).toContain('3.14');
  });

  it('contains 4-way folder architecture rules in HTML', () => {
    const doc03 = AURORA_SOFTWARE_DOCS.find((d) => d.code === 'DOC-SWE-03');
    expect(doc03?.htmlContent).toContain('Component.tsx');
    expect(doc03?.htmlContent).toContain('logic/Component.logic.ts');
    expect(doc03?.htmlContent).toContain('styles/Component.style.ts');
    expect(doc03?.htmlContent).toContain('data/Component.data.ts');
  });
});
