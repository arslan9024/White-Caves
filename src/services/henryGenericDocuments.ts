import { genericDocumentRegistry, genericDocumentTypes, genericValidation, type GenericDocumentType,
  type GenericValues, type ReviewedGenericDocument } from '../../server/shared/henryDocumentRegistry';
import { normalizeDocumentDate, normalizeDocumentText, parseDocumentNumber, readDocumentFields,
  markFieldReviewed, type ExtractionDiagnostics } from './henryDocumentParsing';
import { henryEmiratesIdScannerService } from './HenryEmiratesIdScannerService';
import { authFetch } from '../utils/authFetch';
import logger from '../utils/logger';
import type { VaultSaveOptions } from './henryScanReview';

export type GenericScan = ReviewedGenericDocument & { diagnostics: ExtractionDiagnostics; missingFields: string[] };
export function rankGenericTypes(text: string): Array<{ type: GenericDocumentType; score: number }> {
  const normalized = normalizeDocumentText(text).toLowerCase().slice(0, 65536);
  return genericDocumentTypes.map(type => ({ type,
    score: genericDocumentRegistry[type].markers.filter(marker => {
      const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u').test(normalized);
    }).length,
  })).filter(candidate => candidate.score > 0).sort((a, b) => b.score - a.score);
}
export function parseGenericDocument(type: GenericDocumentType, text: string): GenericScan {
  const specs = genericDocumentRegistry[type].fields;
  const { values: candidates, diagnostics } = readDocumentFields(normalizeDocumentText(text.slice(0, 65536)).slice(0, 65536),
    Object.fromEntries(specs.map(spec => [spec.key, spec.aliases])));
  const values: GenericValues = {};
  for (const spec of specs) {
    const converted = candidates[spec.key].map(value => spec.kind === 'date' ? strictDate(value)
      : spec.kind === 'amount' ? strictAmount(value) : value);
    const unique = [...new Set(converted.filter(value => value !== undefined && value !== ''))];
    values[spec.key] = unique[0] ?? '';
    const comparisons = converted.map((value, index) => value === '' || value === undefined
      ? `unparsed:${candidates[spec.key][index]}` : `${typeof value}:${value}`);
    if (new Set(comparisons).size > 1)
      diagnostics.fields[spec.key].state = 'conflict';
  }
  return { documentType: type, documentReference: String(values.documentReference || ''), values,
    demoOnly: false, reviewConfirmed: false, diagnostics, missingFields: genericValidation(type, values) };
}
function strictDate(value: string): string {
  const text = normalizeDocumentText(value).trim();
  if (!/^(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{1,2}\s+[\p{L}]+(?:\s*\/\s*[\p{L}]+)?\s+\d{4})$/u.test(text))
    return text;
  const bilingual = /^(\d{1,2})\s+([\p{L}]+)\s*\/\s*([\p{L}]+)\s+(\d{4})$/u.exec(text);
  if (bilingual) {
    const first = normalizeDocumentDate(`${bilingual[1]} ${bilingual[2]} ${bilingual[4]}`);
    const second = normalizeDocumentDate(`${bilingual[1]} ${bilingual[3]} ${bilingual[4]}`);
    if (!first || first !== second) return text;
    return first;
  }
  return normalizeDocumentDate(text) || text;
}
export function strictAmount(value: string): number | undefined {
  const normalized = normalizeDocumentText(value).replace(/٬/g, ',').replace(/٫/g, '.').trim();
  // Never extract a convenient numeric substring out of prose, a negative or an account number.
  if (!/^(?:AED\s*)?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?(?:\s*AED)?$/i.test(normalized)) return undefined;
  return parseDocumentNumber(normalized.replace(/\s*AED$/i, ''));
}
export function editGenericField(scan: GenericScan, key: string, text: string): GenericScan {
  const spec = genericDocumentRegistry[scan.documentType].fields.find(item => item.key === key);
  if (!spec) return scan;
  const value = spec.kind === 'amount' ? strictAmount(text) ?? text : text;
  const values = { ...scan.values, [key]: value };
  const diagnostics = markFieldReviewed(scan.diagnostics, key, value)!;
  diagnostics.fields[key] = { ...diagnostics.fields[key], values: scan.diagnostics.fields[key].values,
    textRanges: scan.diagnostics.fields[key].textRanges };
  return { ...scan, values, documentReference: String(values.documentReference ?? ''), reviewConfirmed: false,
    diagnostics,
    missingFields: genericValidation(scan.documentType, values) };
}
export async function extractGenericSource(file: File): Promise<{ text: string; warnings: string[]; ocrConfidence?: number }> {
  try {
    if (!file.size || file.size > 4 * 1024 * 1024 || !['application/pdf', 'image/png', 'image/jpeg'].includes(file.type))
      throw new Error('Unsupported source');
    const result = await henryEmiratesIdScannerService.extractDocumentText(file, undefined, text =>
      Math.max(...genericDocumentTypes.map(type => {
        const parsed = parseGenericDocument(type, text);
        const required = genericDocumentRegistry[type].fields.filter(spec => spec.required);
        return required.filter(spec => !parsed.missingFields.includes(spec.key)).length / required.length;
      })));
    return { text: [result.ocrText, result.streamText].filter(Boolean).join('\n').slice(0, 65536),
      warnings: result.warnings || [], ocrConfidence: result.ocrConfidence };
  } catch {
    logger.error('Henry generic extraction failed');
    throw new Error('Source extraction failed. Upload a readable PDF, PNG or JPEG (at most 4 MB); no previous extraction was reused.');
  }
}
export function genericReady(scan: GenericScan): boolean {
  return scan.demoOnly === false && scan.reviewConfirmed === true &&
    scan.documentReference === scan.values.documentReference &&
    genericValidation(scan.documentType, scan.values).length === 0 &&
    !Object.values(scan.diagnostics.fields).some(field => field.state === 'conflict');
}
export async function saveGenericDocument(scan: GenericScan, original: File, options: VaultSaveOptions = {}): Promise<string> {
  try {
    if (!genericReady(scan) || !original || !original.size || original.size > 4 * 1024 * 1024 ||
      !['application/pdf', 'image/png', 'image/jpeg'].includes(original.type)) throw new Error('Review required');
    const form = new FormData();
    const { sources: _sources, ...links } = options;
    form.append('metadata', JSON.stringify({ ...links, docType: scan.documentType,
      referenceNumber: scan.documentReference, reviewConfirmed: true, extractedJson: scan,
      title: genericDocumentRegistry[scan.documentType].label }));
    form.append('source', original);
    const response = await authFetch('/api/henry/documents/save', { method: 'POST', body: form });
    if (!response.ok) throw new Error('Save rejected');
    const result = await response.json();
    if (!result.success || typeof result.data?.id !== 'string' || !/^[a-f0-9]{24}$/i.test(result.data.id))
      throw new Error('Save unavailable');
    return result.data.id;
  } catch {
    logger.error('Henry generic vault save failed');
    throw new Error('Nothing confirmed saved. Review the current source, check vault access and retry.');
  }
}
