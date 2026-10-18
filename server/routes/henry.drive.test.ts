import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import type { HenryDriveSource } from '@prisma/client';

const mocks = vi.hoisted(() => {
  const model = () => ({ findFirst: vi.fn(), findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(),
    upsert: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() });
  return { db: { henryDriveConnection: model(), henryDriveOAuthState: model(), henryDriveSource: model(),
    henryScannedDocument: model(), henryDocumentAudit: model(),
    lead: model(), property: model(), lease: model(), transaction: model(), $transaction: vi.fn() },
  google: { metadata: vi.fn(), children: vi.fn(), identity: vi.fn(), content: vi.fn() },
  auth: { generateCodeVerifierAsync: vi.fn(), generateAuthUrl: vi.fn(), getToken: vi.fn(),
    setCredentials: vi.fn(), refreshAccessToken: vi.fn(), eagerRefreshThresholdMillis: 0, forceRefreshOnFailure: false } };
});
vi.mock('../database.js', () => ({ prisma: mocks.db }));
vi.mock('../middleware/rbac.js', () => ({
  requireMinRole: () => (req: Request, res: Response, next: NextFunction) =>
    req.headers['x-role'] === 'agent' ? next() : res.sendStatus(403),
}));
vi.mock('../services/henry/driveGoogle.js', () => ({
  driveConfigured: () => !!process.env.GOOGLE_DRIVE_CLIENT_ID,
  driveOAuth: () => mocks.auth,
  driveFolderMime: 'application/vnd.google-apps.folder', driveShortcutMime: 'application/vnd.google-apps.shortcut',
  driveMimes: ['application/pdf', 'image/png', 'image/jpeg'],
  DriveGoogle: class { metadata = mocks.google.metadata; children = mocks.google.children; identity = mocks.google.identity; content = mocks.google.content; },
}));
import router from './henry.drive';
import vaultRouter from './henry';
import { driveHash, openDrive, sealDrive } from '../services/henry/driveCrypto';
import { disconnectDrive, driveSession, finishDriveOAuth, startDriveOAuth, type DriveConnectionData } from '../services/henry/driveConnection';
import { approveDriveFolders, downloadDriveSource, freshDriveSource, indexDrive, reviewDriveSource, searchDrive, validateDriveProvenance } from '../services/henry/driveIndex';

const owner = '123456789012345678901234', other = '223456789012345678901234', id = '323456789012345678901234';
const date = new Date('2026-10-18T12:00:00Z'), identity = JSON.stringify({ id: 'synthetic-permission', label: 'Synthetic account' });
const folder = { id: 'root', mimeType: 'application/vnd.google-apps.folder', trashed: false };
const file = { id: 'synthetic-file', name: 'Synthetic client contract.pdf', mimeType: 'application/pdf',
  parents: ['root'], modifiedTime: date.toISOString(), version: '1', size: '14', md5Checksum: 'synthetic-md5', trashed: false };
const version = `1:${date.toISOString()}:synthetic-md5`;
const info = { fileId: file.id, name: file.name, mime: file.mimeType, version, modified: date.toISOString(), size: 14 };
function payload(roots = ['root']): DriveConnectionData {
  return { credentials: { access_token: 'synthetic-access', refresh_token: 'synthetic-refresh', expiry_date: Date.now() + 3600000 },
    identity, generation: 'synthetic-generation', roots };
}
const connection = (data = payload()) => ({ id, ownerUserId: owner, encryptedPayload: sealDrive(data), updatedAt: date });
const source = () => ({ id, ownerUserId: owner, fileKey: driveHash(file.id), encryptedPayload: sealDrive(info),
  stale: false, reviewedVersion: null, leadId: null, propertyId: null, tenancyId: null, transactionId: null, updatedAt: date });
function app(userId: string | undefined = owner) {
  const instance = express(); instance.use(express.json());
  instance.use((req, _res, next) => { Object.assign(req, { user: userId ? { id: userId } : undefined }); next(); });
  instance.use('/drive', router);
  instance.use((error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) =>
    res.status(error.statusCode || 500).json({ error: error.message }));
  return instance;
}
const post = (path: string, data: object, who = owner) => request(app(who)).post(`/drive/${path}`)
  .set('authorization', '******').set('x-role', 'agent').send(data);

