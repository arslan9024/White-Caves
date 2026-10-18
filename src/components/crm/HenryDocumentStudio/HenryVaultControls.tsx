import React, { useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import logger from '../../../utils/logger';
import { ScanReview, VaultSaveOptions, hydrateVaultScan } from '../../../services/henryScanReview';
import { EMPTY_EMIRATES_ID } from '../../../services/HenryEmiratesIdScannerService';
import deed from '../../../services/HenryTitleDeedScannerService';
import HenryCrmLinkSelector from './HenryCrmLinkSelector';
import HenryCaseLinks from './HenryCaseLinks';
import { downloadHenryOriginal } from '../../../services/henryOperations';

interface VaultRow {
  id: string;
  docType: string;
  referenceNumber: string;
  expiryStatus: string;
  leadId?: string;
  propertyId?: string;
  reminderDismissedAt?: string;
  extractedJson?: ScanReview & object;
}

export default function HenryVaultControls({
  docType,
  options,
  onOptions,
  onSuggestion,
}: {
  docType: string;
  options: VaultSaveOptions;
  onOptions: (options: VaultSaveOptions) => void;
  onSuggestion: (data: ScanReview & object) => void;
}) {
  const [rows, setRows] = useState<VaultRow[]>([]);
  const [reference, setReference] = useState('');
  const [expiry, setExpiry] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestion, setSuggestion] = useState<VaultRow | null>(null);
  const [linksConfirmed, setLinksConfirmed] = useState(false);
  const [lead, setLead] = useState('');
  const [property, setProperty] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const run = async (work: () => Promise<void>) => {
    setBusy(true);
    setMessage('');
    try {
      await work();
    } catch {
      logger.error('Henry vault controls request failed', { docType });
      setMessage('Vault request failed. Check access, configuration and retry.');
    } finally {
      setBusy(false);
    }
  };
  const json = async (url: string, init?: RequestInit) => {
    const response = await authFetch(url, init);
    if (!response.ok) throw new Error('Vault request rejected');
    return response.json();
  };
  const load = (nextPage: number) =>
    void run(async () => {
      const filters = {
        docType,
        page: nextPage,
        limit: 10,
        ...(reference ? { referenceNumber: reference } : {}),
        ...(expiry ? { expiryStatus: expiry } : {}),
        ...(options.leadId ? { leadId: options.leadId } : {}),
        ...(options.propertyId ? { propertyId: options.propertyId } : {}),
        ...(options.tenancyId ? { tenancyId: options.tenancyId } : {}),
        ...(options.transactionId ? { transactionId: options.transactionId } : {}),
      };
      const result = await json('/api/henry/documents/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });
      setRows(Array.isArray(result?.data) ? result.data : []);
      setPage(nextPage);
      setHasMore(Boolean(result?.hasMore));
      setLoaded(true);
    });
  const download = (id: string, side: number) =>
    void run(() => downloadHenryOriginal(id, side));
  const useSuggestion = () =>
    void run(async () => {
      const data =
        docType === 'emirates_id'
          ? hydrateVaultScan(suggestion, 'emirates_id', EMPTY_EMIRATES_ID)
          : docType === 'title_deed'
            ? hydrateVaultScan(suggestion, 'title_deed', deed.getDemoExtractedData())
            : null;
      if (!data) throw new Error('Unsupported archive type');
      onOptions({
        ...options,
        sources: undefined,
        replacesId: undefined,
        leadId: undefined,
        propertyId: undefined,
        tenancyId: undefined,
        transactionId: undefined,
      });
      setLinksConfirmed(false);
      setLead('');
      setProperty('');
      onSuggestion(data);
      setSuggestion(null);
    });
  return (
    <section aria-label="Encrypted document archive">
      <p>
        Originals: encrypted PDF/JPEG/PNG, maximum 4 MB total. Retention is a configurable review
        interval (default 365 days), not a legal mandate. Nothing is automatically deleted.
      </p>
      <label>
        Approved lead ID
        <input
          aria-label="Approved lead ID"
          value={lead}
          onChange={e => {
            setLead(e.target.value);
            setLinksConfirmed(false);
            onOptions({ ...options, leadId: undefined, propertyId: undefined });
          }}
        />
      </label>
      <HenryCrmLinkSelector kind="lead" value={lead} onChange={id => {
        setLead(id);
        setLinksConfirmed(false);
        onOptions({ ...options, leadId: undefined, propertyId: undefined });
      }} />
      <label>
        Approved property ID
        <input
          aria-label="Approved property ID"
          value={property}
          onChange={e => {
            setProperty(e.target.value);
            setLinksConfirmed(false);
            onOptions({ ...options, leadId: undefined, propertyId: undefined });
          }}
        />
      </label>
      <HenryCrmLinkSelector kind="property" value={property} onChange={id => {
        setProperty(id);
        setLinksConfirmed(false);
        onOptions({ ...options, leadId: undefined, propertyId: undefined });
      }} />
      <label>
        <input
          type="checkbox"
          checked={linksConfirmed}
          onChange={e => {
            setLinksConfirmed(e.target.checked);
            onOptions({
              ...options,
              leadId: e.target.checked ? lead || undefined : undefined,
              propertyId: e.target.checked ? property || undefined : undefined,
            });
          }}
        />
        Confirm these existing CRM links (server checks ownership)
      </label>
      <label>
        Exact reference
        <input
          aria-label="Exact reference"
          value={reference}
          onChange={e => setReference(e.target.value)}
        />
      </label>
      <HenryCaseLinks additionalOnly options={options} onOptions={onOptions} />
      <label>
        Expiry filter
        <select aria-label="Expiry filter" value={expiry} onChange={e => setExpiry(e.target.value)}>
          <option value="">All active</option>
          <option value="soon_expiring">Within 30 days</option>
          <option value="expired">Expired</option>
          <option value="current">Current</option>
        </select>
      </label>
      <button type="button" disabled={busy} onClick={() => load(1)}>
        Search archive
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() =>
          void run(async () => {
            const result = await json(`/api/henry/documents/latest/${docType}`);
            setSuggestion(result.data);
          })
        }
      >
        Suggest from latest reviewed record
      </button>
      {busy && <p role="status">Loading archive…</p>}
      {message && <p role="alert">{message}</p>}
      {loaded && !busy && !rows.length && <p>No matching active documents.</p>}
      {suggestion && (
        <div>
          <p>
            Existing reviewed record {suggestion.referenceNumber}. This is a suggestion, not
            identity or ownership verification.
          </p>
          <button type="button" disabled={busy} onClick={() => download(suggestion.id, 0)}>
            Download suggested original
          </button>
          {docType === 'emirates_id' && (
            <button type="button" disabled={busy} onClick={() => download(suggestion.id, 1)}>
              Download suggested back
            </button>
          )}
          <button type="button" disabled={busy} onClick={useSuggestion}>
            Use suggestion for review
          </button>
          <button type="button" onClick={() => setSuggestion(null)}>
            Cancel suggestion
          </button>
        </div>
      )}
      {rows.map(row => (
        <div key={row.id}>
          <span>
            {row.referenceNumber} · {row.expiryStatus}{' '}
            {row.reminderDismissedAt ? '· reminder dismissed' : ''}
          </span>
          <span>
            {' '}
            · Lead {row.leadId || 'none'} · Property {row.propertyId || 'none'}
          </span>
          <button type="button" disabled={busy} onClick={() => download(row.id, 0)}>
            Download original
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                const result = await json(`/api/henry/documents/${encodeURIComponent(row.id)}`);
                setSuggestion(result.data);
              })
            }
          >
            Load reviewed fields
          </button>
          {docType === 'emirates_id' && (
            <button type="button" disabled={busy} onClick={() => download(row.id, 1)}>
              Download back
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => onOptions({ ...options, replacesId: row.id })}
          >
            Select for replacement
          </button>
          <button type="button" disabled={busy} onClick={() => setDeleteId(row.id)}>
            Request deletion
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await json(`/api/henry/documents/${row.id}/reminder`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ dismissed: !row.reminderDismissedAt }),
                });
                setRows(previous =>
                  previous.map(item =>
                    item.id === row.id
                      ? {
                          ...item,
                          reminderDismissedAt: row.reminderDismissedAt
                            ? undefined
                            : new Date().toISOString(),
                        }
                      : item
                  )
                );
              })
            }
          >
            Toggle reminder
          </button>
        </div>
      ))}
      {deleteId && (
        <div role="alert">
          Delete only document {deleteId}, including its encrypted original? This cannot be undone;
          the audit record remains.
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await json(`/api/henry/documents/${deleteId}`, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ confirmDocumentId: deleteId }),
                });
                setRows(previous => previous.filter(row => row.id !== deleteId));
                setDeleteId(null);
              })
            }
          >
            Confirm permanent deletion
          </button>
          <button type="button" onClick={() => setDeleteId(null)}>
            Cancel deletion
          </button>
        </div>
      )}
      {options.replacesId && (
        <p>
          Replacement selected: {options.replacesId}. Upload and review the corrected original
          before saving.
          <button type="button" onClick={() => onOptions({ ...options, replacesId: undefined })}>
            Cancel replacement
          </button>
        </p>
      )}
      {loaded && (
        <>
          <button type="button" disabled={busy || page === 1} onClick={() => load(page - 1)}>
            Previous
          </button>
          <button type="button" disabled={busy || !hasMore} onClick={() => load(page + 1)}>
            Next
          </button>
        </>
      )}
    </section>
  );
}
