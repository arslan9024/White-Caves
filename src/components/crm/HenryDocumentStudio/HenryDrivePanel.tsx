import React, { useState } from 'react';
import styled from 'styled-components';
import type { DriveImport } from '../../../services/henryDrive';
import type { VaultSaveOptions } from '../../../services/henryScanReview';
import HenryCaseLinks from './HenryCaseLinks';
import { useHenryDrive } from './logic/useHenryDrive';

const Panel = styled.section`
  background: #FFFFFF; color: #1E293B; border: 1px solid #CBD5E1; border-radius: 8px;
  padding: 1rem; margin-block: 1rem; overflow-wrap: anywhere;
  label { display: block; margin-block: 0.5rem; }
  button { background: #EF4444; color: #FFFFFF; padding: 0.5rem; margin: 0.25rem; border: 0; border-radius: 4px; }
  button:disabled { opacity: 0.55; }
  textarea, input { max-width: 100%; }
`;
export default function HenryDrivePanel({ onImport }: { onImport: (source: DriveImport | null) => void }) {
  const state = useHenryDrive(onImport);
  const [folders, setFolders] = useState(''), [confirmed, setConfirmed] = useState(false);
  const [q, setQ] = useState(''), [page, setPage] = useState(1), [links, setLinks] = useState<VaultSaveOptions>({});
  const [disconnecting, setDisconnecting] = useState(false);
  return <Panel aria-label="Henry separate-account Drive">
    <h2>Henry Drive — separate Google account</h2>
    <p>Read-only originals; never uploads, shares, edits or deletes Google files. Google consent grants broad Drive read-only access:
      the folder allowlist is enforced by this application, not a Google folder-scoped permission. Calendar and Firebase accounts are unchanged.</p>
    {state.busy && <p role="status">Loading Drive operation…</p>}
    {state.error && <p role="alert">{state.error}</p>}
    {state.message && <p role="status">{state.message}</p>}
    <button type="button" disabled={state.busy} onClick={() => void state.reload()}>Reload Drive status</button>
    {state.status?.configured === false && <p role="alert">Server setup required: GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET,
      GOOGLE_DRIVE_REDIRECT_URI (this application origin + /henry-drive-callback), DATABASE_URL and ENCRYPTION_KEY.
      Administrator: enable Google Drive API; configure an OAuth Web application, exact redirect and consent/test users.
      Credentials belong on the server only. Never use Calendar credentials implicitly.</p>}
    {state.status?.configured && !state.status.connected && <button type="button" disabled={state.busy} onClick={state.connect}>
      Connect separate Google account
    </button>}
    {state.status?.connected && <>
      <p>Connected: {state.status.identity}. Approved folders: {state.status.roots.length ? state.status.roots.join(', ') : 'none — nothing can be indexed'}.</p>
      <p>Last bounded scan: {state.status.indexedAt || 'never'}{state.status.partial && ' (partial)'}. No content/full-text search or ownership guessing.</p>
      <label>Approved folder IDs (up to five, comma or newline separated)<textarea aria-label="Approved folder IDs" value={folders}
        onChange={event => { setFolders(event.target.value); setConfirmed(false); }} /></label>
      <label><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />
        I approve replacing the folder allowlist and clearing local index/links. Empty means no access. Existing vault originals remain.</label>
      <button type="button" disabled={state.busy || !confirmed} onClick={() => {
        setConfirmed(false); void state.approve(folders.split(/[,\n]/).map(value => value.trim()).filter(Boolean));
      }}>Confirm approved folders</button>
      <button type="button" disabled={state.busy || !state.status.roots.length} onClick={() => void state.index()}>Resync bounded index</button>
      <p>At most 100 files, 6 listing pages, 3 descendant folder levels and a 45-second scan budget (current request may finish) per scan. Shortcuts skipped.
        Existing PDF/PNG/JPEG only, at most 4 MB; native Google documents are not exported.
        Shared-drive folders work only when the connected account can read them; organization policy may deny access.</p>
      <label>Filename metadata search<input value={q} onChange={event => { setQ(event.target.value); state.setSelected(null); setLinks({}); }} maxLength={150} /></label>
      <button type="button" disabled={state.busy} onClick={() => { setPage(1); void state.search(q, 1); }}>Search Drive metadata</button>
      {!state.sources.length && !state.busy && <p>No indexed results loaded. Approve folders, resync, then search. Filenames are not reviewed evidence.</p>}
      <ul>{state.sources.map(source => <li key={source.id}>
        {source.name} · {source.stale ? 'stale/inaccessible — resync and review' : `${source.reviewed ? 'metadata links reviewed' : 'pending review'} · ${source.modified}`}
        {!source.stale && <>
          <button type="button" disabled={state.busy} onClick={() => { state.setSelected(source); setLinks({}); }}>Review dossier links: {source.name}</button>
          <button type="button" disabled={state.busy} onClick={() => void state.importOriginal(source)}>Load original into OCR review: {source.name}</button>
        </>}
      </li>)}</ul>
      {page > 1 && <button type="button" disabled={state.busy} onClick={() => { setPage(page - 1); void state.search(q, page - 1); }}>Previous metadata page</button>}
      {state.hasMore && <button type="button" disabled={state.busy} onClick={() => { setPage(page + 1); void state.search(q, page + 1); }}>Next metadata page</button>}
      {state.selected && <fieldset disabled={state.busy}>
        <legend>Explicit metadata review: {state.selected.name}</legend>
        <p>No automatic matching. Choose existing authorized client/property/tenancy/transaction records. Metadata citations do not count toward checklists.</p>
        <HenryCaseLinks key={state.selected.id + state.selected.updatedAt} options={links} onOptions={setLinks} />
        <button type="button" disabled={!Object.values(links).some(Boolean)} onClick={() => void state.review(links)}>Confirm current source revision and dossier links</button>
      </fieldset>}
      <button type="button" disabled={state.busy} onClick={() => setDisconnecting(true)}>Disconnect Drive</button>
      {disconnecting && <div role="group" aria-label="Confirm Drive disconnect">
        <p>Clear encrypted credentials, pending authorization, local index and Drive links? Google files and saved vault originals are not deleted.</p>
        <button type="button" disabled={state.busy} onClick={() => { setDisconnecting(false); void state.disconnect(); }}>Confirm disconnect</button>
        <button type="button" onClick={() => setDisconnecting(false)}>Keep connection</button>
      </div>}
    </>}
  </Panel>;
}
