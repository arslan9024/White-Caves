/**
 * LandlordDocumentsTab — Phase 2.6: Documents
 *
 * List of documents: tenancy agreements, Ejari certificates, NOC letters
 * Shows: name, type, date, "Download" link (placeholder PDF URL for Phase 2)
 * No upload ability for Phase 2
 *
 * @component
 */

import React, { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

const LandlordDocumentsTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'tenancy' | 'ejari' | 'noc' | 'receipt'>(
    'all'
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const mockDocuments = useMemo(
    () => [
      {
        id: 'doc-001',
        name: 'Marina View Tenancy Agreement 2026',
        type: 'tenancy' as const,
        property: 'Marina View 2BR Apartment',
        issuedDate: '2026-01-01',
        url: 'https://example.com/docs/doc-001.pdf',
      },
      {
        id: 'doc-002',
        name: 'Downtown Studio Ejari Certificate',
        type: 'ejari' as const,
        property: 'Downtown Studio',
        issuedDate: '2026-02-15',
        url: 'https://example.com/docs/doc-002.pdf',
      },
      {
        id: 'doc-003',
        name: 'JBR Villa NOC Letter',
        type: 'noc' as const,
        property: 'JBR 3BR Villa',
        issuedDate: '2026-03-09',
        url: 'https://example.com/docs/doc-003.pdf',
      },
      {
        id: 'doc-004',
        name: 'Marina View Deposit Receipt',
        type: 'receipt' as const,
        property: 'Marina View 2BR Apartment',
        issuedDate: '2026-01-10',
        url: 'https://example.com/docs/doc-004.pdf',
      },
    ],
    []
  );

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return mockDocuments.filter(document => {
      const typeMatches = typeFilter === 'all' || document.type === typeFilter;
      const searchMatches =
        normalizedSearch.length === 0 ||
        document.name.toLowerCase().includes(normalizedSearch) ||
        document.property.toLowerCase().includes(normalizedSearch) ||
        document.id.toLowerCase().includes(normalizedSearch);

      return typeMatches && searchMatches;
    });
  }, [mockDocuments, searchQuery, typeFilter]);

  const selectedDocument = useMemo(
    () => mockDocuments.find(document => document.id === selectedDocumentId) ?? null,
    [mockDocuments, selectedDocumentId]
  );

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your documents.</p>
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
          placeholder="Search by document name, property, or ID"
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
                <a
                  href={document.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`download-link-${document.id}`}
                >
                  Download
                </a>
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
              <strong>ID:</strong> {selectedDocument.id}
            </p>
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
            <p>
              <strong>Download:</strong>{' '}
              <a href={selectedDocument.url} target="_blank" rel="noreferrer">
                Open PDF
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDocumentsTab;
