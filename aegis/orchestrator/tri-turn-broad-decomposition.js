const DEFAULT_CHILD_LIMIT = 3;

function normalize(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .trim();
}

function normalizeToken(value) {
  return normalize(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function deriveTraceability(parent) {
  const title = normalize(parent?.title);
  const waveMatch = title.match(/\[WAVE[-_ ]?(\d+)[^\]]*\]/i);
  const domainMatch = title.match(/\[WAVE[-_ ]?\d+[-_ ]([^\]]+)\]/i);
  const parentNumber = Number(parent?.number || 0);
  const domain = (domainMatch?.[1] || 'GENERAL')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();
  const wave = waveMatch?.[1] || 'UNASSIGNED';
  const key = `W${wave}-${domain}-${parentNumber}`;
  return {
    srsId: `SRS-ISSUE-${key}`,
    sddId: `SDD-ISSUE-${key}`,
    srsPath: `plans/implementation_handoffs/SRS-ISSUE-${key}.md`,
    sddPath: `plans/implementation_handoffs/SDD-ISSUE-${key}.md`,
    status: 'REQUIRED',
  };
}

function analyzeCandidateFiles(candidateFiles, repositoryFiles = [], historicalIssues = []) {
  const candidates = [
    ...new Set(candidateFiles.map(file => String(file).replace(/\\/g, '/'))),
  ].sort();
  const existingFiles = new Set(repositoryFiles.map(file => String(file).replace(/\\/g, '/')));
  const exactMatches = candidates.filter(file => existingFiles.has(file));
  const normalizedCandidates = new Set(candidates.map(normalizeToken));
  const relatedFiles = repositoryFiles.filter(file => {
    const normalized = normalizeToken(file);
    return [...normalizedCandidates].some(
      candidate => candidate && (normalized.includes(candidate) || candidate.includes(normalized))
    );
  });
  const issueMatches = historicalIssues.filter(issue => {
    const issueText = normalizeToken(`${issue?.title || ''} ${issue?.body || ''}`);
    return (
      candidates.some(file => issueText.includes(normalizeToken(file))) ||
      candidates.some(file => issueText.includes(normalizeToken(file.split('/').pop())))
    );
  });

  let decision = 'UNIQUE';
  if (exactMatches.length > 0) decision = 'REUSE_EXISTING';
  else if (issueMatches.some(issue => String(issue?.state).toLowerCase() === 'closed'))
    decision = 'REUSE_CLOSED';
  else if (relatedFiles.length > 0 || issueMatches.length > 0) decision = 'REVIEW_REQUIRED';

  return {
    decision,
    confidence: decision === 'UNIQUE' ? 1 : exactMatches.length > 0 ? 0.95 : 0.65,
    exactMatches,
    relatedFiles: [...new Set(relatedFiles)].sort(),
    issueMatches: issueMatches.map(issue => ({
      number: Number(issue?.number || 0),
      state: issue?.state || 'unknown',
      title: normalize(issue?.title),
    })),
  };
}

