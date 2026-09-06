/**
 * Ejari Suite Production Release Gate — automated validator logic.
 *
 * Issue: #2489
 * Parent issue: #1924 (open — pending reconciliation)
 * Workstream: W55 — Ejari Suite Production Release Gate
 *
 * This module implements the automated structural/traceability validator
 * anticipated by the W55 gate's SDD (see
 * plans/implementation_handoffs/SDD-ISSUE-W55-EJARI-GATE-1924.md, section 5
 * "Validation Approach"): it inspects the textual content of the gate's
 * documentation/code artifacts and asserts on real substrings rather than
 * relying on manual review alone.
 *
 * Scope: pure, side-effect-free text analysis. It does not read files from
 * disk, does not call GitHub, and does not mutate any state — callers are
 * responsible for supplying artifact contents (e.g. already-read file text).
 */

/** A single documentation or code artifact under the Ejari release gate. */
export interface EjariDocumentArtifact {
  /** Repo-relative path used for reporting; not read from disk by this module. */
  readonly path: string;
  /** Raw text content of the artifact. */
  readonly content: string;
}

/** Severity of a gate rule violation or pass. */
export type GateRuleSeverity = 'error' | 'warning';

/** Result of evaluating a single rule against a single artifact. */
export interface GateCheckResult {
  readonly ruleId: string;
  readonly artifactPath: string;
  readonly passed: boolean;
  readonly severity: GateRuleSeverity;
  readonly message: string;
}

/** Overall status of the release gate for a set of artifacts. */
export type GateStatus = 'ready' | 'blocked';

/** Aggregated evaluation across all artifacts and rules. */
export interface GateEvaluation {
  readonly status: GateStatus;
  readonly results: readonly GateCheckResult[];
  readonly failureCount: number;
}

/** Configuration describing the traceability/exclusion contract to enforce. */
export interface EjariGateConfig {
  /** Identifiers that must appear verbatim in every artifact (e.g. "#2489", "#1924", "W55"). */
  readonly requiredTraceabilityMarkers: readonly string[];
  /** The parent issue reference whose closure must never be asserted (e.g. "#1924"). */
  readonly parentIssueRef: string;
  /** Phrases that must appear in at least one artifact describing excluded scope. */
  readonly requiredExclusionPhrases: readonly string[];
  /** Section headings that at least one artifact must contain (e.g. completion evidence, rollback). */
  readonly requiredEvidenceSections: readonly string[];
}

/** Default configuration matching the W55 Ejari release gate contract. */
export const DEFAULT_EJARI_GATE_CONFIG: EjariGateConfig = {
  requiredTraceabilityMarkers: ['#2489', '#1924', 'W55'],
  parentIssueRef: '#1924',
  requiredExclusionPhrases: [
    'parent issue closure',
    'bulk GitHub mutation',
    'destructive database operations',
    'production secret',
  ],
  requiredEvidenceSections: ['Completion Evidence', 'Rollback Note'],
};

/**
 * Patterns that assert a GitHub issue is being closed by this change
 * (e.g. "closes #1924", "fixes #1924", "resolves #1924"), which must never
 * apply to the parent issue reference under this gate's exclusion rules.
 */
