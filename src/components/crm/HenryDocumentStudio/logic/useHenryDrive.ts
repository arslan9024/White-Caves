import { useCallback, useEffect, useRef, useState } from 'react';
import { driveRequest, loadDriveOriginal, reviewDrive, type DriveImport, type DriveSource, type DriveStatus } from '../../../../services/henryDrive';
import type { VaultSaveOptions } from '../../../../services/henryScanReview';

export function useHenryDrive(onImport: (source: DriveImport | null) => void) {
  const [status, setStatus] = useState<DriveStatus | null>(null);
  const [sources, setSources] = useState<DriveSource[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [hasMore, setHasMore] = useState(false), [selected, setSelected] = useState<DriveSource | null>(null);
  const active = useRef(0);
  const popup = useRef<Window | null>(null);
  const run = useCallback(async (work: (current: () => boolean) => Promise<void>) => {
    const revision = ++active.current;
    setBusy(true); setError(''); setMessage('');
    try { await work(() => revision === active.current); }
    catch (failure) {
      if (revision === active.current) {
        setSelected(null); setSources([]);
        setError(failure instanceof Error ? failure.message : 'Drive unavailable.');
      }
    } finally { if (revision === active.current) setBusy(false); }
  }, []);
  const reload = useCallback(() => run(async current => {
    const result = await driveRequest<DriveStatus>('status');
    if (current()) { setStatus(result); setSources([]); setSelected(null); }
  }), [run]);
  useEffect(() => {
    void reload();
    const receive = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === popup.current &&
        event.data?.type === 'henry-drive-connected') void reload();
    };
    window.addEventListener('message', receive);
    return () => { active.current++; window.removeEventListener('message', receive); };
  }, [reload]);
  const search = (q: string, page: number) => run(async current => {
    setSelected(null);
    const result = await driveRequest<{ sources: DriveSource[]; hasMore: boolean; partial?: boolean }>('search', { q, page });
    if (current()) {
      setSources(result.sources); setHasMore(result.hasMore);
      if (result.partial) setMessage('Partial metadata result: fresh-access checking reached its time/index bound. Retry or resync; absence is not conclusive.');
    }
  });
  return { status, sources, busy, error, message, hasMore, selected, setSelected, reload, search,
    connect: () => {
      popup.current = window.open('about:blank', 'henry-drive-oauth', 'popup,width=600,height=720');
      if (!popup.current) { setError('Allow popups to connect a separate Drive account.'); return; }
      void run(async current => {
        try {
          const result = await driveRequest<{ url: string }>('connect', {});
          const url = new URL(result.url);
          if (url.origin !== 'https://accounts.google.com') throw new Error('Invalid authorization URL');
          if (current() && popup.current) popup.current.location.href = url.href;
        } catch (failure) { popup.current?.close(); throw failure; }
      });
    },
    approve: (folderIds: string[]) => run(async current => {
      onImport(null); setSources([]); setSelected(null);
      await driveRequest('folders', { folderIds, confirmed: true });
      const result = await driveRequest<DriveStatus>('status');
      if (current()) { setStatus(result); setMessage('Folder allowlist replaced. Local index and links cleared; vault originals retained.'); }
    }),
    index: () => run(async current => {
      onImport(null); setSelected(null); setSources([]);
      const result = await driveRequest<{ count: number; partial: boolean; skipped: number }>('index', {});
      if (current()) setMessage(`Indexed ${result.count} files. ${result.partial ? 'Partial scan: bounded limits reached.' : 'Bounded scan finished.'} Skipped unsupported/oversize/shortcut entries: ${result.skipped}. Search to view fresh metadata.`);
      const next = await driveRequest<DriveStatus>('status');
      if (current()) setStatus(next);
    }),
    review: (links: VaultSaveOptions) => run(async current => {
      if (!selected) return;
      await reviewDrive(selected, links);
      if (current()) { setSelected(null); setSources([]); setMessage('Explicit metadata links saved. Reload search or the dossier to see the citation. This does not complete document checklists.'); }
    }),
    importOriginal: (source: DriveSource) => run(async current => {
      onImport(null);
      const original = await loadDriveOriginal(source);
      if (current()) { onImport(original); setMessage('Original loaded into reviewed document intake below. Choose category and compare every field before saving.'); }
    }),
    disconnect: () => run(async current => {
      onImport(null); setSelected(null); setSources([]);
      await driveRequest('disconnect', { confirmed: true });
      if (current()) {
        setStatus(value => value ? { configured: value.configured, connected: false, roots: [] } : value);
        setMessage('Disconnected locally. Encrypted credentials and local index cleared. Vault originals retained. Remove app access in Google Account permissions to revoke the Google grant too.');
      }
    }),
  };
}
