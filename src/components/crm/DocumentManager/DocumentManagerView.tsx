/**
 * White Caves Real Estate LLC - Document Manager Workspace View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  FileText,
  UploadCloud,
  Search,
  ShieldCheck,
  Cpu,
  Handshake,
  CheckCircle2,
} from 'lucide-react';
import { useDocumentManager, UseDocumentManagerProps } from './DocumentManager.logic';
import { DocumentCard } from './DocumentCard';
import { DocumentDetailModal } from './DocumentDetailModal';
import { DocumentUploadDrawer } from './DocumentUploadDrawer';
import {
  DocumentContainer,
  DocumentHeader,
  MetricsGrid,
  MetricCard,
  DocumentFilterBar,
  DocumentsGrid,
} from './DocumentManager.styles';

export const DocumentManagerView: FC<UseDocumentManagerProps> = props => {
  const {
    documents,
    metrics,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    selectedDocForModal,
    isDrawerOpen,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenUploadDrawer,
    handleCloseUploadDrawer,
    handleVerifyDocument,
    handleSaveDocument,
  } = useDocumentManager(props);

  return (
    <DocumentContainer data-testid="document-manager-view">
      {/* ── 1. Top Executive Header ─────────────────────────────────── */}
      <DocumentHeader>
        <div className="title-group">
          <h1>
            <FileText size={24} color="#38BDF8" />
            Sovereign Document Vault & Henry OCR Centre
          </h1>
          <p>
            Cryptographic storage, OCR verification, and lifecycle tracking for Title Deeds,
            Emirates IDs, Passports, Ejari Contracts, and Payment Receipts.
          </p>
        </div>

        <div className="actions">
          <button
            onClick={handleOpenUploadDrawer}
            data-testid="upload-doc-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#38BDF8',
              color: '#070D18',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)',
            }}
          >
            <UploadCloud size={16} />
            <span>Upload Dossier</span>
          </button>
        </div>
      </DocumentHeader>

      {/* ── 2. Real-Time Document Metrics Deck ──────────────────────── */}
      <MetricsGrid>
        <MetricCard $accentColor="#38BDF8">
          <div className="label">Documents in Vault</div>
          <div className="value">
            {metrics.totalDocsCount} <span className="sub">Files</span>
          </div>
        </MetricCard>

        <MetricCard $accentColor="#34D399">
          <div className="label">Verified Ratio</div>
          <div className="value">
            {metrics.verifiedRatePercent}%
            <span className="sub">
              ({metrics.verifiedDocsCount}/{metrics.totalDocsCount})
            </span>
          </div>
        </MetricCard>

        <MetricCard $accentColor="#C084FC">
          <div className="label">Linked Deals Covered</div>
          <div className="value">
            {metrics.linkedDealsCount} <span className="sub">Transactions</span>
          </div>
        </MetricCard>

        <MetricCard $accentColor="#F59E0B">
          <div className="label">Henry OCR Quality</div>
          <div className="value">
            {metrics.avgOcrConfidence}% <span className="sub">Confidence</span>
          </div>
        </MetricCard>
      </MetricsGrid>

      {/* ── 3. Filter & Search Bar ─────────────────────────────────── */}
      <DocumentFilterBar>
        <div className="search-input">
          <Search size={15} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search documents by ID, code, title, entity, or deal #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            data-testid="doc-search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
            data-testid="filter-doc-type"
            style={{
              background: '#0B132B',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Doc Types</option>
            <option value="TITLE_DEED">Title Deed</option>
            <option value="EMIRATES_ID">Emirates ID</option>
            <option value="PASSPORT">Passport</option>
            <option value="EJARI_CONTRACT">Ejari Contract</option>
            <option value="PAYMENT_RECEIPT">Payment Receipt</option>
            <option value="TRADE_LICENSE">Trade License</option>
            <option value="MOU_FORM_F">MOU Form F</option>
            <option value="NOC_CERTIFICATE">Developer NOC</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            style={{
              background: '#0B132B',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING_OCR">Pending OCR</option>
            <option value="EXPIRED">Expired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </DocumentFilterBar>

      {/* ── 4. Documents Grid ──────────────────────────────────────── */}
      <DocumentsGrid>
        {documents.map(doc => (
          <DocumentCard key={doc.id} document={doc} onInspect={handleOpenDetailModal} />
        ))}
      </DocumentsGrid>

      {/* ── 5. Detail Inspection Modal ─────────────────────────────── */}
      {selectedDocForModal && (
        <DocumentDetailModal
          document={selectedDocForModal}
          onClose={handleCloseDetailModal}
          onVerify={handleVerifyDocument}
        />
      )}

      {/* ── 6. Upload Drawer ────────────────────────────────────────── */}
      <DocumentUploadDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseUploadDrawer}
        onSave={handleSaveDocument}
      />
    </DocumentContainer>
  );
};

export default DocumentManagerView;