function buildFileBoundaries(candidateFiles, index) {
  const files = [...new Set(candidateFiles)];
  const boundaries = {
    view: [],
    logic: [],
    styles: [],
    data: [],
    tests: [],
    docs: [],
  };
  for (const file of files) {
    if (/\.test\.(ts|tsx|js|jsx)$/.test(file)) boundaries.tests.push(file);
    else if (/\.md$/.test(file)) boundaries.docs.push(file);
    else if (/style|\.css$|\.scss$/.test(file)) boundaries.styles.push(file);
    else if (/data|locale|\.json$/.test(file)) boundaries.data.push(file);
    else if (/\.tsx$|components?\//.test(file)) boundaries.view.push(file);
    else boundaries.logic.push(file);
  }
  return { ...boundaries, owner: `CHILD-${String(index).padStart(3, '0')}` };
}

function buildChildTask(
  parent,
  index,
  objective,
  included,
  excluded,
  candidateFiles = [],
  analysis = {}
) {
  const parentNumber = Number(parent?.number || 0);
  const traceability = analysis.traceability || deriveTraceability(parent);
  return {
    schemaVersion: '1.0.0',
    taskId: `ISSUE-${parentNumber}-CHILD-${String(index).padStart(3, '0')}`,
    parentIssueNumber: parentNumber,
    parentIssueUrl: parent?.html_url || '',
    parentTitle: normalize(parent?.title),
    issueType: 'repository-feature',
    handoffState: 'WAITING_FOR_APPROVAL',
    requiresApproval: true,
    objective,
    scope: { included, excluded },
    candidateFiles,
    fileBoundaries: buildFileBoundaries(candidateFiles, index),
    traceability,
    analysis: analysis.analysis || analyzeCandidateFiles(candidateFiles),
    reusePlan: analysis.reusePlan || { action: 'NO_MATCH', references: [] },
    acceptanceCriteria: [
      'Implementation remains within the declared child scope.',
      'Focused tests and required validation commands pass.',
      'Completion evidence and rollback note are recorded.',
      'Parent issue remains open until all child work is reconciled.',
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

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'into',
  'wave',
  'aegis',
  'v2',
  'v3',
  'ai',
  'mesh',
  'docs',
]);

function slugifyFeatureName(title) {
  const words = normalize(title)
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .map(word => word.trim())
    .filter(word => word.length > 1 && !/^\d+$/.test(word) && !STOP_WORDS.has(word.toLowerCase()))
    .slice(0, 4);
  if (words.length === 0) return 'domainFeature';
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

function resolveFeatureFolder(text) {
  if (/expense|invoice|payment|vat|finance|commission/.test(text)) return 'finance';
  if (/passport|deed|contract|document|ocr|tenancy|ejari/.test(text)) return 'documents';
  if (/property|listing|valuation|market/.test(text)) return 'properties';
  if (/lead|crm|scoring|offer/.test(text)) return 'leads';
  return 'shared';
}

function decomposeBroadIssue(parent, limit = DEFAULT_CHILD_LIMIT, options = {}) {
  const title = normalize(parent?.title);
  const text = `${title}\n${normalize(parent?.body)}`.toLowerCase();
  const traceability = deriveTraceability(parent);
  const analysisOptions = {
    repositoryFiles: options.repositoryFiles || [],
    historicalIssues: options.historicalIssues || [],
  };
  const taskAnalysis = candidateFiles => ({
    traceability,
    analysis: analyzeCandidateFiles(
      candidateFiles,
      analysisOptions.repositoryFiles,
      analysisOptions.historicalIssues
    ),
  });
  const children = [];

  if (/expense|receipt|approval workflow/.test(text)) {
    children.push(
      buildChildTask(
        parent,
        1,
        'Define the typed expense-claim domain contract and pure validation rules.',
        ['domain types', 'pure validation', 'unit tests'],
        ['upload/storage', 'provider integration', 'approval mutations'],
        ['src/features/finance/expenseClaims/expenseClaims.types.ts'],
        taskAnalysis(['src/features/finance/expenseClaims/expenseClaims.types.ts'])
      ),
      buildChildTask(
        parent,
        2,
        'Build the ExpenseClaim form and local receipt metadata validation.',
        ['four-way form UI', 'localized copy', 'local receipt metadata validation'],
        ['network upload', 'storage', 'approval mutations'],
        ['src/features/finance/expenseClaims/ExpenseClaimForm.tsx'],
        taskAnalysis(['src/features/finance/expenseClaims/ExpenseClaimForm.tsx'])
      ),
      buildChildTask(
        parent,
        3,
        'Define pure approval state transitions and authorization-ready contracts.',
        ['transition rules', 'pure tests', 'audit event contract'],
        ['persistence', 'payment dispatch', 'authorization middleware'],
        ['src/features/finance/expenseClaims/expenseClaimApproval.logic.ts'],
        taskAnalysis(['src/features/finance/expenseClaims/expenseClaimApproval.logic.ts'])
      )
    );
  } else {
    const folder = resolveFeatureFolder(text);
    const slug = slugifyFeatureName(title);
    const basePath = `src/features/${folder}/${slug}`;
    children.push(
      buildChildTask(
        parent,
        1,
        `Define the smallest typed domain contract for: ${title}.`,
        ['domain contract', 'pure validation', 'unit tests'],
        ['external integrations', 'persistence mutations', 'parent closure'],
        [`${basePath}/${slug}.types.ts`, `${basePath}/${slug}.types.test.ts`],
        taskAnalysis([`${basePath}/${slug}.types.ts`, `${basePath}/${slug}.types.test.ts`])
      ),
      buildChildTask(
        parent,
        2,
        `Implement the bounded UI or service slice for: ${title}.`,
        ['single bounded implementation slice', 'focused tests'],
        ['unrelated modules', 'destructive migrations', 'parent closure'],
        [`${basePath}/${slug}.logic.ts`, `${basePath}/${slug}.logic.test.ts`],
        taskAnalysis([`${basePath}/${slug}.logic.ts`, `${basePath}/${slug}.logic.test.ts`])
      ),
      buildChildTask(
        parent,
        3,
        `Add integration and release validation for: ${title}.`,
        ['integration checks', 'documentation', 'release evidence'],
        ['new feature scope', 'parent closure'],
        [`${basePath}/${slug}.contract.md`, `${basePath}/README.md`],
        taskAnalysis([`${basePath}/${slug}.contract.md`, `${basePath}/README.md`])
      )
    );
  }

  return children.slice(0, Math.max(1, limit));
}

export {
  DEFAULT_CHILD_LIMIT,
  analyzeCandidateFiles,
  buildFileBoundaries,
  decomposeBroadIssue,
  deriveTraceability,
  resolveFeatureFolder,
  slugifyFeatureName,
};