const CLOSURE_VERBS = [
  'close',
  'closes',
  'closed',
  'fix',
  'fixes',
  'fixed',
  'resolve',
  'resolves',
  'resolved',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Detects whether an artifact's content contains a GitHub closure keyword
 * directly bound to the given issue reference (e.g. "closes #1924").
 */
export function isIssueClosureAsserted(content: string, issueRef: string): boolean {
  const escapedRef = escapeRegExp(issueRef);
  const verbAlternation = CLOSURE_VERBS.join('|');
  const pattern = new RegExp(`\\b(?:${verbAlternation})\\s+${escapedRef}\\b`, 'i');
  return pattern.test(content);
}

/**
 * Checks that a single artifact contains every required traceability marker
 * verbatim (case-sensitive, since issue/workstream IDs are not free text).
 */
export function checkTraceabilityMarkers(
  artifact: EjariDocumentArtifact,
  requiredMarkers: readonly string[] = DEFAULT_EJARI_GATE_CONFIG.requiredTraceabilityMarkers
): GateCheckResult[] {
  return requiredMarkers.map(marker => {
    const passed = artifact.content.includes(marker);
    return {
      ruleId: `traceability:${marker}`,
      artifactPath: artifact.path,
      passed,
      severity: 'error',
      message: passed
        ? `Traceability marker "${marker}" present in ${artifact.path}.`
        : `Traceability marker "${marker}" is missing from ${artifact.path}.`,
    };
  });
}

/**
 * Checks that an artifact never asserts closure of the parent issue, and
 * (when it references the parent issue at all) describes it as open.
 */
export function checkParentIssueOpenLanguage(
  artifact: EjariDocumentArtifact,
  parentIssueRef: string = DEFAULT_EJARI_GATE_CONFIG.parentIssueRef
): GateCheckResult {
  const closureAsserted = isIssueClosureAsserted(artifact.content, parentIssueRef);
  const mentionsParent = artifact.content.includes(parentIssueRef);
  const describesOpen = new RegExp(
    `${escapeRegExp(parentIssueRef)}[^\\n]{0,40}\\bopen\\b`,
    'i'
  ).test(artifact.content);

  if (closureAsserted) {
    return {
      ruleId: 'parent-issue-not-closed',
      artifactPath: artifact.path,
      passed: false,
      severity: 'error',
      message: `${artifact.path} asserts closure of parent issue ${parentIssueRef}, which is excluded scope.`,
    };
  }

  if (mentionsParent && !describesOpen) {
    return {
      ruleId: 'parent-issue-not-closed',
      artifactPath: artifact.path,
      passed: false,
      severity: 'warning',
      message: `${artifact.path} references ${parentIssueRef} without describing it as open.`,
    };
  }

  return {
    ruleId: 'parent-issue-not-closed',
    artifactPath: artifact.path,
    passed: true,
    severity: 'error',
    message: `${artifact.path} does not assert closure of parent issue ${parentIssueRef}.`,
  };
}

/**
 * Checks whether a single artifact contains a required exclusion phrase.
 * Matching is case-insensitive since exclusion prose may vary in casing.
 */
export function checkExclusionPhrasePresent(
  artifact: EjariDocumentArtifact,
  phrase: string
): boolean {
  return artifact.content.toLowerCase().includes(phrase.toLowerCase());
}

/**
 * Checks that, across the full artifact set, every required exclusion
 * phrase appears in at least one artifact.
 */
export function checkExclusionPhrases(
  artifacts: readonly EjariDocumentArtifact[],
  requiredPhrases: readonly string[] = DEFAULT_EJARI_GATE_CONFIG.requiredExclusionPhrases
): GateCheckResult[] {
  return requiredPhrases.map(phrase => {
    const matchingArtifact = artifacts.find(artifact =>
      checkExclusionPhrasePresent(artifact, phrase)
    );
    return {
      ruleId: `exclusion-phrase:${phrase}`,
      artifactPath: matchingArtifact?.path ?? '(none)',
      passed: matchingArtifact !== undefined,
      severity: 'error',
      message: matchingArtifact
        ? `Exclusion phrase "${phrase}" found in ${matchingArtifact.path}.`
        : `Exclusion phrase "${phrase}" was not found in any artifact.`,
    };
  });
}

/**
 * Checks that, across the full artifact set, every required evidence
 * section heading appears in at least one artifact.
 */
export function checkEvidenceSections(
  artifacts: readonly EjariDocumentArtifact[],
  requiredSections: readonly string[] = DEFAULT_EJARI_GATE_CONFIG.requiredEvidenceSections
): GateCheckResult[] {
  return requiredSections.map(section => {
    const matchingArtifact = artifacts.find(artifact => artifact.content.includes(section));
    return {
      ruleId: `evidence-section:${section}`,
      artifactPath: matchingArtifact?.path ?? '(none)',
      passed: matchingArtifact !== undefined,
      severity: 'error',
      message: matchingArtifact
        ? `Evidence section "${section}" found in ${matchingArtifact.path}.`
        : `Evidence section "${section}" was not found in any artifact.`,
    };
  });
}

/**
 * Evaluates the full Ejari Suite Production Release Gate against a set of
 * artifacts, combining traceability, parent-issue-open, exclusion-phrase,
 * and evidence-section checks into a single pass/fail evaluation.
 *
 * The gate is "ready" only when there are zero error-severity failures;
 * warning-severity failures are surfaced but do not block the gate.
 */
export function evaluateEjariSuiteProductionReleaseGate(
  artifacts: readonly EjariDocumentArtifact[],
  config: EjariGateConfig = DEFAULT_EJARI_GATE_CONFIG
): GateEvaluation {
  const perArtifactResults = artifacts.flatMap(artifact => [
    ...checkTraceabilityMarkers(artifact, config.requiredTraceabilityMarkers),
    checkParentIssueOpenLanguage(artifact, config.parentIssueRef),
  ]);

  const crossArtifactResults = [
    ...checkExclusionPhrases(artifacts, config.requiredExclusionPhrases),
    ...checkEvidenceSections(artifacts, config.requiredEvidenceSections),
  ];

  const results = [...perArtifactResults, ...crossArtifactResults];
  const failureCount = results.filter(
    result => !result.passed && result.severity === 'error'
  ).length;

  return {
    status: failureCount === 0 ? 'ready' : 'blocked',
    results,
    failureCount,
  };
}
