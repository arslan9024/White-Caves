// FILE: src/components/crm/DocumentManager/DocumentManager.test.tsx
/**
 * White Caves Real Estate LLC - Document Manager Unit Tests
 * Standard: AEGIS 12-Way Co-Location Architecture Standard (Tests - Tier 6)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DocumentManagerView } from './DocumentManagerView';
import { CANONICAL_DOCUMENTS } from './DocumentManager.data';
import {
  executeDocumentOcrExtraction,
  validateDocumentExpiration,
} from './DocumentManager.workflow';
import { DocumentManagerFallback } from './DocumentManager.fallback';
import { DocumentTelemetry } from './DocumentManager.telemetry';
import { getDocumentI18n } from './DocumentManager.i18n';
import {
  saveDocumentsCache,
  loadDocumentsCache,
  getDocumentByTuringId,
  indexDocumentsInMemory,
} from './DocumentManager.cache';
import { extractDocumentOcrFieldsOffThread } from './DocumentManager.workers';

describe('DocumentManager Suite (12-Way Blueprint)', () => {
  beforeEach(() => {
    localStorage.clear();
    indexDocumentsInMemory(CANONICAL_DOCUMENTS);
    DocumentTelemetry.clear();
  });

  // --- Tier 1 & 2: View and Logic Integration ---
  it('renders workspace title, metrics deck, and canonical document cards', () => {
    render(<DocumentManagerView initialDocuments={CANONICAL_DOCUMENTS} />);

    expect(screen.getByText(/Sovereign Document Vault & Henry OCR Centre/i)).toBeInTheDocument();
    expect(screen.getByText(/Documents in Vault/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Henry OCR Quality/i)).toBeInTheDocument();

    expect(screen.getByText('Verified DLD Title Deed TD-908124')).toBeInTheDocument();
    expect(screen.getByTestId('document-card-DOC-001')).toBeInTheDocument();
  });

  it('filters documents by type dropdown', () => {
    render(<DocumentManagerView initialDocuments={CANONICAL_DOCUMENTS} />);

    const typeSelect = screen.getByTestId('filter-doc-type');
    fireEvent.change(typeSelect, { target: { value: 'EJARI_CONTRACT' } });

    expect(screen.getByText(/DLD Ejari Tenancy Contract EJA-2026-88/i)).toBeInTheDocument();
    expect(screen.queryByText('Verified DLD Title Deed TD-908124')).not.toBeInTheDocument();
  });

  it('filters documents by search query', () => {
    render(<DocumentManagerView initialDocuments={CANONICAL_DOCUMENTS} />);

    const searchInput = screen.getByTestId('doc-search-input');
    fireEvent.change(searchInput, { target: { value: 'REC-5510' } });

    expect(screen.getByText('Agency Commission 5% VAT Payment Receipt')).toBeInTheDocument();
    expect(screen.queryByText('Verified DLD Title Deed TD-908124')).not.toBeInTheDocument();
  });

  it('opens document inspection detail modal when clicking Inspect Dossier', () => {
    render(<DocumentManagerView initialDocuments={CANONICAL_DOCUMENTS} />);

    const inspectBtn = screen.getByTestId('inspect-doc-DOC-001');
    fireEvent.click(inspectBtn);

    expect(screen.getByTestId('document-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/Dubai Land Department/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Emaar Asset Holdings/i).length).toBeGreaterThan(0);

    const closeBtn = screen.getByTestId('close-document-modal');
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('document-detail-modal')).not.toBeInTheDocument();
  });

  it('auto-opens detail modal when selectedDocId prop is provided (deep link)', () => {
    render(<DocumentManagerView selectedDocId="DOC-004" initialDocuments={CANONICAL_DOCUMENTS} />);

    expect(screen.getByTestId('document-detail-modal')).toBeInTheDocument();
    expect(screen.getAllByText(/EJA-2026-88/i).length).toBeGreaterThan(0);
  });

  it('opens upload drawer and registers a new document', () => {
    render(<DocumentManagerView initialDocuments={CANONICAL_DOCUMENTS} />);

    const uploadBtn = screen.getByTestId('upload-doc-btn');
    fireEvent.click(uploadBtn);

    expect(screen.getByTestId('document-upload-drawer')).toBeInTheDocument();

    const titleInput = screen.getByTestId('doc-title-input');
    fireEvent.change(titleInput, { target: { value: 'DEWA Clearance Certificate 2026' } });

    const entityInput = screen.getByTestId('doc-entity-input');
    fireEvent.change(entityInput, { target: { value: 'Dubai Electricity & Water Authority' } });

    const saveBtn = screen.getByTestId('save-doc-btn');
    fireEvent.click(saveBtn);

    expect(screen.queryByTestId('document-upload-drawer')).not.toBeInTheDocument();
    expect(screen.getByText('DEWA Clearance Certificate 2026')).toBeInTheDocument();
  });

  // --- Tier 7: Stateless Workflow Chains ---
  it('extracts OCR fields deterministically in workflow', () => {
    const ocrResult = executeDocumentOcrExtraction('dld-title-deed.pdf', 'TITLE_DEED');
    expect(ocrResult.success).toBe(true);
    expect(ocrResult.docType).toBe('TITLE_DEED');
    expect(ocrResult.confidence).toBeGreaterThanOrEqual(99);
    expect(ocrResult.extractedFields.issuingAuthority).toBe('Dubai Land Department');
  });

  it('validates document expiration correctly in workflow', () => {
    const docWithFutureExpiry = CANONICAL_DOCUMENTS[1];
    const validation = validateDocumentExpiration(docWithFutureExpiry);
    expect(validation.isExpired).toBe(false);
  });

  // --- Tier 8: Failure Boundary ---
  it('renders DocumentManagerFallback boundary with errorId and triggers onRetry', () => {
    const onRetry = vi.fn();
    const onNavigateBack = vi.fn();

    render(
      <DocumentManagerFallback
        error="DLD Statutory OCR Buffer Desync"
        errorId="ERR-DLD-500"
        onRetry={onRetry}
        onNavigateBack={onNavigateBack}
      />
    );

    expect(screen.getByTestId('document-manager-fallback')).toBeInTheDocument();
    expect(screen.getByText('ERR-DLD-500')).toBeInTheDocument();
    expect(screen.getByText(/DLD Statutory OCR Buffer Desync/i)).toBeInTheDocument();

    const retryBtn = screen.getByTestId('document-fallback-retry-btn');
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);

    const backBtn = screen.getByTestId('document-fallback-back-btn');
    fireEvent.click(backBtn);
    expect(onNavigateBack).toHaveBeenCalledTimes(1);
  });

  // --- Tier 9: Real-Time State Attestations & Telemetry ---
  it('tracks document telemetry events and delivers to queue with non-blocking dispatch', () => {
    DocumentTelemetry.track('OCR_VERIFIED', {
      docId: 'DOC-001',
      actorRole: 'MANAGING_DIRECTOR',
    });

    const events = DocumentTelemetry.getRecentEvents();
    expect(events.length).toBeGreaterThan(0);
    const lastEvent = events[events.length - 1];
    expect(lastEvent.eventType).toBe('OCR_VERIFIED');
    expect(lastEvent.docId).toBe('DOC-001');
  });

  // --- Tier 10: 4-Language Translation Schemas ---
  it('resolves 4-language i18n schemas with Arabic RTL compliance', () => {
    const arI18n = getDocumentI18n('ar');
    expect(arI18n.dir).toBe('rtl');
    expect(arI18n.workspaceTitle).toContain('المستندات');

    const enI18n = getDocumentI18n('en');
    expect(enI18n.dir).toBe('ltr');
    expect(enI18n.workspaceTitle).toContain('Vault');

    const esI18n = getDocumentI18n('es');
    expect(esI18n.workspaceTitle).toContain('Documentos');

    const ruI18n = getDocumentI18n('ru');
    expect(ruI18n.workspaceTitle).toContain('Документов');
  });

  // --- Tier 11: Localized State Persistence & O(1) Cache Lookup ---
  it('persists documents cache and provides O(1) lookups by Turing ID', () => {
    saveDocumentsCache(CANONICAL_DOCUMENTS);
    const cached = loadDocumentsCache();
    expect(cached).toBeDefined();
    expect(cached?.length).toBe(CANONICAL_DOCUMENTS.length);

    const lookupById = getDocumentByTuringId('DOC-001');
    expect(lookupById).toBeDefined();
    expect(lookupById?.title).toContain('Title Deed');

    const lookupByCode = getDocumentByTuringId('TD-908124');
    expect(lookupByCode?.id).toBe('DOC-001');
  });

  // --- Tier 12: Off-Thread Multi-Agent Background Computation ---
  it('extracts OCR fields and asserts Law 11 overlay compliance off-thread', async () => {
    const result = await extractDocumentOcrFieldsOffThread({
      docId: 'DOC-001',
      docType: 'TITLE_DEED',
      enforceLaw11Overlay: true,
    });

    expect(result.docId).toBe('DOC-001');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(98);
    expect(result.dldChecksum).toContain('DLD-CHK-DOC-001');
    expect(result.law11OverlayCompliant).toBe(true);
    expect(result.meritBonusXp).toBe(500); // Law 10: Gamified Merit XP
  });
});
