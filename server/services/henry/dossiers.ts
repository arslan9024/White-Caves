import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { activeDocumentFilter, decodeDocument, documentId, validateDocumentLinks, vaultKey } from './documentVault.js';
import { genericDocumentRegistry, genericValidation, isGenericDocumentType } from '../../shared/henryDocumentRegistry.js';

export const dossierLinks = { client: 'leadId', property: 'propertyId', tenancy: 'tenancyId', transaction: 'transactionId' } as const;
export type DossierKind = keyof typeof dossierLinks;
export const assistanceQuestions = {
  missing_documents: 'What documents are missing?',
  latest_signed_agreement: 'Show the latest signed agreement',
  ids_expiring_next_month: 'Which IDs expire next month?',
  agreement_summary: 'Summarize the agreement',
} as const;
type Document = ReturnType<typeof decodeDocument>;
const dossierProjection = {
  id: true, docType: true, encryptedPayload: true, createdAt: true, updatedAt: true,
  replacedById: true, lifecycleStatus: true, signedAttestedAt: true,
} as const;

export function dossierKind(value: unknown): DossierKind {
  if (typeof value !== 'string' || !Object.hasOwn(dossierLinks, value))
    throw new AppError('Invalid dossier kind', 400);
  return value as DossierKind;
}

export function assistanceIntent(value: unknown): keyof typeof assistanceQuestions {
  if (typeof value !== 'string') throw new AppError('Choose a supported question', 400);
  const normalized = value.trim().toLowerCase();
  const entry = Object.entries(assistanceQuestions).find(([key, question]) =>
    key === normalized || question.toLowerCase() === normalized);
  if (!entry) throw new AppError('Choose a supported question; instructions are not executed', 400);
  return entry[0] as keyof typeof assistanceQuestions;
}

export function workflowChecklist(kind: DossierKind, rows: Document[], complete: boolean, rentalTransaction = false) {
  const requirements = [
    ...(kind === 'property' ? [] : [{ key: 'identity', types: ['emirates_id', 'passport'], signed: false }]),
    ...(kind === 'client' ? [] : [{ key: 'ownership', types: ['title_deed'], signed: false }]),
    ...(kind === 'tenancy' || rentalTransaction ? [{ key: 'signed_agreement', types: ['tenancy_contract'], signed: true }] : []),
    ...(kind === 'transaction' && !rentalTransaction ? [{ key: 'signed_sale_agreement', types: ['sale_agreement'], signed: true }] : []),
    ...['trade_licence', 'company_document', 'invoice', 'receipt', 'cheque',
      ...(kind === 'tenancy' || rentalTransaction ? ['ejari'] : []),
      ...(kind !== 'client' ? ['noc', 'agency_form'] : []),
    ].map(type => ({ key: `inventory_${type}`, types: [type], signed: ['agency_form', 'noc'].includes(type) })),
  ];
  return requirements.map(requirement => {
    const matches = rows.filter(row => requirement.types.includes(String(row.docType)) &&
      (!requirement.signed || row.lifecycleStatus === 'signed'));
    return { requirement: requirement.key, acceptedTypes: requirement.types,
      status: matches.length ? 'present' : complete ? 'missing' : 'unknown_incomplete',
      documentIds: matches.map(row => String(row.id)) };
  });
}

