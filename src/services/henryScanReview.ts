import { authFetch } from '../utils/authFetch';
import logger from '../utils/logger';
import type { ExtractionDiagnostics } from './henryDocumentParsing';

export interface ScanReview {
  demoOnly?: boolean;
  reviewConfirmed?: boolean;
  missingFields?: string[];
  diagnostics?: ExtractionDiagnostics;
}

export interface VaultSaveOptions {
  sources?: File[];
  leadId?: string;
  propertyId?: string;
  replacesId?: string;
}

export function canUseScan(data: ScanReview | null | undefined): boolean {
  return !!data && !data.demoOnly && data.reviewConfirmed === true && !data.missingFields?.length &&
    !Object.values(data.diagnostics?.fields || {}).some(field => field.state === 'conflict');
}

export function validScanDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  return (
    date.getUTCFullYear() === Number(match[3]) &&
    date.getUTCMonth() + 1 === Number(match[2]) &&
    date.getUTCDate() === Number(match[1])
  );
}

export function scanExpiry(value: string): { isExpired: boolean; daysUntilExpiry: number } {
  if (!validScanDate(value)) return { isExpired: false, daysUntilExpiry: NaN };
  const parts = value.split('/');
  const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const time = Date.parse(iso);
  const today = Math.floor(Date.now() / 86400000) * 86400000;
  const days = (time - today) / 86400000;
  return { isExpired: Number.isFinite(time) && days < 0, daysUntilExpiry: days };
}

export async function saveReviewedScan(
  docType: string,
  data: ScanReview & object,
  referenceNumber: string,
  clientName: string,
  options: VaultSaveOptions = {}
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!canUseScan(data))
    return { success: false, error: 'Review required. Demo or incomplete scans cannot be saved.' };
  try {
    const metadata = { docType, extractedJson: data, referenceNumber, clientName, reviewConfirmed: true,
      leadId: options.leadId, propertyId: options.propertyId, replacesId: options.replacesId };
    let body: string | FormData = JSON.stringify(metadata);
    if (options.sources?.length) {
      if (options.sources.reduce((total, file) => total + file.size, 0) > 4 * 1024 * 1024)
        return { success: false, error: 'Encrypted originals must total at most 4 MB. Compress or rescan first.' };
      const form = new FormData();
      form.append('metadata', JSON.stringify(metadata));
      options.sources.forEach(file => form.append('source', file));
      body = form;
    }
    const response = await authFetch('/api/henry/documents/save', {
      method: 'POST',
      ...(typeof body === 'string' ? { headers: { 'Content-Type': 'application/json' } } : {}),
      body,
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.id) {
      return { success: false, error: result.error || 'Document was not saved.' };
    }
    return { success: true, id: result.data.id };
  } catch (error) {
    logger.error('Henry document save failed', { docType, errorName: error instanceof Error ? error.name : 'UnknownError' });
    return { success: false, error: 'Vault unavailable. Nothing was saved.' };
  }
}
