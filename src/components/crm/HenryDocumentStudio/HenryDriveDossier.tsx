import React, { useEffect, useRef, useState } from 'react';
import { driveRequest, openDriveOriginal, type DriveSource } from '../../../services/henryDrive';
import type { DossierKind } from '../../../services/henryOperations';

export default function HenryDriveDossier({ kind, id }: { kind: DossierKind; id: string }) {
  const [sources, setSources] = useState<DriveSource[] | null>(null);
  const [partial, setPartial] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  const load = async () => {
    setBusy(true); setError(''); setSources(null);
    try {
      const result = await driveRequest<{ sources: DriveSource[]; partial: boolean }>(`dossiers/${kind}/${encodeURIComponent(id)}`);
      if (active.current) { setSources(result.sources); setPartial(result.partial); }
    } catch { if (active.current) setError('Drive citations unavailable. Check account access or reconnect and resync.'); }
    finally { if (active.current) setBusy(false); }
  };
  const download = async (source: DriveSource) => {
    setBusy(true); setError('');
    try { await openDriveOriginal(source, () => active.current); }
    catch { if (active.current) { setError('Drive original changed or is inaccessible. Resync and review again.'); setSources(null); } }
    finally { if (active.current) setBusy(false); }
  };
  return <section aria-label="Reviewed Drive dossier citations">
    <h3>Drive metadata citations (separate from checklist evidence)</h3>
    <p>Only your explicitly reviewed links. Filenames, stale links and unreviewed originals never satisfy workflow checklists.
      Imported vault originals are immutable reviewed snapshots, not live Google documents.</p>
    <button type="button" disabled={busy} onClick={() => void load()}>Load fresh Drive citations</button>
    {busy && <p role="status">Checking Drive source access…</p>}
    {error && <p role="alert">{error}</p>}
    {sources && !sources.length && <p>No reviewed Drive metadata linked to this dossier.</p>}
    {partial && <p>Partial citations: bounded result only (25). Use Henry Drive metadata search for other sources.</p>}
    <ul>{sources?.map(source => <li key={source.id}>{source.name} · {source.stale ? 'stale — not evidence' : source.modified}
      {!source.stale && <button type="button" disabled={busy} onClick={() => void download(source)}>Download authenticated Drive original</button>}
    </li>)}</ul>
  </section>;
}
