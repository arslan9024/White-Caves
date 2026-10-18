import React, { useEffect, useRef, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import logger from '../../../utils/logger';

export default function HenryCrmLinkSelector({ kind, value, onChange }: {
  kind: 'lead' | 'property' | 'tenancy' | 'transaction'; value: string; onChange: (id: string) => void;
}) {
  const [rows, setRows] = useState<Array<{ id: string; name: string }>>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    request.current?.abort();
    setRows([]);
    setQuery('');
    setPage(1);
    setHasMore(false);
    setLoaded(false);
    setBusy(false);
    setError('');
    return () => request.current?.abort();
  }, [kind]);
  const load = async (nextPage: number) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const response = await authFetch(`/api/henry/documents/link-options?kind=${kind}&page=${nextPage}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Options unavailable');
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || ('success' in result && result.success !== true) ||
        !('data' in result) || !Array.isArray(result.data) || result.data.some(row =>
          !row || typeof row !== 'object' || typeof row.id !== 'string' || !row.id.trim() ||
          typeof row.name !== 'string' || !row.name.trim()
        )) throw new Error('Invalid options');
      const data = result.data as Array<{ id: string; name: string }>;
      if (controller.signal.aborted) return;
      setRows(data);
      setPage(nextPage);
      setHasMore('hasMore' in result && result.hasMore === true);
      setLoaded(true);
    } catch {
      if (!controller.signal.aborted) {
        logger.error('Henry CRM link options unavailable', { kind });
        setError('Could not load authorized CRM options. Retry or use an approved ID.');
      }
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  };
  const matches = rows.filter(row => row.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <fieldset>
    <legend>Authorized {kind} selection</legend>
    <button type="button" disabled={busy} onClick={() => void load(1)}>Load authorized {kind === 'lead' ? 'leads' : kind === 'property' ? 'properties' : `${kind} records`}</button>
    <label>Search names on this page
      <input aria-label={`Search ${kind} names`} value={query} onChange={event => setQuery(event.target.value)} />
    </label>
    <label>Select {kind}
      <select aria-label={`Select authorized ${kind}`} value={value} disabled={busy} onChange={event => onChange(event.target.value)}>
        <option value="">No {kind} selected</option>
        {value && !matches.some(row => row.id === value) && <option value={value}>Selected approved ID</option>}
        {matches.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}
      </select>
    </label>
    {busy && <p role="status">Loading authorized {kind}s…</p>}
    {error && <p role="alert">{error}</p>}
    {loaded && !busy && !matches.length && <p>No matching authorized {kind}s on this page.</p>}
    {loaded && <>
      <button type="button" disabled={busy || page <= 1} onClick={() => void load(page - 1)}>Previous {kind} page</button>
      <button type="button" disabled={busy || !hasMore || page >= 1000} onClick={() => void load(page + 1)}>Next {kind} page</button>
    </>}
  </fieldset>;
}
