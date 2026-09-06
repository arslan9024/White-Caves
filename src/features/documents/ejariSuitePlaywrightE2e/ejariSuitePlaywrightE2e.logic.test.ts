import { describe, expect, it } from 'vitest';
import {
  EjariScenarioValidationError,
  criticalSteps,
  filterScenariosByTags,
  isScenarioPassing,
  isSuiteGreen,
  summarizeSuiteRun,
  validateScenario,
  validateSuite,
  type EjariScenario,
  type EjariScenarioResult,
  type EjariStep,
} from './ejariSuitePlaywrightE2e.logic';

function makeStep(overrides: Partial<EjariStep> = {}): EjariStep {
  return {
    id: 'step-1',
    description: 'Upload Ejari contract PDF',
    stage: 'upload',
    selector: '[data-testid="ejari-upload-input"]',
    timeoutMs: 2000,
    critical: true,
    ...overrides,
  };
}

function makeScenario(overrides: Partial<EjariScenario> = {}): EjariScenario {
  return {
    id: 'scenario-happy-path',
    title: 'Full Ejari renewal happy path',
    tags: ['ejari', 'happy-path'],
    steps: [
      makeStep({ id: 'upload', stage: 'upload' }),
      makeStep({ id: 'validate', stage: 'validation', critical: true }),
      makeStep({ id: 'submit', stage: 'submission', critical: true }),
      makeStep({ id: 'approve', stage: 'approval', critical: false }),
    ],
    ...overrides,
  };
}

describe('validateScenario', () => {
  it('accepts a well-formed scenario without throwing', () => {
    expect(() => validateScenario(makeScenario())).not.toThrow();
  });

  it('rejects a scenario with an empty id', () => {
    expect(() => validateScenario(makeScenario({ id: '  ' }))).toThrow(
      EjariScenarioValidationError
    );
  });

  it('rejects a scenario with no steps', () => {
    expect(() => validateScenario(makeScenario({ steps: [] }))).toThrow(/at least one step/);
  });

  it('rejects duplicate step ids within a scenario', () => {
    const scenario = makeScenario({
      steps: [makeStep({ id: 'dup' }), makeStep({ id: 'dup' })],
    });
    expect(() => validateScenario(scenario)).toThrow(/Duplicate step id/);
  });

  it('rejects a non-positive timeoutMs', () => {
    const scenario = makeScenario({
      steps: [makeStep({ timeoutMs: 0 })],
    });
    expect(() => validateScenario(scenario)).toThrow(/positive timeoutMs/);
  });

  it('rejects a step with an empty selector', () => {
    const scenario = makeScenario({
      steps: [makeStep({ selector: '   ' })],
    });
    expect(() => validateScenario(scenario)).toThrow(/non-empty selector/);
  });

  it('rejects steps that are out of lifecycle order', () => {
    const scenario = makeScenario({
      steps: [makeStep({ id: 'a', stage: 'submission' }), makeStep({ id: 'b', stage: 'upload' })],
    });
    expect(() => validateScenario(scenario)).toThrow(/out of lifecycle order/);
  });
});

describe('validateSuite', () => {
  it('accepts a suite of valid, uniquely-identified scenarios', () => {
    const suite = [makeScenario({ id: 'a' }), makeScenario({ id: 'b' })];
    expect(() => validateSuite(suite)).not.toThrow();
  });

  it('rejects an empty suite', () => {
    expect(() => validateSuite([])).toThrow(/at least one scenario/);
  });

  it('rejects duplicate scenario ids', () => {
    const suite = [makeScenario({ id: 'dup' }), makeScenario({ id: 'dup' })];
    expect(() => validateSuite(suite)).toThrow(/Duplicate scenario id/);
  });

  it('propagates the underlying scenario validation error', () => {
    const suite = [makeScenario({ steps: [] })];
    expect(() => validateSuite(suite)).toThrow(EjariScenarioValidationError);
  });
});

describe('filterScenariosByTags', () => {
  const scenarios = [
    makeScenario({ id: 'a', tags: ['ejari', 'happy-path'] }),
    makeScenario({ id: 'b', tags: ['ejari', 'edge-case'] }),
    makeScenario({ id: 'c', tags: ['renewal'] }),
  ];

  it('returns all scenarios when no tags are given', () => {
    expect(filterScenariosByTags(scenarios, [])).toHaveLength(3);
  });

  it('returns only scenarios containing every requested tag', () => {
    const filtered = filterScenariosByTags(scenarios, ['ejari']);
    expect(filtered.map(s => s.id)).toEqual(['a', 'b']);
  });

  it('applies AND semantics across multiple tags', () => {
    const filtered = filterScenariosByTags(scenarios, ['ejari', 'edge-case']);
    expect(filtered.map(s => s.id)).toEqual(['b']);
  });

  it('returns an empty array when no scenario matches', () => {
    expect(filterScenariosByTags(scenarios, ['nonexistent'])).toHaveLength(0);
  });
});

