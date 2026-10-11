import { authFetch } from '../utils/authFetch';
import logger from '../utils/logger';

export interface ScanReview {
  demoOnly?: boolean;
  reviewConfirmed?: boolean;
  missingFields?: string[];
}

export function canUseScan(data: ScanReview | null | undefined): boolean {
  return !!data && !data.demoOnly && data.reviewConfirmed === true && !data.missingFields?.length;
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
  const parts = value.split('/');
  const iso = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : value;
  const time = Date.parse(iso);
  const days = Number.isFinite(time) ? Math.ceil((time - Date.now()) / 86400000) : 0;
  return { isExpired: Number.isFinite(time) && days < 0, daysUntilExpiry: days };
}

export async function saveReviewedScan(
  docType: string,
  data: ScanReview & object,
  referenceNumber: string,
  clientName: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!canUseScan(data))
    return { success: false, error: 'Review required. Demo or incomplete scans cannot be saved.' };
  try {
    const response = await authFetch('/api/henry/documents/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docType,
        extractedJson: data,
        referenceNumber,
        clientName,
        reviewConfirmed: true,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.id) {
      return { success: false, error: result.error || 'Document was not saved.' };
    }
    return { success: true, id: result.data.id };
  } catch {
    logger.error('Henry document save failed');
    return { success: false, error: 'Vault unavailable. Nothing was saved.' };
  }
}
