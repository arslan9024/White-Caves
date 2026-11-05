/**
 * White Caves Real Estate LLC - Document Manager Unit Tests
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocumentManagerView } from './DocumentManagerView';
import { CANONICAL_DOCUMENTS } from './DocumentManager.data';
import {
  executeDocumentOcrExtraction,
  validateDocumentExpiration,
} from './DocumentManager.workflow';

describe('DocumentManager Suite (7-Category Architecture Standard)', () => {
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

    // Close modal
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
});
