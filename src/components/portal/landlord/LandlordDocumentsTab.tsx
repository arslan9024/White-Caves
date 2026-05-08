/**
 * LandlordDocumentsTab — Phase 29: Live API integration
 *
 * Documents derived from leases API.
 * Each lease shows as a Tenancy Agreement document.
 * Ejari entries are added for leases that have ejariNumber set.
 * No file download in Phase 29 (placeholder URL only).
 *
 * @component
 */

import React, { FC, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

// ── API shapes ────────────────────────────────────────────────────────────────

interface ApiLease {
  id: string;
  leaseNumber?: string | null;
  startDate: string;
  endDate: string;
  status: string;
  ejariNumber?: string | null;
  ejariStatus?: string | null;
  tenant: { id: string; name: string } | null;
  property: { id: string; title: string } | null;
  documents: string[];
}

// ── Internal view model ───────────────────────────────────────────────────────

interface DocumentEntry {
  id: string;
  name: string;
  type: 'tenancy' | 'ejari' | 'noc' | 'receipt';
  property: string;
  issuedDate: string;
  url: string;
}

function leasesToDocuments(leases: ApiLease[]): DocumentEntry[] {
  const docs: DocumentEntry[] = [];

  for (const lease of leases) {
    const propTitle = lease.property?.title ?? 'Unknown Property';
    const tenantName = lease.tenant?.name ?? 'Unknown Tenant';
    const issued = new Date(lease.startDate).toLocaleDateString('en-AE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    // Tenancy agreement
    docs.push({
      id: `${lease.id}-tenancy`,
      name: `${propTitle} — Tenancy Agreement (${tenantName})`,
      type: 'tenancy',
      property: propTitle,
      issuedDate: issued,
      url: lease.documents?.[0] ?? '#',
    });

    // Ejari certificate if registered
    if (lease.ejariNumber) {
      docs.push({
        id: `${lease.id}-ejari`,
        name: `${propTitle} — Ejari Certificate (${lease.ejariNumber})`,
        type: 'ejari',
        property: propTitle,
        issuedDate: issued,
        url: '#',
      });
    }
  }

  return docs;
}

// ── Main component ────────────────────────────────────────────────────────────

const LandlordDocumentsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'tenancy' | 'ejari' | 'noc' | 'receipt'>(
    'all'
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [leases, setLeases] = useState<ApiLease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    authFetch('/api/leases?role=landlord&pageSize=100')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setLeases(data.data ?? []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError((err as Error).message || 'Failed to load documents');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const documents: DocumentEntry[] = useMemo(() => leasesToDocuments(leases), [leases]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return documents.filter(document => {
      const typeMatches = typeFilter === 'all' || document.type === typeFilter;
      const searchMatches =
        normalizedSearch.length === 0 ||
        document.name.toLowerCase().includes(normalizedSearch) ||
        document.property.toLowerCase().includes(normalizedSearch);
      return typeMatches && searchMatches;
    });
  }, [documents, searchQuery, typeFilter]);

  const selectedDocument = useMemo(
    () => documents.find(d => d.id === selectedDocumentId) ?? null,
    [documents, selectedDocumentId]
  );

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your documents.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-state" data-testid="documents-loading">
        <p>⏳ Loading your documents…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state" data-testid="documents-error">
        <p>⚠️ {error}</p>
        <button className="btn-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tab-content-section landlord-documents-tab">
      <div className="tab-header">
        <h3>Documents</h3>
        <p>Review tenancy files, Ejari certificates, NOC letters, and receipts.</p>
      </div>

      <div className="tab-controls">
        <input
          data-testid="document-search"
          type="text"
          placeholder="Search by document name or property"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />

        <select
          data-testid="document-type-filter"
          value={typeFilter}
          onChange={event =>
            setTypeFilter(event.target.value as 'all' | 'tenancy' | 'ejari' | 'noc' | 'receipt')
          }
        >
          <option value="all">All Types</option>
          <option value="tenancy">Tenancy Agreement</option>
          <option value="ejari">Ejari Certificate</option>
          <option value="noc">NOC Letter</option>
          <option value="receipt">Receipt</option>
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty-state" data-testid="documents-empty-state">
          <p>No documents match your filters.</p>
        </div>
      ) : (
        <div className="documents-list" data-testid="documents-list">
          {filteredDocuments.map(document => (
            <div
              key={document.id}
              className="document-row"
              data-testid={`document-row-${document.id}`}
            >
              <div>
                <h4>{document.name}</h4>
                <p>{document.property}</p>
                <p>Issued: {document.issuedDate}</p>
              </div>

              <div>
                <span className={`status-badge type-${document.type}`}>{document.type}</span>
              </div>

              <div>
                {document.url !== '#' ? (
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`download-link-${document.id}`}
                  >
                    Download
                  </a>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    File pending upload
                  </span>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  data-testid={`view-details-${document.id}`}
                  onClick={() => setSelectedDocumentId(document.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedDocument && (
        <div
          className="modal-overlay"
          data-testid="document-detail-modal"
          onClick={() => setSelectedDocumentId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close document details"
              onClick={() => setSelectedDocumentId(null)}
            >
              ×
            </button>

            <h4>Document Details</h4>
            <p>
              <strong>Name:</strong> {selectedDocument.name}
            </p>
            <p>
              <strong>Type:</strong> {selectedDocument.type}
            </p>
            <p>
              <strong>Property:</strong> {selectedDocument.property}
            </p>
            <p>
              <strong>Issued Date:</strong> {selectedDocument.issuedDate}
            </p>
            {selectedDocument.url !== '#' && (
              <p>
                <strong>Download:</strong>{' '}
                <a href={selectedDocument.url} target="_blank" rel="noreferrer">
                  Open document
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDocumentsTab;
