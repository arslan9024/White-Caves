const HANDOFF_STATES = Object.freeze({
  GITHUB_OPEN: 'GITHUB_OPEN',
  ANALYZING: 'ANALYZING',
  PLAN_READY: 'PLAN_READY',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  IMPLEMENTING: 'IMPLEMENTING',
  VALIDATING: 'VALIDATING',
  EVIDENCE_READY: 'EVIDENCE_READY',
  CLOSURE_READY: 'CLOSURE_READY',
  CLOSED: 'CLOSED',
  BLOCKED: 'BLOCKED',
});

const ISSUE_TYPES = Object.freeze({
  LOCAL_FINGERPRINT_FIX: 'local-fingerprint-fix',
  REPOSITORY_FEATURE: 'repository-feature',
  DOCUMENTATION: 'documentation',
  SECURITY_SENSITIVE: 'security-sensitive',
  EXTERNAL_BLOCKED: 'external-blocked',
  NEEDS_HUMAN_DECISION: 'needs-human-decision',
});

function normalizeText(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .trim();
}

function issueLabels(issue) {
  return (issue?.labels || [])
    .map(label => (typeof label === 'string' ? label : label?.name || ''))
    .filter(Boolean);
}

function extractAcceptanceCriteria(body) {
  return normalizeText(body)
    .split('\n')
    .map(line => line.match(/^\s*-\s*\[[ xX]\]\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function extractCandidateFiles(issue) {
  const text = `${issue?.title || ''}\n${issue?.body || ''}`;
  const candidates = [];
  const backtickPattern = /`((?:src|server|app|aegis|plans|docs|public)\/[^`\s]+)`/g;
  let match;
  while ((match = backtickPattern.exec(text)) !== null) candidates.push(match[1]);

  const pathPattern =
    /\b((?:src|server|app|aegis|plans|docs|public)\/[A-Za-z0-9_./-]+\.(?:ts|tsx|js|jsx|md|json|css))\b/g;
  while ((match = pathPattern.exec(text)) !== null) candidates.push(match[1]);

  return [...new Set(candidates)];
}

function hasFingerprint(issue) {
  return /TTSAP_FINGERPRINT:\s*[^\s<]+/i.test(String(issue?.body || ''));
}

function extractTraceability(issue) {
  const body = String(issue?.body || '');
  const match = pattern => body.match(pattern)?.[1]?.trim() || '';
  return {
    srsId: match(/- SRS:\s*`([^`]+)`/i),
    sddId: match(/- SDD:\s*`([^`]+)`/i),
    srsPath: match(/- SRS packet:\s*`([^`]+)`/i),
    sddPath: match(/- SDD packet:\s*`([^`]+)`/i),
    analysisDecision: match(/- Decision:\s*\*\*([^*]+)\*\*/i),
  };
}

function classifyGitHubIssue(issue) {
  const title = normalizeText(issue?.title);
  const body = normalizeText(issue?.body);
  const text = `${title}\n${body}`.toLowerCase();
  const labels = issueLabels(issue).map(label => label.toLowerCase());
  const candidates = extractCandidateFiles(issue);
  const fingerprinted = hasFingerprint(issue);

  let issueType = ISSUE_TYPES.REPOSITORY_FEATURE;
  if (fingerprinted) issueType = ISSUE_TYPES.LOCAL_FINGERPRINT_FIX;
  else if (/security|csrf|xss|jwt|auth|vulnerability|pdpl|rera|aml/.test(text))
    issueType = ISSUE_TYPES.SECURITY_SENSITIVE;
  else if (/documentation|readme|docs|governance|policy|acceptance criteria/.test(text))
    issueType = ISSUE_TYPES.DOCUMENTATION;
  else if (/blocked|external dependency|third-party|waiting on/.test(text))
    issueType = ISSUE_TYPES.EXTERNAL_BLOCKED;
  else if (/decision required|choose between|architecture decision|business approval/.test(text))
    issueType = ISSUE_TYPES.NEEDS_HUMAN_DECISION;

  const priority =
    labels
      .find(label => /^(?:severity:)?p[0-3](?:[-_].*)?$/.test(label))
      ?.match(/p[0-3]/)?.[0]
      .toUpperCase() ||
    body.match(/priority:\s*(?:\*\*)?(p[0-3])\b/i)?.[1]?.toUpperCase() ||
    'P3';
  const risk =
    issueType === ISSUE_TYPES.SECURITY_SENSITIVE || issueType === ISSUE_TYPES.REPOSITORY_FEATURE
      ? 'high'
      : issueType === ISSUE_TYPES.DOCUMENTATION
        ? 'medium'
        : 'low';
  const planRequired = issueType !== ISSUE_TYPES.LOCAL_FINGERPRINT_FIX;

  return {
    issueType,
    handoffState: planRequired ? HANDOFF_STATES.PLAN_READY : HANDOFF_STATES.GITHUB_OPEN,
    planRequired,
    requiresApproval: planRequired,
    fingerprinted,
    priority,
    risk,
    candidateFiles: candidates,
  };
}

function buildGitHubIssueHandoff(issue, options = {}) {
  const classification = classifyGitHubIssue(issue);
  const acceptanceCriteria = extractAcceptanceCriteria(issue?.body);
  const issueNumber = Number(issue?.number || 0);
  const title = normalizeText(issue?.title) || `GitHub issue #${issueNumber}`;
  const traceability = extractTraceability(issue);
  const validationCommands = options.validationCommands || [
    'npm run typecheck',
    'npm run lint',
    'npm run build',
    'npm run plans:validate',
    'npm run aegis:policy:gate',
    'npm run aegis:gates',
  ];

  return {
    schemaVersion: '1.0.0',
    issueNumber,
    issueUrl: issue?.html_url || `https://github.com/arslan9024/White-Caves/issues/${issueNumber}`,
    title,
    objective:
      normalizeText(issue?.body)
        .split('\n')
        .find(line => line.trim()) || title,
    issueType: classification.issueType,
    handoffState: classification.handoffState,
    priority: classification.priority,
    risk: classification.risk,
    planRequired: classification.planRequired,
    requiresApproval: classification.requiresApproval,
    isParentIssue: options.isChildIssue !== true,
    acceptanceCriteria,
    candidateFiles: classification.candidateFiles,
    traceability,
    dependencies: [],
    validationCommands,
    closurePolicy: {
      closeOnlyAfter: [
        'EVIDENCE_READY',
        'CLOSURE_READY',
        'validated acceptance criteria',
        'evidence comment posted',
      ],
      parentIssueClosureAllowed: false,
      childIssueClosureAllowed: options.isChildIssue === true,
    },
    source: 'github',
    createdAt: new Date().toISOString(),
  };
}

function buildChildImplementationTask(parentHandoff, childId = 'CHILD-001') {
  const parentNumber = Number(parentHandoff?.issueNumber || 0);
  const parentTitle = normalizeText(parentHandoff?.title) || `Parent issue #${parentNumber}`;
  const isExpenseClaims = /expense|receipt|approval workflow/i.test(parentTitle);
  const objective = isExpenseClaims
    ? 'Define the typed ExpenseClaim domain contract and validation test surface without implementing receipt storage, provider integration, or approval workflow mutations.'
    : 'Define the smallest typed domain contract and validation test surface for the parent feature without implementing external integrations.';
  const candidateFiles = isExpenseClaims
    ? [
        'src/features/finance/expenseClaims/expenseClaims.types.ts',
        'src/features/finance/expenseClaims/expenseClaims.types.test.ts',
      ]
    : [
        'src/features/finance/domainFeature/domainFeature.types.ts',
        'src/features/finance/domainFeature/domainFeature.types.test.ts',
      ];

  return {
    schemaVersion: '1.0.0',
    taskId: `ISSUE-${parentNumber}-${childId}`,
    parentIssueNumber: parentNumber,
    parentIssueUrl: parentHandoff?.issueUrl || '',
    parentTitle,
    issueType: 'repository-feature',
    handoffState: 'WAITING_FOR_APPROVAL',
    requiresApproval: true,
    objective,
    scope: {
      included: ['typed domain contract', 'pure validation rules', 'unit tests'],
      excluded: [
        'receipt upload/storage',
        'third-party provider integration',
        'approval workflow mutations',
        'parent issue closure',
      ],
    },
    candidateFiles,
    acceptanceCriteria: [
      'Define strict TypeScript types for the child domain boundary.',
      'Add pure validation tests for valid and invalid payloads.',
      'Keep external integrations and persistence out of this child task.',
      'Record validation evidence and rollback note before closure review.',
    ],
    validationCommands: ['npm run typecheck', 'npm run plans:validate'],
    closurePolicy: {
      childIssueClosureAllowed: true,
      parentIssueClosureAllowed: false,
      requiresEvidenceArtifact: true,
    },
    createdAt: new Date().toISOString(),
  };
}

export {
  HANDOFF_STATES,
  ISSUE_TYPES,
  buildChildImplementationTask,
  buildGitHubIssueHandoff,
  classifyGitHubIssue,
  extractAcceptanceCriteria,
  extractCandidateFiles,
  extractTraceability,
};
