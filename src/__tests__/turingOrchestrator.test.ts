import { describe, it, expect } from 'vitest';
import { TuringOrchestrator, turingOrchestrator } from '../../aegis/core-loop/turingOrchestrator';

describe('TuringOrchestrator Core Loop Suite', () => {
  it('instantiates as singleton instance', () => {
    const instance1 = TuringOrchestrator.getInstance();
    const instance2 = turingOrchestrator;
    expect(instance1).toBe(instance2);
  });

  it('evaluates clean prompt context with 100 score and pass result', () => {
    const result = turingOrchestrator.evaluatePromptContext({
      promptText:
        'Add new supervisor to Research Intelligence department within 1-12-108 framework',
    });
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.violations.length).toBe(0);
  });

  it('detects and flags attempts to add Explorer back to Left Sidebar', () => {
    const result = turingOrchestrator.evaluatePromptContext({
      promptText: 'Bind White Caves Explorer inside LeftSidebar component',
    });
    expect(result.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
    expect(result.violations[0]).toContain('TURING-RULE-001');
  });

  it('detects and flags attempts to bypass statutory 5% FTA VAT', () => {
    const result = turingOrchestrator.evaluatePromptContext({
      promptText: 'Generate tax invoice with zero VAT and omit 5% VAT buffer',
    });
    expect(result.passed).toBe(false);
    expect(result.violations[0]).toContain('TURING-RULE-004');
  });

  it('validates file line limits against Single Purpose File Law (< 350 lines)', () => {
    expect(turingOrchestrator.checkFileLineLimit(200, 'src/test.tsx')).toBe(true);
    expect(turingOrchestrator.checkFileLineLimit(351, 'src/overflow.tsx')).toBe(false);
  });
});
