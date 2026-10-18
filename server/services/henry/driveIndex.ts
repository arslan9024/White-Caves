import { createHash, randomBytes } from 'node:crypto';
import type { HenryDriveSource } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createLogger } from '../../utils/logger.js';
import { documentId, maxSourceBytes, validateDocumentLinks } from './documentVault.js';
import { driveHash, openDrive, sealDrive } from './driveCrypto.js';
import { driveSession, saveDriveConnection, type DriveSession, type DriveConnectionData } from './driveConnection.js';
import { driveFolderMime, driveMimes, driveShortcutMime, type DriveFile } from './driveGoogle.js';

export const driveLimits = { files: 100, pages: 6, depth: 3, roots: 5, scanMilliseconds: 45000 };
const log = createLogger('HenryDriveIndex');
export interface DriveMetadata { fileId: string; name: string; mime: string; version: string; modified: string; size: number }
export function driveFileId(value: unknown): string {
  if (typeof value !== 'string' || !/^[\w-]{1,200}$/.test(value)) throw new AppError('Enter a valid Drive folder ID (not a URL)', 400);
  return value;
}
export function driveVersion(file: DriveFile): string {
  if (!file.version || !file.modifiedTime) throw new AppError('Drive revision unavailable', 409);
  return `${file.version}:${file.modifiedTime}:${file.md5Checksum || ''}`;
}
function metadata(file: DriveFile): DriveMetadata {
  return { fileId: driveFileId(file.id), name: (file.name || 'Untitled').slice(0, 500), mime: file.mimeType || '',
    version: driveVersion(file), modified: file.modifiedTime!, size: Number(file.size || 0) };
}
export async function approvedMembership(session: DriveSession, file: DriveFile): Promise<void> {
  if (!session.data.roots.length || file.trashed || file.mimeType === driveShortcutMime)
    throw new AppError('Source is outside the approved folders or unavailable', 403);
  let current = file;
  const seen = new Set<string>();
  for (let depth = 0; depth <= driveLimits.depth + 1; depth++) {
    const id = driveFileId(current.id);
    if (current.trashed || current.mimeType === driveShortcutMime || seen.has(id)) break;
    seen.add(id);
    if (session.data.roots.includes(id)) {
      if (current.mimeType !== driveFolderMime) break;
      return;
    }
    if (current.parents?.length !== 1) break;
    current = await session.api.metadata(driveFileId(current.parents[0]));
    if (current.mimeType !== driveFolderMime) break;
  }
  throw new AppError('Source is outside the approved folders or nesting limit', 403);
}
export async function approveDriveFolders(ownerUserId: string, input: Record<string, unknown>) {
  if (input.confirmed !== true || !Array.isArray(input.folderIds) || input.folderIds.length > driveLimits.roots)
    throw new AppError('Explicit confirmation and at most five folder IDs required', 400);
  const roots = [...new Set(input.folderIds.map(driveFileId))];
  const session = await driveSession(ownerUserId);
  for (const root of roots) {
    const file = await session.api.metadata(root);
    if (file.trashed || file.mimeType !== driveFolderMime) throw new AppError('Every approved ID must be an accessible, non-trashed folder', 400);
  }
  session.data.roots = roots;
  session.data.indexedAt = undefined;
  session.data.partial = false;
  delete session.data.scan;
  await prisma.$transaction(async tx => {
    const changed = await tx.henryDriveConnection.updateMany({ where: { id: session.row.id, ownerUserId,
      encryptedPayload: session.row.encryptedPayload }, data: { encryptedPayload: sealDrive(session.data) } });
    if (changed.count !== 1) throw new AppError('Drive connection changed; reload', 409);
    await tx.henryDriveSource.deleteMany({ where: { ownerUserId } });
  });
  return roots;
}
export async function indexDrive(ownerUserId: string) {
  const session = await driveSession(ownerUserId);
  if (!session.data.roots.length) throw new AppError('Approve folders first. Whole-Drive indexing is disabled.', 409);
  if (session.data.scan && session.data.scan.expiresAt > Date.now())
    throw new AppError('Drive indexing already in progress; retry later', 409);
  const releasedPayload = sealDrive({ ...session.data, scan: undefined });
  session.data.scan = { generation: randomBytes(16).toString('hex'),
    expiresAt: Date.now() + driveLimits.scanMilliseconds + 60000 };
  const claimedPayload = sealDrive(session.data);
  try {
    await prisma.$transaction(async tx => {
      // Changing the ciphertext fences every older scan before any source is marked stale.
      const connected = await tx.henryDriveConnection.updateMany({ where: {
        id: session.row.id, ownerUserId, encryptedPayload: session.row.encryptedPayload,
      }, data: { encryptedPayload: claimedPayload } });
      if (connected.count !== 1) throw new AppError('Drive connection changed; retry indexing', 409);
      await tx.henryDriveSource.updateMany({ where: { ownerUserId }, data: { stale: true } });
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2034')
      throw new AppError('Drive connection changed; retry indexing', 409);
    throw error;
  }
  session.row.encryptedPayload = claimedPayload;
  try {
    return await scanDrive(ownerUserId, session);
  } catch (error) {
    log.warn('Drive scan failed; releasing its connection lease', { ownerUserId });
    try {
      await prisma.henryDriveConnection.updateMany({ where: {
        id: session.row.id, ownerUserId, encryptedPayload: claimedPayload,
      }, data: { encryptedPayload: releasedPayload } });
    } catch {
      // The durable expiry also recovers process crashes and failed cleanup.
      log.warn('Drive scan lease release failed; expiry will permit recovery', { ownerUserId });
    }
    throw error;
  }
}
async function scanDrive(ownerUserId: string, session: DriveSession) {
  const queue = session.data.roots.map(id => ({ id, depth: 0 }));
  const seen = new Set<string>();
  const deadline = Date.now() + driveLimits.scanMilliseconds;
  let pages = 0, count = 0, partial = false, skipped = 0;
  while (queue.length && pages < driveLimits.pages && count < driveLimits.files && Date.now() < deadline) {
    const folder = queue.shift()!;
    if (seen.has(folder.id)) continue;
    seen.add(folder.id);
    await approvedMembership(session, await session.api.metadata(folder.id));
    let token: string | undefined;
    do {
      const page = await session.api.children(folder.id, token);
      pages++;
      partial ||= page.incomplete;
      for (const file of page.files) {
        if (count >= driveLimits.files || Date.now() >= deadline) { partial = true; break; }
        if (file.trashed || file.mimeType === driveShortcutMime) { skipped++; continue; }
        if (file.mimeType === driveFolderMime) {
          if (folder.depth < driveLimits.depth) queue.push({ id: driveFileId(file.id), depth: folder.depth + 1 });
          else partial = true;
          continue;
        }
        if (!driveMimes.includes(file.mimeType || '') || Number(file.size || 0) > maxSourceBytes) { skipped++; continue; }
        // Listing is not proof of current membership: re-fetch the file and each ancestor.
        const current = await session.api.metadata(driveFileId(file.id));
        await approvedMembership(session, current);
        const info = metadata(current);
        const fileKey = driveHash(info.fileId);
        await prisma.$transaction(async tx => {
          if (!session.data.scan || session.data.scan.expiresAt <= Date.now())
            throw new AppError('Drive scan expired; retry indexing', 409);
          const connected = await tx.henryDriveConnection.updateMany({ where: {
            id: session.row.id, ownerUserId, encryptedPayload: session.row.encryptedPayload,
          }, data: { encryptedPayload: session.row.encryptedPayload } });
          if (connected.count !== 1) throw new AppError('Drive connection changed; retry indexing', 409);
          const old = await tx.henryDriveSource.findUnique({ where: { ownerUserId_fileKey: { ownerUserId, fileKey } } });
          const same = old && openDrive<DriveMetadata>(old.encryptedPayload).version === info.version;
          await tx.henryDriveSource.upsert({ where: { ownerUserId_fileKey: { ownerUserId, fileKey } },
            create: { ownerUserId, fileKey, encryptedPayload: sealDrive(info), stale: false },
            update: { encryptedPayload: sealDrive(info), stale: false, ...(!same ? {
              reviewedVersion: null, leadId: null, propertyId: null, tenancyId: null, transactionId: null,
            } : {}) } });
        });
        count++;
      }
      token = page.next;
      if (token && (pages >= driveLimits.pages || count >= driveLimits.files || Date.now() >= deadline)) partial = true;
    } while (token && pages < driveLimits.pages && count < driveLimits.files && Date.now() < deadline);
  }
  partial ||= queue.length > 0;
  session.data.indexedAt = new Date().toISOString();
  session.data.partial = partial;
  // Unvisited/moved/deleted sources cannot retain dossier citations after a bounded resync.
  await saveDriveConnection(session, true);
  return { count, pages, partial, skipped, limits: driveLimits };
}
export async function freshDriveSource(ownerUserId: string, id: unknown, expected?: unknown) {
  const source = await prisma.henryDriveSource.findFirst({ where: { ownerUserId, id: documentId(id) } });
  if (!source) throw new AppError('Drive source not found', 404);
  const session = await driveSession(ownerUserId);
  const stored = openDrive<DriveMetadata>(source.encryptedPayload);
  try {
    const file = await session.api.metadata(stored.fileId);
    await approvedMembership(session, file);
    if (!driveMimes.includes(file.mimeType || '') || Number(file.size || 0) > maxSourceBytes ||
      driveVersion(file) !== stored.version || (expected !== undefined && expected !== stored.version) || source.stale)
      throw new AppError('Drive source changed. Resync and explicitly review again.', 409);
    // Folder approval/disconnect may change while Google requests are in flight.
    const connection = await prisma.henryDriveConnection.findUnique({ where: { ownerUserId } });
    const latest = connection ? openDrive<DriveConnectionData>(connection.encryptedPayload) : null;
    if (!latest || latest.generation !== session.data.generation ||
      JSON.stringify(latest.roots) !== JSON.stringify(session.data.roots) ||
      !await prisma.henryDriveSource.findFirst({ where: {
        id: source.id, ownerUserId, encryptedPayload: source.encryptedPayload, stale: false,
      } }))
      throw new AppError('Drive connection or source changed during access', 409);
    return { source, info: metadata(file), session };
  } catch {
    log.warn('Drive source freshness/membership validation failed; marking local source stale');
    await prisma.henryDriveSource.updateMany({ where: { id: source.id, ownerUserId,
      encryptedPayload: source.encryptedPayload, updatedAt: source.updatedAt },
    data: { stale: true, reviewedVersion: null } });
    throw new AppError('Drive source is stale or inaccessible. Resync before review or access.', 409);
  }
}
function sourceView(source: HenryDriveSource, info: DriveMetadata) {
  return { id: source.id, name: info.name, mime: info.mime, modified: info.modified, version: info.version,
    updatedAt: source.updatedAt.toISOString(), reviewed: source.reviewedVersion === info.version,
    stale: false, leadId: source.leadId, propertyId: source.propertyId, tenancyId: source.tenancyId,
    transactionId: source.transactionId };
}
export async function searchDrive(ownerUserId: string, input: Record<string, unknown>) {
  if (typeof input.q !== 'string' || input.q.length > 150) throw new AppError('Metadata search text must be at most 150 characters', 400);
  const page = input.page ?? 1;
  if (typeof page !== 'number' || !Number.isInteger(page) || page < 1 || page > 4) throw new AppError('Invalid index page', 400);
  const rows = await prisma.henryDriveSource.findMany({ where: { ownerUserId }, orderBy: { id: 'asc' }, take: 101 });
  const matches = rows.slice(0, 100).filter(row => openDrive<DriveMetadata>(row.encryptedPayload).name.toLowerCase().includes((input.q as string).toLowerCase()));
  const result = [];
  const deadline = Date.now() + driveLimits.scanMilliseconds;
  let partial = rows.length > 100;
  for (const row of matches.slice((page - 1) * 25, page * 25)) {
    if (Date.now() >= deadline) { partial = true; break; }
    try {
      const fresh = await freshDriveSource(ownerUserId, row.id);
      result.push(sourceView(fresh.source, fresh.info));
    } catch {
      result.push({ id: row.id, name: 'Unavailable or changed source', stale: true, reviewed: false });
    }
  }
  return { sources: result, hasMore: matches.length > page * 25, bounded: true, partial };
}
export async function reviewDriveSource(ownerUserId: string, id: unknown, input: Record<string, unknown>) {
  if (input.confirmed !== true || typeof input.updatedAt !== 'string' || !Number.isFinite(Date.parse(input.updatedAt)) ||
    typeof input.version !== 'string') throw new AppError('Explicit current-revision review required', 400);
  const { source, info } = await freshDriveSource(ownerUserId, id, input.version);
  const links = await validateDocumentLinks(ownerUserId, input);
  if (!Object.values(links).some(Boolean)) throw new AppError('Choose at least one authorized existing dossier', 400);
  const changed = await prisma.henryDriveSource.updateMany({ where: { id: source.id, ownerUserId, updatedAt: new Date(input.updatedAt),
    encryptedPayload: source.encryptedPayload, stale: false },
  data: { ...links, reviewedVersion: info.version } });
  if (changed.count !== 1) throw new AppError('Source changed; reload before confirming', 409);
  return { reviewed: true };
}
interface DriveProof { owner: string; sourceId: string; version: string; sha256: string; expires: number; fileId: string; modified: string }
const digest = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');
export async function downloadDriveSource(ownerUserId: string, id: unknown, version: unknown) {
  if (typeof version !== 'string') throw new AppError('Exact displayed source revision required', 400);
  const current = await freshDriveSource(ownerUserId, id, version);
  if (current.info.size > maxSourceBytes) throw new AppError('Drive original exceeds 4 MB', 413);
  const bytes = await current.session.api.content(current.info.fileId, current.info.mime);
  await freshDriveSource(ownerUserId, id, current.info.version);
  const proof = sealDrive({ owner: ownerUserId, sourceId: current.source.id, version: current.info.version,
    sha256: digest(bytes), expires: Date.now() + 60 * 60000, fileId: current.info.fileId, modified: current.info.modified } satisfies DriveProof);
  return { bytes, mime: current.info.mime, proof };
}
export async function validateDriveProvenance(owner: string, input: unknown, files: Express.Multer.File[]) {
  if (input === undefined) return {};
  if (!input || typeof input !== 'object' || !('proof' in input) || typeof input.proof !== 'string' || input.proof.length > 5000)
    throw new AppError('Invalid Drive provenance', 400);
  const proof = openDrive<DriveProof>(input.proof);
  const sourceIndex = files.findIndex(file => digest(file.buffer) === proof.sha256);
  if (proof.owner !== owner || proof.expires < Date.now() || !files.length || files.length > 2 || sourceIndex < 0)
    throw new AppError('Drive original proof expired or does not match this upload', 409);
  await freshDriveSource(owner, proof.sourceId, proof.version);
  return { encryptedDriveProvenance: sealDrive({ sourceId: proof.sourceId, fileId: proof.fileId,
    version: proof.version, modified: proof.modified, sourceIndex, sha256: proof.sha256, confirmedAt: new Date().toISOString() }) };
}