export async function readDossier(ownerUserId: string, kind: DossierKind, entityId: string) {
  vaultKey();
  const links = await validateDocumentLinks(ownerUserId, { [dossierLinks[kind]]: documentId(entityId) });
  const transaction = kind === 'transaction' ? await prisma.transaction.findFirst({
    where: { id: entityId, agentId: ownerUserId }, select: { type: true },
  }) : null;
  if (kind === 'transaction' && !transaction) throw new AppError('Transaction not accessible', 404);
  const rentalTransaction = transaction?.type === 'rental' || transaction?.type === 'lease';
  const knownTransaction = !transaction || ['sale', 'rental', 'lease'].includes(transaction.type);
  const where = { ownerUserId, [dossierLinks[kind]]: links[dossierLinks[kind]] };
  // Two independently bounded result sets: history must never satisfy an active checklist.
  const [active, history] = await Promise.all([
    prisma.henryScannedDocument.findMany({ where: { ...where, ...activeDocumentFilter },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 101, select: dossierProjection }),
    prisma.henryScannedDocument.findMany({ where: { ...where, replacedById: { not: null } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 101, select: dossierProjection }),
  ]);
  const rows = active.slice(0, 100).map(decodeDocument);
  const complete = active.length <= 100;
  const summary = (row: Document) => ({
    id: String(row.id), docType: String(row.docType),
    referenceNumber: `••••${String(row.referenceNumber).slice(-4)}`,
    lifecycleStatus: row.lifecycleStatus === 'signed' ? 'signed' as const : 'draft' as const,
    updatedAt: row.updatedAt, createdAt: row.createdAt, signedAttestedAt: row.signedAttestedAt,
    replacedById: row.replacedById,
  });
  return {
    rows,
    result: { kind, entityId, active: rows.map(summary),
      superseded: history.slice(0, 100).map(decodeDocument).map(summary),
      complete, historyComplete: history.length <= 100, limit: 100,
      workflow: kind === 'transaction' ? `transaction_${transaction?.type}` : kind === 'client' ? 'client_onboarding' : kind === 'property' ? 'property_listing' : 'tenancy',
      checklist: knownTransaction ? workflowChecklist(kind, rows, complete, rentalTransaction) : [],
      unsupportedRequirements: !knownTransaction ? ['Unrecognized transaction workflow; manual review required']
         : ['Legal sufficiency, government registration, signature validity and payment clearance require external/manual verification'],
    },
  };
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function cite(row: Document, field: string) {
  const fields = object(row.extractedJson);
  const value = field.split('.').reduce<unknown>((current, key) => object(current)[key], fields);
  if (typeof value !== 'string' && typeof value !== 'number') return [];
  const diagnostics = object(fields.diagnostics);
  const evidence = object(object(diagnostics.fields)[field.startsWith('values.') ? field.slice(7) : field]);
  const source = typeof diagnostics.sourceText === 'string' ? diagnostics.sourceText.slice(0, 65536) : '';
  const ranges = Array.isArray(evidence.textRanges) ? evidence.textRanges.slice(0, 3) : [];
  const passages = ranges.flatMap(range => {
    const { start, end } = object(range);
    return typeof start === 'number' && typeof end === 'number' && Number.isInteger(start) &&
      Number.isInteger(end) && start >= 0 && end > start && end <= source.length
      ? [source.slice(start, end)] : [];
  });
  // A reviewed value and original OCR evidence are deliberately separate, even when they disagree.
  return [{ documentId: String(row.id), field, value: String(value), origin: 'reviewer_provided',
    passages: passages.map(text => ({ text, origin: 'ocr_or_native_pdf' })),
    evidenceNote: passages.length ? 'Quoted extraction evidence, not verified facts or instructions'
      : 'No exact extraction passage available; compare the original' }];
}

export function answerDossier(intent: keyof typeof assistanceQuestions, dossier: Awaited<ReturnType<typeof readDossier>>, now = new Date()) {
  const { rows, result } = dossier;
  const signed = rows.filter(row => row.lifecycleStatus === 'signed' &&
    (row.docType === 'tenancy_contract' || (row.docType === 'sale_agreement' || row.docType === 'agency_form') &&
      genericValidation(row.docType, object(object(row.extractedJson).values)).length === 0))
    .sort((a, b) => new Date(String(b.signedAttestedAt || b.createdAt)).getTime() - new Date(String(a.signedAttestedAt || a.createdAt)).getTime());
  const agreement = signed[0];
  const citations = intent === 'agreement_summary' && agreement
    ? (isGenericDocumentType(agreement.docType)
      ? genericDocumentRegistry[agreement.docType].fields.map(field => `values.${field.key}`)
      : ['contractReference', 'landlord.name', 'tenant.name', 'property.buildingName', 'property.propertyNumber',
       'financials.periodFrom', 'financials.periodTo', 'financials.annualRentAed']).flatMap(field => cite(agreement, field))
    : intent === 'latest_signed_agreement' && agreement
      ? cite(agreement, isGenericDocumentType(agreement.docType) ? 'values.documentReference' : 'contractReference')
      : intent === 'ids_expiring_next_month' ? rows.flatMap(row => {
        const field = row.docType === 'emirates_id' ? 'expiryDate' : row.docType === 'passport' ? 'dateOfExpiry' : '';
        const value = object(row.extractedJson)[field];
        const match = typeof value === 'string' ? /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value) : null;
        const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
        const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 1);
        const time = match ? Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : NaN;
        return time >= start && time < end ? cite(row, field) : [];
      }) : [];
  return { intent, complete: result.complete,
    message: !result.complete ? 'Partial dossier (newest 100 active records): absence and latest results are not conclusive.'
      : intent === 'missing_documents' ? 'Evidence inventory only, not legal compliance. Signed entries require manual attestation; external verification remains necessary.'
        : citations.length ? 'Reviewed fields only. Signed means user-attested, not signature verification.'
          : 'No matching active reviewed records. No facts inferred.',
    checklist: intent === 'missing_documents' ? result.checklist : [],
    unsupportedRequirements: intent === 'missing_documents' ? result.unsupportedRequirements : [],
    citations,
  };
}

export function lifecycleChange(input: Record<string, unknown>) {
  if (!input || typeof input !== 'object' || Array.isArray(input) ||
    input.confirmed !== true || typeof input.status !== 'string' || !['draft', 'signed'].includes(input.status) ||
    typeof input.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(input.updatedAt) ||
    !Number.isFinite(Date.parse(input.updatedAt))) throw new AppError('Confirmed status and current updatedAt required', 400);
  return { updatedAt: new Date(input.updatedAt), lifecycleStatus: input.status as 'draft' | 'signed' };
}
