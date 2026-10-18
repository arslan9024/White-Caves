import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Readable } from 'node:stream';
import { OAuth2Client } from 'google-auth-library';
const mocks = vi.hoisted(() => ({ get: vi.fn(), list: vi.fn(), about: vi.fn(), drive: vi.fn(), oauth: vi.fn() }));
vi.mock('googleapis', () => ({ google: { drive: mocks.drive, auth: { OAuth2: class { constructor(...args: unknown[]) { mocks.oauth(...args); } } } } }));
import { DriveGoogle, driveConfigured, driveOAuth } from './driveGoogle';

beforeEach(() => {
  vi.resetAllMocks();
  mocks.drive.mockReturnValue({ files: { get: mocks.get, list: mocks.list }, about: { get: mocks.about } });
  vi.stubEnv('GOOGLE_DRIVE_CLIENT_ID', 'synthetic-client'); vi.stubEnv('GOOGLE_DRIVE_CLIENT_SECRET', 'synthetic-secret');
  vi.stubEnv('GOOGLE_DRIVE_REDIRECT_URI', 'https://app.example/henry-drive-callback');
});
const adapter = () => new DriveGoogle(new OAuth2Client());
describe('Henry Google read-only adapter', () => {
  it('uses only the separate Drive client and exact callback without Calendar settings', () => {
    expect(driveConfigured()).toBe(true); driveOAuth();
    expect(mocks.oauth).toHaveBeenCalledWith('synthetic-client', 'synthetic-secret', 'https://app.example/henry-drive-callback');
    vi.stubEnv('GOOGLE_DRIVE_CLIENT_SECRET', '');
    expect(driveConfigured()).toBe(false); expect(() => driveOAuth()).toThrow('setup required');
  });
  it.each(['http://external.example/henry-drive-callback', 'https://app.example/other',
    'https://app.example/henry-drive-callback?redirect=evil', 'https://app.example/henry-drive-callback#token'])('rejects unsafe callback %s', redirect => {
    vi.stubEnv('GOOGLE_DRIVE_REDIRECT_URI', redirect);
    expect(() => driveOAuth()).toThrow('redirect must be');
  });
  it('supports explicitly accessible shared-drive files without broad corpora search', async () => {
    mocks.get.mockResolvedValue({ data: { id: 'folder' } });
    mocks.list.mockResolvedValue({ data: { files: [], nextPageToken: 'next', incompleteSearch: true } });
    const api = adapter(); await api.metadata('file'); const page = await api.children('folder', 'previous');
    expect(mocks.get).toHaveBeenCalledWith(expect.objectContaining({ fileId: 'file', supportsAllDrives: true }), expect.objectContaining({ timeout: 15000, retry: false }));
    expect(mocks.list).toHaveBeenCalledWith(expect.objectContaining({ q: "'folder' in parents and trashed = false",
      pageToken: 'previous', pageSize: 50, includeItemsFromAllDrives: true }), expect.any(Object));
    expect(page).toEqual({ files: [], next: 'next', incomplete: true });
  });
  it.each([
    ['application/pdf', Buffer.from('%PDF-synthetic')],
    ['image/jpeg', Buffer.from([255, 216, 255, 0])],
    ['image/png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0])],
  ])('reads a bounded %s original only when its file magic matches', async (mime, bytes) => {
    mocks.get.mockResolvedValue({ data: Readable.from([bytes]) });
    await expect(adapter().content('file', mime)).resolves.toEqual(bytes);
    expect(mocks.get).toHaveBeenCalledWith({ fileId: 'file', alt: 'media', supportsAllDrives: true },
      expect.objectContaining({ responseType: 'stream', timeout: 15000 }));
  });
  it.each(['text/html', 'image/svg+xml', 'application/vnd.google-apps.document'])('never exports or renders %s', async mime => {
    await expect(adapter().content('file', mime)).rejects.toThrow('not exported');
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it.each([Buffer.from('<html>not a PDF</html>'), Buffer.alloc(0)])('rejects empty or signature-spoofed original', async bytes => {
    mocks.get.mockResolvedValue({ data: Readable.from([bytes]) });
    await expect(adapter().content('file', 'application/pdf')).rejects.toThrow('signature');
  });
  it('stops and destroys the stream immediately above four MB', async () => {
    const stream = Readable.from([Buffer.from('%PDF-'), Buffer.alloc(4 * 1024 * 1024)]);
    mocks.get.mockResolvedValue({ data: stream });
    await expect(adapter().content('file', 'application/pdf')).rejects.toThrow('exceeds 4 MB');
    expect(stream.destroyed).toBe(true);
  });
  it('requires a durable provider account identity without logging it', async () => {
    mocks.about.mockResolvedValue({ data: { user: { permissionId: 'synthetic-id', emailAddress: 'synthetic@example.invalid' } } });
    await expect(adapter().identity()).resolves.toBe(JSON.stringify({ id: 'synthetic-id', label: 'synthetic@example.invalid' }));
    mocks.about.mockResolvedValue({ data: { user: {} } });
    await expect(adapter().identity()).rejects.toThrow('identity unavailable');
  });
});
