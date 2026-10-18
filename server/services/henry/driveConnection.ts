import { randomBytes } from 'node:crypto';
import { CodeChallengeMethod } from 'google-auth-library';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { createLogger } from '../../utils/logger.js';
import { driveHash, openDrive, sealDrive } from './driveCrypto.js';
import { DriveGoogle, driveOAuth, type DriveCredentials } from './driveGoogle.js';
import { vaultKey } from './documentVault.js';

const log = createLogger('HenryDrive');
export interface DriveConnectionData {
  credentials: DriveCredentials; identity: string; roots: string[]; generation: string;
  indexedAt?: string; partial?: boolean;
  scan?: { generation: string; expiresAt: number };
}
export async function startDriveOAuth(ownerUserId: string, session: string) {
  vaultKey();
  if (!session) throw new AppError('Authenticated browser session required', 401);
  const client = driveOAuth();
  const nonce = randomBytes(32).toString('base64url');
  const state = `${nonce}.${driveHash(`${ownerUserId}:${nonce}`)}`;
  const pkce = await client.generateCodeVerifierAsync();
  // Replacing an outstanding attempt cancels it; the callback is consumed atomically.
  await prisma.henryDriveOAuthState.deleteMany({ where: { ownerUserId } });
  await prisma.henryDriveOAuthState.create({ data: {
    ownerUserId, stateHash: driveHash(state), sessionHash: driveHash(session),
    encryptedPayload: sealDrive({ verifier: pkce.codeVerifier }), expiresAt: new Date(Date.now() + 5 * 60000),
  } });
  return { url: client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/drive.readonly'], access_type: 'offline',
    prompt: 'consent select_account', state, code_challenge: pkce.codeChallenge, code_challenge_method: CodeChallengeMethod.S256,
  }) };
}
export async function finishDriveOAuth(ownerUserId: string, session: string, input: Record<string, unknown>) {
  if (typeof input.state !== 'string' || input.state.length > 200 || typeof input.code !== 'string' ||
    !input.code || input.code.length > 4096 || !session) throw new AppError('Invalid Drive authorization response', 400);
  const [nonce, signature] = input.state.split('.');
  if (!nonce || signature !== driveHash(`${ownerUserId}:${nonce}`)) throw new AppError('Invalid Drive authorization state', 400);
  const stateHash = driveHash(input.state);
  const where = { ownerUserId, stateHash, sessionHash: driveHash(session), expiresAt: { gt: new Date() }, claimed: false };
  const state = await prisma.henryDriveOAuthState.findFirst({ where });
  if (!state || (await prisma.henryDriveOAuthState.updateMany({ where: { ...where, id: state.id },
    data: { claimed: true } })).count !== 1)
    throw new AppError('Drive authorization expired, already used or belongs to another session', 409);
  const client = driveOAuth();
  const exchanged = await client.getToken({ code: input.code, codeVerifier: openDrive<{ verifier: string }>(state.encryptedPayload).verifier });
  const tokens = { ...exchanged.tokens };
  client.setCredentials(tokens);
  const identity = await new DriveGoogle(client).identity();
  const previous = await prisma.henryDriveConnection.findUnique({ where: { ownerUserId } });
  const old = previous ? openDrive<DriveConnectionData>(previous.encryptedPayload) : null;
  if (old?.identity === identity && !tokens.refresh_token) tokens.refresh_token = old.credentials.refresh_token;
  if (!tokens.refresh_token) throw new AppError('Offline Drive consent required. Reconnect and grant read-only access.', 409);
  const payload: DriveConnectionData = { credentials: tokens, identity, roots: [], generation: randomBytes(16).toString('hex') };
  await prisma.$transaction(async tx => {
    const consumed = await tx.henryDriveOAuthState.deleteMany({ where: {
      id: state.id, ownerUserId, claimed: true, expiresAt: { gt: new Date() },
    } });
    if (consumed.count !== 1) throw new AppError('Drive authorization canceled or expired; reconnect', 409);
    await tx.henryDriveSource.deleteMany({ where: { ownerUserId } });
    await tx.henryDriveConnection.upsert({ where: { ownerUserId },
      create: { ownerUserId, encryptedPayload: sealDrive(payload) }, update: { encryptedPayload: sealDrive(payload) } });
  });
}
export async function driveSession(ownerUserId: string) {
  vaultKey();
  const row = await prisma.henryDriveConnection.findUnique({ where: { ownerUserId } });
  if (!row) throw new AppError('Connect your separate Drive account first', 409);
  const data = openDrive<DriveConnectionData>(row.encryptedPayload);
  const auth = driveOAuth();
  auth.setCredentials(data.credentials);
  // Refresh explicitly before exposing the adapter. Persist rotated refresh tokens before any read.
  if (!data.credentials.access_token || (data.credentials.expiry_date || 0) < Date.now() + 60000) {
    try {
      const refreshed = (await auth.refreshAccessToken()).credentials;
      data.credentials = { ...data.credentials, ...refreshed,
        refresh_token: refreshed.refresh_token || data.credentials.refresh_token };
      if (!data.credentials.access_token || !data.credentials.refresh_token) throw new Error('Missing credentials');
      const encryptedPayload = sealDrive(data);
      const changed = await prisma.henryDriveConnection.updateMany({ where: { id: row.id, ownerUserId,
        encryptedPayload: row.encryptedPayload }, data: { encryptedPayload } });
      if (changed.count !== 1) throw new AppError('Drive connection changed; retry', 409);
      row.encryptedPayload = encryptedPayload;
      auth.setCredentials(data.credentials);
    } catch {
      log.warn('Drive credential refresh failed; reconnect required');
      throw new AppError('Drive access unavailable. Reconnect your account and retry.', 409);
    }
  }
  // Prevent hidden refreshes whose rotated credentials could not be persisted.
  auth.eagerRefreshThresholdMillis = 0;
  auth.forceRefreshOnFailure = false;
  auth.setCredentials({ ...data.credentials, refresh_token: undefined });
  return { row, data, api: new DriveGoogle(auth) };
}
export type DriveSession = Awaited<ReturnType<typeof driveSession>>;
export async function saveDriveConnection(session: DriveSession, pruneStale = false) {
  await prisma.$transaction(async tx => {
    if (pruneStale && (!session.data.scan || session.data.scan.expiresAt <= Date.now()))
      throw new AppError('Drive scan expired; retry indexing', 409);
    const changed = await tx.henryDriveConnection.updateMany({ where: { id: session.row.id,
      ownerUserId: session.row.ownerUserId, encryptedPayload: session.row.encryptedPayload },
    data: { encryptedPayload: sealDrive({ ...session.data, scan: undefined }) } });
    if (changed.count !== 1) throw new AppError('Drive connection changed; reload', 409);
    if (pruneStale) await tx.henryDriveSource.deleteMany({ where: { ownerUserId: session.row.ownerUserId, stale: true } });
  });
}
export async function disconnectDrive(ownerUserId: string) {
  // Local revocation is immediate even if Google is unavailable. No provider files are touched.
  await prisma.$transaction(async tx => {
    await tx.henryDriveConnection.deleteMany({ where: { ownerUserId } });
    await tx.henryDriveSource.deleteMany({ where: { ownerUserId } });
    await tx.henryDriveOAuthState.deleteMany({ where: { ownerUserId } });
  });
}
