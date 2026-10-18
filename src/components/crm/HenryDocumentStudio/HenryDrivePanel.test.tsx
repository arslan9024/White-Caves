import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HenryDrivePanel from './HenryDrivePanel';
import HenryDriveCallback from '../../../pages/crm/HenryDriveCallback';
import { driveRequest, loadDriveOriginal, reviewDrive, type DriveSource, type DriveStatus } from '../../../services/henryDrive';
import { authFetch } from '../../../utils/authFetch';

vi.mock('../../../services/henryDrive', () => ({ driveRequest: vi.fn(), loadDriveOriginal: vi.fn(), reviewDrive: vi.fn() }));
vi.mock('../../../utils/authFetch', () => ({ authFetch: vi.fn() }));
const id = 'a'.repeat(24);
const source: DriveSource = { id, name: 'Synthetic client.pdf', mime: 'application/pdf', version: 'synthetic-version',
  updatedAt: '2026-10-18T00:00:00Z', modified: '2026-10-18T00:00:00Z', stale: false, reviewed: false };
const connected: DriveStatus = { configured: true, connected: true, identity: 'Synthetic account', roots: [] };
const onImport = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(driveRequest).mockImplementation(async path => path === 'status' ? connected : path === 'search'
    ? { sources: [source], hasMore: false } : {});
  vi.mocked(authFetch).mockResolvedValue(new Response(JSON.stringify({ success: true, data: [{ id, name: 'Synthetic dossier' }] })));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); window.history.replaceState(null, '', '/'); });
