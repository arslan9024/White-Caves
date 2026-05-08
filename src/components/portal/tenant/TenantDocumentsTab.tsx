/**
 * TenantDocumentsTab — Phase 2.11: Documents
 *
 * Lease agreement, Ejari, NOC.
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

const TenantDocumentsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lease' | 'ejari' | 'receipt'>('all');

  const documents = useMemo(
    () => [
      {
        id: 'td-001',
        name: 'Tenancy Agreement 2026',
        type: 'lease' as const,
        url: 'https://example.com/docs/td-001.pdf',
      },
      {
        id: 'td-002',
        name: 'Ejari Certificate 2026',
        type: 'ejari' as const,
        url: 'https://example.com/docs/td-002.pdf',
      },
      {
        id: 'td-003',
        name: 'Security Deposit Receipt',
        type: 'receipt' as const,
        url: 'https://example.com/docs/td-003.pdf',
      },
    ],
    []
  );

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

      {filteredDocuments.length === 0 ? (
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
