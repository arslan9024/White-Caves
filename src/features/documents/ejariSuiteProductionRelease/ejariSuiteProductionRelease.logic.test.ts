import { describe, expect, it } from 'vitest';
import {
  DEFAULT_EJARI_GATE_CONFIG,
  checkEvidenceSections,
  checkExclusionPhrasePresent,
  checkExclusionPhrases,
  checkParentIssueOpenLanguage,
  checkTraceabilityMarkers,
  evaluateEjariSuiteProductionReleaseGate,
  isIssueClosureAsserted,
  type EjariDocumentArtifact,
} from './ejariSuiteProductionRelease.logic';

const compliantArtifact: EjariDocumentArtifact = {
  path: 'plans/implementation_handoffs/SRS-ISSUE-W55-EJARI-GATE-1924.md',
  content: `
    Issue: #2489
    Parent issue: #1924 (open — pending reconciliation)
    Workstream: W55 — Ejari Suite Production Release Gate

    ## Completion Evidence
    Delivered the automated gate validator.

    ## Rollback Note
    Delete the added files; no runtime state was mutated.

    Excluded scope: parent issue closure, bulk GitHub mutation,
    destructive database operations, production secret rewrites.
  `,
};

const secondCompliantArtifact: EjariDocumentArtifact = {
  path: 'plans/implementation_handoffs/SDD-ISSUE-W55-EJARI-GATE-1924.md',
  content: `
    Issue: #2489
    Parent issue: #1924 (open — pending reconciliation)
    Workstream: W55 — Ejari Suite Production Release Gate
  `,
};

describe('isIssueClosureAsserted', () => {
  it('detects a "closes #1924" style closure keyword bound to the issue ref', () => {
    expect(isIssueClosureAsserted('This PR closes #1924 once merged.', '#1924')).toBe(true);
  });

  it('detects other closure verbs like "fixes" and "resolves"', () => {
    expect(isIssueClosureAsserted('fixes #1924', '#1924')).toBe(true);
    expect(isIssueClosureAsserted('Resolves #1924 fully.', '#1924')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isIssueClosureAsserted('CLOSES #1924', '#1924')).toBe(true);
  });

  it('does not flag a bare mention without a closure verb', () => {
    expect(
      isIssueClosureAsserted('Parent issue: #1924 (open — pending reconciliation)', '#1924')
    ).toBe(false);
  });

  it('does not flag closure verbs referencing a different issue number', () => {
    expect(isIssueClosureAsserted('closes #999', '#1924')).toBe(false);
  });
});

describe('checkTraceabilityMarkers', () => {
  it('passes every marker when all are present', () => {
    const results = checkTraceabilityMarkers(compliantArtifact);
    expect(results).toHaveLength(DEFAULT_EJARI_GATE_CONFIG.requiredTraceabilityMarkers.length);
    expect(results.every(result => result.passed)).toBe(true);
  });

  it('fails a specific marker when it is missing', () => {
    const artifact: EjariDocumentArtifact = {
      path: 'x.md',
      content: 'Issue: #2489, Workstream: W55',
    };
    const results = checkTraceabilityMarkers(artifact);
    const parentMarkerResult = results.find(result => result.ruleId === 'traceability:#1924');
    expect(parentMarkerResult?.passed).toBe(false);
    expect(parentMarkerResult?.message).toContain('missing');
  });
});

describe('checkParentIssueOpenLanguage', () => {
  it('passes when the parent issue is described as open', () => {
    const result = checkParentIssueOpenLanguage(compliantArtifact);
    expect(result.passed).toBe(true);
    expect(result.severity).toBe('error');
  });

  it('fails with error severity when parent issue closure is asserted', () => {
    const artifact: EjariDocumentArtifact = { path: 'bad.md', content: 'This closes #1924.' };
    const result = checkParentIssueOpenLanguage(artifact);
    expect(result.passed).toBe(false);
    expect(result.severity).toBe('error');
    expect(result.message).toContain('excluded scope');
  });

  it('fails with warning severity when the parent is mentioned but not described as open', () => {
    const artifact: EjariDocumentArtifact = {
      path: 'ambiguous.md',
      content: 'See parent #1924 for context.',
    };
    const result = checkParentIssueOpenLanguage(artifact);
    expect(result.passed).toBe(false);
    expect(result.severity).toBe('warning');
  });

  it('passes when the parent issue is not mentioned at all', () => {
    const artifact: EjariDocumentArtifact = {
      path: 'unrelated.md',
      content: 'No parent reference here.',
    };
    const result = checkParentIssueOpenLanguage(artifact);
    expect(result.passed).toBe(true);
  });
});