describe('Henry separate-account Drive security and bounded inventory', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv('ENCRYPTION_KEY', 'a'.repeat(64)); vi.stubEnv('DATABASE_URL', 'mongodb://localhost/synthetic');
    vi.stubEnv('GOOGLE_DRIVE_CLIENT_ID', 'synthetic-client');
    mocks.db.$transaction.mockImplementation(async work => work(mocks.db));
    mocks.db.henryDriveConnection.findUnique.mockResolvedValue(connection());
    mocks.db.henryDriveConnection.updateMany.mockResolvedValue({ count: 1 });
    mocks.db.henryDriveSource.findFirst.mockResolvedValue(source());
    mocks.db.henryDriveSource.findUnique.mockResolvedValue(null);
    mocks.db.henryDriveSource.findMany.mockResolvedValue([]);
    mocks.db.henryDriveSource.updateMany.mockResolvedValue({ count: 1 });
    mocks.db.henryDriveSource.deleteMany.mockResolvedValue({ count: 0 });
    mocks.db.henryDriveOAuthState.deleteMany.mockResolvedValue({ count: 1 });
    mocks.db.henryDriveOAuthState.updateMany.mockResolvedValue({ count: 1 });
    for (const model of [mocks.db.lead, mocks.db.property, mocks.db.lease, mocks.db.transaction])
      model.findFirst.mockResolvedValue({ id });
    mocks.google.metadata.mockImplementation(async key => key === 'root' ? folder : file);
    mocks.google.children.mockResolvedValue({ files: [file], incomplete: false });
    mocks.google.identity.mockResolvedValue(identity);
    mocks.google.content.mockResolvedValue(Buffer.from('%PDF-synthetic'));
    mocks.auth.generateCodeVerifierAsync.mockResolvedValue({ codeVerifier: 'synthetic-pkce-verifier', codeChallenge: 'synthetic-pkce-challenge' });
    mocks.auth.generateAuthUrl.mockImplementation(options => `https://accounts.google.com/o/oauth2/v2/auth?state=${options.state}`);
    mocks.auth.getToken.mockResolvedValue({ tokens: payload().credentials });
    mocks.auth.refreshAccessToken.mockResolvedValue({ credentials: { access_token: 'synthetic-rotated', expiry_date: Date.now() + 3600000 } });
  });
  it('encrypts filenames, account identity, tokens and PKCE; fails closed without the vault key', async () => {
    const original = { name: file.name, identity, tokens: payload().credentials };
    const value = sealDrive(original);
    expect(value).not.toContain(file.name); expect(value).not.toContain('synthetic-access');
    expect(openDrive(value)).toEqual(original);
    const parts = value.split('.'); parts[2] = Buffer.from('tampered').toString('base64');
    expect(() => openDrive(parts.join('.'))).toThrow('Encrypted Drive storage unavailable');
    vi.stubEnv('ENCRYPTION_KEY', '');
    await expect(startDriveOAuth(owner, 'session')).rejects.toThrow('not configured');
  });
  it('starts with signed state, persisted encrypted PKCE and owner/session/expiry guards', async () => {
    const result = await startDriveOAuth(owner, 'session');
    const state = new URL(result.url).searchParams.get('state')!;
    const stored = mocks.db.henryDriveOAuthState.create.mock.calls[0][0].data;
    expect(stored).toMatchObject({ ownerUserId: owner, sessionHash: driveHash('session'), stateHash: driveHash(state) });
    expect(stored.expiresAt.getTime()).toBeGreaterThan(Date.now());
    expect(stored.encryptedPayload).not.toContain('synthetic-pkce');
    expect(openDrive(stored.encryptedPayload)).toEqual({ verifier: 'synthetic-pkce-verifier' });
    expect(mocks.auth.generateAuthUrl).toHaveBeenCalledWith(expect.objectContaining({
      code_challenge: 'synthetic-pkce-challenge', code_challenge_method: 'S256',
      scope: ['https://www.googleapis.com/auth/drive.readonly'], prompt: 'consent select_account',
    }));
  });
  async function authorization() {
    const result = await startDriveOAuth(owner, 'session');
    const state = new URL(result.url).searchParams.get('state')!;
    const data = mocks.db.henryDriveOAuthState.create.mock.calls[0][0].data;
    let available = true;
    mocks.db.henryDriveOAuthState.findFirst.mockImplementation(async ({ where }) =>
      available && where.ownerUserId === owner && where.sessionHash === driveHash('session') &&
      data.expiresAt > where.expiresAt.gt ? { id, ...data } : null);
    mocks.db.henryDriveOAuthState.updateMany.mockImplementation(async () => {
      const count = available ? 1 : 0; available = false; return { count };
    });
    return { state, code: 'synthetic-code' };
  }
  it('consumes state atomically once, exchanges PKCE server-side and resets default allowlist to empty', async () => {
    const input = await authorization();
    await finishDriveOAuth(owner, 'session', input);
    await expect(finishDriveOAuth(owner, 'session', input)).rejects.toThrow('already used');
    expect(mocks.auth.getToken).toHaveBeenCalledTimes(1);
    expect(mocks.auth.getToken).toHaveBeenCalledWith({ code: input.code, codeVerifier: 'synthetic-pkce-verifier' });
    const encrypted = mocks.db.henryDriveConnection.upsert.mock.calls[0][0].create.encryptedPayload;
    expect(openDrive<DriveConnectionData>(encrypted).roots).toEqual([]);
    expect(encrypted).not.toContain('Synthetic account');
    expect(mocks.db.henryDriveSource.deleteMany).toHaveBeenCalledWith({ where: { ownerUserId: owner } });
  });
  it('cannot resurrect a disconnected/canceled connection while the provider code exchange is in flight', async () => {
    const input = await authorization();
    mocks.db.henryDriveOAuthState.deleteMany.mockResolvedValue({ count: 0 });
    await expect(finishDriveOAuth(owner, 'session', input)).rejects.toThrow('canceled or expired');
    expect(mocks.db.henryDriveConnection.upsert).not.toHaveBeenCalled();
  });
  it.each(['other-owner', 'other-session', 'expired', 'tampered', 'consumed-race'])('rejects %s OAuth responses before token exchange', async scenario => {
    const input = await authorization();
    if (scenario === 'expired') mocks.db.henryDriveOAuthState.findFirst.mockResolvedValue(null);
    if (scenario === 'consumed-race') mocks.db.henryDriveOAuthState.updateMany.mockResolvedValue({ count: 0 });
    if (scenario === 'tampered') input.state += '-tampered';
    await expect(finishDriveOAuth(scenario === 'other-owner' ? other : owner, scenario === 'other-session' ? 'wrong' : 'session', input)).rejects.toThrow();
    expect(mocks.auth.getToken).not.toHaveBeenCalled();
  });
  it('retains a missing refresh token only for the same account; never mixes accounts', async () => {
    const input = await authorization();
    mocks.auth.getToken.mockResolvedValue({ tokens: { access_token: 'synthetic-new' } });
    await finishDriveOAuth(owner, 'session', input);
    const data = openDrive<DriveConnectionData>(mocks.db.henryDriveConnection.upsert.mock.calls[0][0].create.encryptedPayload);
    expect(data.credentials.refresh_token).toBe('synthetic-refresh');
    const next = await authorization();
    mocks.google.identity.mockResolvedValue(JSON.stringify({ id: 'another-account', label: 'Other synthetic' }));
    await expect(finishDriveOAuth(owner, 'session', next)).rejects.toThrow('Offline Drive consent');
  });
  it('persists refresh-token rotation encrypted before reads and retains previous token when absent', async () => {
    mocks.db.henryDriveConnection.findUnique.mockResolvedValue(connection({ ...payload(), credentials: {
      refresh_token: 'synthetic-refresh', expiry_date: 0,
    } }));
    await driveSession(owner);
    const stored = openDrive<DriveConnectionData>(mocks.db.henryDriveConnection.updateMany.mock.calls[0][0].data.encryptedPayload);
    expect(stored.credentials).toMatchObject({ access_token: 'synthetic-rotated', refresh_token: 'synthetic-refresh' });
    mocks.db.henryDriveConnection.findUnique.mockResolvedValue(connection({ ...payload(), credentials: {
      refresh_token: 'synthetic-refresh', expiry_date: 0,
    } }));
    mocks.auth.refreshAccessToken.mockResolvedValue({ credentials: { access_token: 'synthetic-2', refresh_token: 'synthetic-refresh-2' } });
    await driveSession(owner);
    const rotated = openDrive<DriveConnectionData>(mocks.db.henryDriveConnection.updateMany.mock.calls[1][0].data.encryptedPayload);
    expect(rotated.credentials.refresh_token).toBe('synthetic-refresh-2');
    expect(mocks.auth.setCredentials).toHaveBeenLastCalledWith(expect.objectContaining({ refresh_token: undefined }));
  });
  it.each(['refresh-denied', 'persist-race'])('fails closed on %s without reading remote originals', async scenario => {
    mocks.db.henryDriveConnection.findUnique.mockResolvedValue(connection({ ...payload(), credentials: { refresh_token: 'synthetic-refresh', expiry_date: 0 } }));
    if (scenario === 'refresh-denied') mocks.auth.refreshAccessToken.mockRejectedValue(new Error('provider secret synthetic-code'));
    else mocks.db.henryDriveConnection.updateMany.mockResolvedValue({ count: 0 });
    await expect(driveSession(owner)).rejects.toThrow('Reconnect');
    expect(mocks.google.content).not.toHaveBeenCalled();
  });
  it('defaults to no folders and never lists the whole Drive', async () => {
    mocks.db.henryDriveConnection.findUnique.mockResolvedValue(connection(payload([])));
    await expect(indexDrive(owner)).rejects.toThrow('Approve folders');
    expect(mocks.google.children).not.toHaveBeenCalled();
  });
  it.each([{}, { confirmed: false, folderIds: ['root'] }, { confirmed: true, folderIds: ['https://drive.google.com/root'] },
    { confirmed: true, folderIds: Array(6).fill('root') }])('rejects unconfirmed or malformed folder approval %j', async input => {
    await expect(approveDriveFolders(owner, input)).rejects.toThrow();
    expect(mocks.db.henryDriveSource.deleteMany).not.toHaveBeenCalled();
  });
  it.each(['trashed', 'shortcut', 'regular-file'])('rejects %s roots', async kind => {
    mocks.google.metadata.mockResolvedValue({ ...folder, trashed: kind === 'trashed',
      mimeType: kind === 'shortcut' ? 'application/vnd.google-apps.shortcut' : kind === 'regular-file' ? 'application/pdf' : folder.mimeType });
    await expect(approveDriveFolders(owner, { confirmed: true, folderIds: ['root'] })).rejects.toThrow('accessible');
  });
  it('validates explicit folders, replaces the index and permits an empty deny-all allowlist', async () => {
    await expect(approveDriveFolders(owner, { confirmed: true, folderIds: ['root'] })).resolves.toEqual(['root']);
    await expect(approveDriveFolders(owner, { confirmed: true, folderIds: [] })).resolves.toEqual([]);
    expect(mocks.db.henryDriveSource.deleteMany).toHaveBeenCalledTimes(2);
  });
  it.each(['moved', 'deleted', 'trashed', 'shortcut', 'revision', 'access-denied', 'folder-denied', 'too-deep'])('revalidates every source and refuses %s originals', async kind => {
    mocks.google.metadata.mockImplementation(async key => {
      if (kind === 'access-denied' || kind === 'deleted' || kind === 'folder-denied' && key === 'root') throw new Error('provider');
      if (key === 'root') return folder;
      if (key !== file.id) return { id: key, mimeType: folder.mimeType, parents: [`${key}-deeper`] };
      return { ...file, parents: [kind === 'moved' ? 'outside' : kind === 'too-deep' ? 'deep' : 'root'],
        trashed: kind === 'trashed', version: kind === 'revision' ? '2' : '1',
        mimeType: kind === 'shortcut' ? 'application/vnd.google-apps.shortcut' : file.mimeType };
    });
    await expect(downloadDriveSource(owner, id, version)).rejects.toThrow('stale or inaccessible');
    expect(mocks.google.content).not.toHaveBeenCalled();
    expect(mocks.db.henryDriveSource.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: { stale: true, reviewedVersion: null } }));
  });
  it('never resolves a source by file ID or other owner; metadata responses omit provider ID/tokens', async () => {
    mocks.db.henryDriveSource.findFirst.mockImplementation(async ({ where }) => where.ownerUserId === owner ? source() : null);
    await expect(freshDriveSource(other, id)).rejects.toThrow('not found');
    mocks.db.henryDriveSource.findMany.mockResolvedValue([source()]);
    const result = await searchDrive(owner, { q: 'client' });
    expect(JSON.stringify(result)).not.toContain(file.id);
    expect(JSON.stringify(result)).not.toContain('synthetic-access');
    expect(result.sources[0]).toMatchObject({ name: file.name, reviewed: false, stale: false });
  });
  it.each(['disconnect', 'folder-change', 'account-change', 'source-removed'])('blocks %s that occurs during an in-flight provider lookup', async scenario => {
    const originalConnection = connection();
    mocks.db.henryDriveConnection.findUnique.mockResolvedValueOnce(originalConnection).mockResolvedValue(
      scenario === 'disconnect' ? null : connection({ ...payload(),
        roots: scenario === 'folder-change' ? [] : ['root'],
        generation: scenario === 'account-change' ? 'another-generation' : 'synthetic-generation' }));
    if (scenario === 'source-removed') mocks.db.henryDriveSource.findFirst.mockResolvedValueOnce(source()).mockResolvedValue(null);
    await expect(freshDriveSource(owner, id)).rejects.toThrow('stale or inaccessible');
    expect(mocks.google.content).not.toHaveBeenCalled();
  });
  it('redacts stale/inaccessible metadata and searches filenames only, not document contents', async () => {
    mocks.db.henryDriveSource.findMany.mockResolvedValue([source()]);
    mocks.google.metadata.mockRejectedValue(new Error('denied'));
    const result = await searchDrive(owner, { q: 'contract' });
    expect(result.sources).toEqual([{ id, name: 'Unavailable or changed source', stale: true, reviewed: false }]);
    expect((await searchDrive(owner, { q: 'text not in filename' })).sources).toEqual([]);
  });
  it('indexes encrypted metadata without inferring owners or dossier links; skips shortcuts/native documents', async () => {
    mocks.google.children.mockResolvedValue({ files: [file, { id: 'shortcut', mimeType: 'application/vnd.google-apps.shortcut' },
      { id: 'doc', mimeType: 'application/vnd.google-apps.document' }], incomplete: false });
    const result = await indexDrive(owner);
    expect(result).toMatchObject({ count: 1, skipped: 2, partial: false });
    const data = mocks.db.henryDriveSource.upsert.mock.calls[0][0].create;
    expect(data).not.toHaveProperty('leadId'); expect(data).not.toHaveProperty('propertyId');
    expect(data.encryptedPayload).not.toContain(file.name);
    expect(mocks.google.content).not.toHaveBeenCalled();
    expect(mocks.db.lead.findFirst).not.toHaveBeenCalled();
  });
  it('invalidates all reviewed links when a remote revision changes', async () => {
    mocks.db.henryDriveSource.findUnique.mockResolvedValue({ ...source(), encryptedPayload: sealDrive({ ...info, version: 'old' }), reviewedVersion: 'old', leadId: id });
    await indexDrive(owner);
    expect(mocks.db.henryDriveSource.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({ reviewedVersion: null, leadId: null, propertyId: null, tenancyId: null, transactionId: null }),
    }));
  });
  function deferred() {
    let resolve!: () => void;
    const promise = new Promise<void>(done => { resolve = done; });
    return { promise, resolve };
  }
  function scanStore() {
    let row: ReturnType<typeof connection> | null = connection();
    let revision = date.getTime();
    const sources = new Map<string, HenryDriveSource>([[id, { ...source(), reviewedVersion: version, leadId: id }]]);
    mocks.db.henryDriveConnection.findUnique.mockImplementation(async () => row ? { ...row } : null);
    mocks.db.henryDriveConnection.updateMany.mockImplementation(async ({ where, data }) => {
      if (!row || where.id !== row.id || where.ownerUserId !== owner || where.encryptedPayload !== row.encryptedPayload)
        return { count: 0 };
      row = { ...row, ...data };
      return { count: 1 };
    });
    mocks.db.henryDriveConnection.deleteMany.mockImplementation(async () => { row = null; return { count: 1 }; });
    mocks.db.henryDriveSource.findUnique.mockImplementation(async () => sources.get(id) || null);
    mocks.db.henryDriveSource.findFirst.mockImplementation(async ({ where }) => {
      const current = sources.get(id);
      return current && (!where.encryptedPayload || current.encryptedPayload === where.encryptedPayload) &&
        (where.stale === undefined || current.stale === where.stale) ? { ...current } : null;
    });
    mocks.db.henryDriveSource.updateMany.mockImplementation(async ({ where, data }) => {
      let count = 0;
      for (const [key, current] of sources) {
        if (where.ownerUserId !== current.ownerUserId || where.id && where.id !== key ||
          where.encryptedPayload && where.encryptedPayload !== current.encryptedPayload ||
          where.updatedAt && where.updatedAt.getTime() !== current.updatedAt.getTime()) continue;
        sources.set(key, { ...current, ...data, updatedAt: new Date(++revision) }); count++;
      }
      return { count };
    });
    mocks.db.henryDriveSource.upsert.mockImplementation(async ({ update }) => {
      sources.set(id, { ...sources.get(id)!, ...update, updatedAt: new Date(++revision) });
    });
    mocks.db.henryDriveSource.deleteMany.mockImplementation(async ({ where }) => {
      let count = 0;
      for (const [key, current] of sources) {
        if (current.ownerUserId === where.ownerUserId && (where.stale === undefined || current.stale === where.stale)) {
          sources.delete(key); count++;
        }
      }
      return { count };
    });
    return { sources, connection: () => row };
  }
  it('claims one durable generation for simultaneous scan snapshots before marking sources stale', async () => {
    const store = scanStore(), entered = deferred(), resume = deferred();
    mocks.google.metadata.mockImplementationOnce(async () => folder).mockImplementationOnce(async () => {
      entered.resolve(); await resume.promise; return file;
    });
    const first = indexDrive(owner);
    const second = indexDrive(owner);
    const rejected = expect(second).rejects.toMatchObject({ statusCode: 409 });
    await entered.promise;
    await rejected;
    await expect(indexDrive(owner)).rejects.toMatchObject({ statusCode: 409 });
    expect(mocks.db.henryDriveSource.updateMany).toHaveBeenCalledTimes(1);
    resume.resolve();
    await first;
    expect(store.sources.get(id)).toMatchObject({ stale: false, reviewedVersion: version, leadId: id });
    expect(openDrive<DriveConnectionData>(store.connection()!.encryptedPayload).scan).toBeUndefined();
  });
  it('releases a failed scan so a subsequent scan can recover its sources', async () => {
    const store = scanStore();
    mocks.google.children.mockRejectedValueOnce(new Error('synthetic provider failure'));
    await expect(indexDrive(owner)).rejects.toThrow('synthetic provider failure');
    expect(openDrive<DriveConnectionData>(store.connection()!.encryptedPayload).scan).toBeUndefined();
    await expect(indexDrive(owner)).resolves.toMatchObject({ count: 1 });
    expect(store.sources.get(id)).toMatchObject({ stale: false, reviewedVersion: version });
  });
  it.each(['source-write', 'prune'])('recovers an expired generation and fences its delayed %s and cleanup', async stage => {
    const store = scanStore(), entered = deferred(), resume = deferred();
    const clock = vi.spyOn(Date, 'now'), started = Date.now();
    if (stage === 'source-write') {
      mocks.google.metadata.mockImplementationOnce(async () => folder).mockImplementationOnce(async () => {
        entered.resolve(); await resume.promise; return file;
      });
    } else {
      mocks.google.children.mockImplementationOnce(async () => {
        entered.resolve(); await resume.promise; return { files: [file], incomplete: false };
      });
    }
    const first = indexDrive(owner);
    const rejected = expect(first).rejects.toMatchObject({ statusCode: 409 });
    try {
      await entered.promise;
      clock.mockReturnValue(started + 110000);
      await expect(indexDrive(owner)).resolves.toMatchObject({ count: 1 });
      const completed = store.connection()!.encryptedPayload;
      resume.resolve(); await rejected;
      expect(store.connection()!.encryptedPayload).toBe(completed);
      expect(store.sources.get(id)).toMatchObject({ stale: false, reviewedVersion: version });
      expect(mocks.db.henryDriveSource.upsert).toHaveBeenCalledTimes(1);
      expect(mocks.db.henryDriveSource.deleteMany).toHaveBeenCalledTimes(1);
    } finally { clock.mockRestore(); resume.resolve(); }
  });
  it('recovers by expiry even when failed-scan lease cleanup also fails', async () => {
    const store = scanStore(), clock = vi.spyOn(Date, 'now'), started = Date.now();
    const persist = mocks.db.henryDriveConnection.updateMany.getMockImplementation()!;
    mocks.db.henryDriveConnection.updateMany.mockImplementationOnce(persist)
      .mockRejectedValueOnce(new Error('synthetic cleanup failure'));
    mocks.google.children.mockRejectedValueOnce(new Error('synthetic provider failure'));
    try {
      await expect(indexDrive(owner)).rejects.toThrow('synthetic provider failure');
      expect(openDrive<DriveConnectionData>(store.connection()!.encryptedPayload).scan).toBeDefined();
      await expect(indexDrive(owner)).rejects.toMatchObject({ statusCode: 409 });
      clock.mockReturnValue(started + 110000);
      await expect(indexDrive(owner)).resolves.toMatchObject({ count: 1 });
      expect(store.sources.get(id)).toMatchObject({ stale: false, reviewedVersion: version });
    } finally { clock.mockRestore(); }
  });
  it('normalizes simultaneous MongoDB transaction claim conflicts to retryable 409', async () => {
    mocks.db.$transaction.mockRejectedValueOnce({ code: 'P2034' });
    await expect(indexDrive(owner)).rejects.toMatchObject({ statusCode: 409 });
    expect(mocks.db.henryDriveSource.updateMany).not.toHaveBeenCalled();
    expect(mocks.google.children).not.toHaveBeenCalled();
  });
  it.each(['disconnect', 'allowlist'])('fences a scan after concurrent %s revocation', async action => {
    const store = scanStore(), entered = deferred(), resume = deferred();
    mocks.google.children.mockImplementationOnce(async () => {
      entered.resolve(); await resume.promise; return { files: [file], incomplete: false };
    });
    const scan = indexDrive(owner);
    const rejected = expect(scan).rejects.toMatchObject({ statusCode: 409 });
    await entered.promise;
    if (action === 'disconnect') await disconnectDrive(owner);
    else await approveDriveFolders(owner, { confirmed: true, folderIds: [] });
    const revoked = store.connection()?.encryptedPayload;
    resume.resolve(); await rejected;
    expect(store.connection()?.encryptedPayload).toBe(revoked);
    expect(store.sources.size).toBe(0);
    expect(mocks.db.henryDriveSource.upsert).not.toHaveBeenCalled();
  });
  it.each(['resync', 'review'])('does not invalidate a newer same-remote-version %s after an old lookup fails', async action => {
    const store = scanStore(), entered = deferred(), resume = deferred();
    mocks.google.metadata.mockImplementationOnce(async () => {
      entered.resolve(); await resume.promise; throw new Error('synthetic delayed failure');
    });
    const lookup = freshDriveSource(owner, id);
    const rejected = expect(lookup).rejects.toMatchObject({ statusCode: 409 });
    await entered.promise;
    if (action === 'resync') await indexDrive(owner);
    await reviewDriveSource(owner, id, { confirmed: true, version,
      updatedAt: store.sources.get(id)!.updatedAt.toISOString(), leadId: id });
    const reviewed = { ...store.sources.get(id)! };
    resume.resolve(); await rejected;
    expect(store.sources.get(id)).toEqual(reviewed);
    expect(store.sources.get(id)).toMatchObject({ stale: false, reviewedVersion: version, leadId: id });
  });
  it('stops pagination at six pages and reports incomplete search honestly', async () => {
    mocks.google.children.mockResolvedValue({ files: [], next: 'another', incomplete: true });
    const result = await indexDrive(owner);
    expect(result).toMatchObject({ pages: 6, count: 0, partial: true });
    expect(mocks.google.children).toHaveBeenCalledTimes(6);
  });
  it('stops at 100 files without importing bytes', async () => {
    const files = Array.from({ length: 150 }, (_, index) => ({ ...file, id: `file-${index}` }));
    mocks.google.children.mockResolvedValue({ files, incomplete: false });
    mocks.google.metadata.mockImplementation(async key => key === 'root' ? folder : { ...file, id: key });
    const result = await indexDrive(owner);
    expect(result).toMatchObject({ count: 100, partial: true });
    expect(mocks.db.henryDriveSource.upsert).toHaveBeenCalledTimes(100);
  });
  it('requires explicit authorized links and exact remote/local revisions', async () => {
    await expect(reviewDriveSource(owner, id, { confirmed: false })).rejects.toThrow('Explicit');
    await expect(reviewDriveSource(owner, id, { confirmed: true, updatedAt: date.toISOString() })).rejects.toThrow('revision');
    await expect(reviewDriveSource(owner, id, { confirmed: true, version, updatedAt: date.toISOString() })).rejects.toThrow('Choose');
    mocks.db.lead.findFirst.mockResolvedValue(null);
    await expect(reviewDriveSource(owner, id, { confirmed: true, version, updatedAt: date.toISOString(), leadId: id })).rejects.toThrow('not accessible');
    mocks.db.lead.findFirst.mockResolvedValue({ id });
    await reviewDriveSource(owner, id, { confirmed: true, version, updatedAt: date.toISOString(), leadId: id });
    expect(mocks.db.henryDriveSource.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ ownerUserId: owner, updatedAt: date }),
      data: expect.objectContaining({ leadId: id, reviewedVersion: version }) }));
    mocks.db.henryDriveSource.updateMany.mockResolvedValue({ count: 0 });
    await expect(reviewDriveSource(owner, id, { confirmed: true, version, updatedAt: date.toISOString(), leadId: id })).rejects.toThrow('changed');
  });
  it('binds archival provenance to authenticated owner, exact bytes and fresh remote revision', async () => {
    const original = await downloadDriveSource(owner, id, version);
    const upload = [{ buffer: original.bytes }] as Express.Multer.File[];
    const data = await validateDriveProvenance(owner, { proof: original.proof }, upload);
    expect(openDrive(data.encryptedDriveProvenance!)).toMatchObject({ fileId: file.id, version, sourceId: id, sourceIndex: 0 });
    const twoSides = await validateDriveProvenance(owner, { proof: original.proof },
      [{ buffer: Buffer.from('synthetic-other-side') }, ...upload] as Express.Multer.File[]);
    expect(openDrive(twoSides.encryptedDriveProvenance!)).toMatchObject({ sourceIndex: 1 });
    await expect(validateDriveProvenance(other, { proof: original.proof }, upload)).rejects.toThrow('does not match');
    await expect(validateDriveProvenance(owner, { proof: original.proof }, [{ buffer: Buffer.from('spoofed') }] as Express.Multer.File[])).rejects.toThrow('does not match');
    mocks.google.metadata.mockResolvedValue({ ...file, version: '2' });
    await expect(validateDriveProvenance(owner, { proof: original.proof }, upload)).rejects.toThrow('stale');
  });
  it('persists encrypted provenance through the actual existing multipart vault route and rejects spoofed bytes', async () => {
    const original = await downloadDriveSource(owner, id, version);
    mocks.db.henryScannedDocument.create.mockImplementation(async ({ data }) => ({ ...data, id, createdAt: date, updatedAt: date }));
    const instance = express();
    instance.use(express.json());
    instance.use((req, _res, next) => { Object.assign(req, { user: { id: owner } }); next(); });
    instance.use('/henry', vaultRouter);
    instance.use((error: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) =>
      res.status(error.statusCode || 500).json({ error: error.message }));
    const metadata = { docType: 'title_deed', reviewConfirmed: true, driveOrigin: { proof: original.proof },
      extractedJson: { certificateNumber: 'SYNTHETIC-42', ownerNameEn: 'SYNTHETIC OWNER', plotNumber: '42' } };
    const response = await request(instance).post('/henry/documents/save').set('x-role', 'agent')
      .field('metadata', JSON.stringify(metadata)).attach('source', original.bytes, { filename: 'synthetic.pdf', contentType: 'application/pdf' });
    expect(response.status).toBe(200);
    const saved = mocks.db.henryScannedDocument.create.mock.calls[0][0].data;
    expect(openDrive(saved.encryptedDriveProvenance)).toMatchObject({ fileId: file.id, version });
    expect(saved.encryptedDriveProvenance).not.toContain(file.id);
    expect(saved.encryptedSource).toBeTypeOf('string');
    expect(JSON.stringify(response.body)).not.toContain('encryptedDriveProvenance');
    mocks.db.henryScannedDocument.create.mockClear();
    const spoof = await request(instance).post('/henry/documents/save').set('x-role', 'agent')
      .field('metadata', JSON.stringify(metadata)).attach('source', Buffer.from('%PDF-spoofed'), { filename: 'synthetic.pdf', contentType: 'application/pdf' });
    expect(spoof.status).toBe(409);
    expect(mocks.db.henryScannedDocument.create).not.toHaveBeenCalled();
  });
  it('denies missing versions and oversized originals before content access', async () => {
    await expect(downloadDriveSource(owner, id, undefined)).rejects.toThrow('revision required');
    mocks.google.metadata.mockImplementation(async key => key === 'root' ? folder : { ...file, size: String(4 * 1024 * 1024 + 1) });
    await expect(downloadDriveSource(owner, id, version)).rejects.toThrow('stale');
    expect(mocks.google.content).not.toHaveBeenCalled();
  });
  it('disconnect clears only local owner-scoped encrypted data and never deletes Drive/vault files', async () => {
    await disconnectDrive(owner);
    for (const model of [mocks.db.henryDriveConnection, mocks.db.henryDriveSource, mocks.db.henryDriveOAuthState])
      expect(model.deleteMany).toHaveBeenCalledWith({ where: { ownerUserId: owner } });
    expect(mocks.google.content).not.toHaveBeenCalled();
  });
  it('status is authenticated, non-cacheable, setup-safe and never returns credentials', async () => {
    const response = await request(app()).get('/drive/status').set('x-role', 'agent');
    expect(response.status).toBe(200); expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body.data).toMatchObject({ connected: true, identity: 'Synthetic account' });
    expect(JSON.stringify(response.body)).not.toContain('synthetic-access');
    expect((await request(app()).get('/drive/status')).status).toBe(403);
    expect((await request(app('not-real')).get('/drive/status').set('x-role', 'agent')).status).toBe(401);
    vi.stubEnv('GOOGLE_DRIVE_CLIENT_ID', '');
    expect((await request(app()).get('/drive/status').set('x-role', 'agent')).body.data).toMatchObject({ configured: false });
  });
  it('callback finish requires an authenticated owner and matching browser bearer session', async () => {
    const input = await authorization();
    expect((await post('finish', input, other)).status).toBe(400);
    expect((await post('finish', input)).status).toBe(409); // different session than start
    expect(mocks.auth.getToken).not.toHaveBeenCalled();
  });
  it('dossier citations reauthorize the entity and isolate owner; do not become checklist evidence', async () => {
    mocks.db.henryDriveSource.findMany.mockResolvedValue([{ ...source(), reviewedVersion: version, leadId: id, propertyId: id }]);
    mocks.db.henryDriveSource.findFirst.mockResolvedValue({ ...source(), reviewedVersion: version, leadId: id, propertyId: id });
    const response = await request(app()).get(`/drive/dossiers/client/${id}`).set('x-role', 'agent');
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ inventoryOnly: true, sources: [{ id, name: file.name, stale: false }] });
    expect(mocks.db.henryDriveSource.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { ownerUserId: owner, leadId: id } }));
    mocks.db.lead.findFirst.mockResolvedValue(null);
    expect((await request(app()).get(`/drive/dossiers/client/${id}`).set('x-role', 'agent')).status).toBe(404);
  });
  it('sanitizes provider errors and never returns raw authorization requests', async () => {
    mocks.google.children.mockRejectedValue(new Error('provider secret synthetic-access synthetic-code'));
    const response = await post('index', {});
    expect(response.status).toBe(502);
    expect(JSON.stringify(response.body)).not.toContain('synthetic-access');
    expect(JSON.stringify(response.body)).not.toContain('synthetic-code');
    expect((await post('disconnect', {})).status).toBe(400);
  });
});
