/**
 * TenantDocumentsTab — Phase 2.11 / Phase 30: Documents (Live API)
 *
 * Derives tenant documents from the active lease record fetched via
 * GET /api/leases?role=tenant&pageSize=1.
 *
 * @component
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

interface ApiLease {
  id: string;
  documents: string[];
  ejariNumber?: string | null;
  addendumDocuments: string[];
}

interface TenantDocument {
  id: string;
  name: string;
  type: 'lease' | 'ejari' | 'receipt';
  url: string;
}

function leaseToDocuments(lease: ApiLease): TenantDocument[] {
  const docs: TenantDocument[] = [];
  if (lease.documents[0]) {
    docs.push({ id: 'doc-agreement', name: 'Tenancy Agreement', type: 'lease', url: lease.documents[0] });
  }
  if (lease.ejariNumber) {
    docs.push({
      id: 'doc-ejari',
      name: `Ejari Certificate (${lease.ejariNumber})`,
      type: 'ejari',
      url: lease.documents[1] ?? '#',
    });
  }
  if (lease.addendumDocuments[0]) {
    docs.push({ id: 'doc-addendum', name: 'Lease Addendum', type: 'receipt', url: lease.addendumDocuments[0] });
  }
  return docs;
}

const TenantDocumentsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [lease, setLease] = useState<ApiLease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lease' | 'ejari' | 'receipt'>('all');

  useEffect(() => {
    authFetch('/api/leases?role=tenant&pageSize=1')
      .then(r => r.json())
      .then(data => setLease((data.data as ApiLease[])?.[0] ?? null))
      .catch(() => setError('Unable to load documents. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const documents = useMemo<TenantDocument[]>(() => {
    if (!lease) return [];
    return leaseToDocuments(lease);
  }, [lease]);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return documents.filter(document => {
      const matchesType = typeFilter === 'all' || document.type === typeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        document.name.toLowerCase().includes(normalizedSearch) ||
        document.id.toLowerCase().includes(normalizedSearch);
      return matchesType && matchesSearch;
    });
  }, [documents, searchQuery, typeFilter]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your documents.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state" data-testid="documents-loading">
        <p>Loading documents…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" data-testid="documents-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="tab-content-section tenant-documents-tab">
      <div className="tab-header">
        <h3>Documents</h3>
        <p>Access your lease agreement, Ejari certificate, and receipts.</p>
      </div>

      <div className="tab-controls">
        <input
          type="text"
          data-testid="tenant-document-search"
          placeholder="Search by document name or ID"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
        <select
          data-testid="tenant-document-type-filter"
          value={typeFilter}
          onChange={event =>
            setTypeFilter(event.target.value as 'all' | 'lease' | 'ejari' | 'receipt')
          }
        >
          <option value="all">All Types</option>
          <option value="lease">Lease Agreement</option>
          <option value="ejari">Ejari</option>
          <option value="receipt">Receipt</option>
        </select>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state" data-testid="tenant-documents-no-lease">
          <p>
            {lease
              ? 'No documents have been uploaded to your lease yet.'
              : 'No active lease found.'}
          </p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="empty-state" data-testid="tenant-documents-empty-state">
          <p>No documents match your filters.</p>
        </div>
      ) : (
        <div className="documents-list" data-testid="tenant-documents-list">
          {filteredDocuments.map(document => (
            <div
              key={document.id}
              className="document-row"
              data-testid={`tenant-document-row-${document.id}`}
            >
              <div>
                <strong>{document.name}</strong>
                <p>{document.id}</p>
              </div>
              <div>
                <span className={`status-badge type-${document.type}`}>{document.type}</span>
              </div>
              <div>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`tenant-document-download-${document.id}`}
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantDocumentsTab;