describe('criticalSteps', () => {
  it('returns only steps flagged as critical, preserving order', () => {
    const scenario = makeScenario();
    const critical = criticalSteps(scenario);
    expect(critical.map(s => s.id)).toEqual(['upload', 'validate', 'submit']);
  });
});

describe('isScenarioPassing', () => {
  const scenario = makeScenario();

  it('passes when all critical steps passed', () => {
    const result: EjariScenarioResult = {
      scenarioId: scenario.id,
      stepResults: [
        { stepId: 'upload', passed: true, durationMs: 100 },
        { stepId: 'validate', passed: true, durationMs: 100 },
        { stepId: 'submit', passed: true, durationMs: 100 },
        { stepId: 'approve', passed: false, durationMs: 100, error: 'flaky UI' },
      ],
    };
    expect(isScenarioPassing(scenario, result)).toBe(true);
  });

  it('fails when a critical step failed', () => {
    const result: EjariScenarioResult = {
      scenarioId: scenario.id,
      stepResults: [
        { stepId: 'upload', passed: true, durationMs: 100 },
        { stepId: 'validate', passed: false, durationMs: 100, error: 'timeout' },
        { stepId: 'submit', passed: true, durationMs: 100 },
      ],
    };
    expect(isScenarioPassing(scenario, result)).toBe(false);
  });

  it('fails when a critical step has no reported result at all', () => {
    const result: EjariScenarioResult = {
      scenarioId: scenario.id,
      stepResults: [{ stepId: 'upload', passed: true, durationMs: 100 }],
    };
    expect(isScenarioPassing(scenario, result)).toBe(false);
  });
});

describe('summarizeSuiteRun', () => {
  it('aggregates pass/fail counts and total duration across scenarios', () => {
    const scenarioA = makeScenario({ id: 'a' });
    const scenarioB = makeScenario({ id: 'b' });

    const results: EjariScenarioResult[] = [
      {
        scenarioId: 'a',
        stepResults: [
          { stepId: 'upload', passed: true, durationMs: 500 },
          { stepId: 'validate', passed: true, durationMs: 500 },
          { stepId: 'submit', passed: true, durationMs: 500 },
          { stepId: 'approve', passed: true, durationMs: 500 },
        ],
      },
      {
        scenarioId: 'b',
        stepResults: [
          { stepId: 'upload', passed: true, durationMs: 500 },
          { stepId: 'validate', passed: false, durationMs: 500, error: 'boom' },
          { stepId: 'submit', passed: true, durationMs: 500 },
          { stepId: 'approve', passed: true, durationMs: 500 },
        ],
      },
    ];

    const summary = summarizeSuiteRun([scenarioA, scenarioB], results);

    expect(summary.totalScenarios).toBe(2);
    expect(summary.passedScenarios).toBe(1);
    expect(summary.failedScenarios).toBe(1);
    expect(summary.totalSteps).toBe(8);
    expect(summary.passedSteps).toBe(7);
    expect(summary.failedSteps).toBe(1);
    expect(summary.criticalFailures).toEqual(['b']);
    expect(summary.durationMs).toBe(4000);
  });

  it('flags steps that exceeded their declared timeout as slow', () => {
    const scenario = makeScenario({
      steps: [makeStep({ id: 'upload', timeoutMs: 1000 })],
    });
    const results: EjariScenarioResult[] = [
      {
        scenarioId: scenario.id,
        stepResults: [{ stepId: 'upload', passed: true, durationMs: 5000 }],
      },
    ];

    const summary = summarizeSuiteRun([scenario], results);
    expect(summary.slowSteps).toEqual(['upload']);
  });

  it('treats a scenario with no matching result as a critical failure', () => {
    const scenario = makeScenario({ id: 'missing-result' });
    const summary = summarizeSuiteRun([scenario], []);

    expect(summary.criticalFailures).toEqual(['missing-result']);
    expect(summary.failedScenarios).toBe(1);
    expect(summary.totalSteps).toBe(0);
  });
});

describe('isSuiteGreen', () => {
  it('returns true when there are no failures at all', () => {
    const summary = summarizeSuiteRun(
      [makeScenario({ id: 'a' })],
      [
        {
          scenarioId: 'a',
          stepResults: [
            { stepId: 'upload', passed: true, durationMs: 10 },
            { stepId: 'validate', passed: true, durationMs: 10 },
            { stepId: 'submit', passed: true, durationMs: 10 },
            { stepId: 'approve', passed: true, durationMs: 10 },
          ],
        },
      ]
    );
    expect(isSuiteGreen(summary)).toBe(true);
  });

  it('returns false when there is at least one critical failure', () => {
    const summary = summarizeSuiteRun([makeScenario({ id: 'a' })], []);
    expect(isSuiteGreen(summary)).toBe(false);
  });
});