describe('checkExclusionPhrasePresent', () => {
  it('matches case-insensitively', () => {
    const artifact: EjariDocumentArtifact = {
      path: 'x.md',
      content: 'PARENT ISSUE CLOSURE is excluded.',
    };
    expect(checkExclusionPhrasePresent(artifact, 'parent issue closure')).toBe(true);
  });

  it('returns false when the phrase is absent', () => {
    const artifact: EjariDocumentArtifact = { path: 'x.md', content: 'Nothing relevant here.' };
    expect(checkExclusionPhrasePresent(artifact, 'parent issue closure')).toBe(false);
  });
});

describe('checkExclusionPhrases', () => {
  it('passes every required phrase when found across the artifact set', () => {
    const results = checkExclusionPhrases([compliantArtifact, secondCompliantArtifact]);
    expect(results.every(result => result.passed)).toBe(true);
    expect(results).toHaveLength(DEFAULT_EJARI_GATE_CONFIG.requiredExclusionPhrases.length);
  });

  it('fails phrases missing from every artifact', () => {
    const results = checkExclusionPhrases([secondCompliantArtifact]);
    expect(results.some(result => !result.passed)).toBe(true);
    const missing = results.find(result => result.ruleId === 'exclusion-phrase:production secret');
    expect(missing?.passed).toBe(false);
    expect(missing?.artifactPath).toBe('(none)');
  });
});

describe('checkEvidenceSections', () => {
  it('passes when required sections are present somewhere in the artifact set', () => {
    const results = checkEvidenceSections([compliantArtifact, secondCompliantArtifact]);
    expect(results.every(result => result.passed)).toBe(true);
  });

  it('fails when a required section heading is absent everywhere', () => {
    const results = checkEvidenceSections([secondCompliantArtifact]);
    expect(results.every(result => !result.passed)).toBe(true);
  });
});

describe('evaluateEjariSuiteProductionReleaseGate', () => {
  it('reports "ready" with zero failures for a fully compliant artifact set', () => {
    const evaluation = evaluateEjariSuiteProductionReleaseGate([
      compliantArtifact,
      secondCompliantArtifact,
    ]);
    expect(evaluation.status).toBe('ready');
    expect(evaluation.failureCount).toBe(0);
    expect(evaluation.results.length).toBeGreaterThan(0);
  });

  it('reports "blocked" when traceability markers are missing', () => {
    const artifact: EjariDocumentArtifact = { path: 'incomplete.md', content: 'no markers here' };
    const evaluation = evaluateEjariSuiteProductionReleaseGate([artifact]);
    expect(evaluation.status).toBe('blocked');
    expect(evaluation.failureCount).toBeGreaterThan(0);
  });

  it('reports "blocked" when parent issue closure is asserted, even if other rules pass', () => {
    const artifact: EjariDocumentArtifact = {
      path: 'risky.md',
      content: `
        Issue: #2489
        Parent issue: #1924
        Workstream: W55

        ## Completion Evidence
        Done.
        ## Rollback Note
        Revert commit.
        parent issue closure, bulk GitHub mutation, destructive database operations, production secret

        This change closes #1924.
      `,
    };
    const evaluation = evaluateEjariSuiteProductionReleaseGate([artifact]);
    expect(evaluation.status).toBe('blocked');
    const closureResult = evaluation.results.find(
      result => result.ruleId === 'parent-issue-not-closed'
    );
    expect(closureResult?.passed).toBe(false);
  });

  it('does not block the gate on warning-severity-only failures', () => {
    const artifact: EjariDocumentArtifact = {
      path: 'warning-only.md',
      content: `
        #2489 #1924 W55
        ## Completion Evidence
        text
        ## Rollback Note
        text
        parent issue closure, bulk GitHub mutation, destructive database operations, production secret
      `,
    };
    // Parent issue #1924 is mentioned but not described as "open" -> warning only.
    const evaluation = evaluateEjariSuiteProductionReleaseGate([artifact]);
    const closureResult = evaluation.results.find(
      result => result.ruleId === 'parent-issue-not-closed'
    );
    expect(closureResult?.severity).toBe('warning');
    expect(evaluation.status).toBe('ready');
  });

  it('supports a custom config with different required markers', () => {
    const artifact: EjariDocumentArtifact = { path: 'custom.md', content: 'CUSTOM-MARKER only' };
    const evaluation = evaluateEjariSuiteProductionReleaseGate([artifact], {
      requiredTraceabilityMarkers: ['CUSTOM-MARKER'],
      parentIssueRef: '#1924',
      requiredExclusionPhrases: [],
      requiredEvidenceSections: [],
    });
    expect(evaluation.status).toBe('ready');
    expect(evaluation.failureCount).toBe(0);
  });
});
