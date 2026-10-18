import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authFetch } from '../utils/authFetch';
import { driveRequest, loadDriveOriginal, type DriveSource } from './henryDrive';

vi.mock('../utils/authFetch', () => ({ authFetch: vi.fn() }));
const source: DriveSource = { id: 'a'.repeat(24), name: 'Synthetic sensitive filename.pdf', stale: false, version: 'synthetic-revision' };
beforeEach(() => { vi.resetAllMocks(); });
describe('Henry authenticated Drive frontend contract', () => {
  it('uses POST metadata search, not filename/token/reference URL query strings', async () => {
    vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: { sources: [] } })));
    await driveRequest('search', { q: 'synthetic-private-name', page: 1 });
    expect(authFetch).toHaveBeenCalledWith('/api/henry/drive/search', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: 'synthetic-private-name', page: 1 }),
      timeout: 180000,
    });
  });
  it('creates a safe File for the existing OCR intake using authenticated bounded content and proof', async () => {
    vi.mocked(authFetch).mockResolvedValue(new Response(new Blob(['%PDF-synthetic'], { type: 'application/pdf' }),
      { headers: { 'Content-Type': 'application/pdf', 'X-Henry-Drive-Proof': 'synthetic-encrypted-proof' } }));
    const result = await loadDriveOriginal(source);
    expect(result.file).toBeInstanceOf(File);
    expect(result.file.type).toBe('application/pdf');
    expect(result.file.name).toBe('drive-original.pdf');
    expect(result.driveOrigin).toEqual({ proof: 'synthetic-encrypted-proof' });
    expect(authFetch).toHaveBeenCalledWith(`/api/henry/drive/sources/${source.id}/original`, expect.objectContaining({
      method: 'POST', body: JSON.stringify({ version: source.version }),
    }));
    expect(String(vi.mocked(authFetch).mock.calls[0][0])).not.toContain('Synthetic sensitive');
  });
  it.each([
    { type: 'text/html', proof: 'proof', size: 10 },
    { type: 'image/svg+xml', proof: 'proof', size: 10 },
    { type: 'application/pdf', proof: '', size: 10 },
    { type: 'application/pdf', proof: 'proof', size: 0 },
    { type: 'application/pdf', proof: 'proof', size: 4 * 1024 * 1024 + 1 },
  ])('refuses invalid or unproven original %j', async input => {
    const blob = new Blob([new Uint8Array(input.size)], { type: input.type });
    vi.mocked(authFetch).mockResolvedValue({ ok: true, blob: async () => blob,
      headers: new Headers({ 'X-Henry-Drive-Proof': input.proof }) } as Response);
    await expect(loadDriveOriginal(source)).rejects.toThrow('Only PDF');
  });
  it('rejects stale sources without initiating a request', async () => {
    await expect(loadDriveOriginal({ ...source, stale: true })).rejects.toThrow('unavailable');
    expect(authFetch).not.toHaveBeenCalled();
  });
  it.each([409, 503, 403])('normalizes status %s without reflecting provider response data', async status => {
    vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ error: 'provider token synthetic-secret' }), { status }));
    await expect(driveRequest('search', { q: '' })).rejects.not.toThrow('synthetic-secret');
  });
});
