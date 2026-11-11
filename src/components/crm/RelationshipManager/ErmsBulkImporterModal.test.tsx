/**
 * ErmsBulkImporterModal.test.tsx
 * Targeted Vitest test suite for ErmsBulkImporterModal
 * Verifies parsing, duplicate detection, and import callbacks
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsBulkImporterModal } from './ErmsBulkImporterModal';
import type { EntityNode } from './RelationshipManager.types';

const mockExisting: EntityNode[] = [
  {
    id: 'user-001',
    name: 'Arslan Malik',
    type: 'USER',
    badge: 'Founder',
    description: 'Executive',
    color: '#EF4444',
    details: {},
  },
];

describe('ErmsBulkImporterModal (Pillar 1 Upgrades 2 & 3)', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ErmsBulkImporterModal
        isOpen={false}
        existingEntities={mockExisting}
        onClose={vi.fn()}
        onImport={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('validates JSON input and flags duplicates', () => {
    const handleImport = vi.fn();
    const handleClose = vi.fn();

    render(
      <ErmsBulkImporterModal
        isOpen={true}
        existingEntities={mockExisting}
        onClose={handleClose}
        onImport={handleImport}
      />
    );

    const textarea = screen.getByPlaceholderText(/Burj Crown 204/);
    const validJson = JSON.stringify([
      { name: 'Arslan Malik', type: 'USER' }, // duplicate name
      { name: 'Palm Frond N Villa', type: 'PROPERTY' },
    ]);

    fireEvent.change(textarea, { target: { value: validJson } });

    expect(screen.getByText(/Validated: 2 entities ready/)).toBeInTheDocument();
    expect(screen.getByText(/1 duplicate names detected/)).toBeInTheDocument();

    const importBtn = screen.getByRole('button', { name: /Import 2 Entities/i });
    fireEvent.click(importBtn);

    expect(handleImport).toHaveBeenCalledTimes(1);
    const imported = handleImport.mock.calls[0][0];
    expect(imported).toHaveLength(2);
    expect(imported[0].name).toBe('Arslan Malik');
    expect(imported[1].name).toBe('Palm Frond N Villa');
  });
});