const mount = async (status = connected) => {
  vi.mocked(driveRequest).mockImplementation(async path => path === 'status' ? status : path === 'search'
    ? { sources: [source], hasMore: false } : {});
  render(<HenryDrivePanel onImport={onImport} />);
  await screen.findByText(/Connected: Synthetic account/);
};
describe('Henry visible Drive connection and review workflow', () => {
  it('renders loading then actionable server-only setup instructions instead of an invisible integration', async () => {
    let resolve!: (value: DriveStatus) => void;
    vi.mocked(driveRequest).mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    render(<HenryDrivePanel onImport={onImport} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading Drive operation');
    await act(async () => resolve({ configured: false, connected: false, roots: [] }));
    expect(screen.getByRole('alert')).toHaveTextContent('GOOGLE_DRIVE_CLIENT_ID');
    expect(screen.getByRole('alert')).toHaveTextContent('/henry-drive-callback');
    expect(screen.queryByRole('button', { name: 'Connect separate Google account' })).not.toBeInTheDocument();
    expect(screen.getByText(/Google consent grants broad Drive read-only access/)).toBeInTheDocument();
  });
  it('has empty allowlist by default, explicit folder replacement confirmation, and no auto scan', async () => {
    await mount();
    expect(screen.getByRole('button', { name: 'Resync bounded index' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Confirm approved folders' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Approved folder IDs'), { target: { value: 'folder-a,\n folder-b' } });
    fireEvent.click(screen.getByLabelText(/I approve replacing/));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm approved folders' }));
    await waitFor(() => expect(driveRequest).toHaveBeenCalledWith('folders', { folderIds: ['folder-a', 'folder-b'], confirmed: true }));
    expect(vi.mocked(driveRequest).mock.calls.some(([path]) => path === 'index')).toBe(false);
    expect(onImport).toHaveBeenCalledWith(null);
  });
  it('filename search never auto-links; reviewers choose authorized entities and explicitly confirm', async () => {
    await mount({ ...connected, roots: ['root'] });
    fireEvent.change(screen.getByLabelText('Filename metadata search'), { target: { value: 'client' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search Drive metadata' }));
    await screen.findByRole('button', { name: /Review dossier links:/ });
    expect(reviewDrive).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Review dossier links:/ }));
    const confirm = screen.getByRole('button', { name: 'Confirm current source revision and dossier links' });
    expect(confirm).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Load authorized leads' }));
    const select = screen.getByLabelText('Select authorized lead');
    await waitFor(() => expect(select).toHaveTextContent('Synthetic dossier'));
    fireEvent.change(select, { target: { value: id } });
    expect(confirm).toBeDisabled();
    fireEvent.click(screen.getByLabelText(/Confirm selected dossier links/));
    fireEvent.click(confirm);
    await waitFor(() => expect(reviewDrive).toHaveBeenCalledWith(source, expect.objectContaining({ leadId: id })));
    await screen.findByText(/Explicit metadata links saved/);
  });
  it('loads bytes into OCR intake only following an explicit user action', async () => {
    await mount({ ...connected, roots: ['root'] });
    const original = { file: new File(['%PDF-synthetic'], 'source.pdf', { type: 'application/pdf' }),
      driveOrigin: { proof: 'synthetic-proof' }, sourceId: id };
    vi.mocked(loadDriveOriginal).mockResolvedValue(original);
    fireEvent.click(screen.getByRole('button', { name: 'Search Drive metadata' }));
    const button = await screen.findByRole('button', { name: /Load original into OCR review:/ });
    expect(loadDriveOriginal).not.toHaveBeenCalled();
    fireEvent.click(button);
    await waitFor(() => expect(onImport).toHaveBeenCalledWith(original));
    expect(loadDriveOriginal).toHaveBeenCalledWith(source);
  });
  it('offers no original/review action for stale results and labels partial scans', async () => {
    await mount({ ...connected, roots: ['root'], partial: true });
    vi.mocked(driveRequest).mockImplementation(async path => path === 'search'
      ? { sources: [{ ...source, stale: true }], hasMore: false } : path === 'index'
        ? { count: 100, partial: true, skipped: 3 } : { ...connected, partial: true });
    fireEvent.click(screen.getByRole('button', { name: 'Search Drive metadata' }));
    await screen.findByText(/stale\/inaccessible/);
    expect(screen.queryByRole('button', { name: /Load original into OCR review:/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resync bounded index' }));
    await screen.findByText(/Partial scan: bounded limits reached/);
  });
  it('requires disconnect confirmation and retains vault/provider files in the user message', async () => {
    await mount();
    fireEvent.click(screen.getByRole('button', { name: 'Disconnect Drive' }));
    expect(driveRequest).not.toHaveBeenCalledWith('disconnect', expect.anything());
    fireEvent.click(screen.getByRole('button', { name: 'Keep connection' }));
    expect(screen.queryByRole('button', { name: 'Confirm disconnect' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Disconnect Drive' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm disconnect' }));
    await waitFor(() => expect(driveRequest).toHaveBeenCalledWith('disconnect', { confirmed: true }));
    expect(onImport).toHaveBeenCalledWith(null);
    await screen.findByText(/Vault originals retained/);
  });
  it('shows normalized errors and clears prior index selections on failed operations', async () => {
    await mount();
    vi.mocked(driveRequest).mockRejectedValueOnce(new Error('Synthetic access denied. Reconnect.'));
    fireEvent.click(screen.getByRole('button', { name: 'Search Drive metadata' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Reconnect');
    expect(screen.queryByRole('button', { name: /Review dossier links:/ })).not.toBeInTheDocument();
  });
  it('reports blocked popup without starting OAuth', async () => {
    vi.mocked(driveRequest).mockResolvedValue({ configured: true, connected: false, roots: [] });
    vi.spyOn(window, 'open').mockReturnValue(null);
    render(<HenryDrivePanel onImport={onImport} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Connect separate Google account' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Allow popups');
    expect(driveRequest).not.toHaveBeenCalledWith('connect', {});
  });
  it('ignores untrusted postMessages instead of reloading a connection', async () => {
    await mount();
    const calls = vi.mocked(driveRequest).mock.calls.length;
    act(() => window.dispatchEvent(new MessageEvent('message', { origin: 'https://attacker.invalid', data: { type: 'henry-drive-connected' } })));
    expect(vi.mocked(driveRequest).mock.calls.length).toBe(calls);
  });
});
describe('Henry dedicated OAuth callback', () => {
  it('strips query codes immediately and submits them only in authenticated POST, once', async () => {
    window.history.replaceState(null, '', '/henry-drive-callback?code=synthetic-code&state=synthetic-state');
    render(<React.StrictMode><HenryDriveCallback /></React.StrictMode>);
    await screen.findByText(/Drive connected/);
    expect(window.location.search).toBe('');
    expect(driveRequest).toHaveBeenCalledTimes(1);
    expect(driveRequest).toHaveBeenCalledWith('finish', { code: 'synthetic-code', state: 'synthetic-state' });
  });
  it.each(['?error=access_denied&error_description=untrusted', '?state=only-state'])('handles denied/incomplete consent without reflecting provider errors %s', async query => {
    window.history.replaceState(null, '', `/henry-drive-callback${query}`);
    render(<HenryDriveCallback />);
    expect(screen.getByRole('status')).toHaveTextContent('not completed');
    expect(screen.queryByText('untrusted')).not.toBeInTheDocument();
    expect(driveRequest).not.toHaveBeenCalled();
    expect(window.location.search).toBe('');
  });
  it('shows safe expiration and session-mismatch recovery', async () => {
    window.history.replaceState(null, '', '/henry-drive-callback?code=synthetic&state=synthetic');
    vi.mocked(driveRequest).mockRejectedValue(new Error('provider secret'));
    render(<HenryDriveCallback />);
    expect(await screen.findByRole('status')).toHaveTextContent(/Completing|failed/);
    await screen.findByText(/same signed-in Henry session/);
    expect(screen.queryByText('provider secret')).not.toBeInTheDocument();
  });
});
