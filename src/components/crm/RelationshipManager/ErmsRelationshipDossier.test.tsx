/**
 * ErmsRelationshipDossier.test.tsx
 * Targeted Vitest test suite for ErmsRelationshipDossier
 * Verifies generation and clipboard copying of relationship dossier
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsRelationshipDossier } from './ErmsRelationshipDossier';
import type { RelationshipChain } from './RelationshipManager.types';

const mockChain: RelationshipChain = {
  id: 'REL-001',
  name: 'Flagship Lease Pipeline',
  dealNumber: 'WC-D-2026-001',
  summary: 'Annual residential tenancy contract registered and closed',
  grossRevenueAED: 180000,
  meritXPAwarded: 500,
  nodes: [
    {
      id: 'org-001',
      name: 'White Caves Real Estate LLC',
      type: 'COMPANY',
      badge: 'Apex Corporate Umbrella',
      description: 'Licensed DLD Brokerage',
      color: '#EF4444',
      details: {},
    },
  ],
  edges: [
    { id: 'e1', sourceId: 'org-001', targetId: 'emp-001', label: 'Governs & Mandates' },
  ],
};

describe('ErmsRelationshipDossier (Pillar 2 Upgrade 19)', () => {
  it('renders chain dossier with corporate credentials and participating nodes', () => {
    render(<ErmsRelationshipDossier chain={mockChain} />);

    expect(screen.getByText('Exportable Relationship Dossier (Pillar 2 · Upgrade 19)')).toBeInTheDocument();
    expect(screen.getByText(/WHITE CAVES REAL ESTATE LLC - STATUTORY RELATIONSHIP DOSSIER/)).toBeInTheDocument();
    expect(screen.getByText(/Chain ID: REL-001/)).toBeInTheDocument();
    expect(screen.getByText(/Gross Deal Volume: AED 180,000/)).toBeInTheDocument();
  });

  it('triggers clipboard copy when clicking Copy Dossier button', () => {
    const originalClipboard = navigator.clipboard;
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<ErmsRelationshipDossier chain={mockChain} />);

    const copyBtn = screen.getByRole('button', { name: /Copy Dossier/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalled();
    Object.assign(navigator, { clipboard: originalClipboard });
  });
});
