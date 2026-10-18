import { AppError } from '../../middleware/errorHandler.js';
import { genericDocumentRegistry, genericValidation, isGenericDocumentType } from '../../shared/henryDocumentRegistry.js';

export function validateGenericDocument(type: unknown, fields: Record<string, unknown>, reference: unknown): void {
  if (!isGenericDocumentType(type)) return;
  const values = fields.values;
  if (fields.documentType !== type || fields.demoOnly !== false || fields.reviewConfirmed !== true ||
    !values || typeof values !== 'object' || Array.isArray(values))
    throw new AppError('Real source and explicit generic document review required', 400);
  const record = values as Record<string, unknown>;
  const allowed = genericDocumentRegistry[type].fields.map(field => field.key);
  if (Object.keys(record).some(key => !allowed.includes(key)) || genericValidation(type, record).length ||
    reference !== record.documentReference || fields.documentReference !== reference)
    throw new AppError('Invalid document fields or exact source reference', 400);
  const permitted = ['documentType', 'documentReference', 'values', 'demoOnly', 'reviewConfirmed', 'diagnostics', 'missingFields'];
  if (Object.keys(fields).some(key => !permitted.includes(key)))
    throw new AppError('Unsupported extracted document field', 400);
  const diagnostics = fields.diagnostics;
  if (!diagnostics || typeof diagnostics !== 'object' || Array.isArray(diagnostics))
    throw new AppError('Source extraction evidence required', 400);
  const evidence = diagnostics as Record<string, unknown>;
  if (typeof evidence.sourceText !== 'string' || evidence.sourceText.length > 65536 ||
    !evidence.fields || typeof evidence.fields !== 'object' || Array.isArray(evidence.fields))
    throw new AppError('Bounded source evidence required', 400);
  if (allowed.some(key => !Object.hasOwn(evidence.fields as object, key)))
    throw new AppError('Every supported field requires extraction or manual-review evidence', 400);
  for (const [key, entry] of Object.entries(evidence.fields)) {
    if (!allowed.includes(key) || !entry || typeof entry !== 'object' || Array.isArray(entry))
      throw new AppError('Invalid field evidence', 400);
    const item = entry as Record<string, unknown>;
    if (genericDocumentRegistry[type].fields.find(spec => spec.key === key)?.required && item.state !== 'extracted')
      throw new AppError('Resolve missing or conflicting required evidence', 400);
    if (!['text', 'review'].includes(String(item.source)) || !Array.isArray(item.values) ||
      item.values.length > 100 || item.values.some(value => typeof value !== 'string' || value.length > 65536))
      throw new AppError('Invalid source passages', 400);
    if (item.textRanges !== undefined && (!Array.isArray(item.textRanges) || item.textRanges.length > 100 ||
      item.textRanges.some(range => !range || typeof range !== 'object' ||
        !Number.isInteger(range.start) || !Number.isInteger(range.end) || range.start < 0 ||
        range.end <= range.start || range.end > String(evidence.sourceText).length)))
      throw new AppError('Invalid source passage range', 400);
  }
}
