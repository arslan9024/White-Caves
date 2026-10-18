import { authFetch } from '../utils/authFetch';
import logger from '../utils/logger';
import type { VaultSaveOptions } from './henryScanReview';

export interface DriveStatus {
  configured: boolean; connected: boolean; roots: string[]; identity?: string; indexedAt?: string; partial?: boolean;
}
export interface DriveSource {
  id: string; name: string; stale: boolean; reviewed?: boolean; mime?: string; version?: string;
  modified?: string; updatedAt?: string;
}
export interface DriveImport { file: File; driveOrigin: { proof: string }; sourceId: string }
export async function driveRequest<T>(path: string, body?: object): Promise<T> {
  try {
    const slow = path === 'index' || path === 'search' || path.startsWith('dossiers/');
    const response = await authFetch(`/api/henry/drive/${path}`, body === undefined ? (slow ? { timeout: 180000 } : undefined) : {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      ...(slow ? { timeout: 180000 } : {}),
    });
    if (!response.ok) {
      if (response.status === 409) throw new Error('Drive source, session or access changed. Reload/resync or reconnect, then review again.');
      if (response.status === 503) throw new Error('Drive setup is incomplete. Ask the server administrator to configure the separate Drive OAuth app and encrypted vault.');
      throw new Error('Drive request failed. Check access and retry.');
    }
    const result = await response.json();
    if (!result.success || !result.data) throw new Error('Drive response unavailable.');
    return result.data as T;
  } catch (error) {
    logger.error('Henry Drive request failed', { errorName: error instanceof Error ? error.name : 'UnknownError' });
    throw new Error(error instanceof Error ? error.message : 'Drive unavailable.');
  }
}
export function reviewDrive(source: DriveSource, links: VaultSaveOptions) {
  return driveRequest(`sources/${encodeURIComponent(source.id)}/review`, {
    ...links, version: source.version, updatedAt: source.updatedAt, confirmed: true,
  });
}
export async function loadDriveOriginal(source: DriveSource): Promise<DriveImport> {
  try {
    if (source.stale || !source.version) throw new Error('Fresh source required');
    const response = await authFetch(`/api/henry/drive/sources/${encodeURIComponent(source.id)}/original`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ version: source.version }),
      timeout: 180000,
    });
    if (!response.ok) throw new Error('Original unavailable');
    const blob = await response.blob();
    const proof = response.headers.get('X-Henry-Drive-Proof');
    if (!proof || !blob.size || blob.size > 4 * 1024 * 1024 ||
      !['application/pdf', 'image/png', 'image/jpeg'].includes(blob.type)) throw new Error('Invalid bounded original');
    return { file: new File([blob], `drive-original.${blob.type === 'application/pdf' ? 'pdf' : blob.type === 'image/png' ? 'png' : 'jpg'}`,
      { type: blob.type }), driveOrigin: { proof }, sourceId: source.id };
  } catch {
    logger.error('Henry Drive original unavailable');
    throw new Error('Original unavailable or changed. Resync and review again. Only PDF, PNG and JPEG up to 4 MB are supported.');
  }
}
export async function openDriveOriginal(source: DriveSource, current = () => true) {
  const original = await loadDriveOriginal(source);
  if (!current()) return;
  const url = URL.createObjectURL(original.file);
  try {
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = original.file.name; anchor.click();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
