const DEFAULT_CHILD_LIMIT = 3;

function normalize(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .trim();
}

function buildChildTask(parent, index, objective, included, excluded, candidateFiles = []) {
  const parentNumber = Number(parent?.number || 0);
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

function decomposeBroadIssue(parent, limit = DEFAULT_CHILD_LIMIT) {
  const title = normalize(parent?.title);
  const text = `${title}\n${normalize(parent?.body)}`.toLowerCase();
  const children = [];

  if (/expense|receipt|approval workflow/.test(text)) {
    children.push(
      buildChildTask(
        parent,
        1,
        'Define the typed expense-claim domain contract and pure validation rules.',
        ['domain types', 'pure validation', 'unit tests'],
        ['upload/storage', 'provider integration', 'approval mutations'],
        ['src/features/finance/expenseClaims/expenseClaims.types.ts']
      ),
      buildChildTask(
        parent,
        2,
        'Build the ExpenseClaim form and local receipt metadata validation.',
        ['four-way form UI', 'localized copy', 'local receipt metadata validation'],
        ['network upload', 'storage', 'approval mutations'],
        ['src/features/finance/expenseClaims/ExpenseClaimForm.tsx']
      ),
      buildChildTask(
        parent,
        3,
        'Define pure approval state transitions and authorization-ready contracts.',
        ['transition rules', 'pure tests', 'audit event contract'],
        ['persistence', 'payment dispatch', 'authorization middleware'],
        ['src/features/finance/expenseClaims/expenseClaimApproval.logic.ts']
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
        [`${basePath}/${slug}.types.ts`, `${basePath}/${slug}.types.test.ts`]
      ),
      buildChildTask(
        parent,
        2,
        `Implement the bounded UI or service slice for: ${title}.`,
        ['single bounded implementation slice', 'focused tests'],
        ['unrelated modules', 'destructive migrations', 'parent closure'],
        [`${basePath}/${slug}.logic.ts`, `${basePath}/${slug}.logic.test.ts`]
      ),
      buildChildTask(
        parent,
        3,
        `Add integration and release validation for: ${title}.`,
        ['integration checks', 'documentation', 'release evidence'],
        ['new feature scope', 'parent closure'],
        [`${basePath}/${slug}.contract.md`, `${basePath}/README.md`]
      )
    );
  }

  return children.slice(0, Math.max(1, limit));
}

export { DEFAULT_CHILD_LIMIT, decomposeBroadIssue, resolveFeatureFolder, slugifyFeatureName };
