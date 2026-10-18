import { authFetch } from '../utils/authFetch';
import logger from '../utils/logger';

export type DossierKind = 'client' | 'property' | 'tenancy' | 'transaction';
export interface DossierRow {
  id: string; docType: string; referenceNumber: string; lifecycleStatus: 'draft' | 'signed';
  updatedAt: string; signedAttestedAt?: string | null;
}
export interface ChecklistItem {
  requirement: string; acceptedTypes: string[]; status: string; documentIds: string[];
}
export interface Dossier {
  active: DossierRow[]; superseded: DossierRow[]; complete: boolean; historyComplete: boolean;
  checklist: ChecklistItem[]; unsupportedRequirements: string[];
}
export const dossierQuestions = {
  missing_documents: 'What documents are missing?',
  latest_signed_agreement: 'Show the latest signed agreement',
  ids_expiring_next_month: 'Which IDs expire next month?',
  agreement_summary: 'Summarize the agreement',
} as const;
export interface DossierAnswer {
  message: string; complete: boolean; checklist: ChecklistItem[]; unsupportedRequirements: string[];
  citations: Array<{ documentId: string; field: string; value: string; origin: string;
    passages: Array<{ text: string; origin: string }>; evidenceNote: string }>;
}
async function request<T>(path: string, body?: object, method = 'POST'): Promise<T> {
  let message = 'Dossier unavailable. Retry.';
  try {
    const response = await authFetch(`/api/henry/documents/${path}`, body ? {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    } : undefined);
    if (!response.ok) {
      message = response.status === 409 ? 'Document changed. Reload before confirming again.' : 'Dossier request failed. Check access and retry.';
      throw new Error(message);
    }
    const result = await response.json();
    if (result.success !== true || !result.data) throw new Error('Dossier response unavailable.');
    return result.data as T;
  } catch (error) {
    logger.error('Henry operations request failed', { method, errorName: error instanceof Error ? error.name : 'UnknownError' });
    throw new Error(message);
  }
}
export const readDossier = (kind: DossierKind, id: string) =>
  request<Dossier>(`dossiers/${kind}/${encodeURIComponent(id)}`);
export const askDossier = (kind: DossierKind, id: string, question: string) =>
  request<DossierAnswer>(`dossiers/${kind}/${encodeURIComponent(id)}/assist`, { question });
export const changeDocumentStatus = (row: DossierRow) =>
  request<DossierRow>(`${encodeURIComponent(row.id)}/lifecycle`,
    { status: row.lifecycleStatus === 'signed' ? 'draft' : 'signed', updatedAt: row.updatedAt, confirmed: true }, 'PATCH');
export const readDossierDocument = (id: string) => request<DossierRow>(encodeURIComponent(id));
export const attachDossierDocument = (row: DossierRow, kind: DossierKind, id: string) => {
  const field = { client: 'leadId', property: 'propertyId', tenancy: 'tenancyId', transaction: 'transactionId' }[kind];
  return request<DossierRow>(`${encodeURIComponent(row.id)}/links`,
    { [field]: id, updatedAt: row.updatedAt, confirmed: true }, 'PATCH');
};

export async function downloadHenryOriginal(id: string, side: number, current = () => true): Promise<void> {
  try {
    if (!/^[a-f0-9]{24}$/i.test(id) || ![0, 1].includes(side)) throw new Error('Invalid original selection');
    const response = await authFetch(`/api/henry/documents/${id}/download?side=${side}`);
    if (!response.ok) throw new Error('Original unavailable');
    const blob = await response.blob();
    if (!current()) return;
    const url = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `original-${side}`;
      anchor.click();
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch {
    logger.error('Henry original download failed', { side });
    throw new Error('Original unavailable. Check access and retry.');
  }
}
