/**
 * ErmsZoeCopilot.test.tsx
 * Targeted Vitest test suite for ErmsZoeCopilot
 * Verifies Natural Language query parsing, autonomous relationship pairings, and risk radar
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsZoeCopilot } from './ErmsZoeCopilot';
import type { EntityNode } from './RelationshipManager.types';

const mockEntities: EntityNode[] = [
  {
    id: 'landlord-001',
    name: 'Sheikh Mansoor Al-Nahyan',
    type: 'LANDLORD',
    badge: 'KYC Verified',
    description: 'Owner of luxury freehold assets',
    color: '#8B5CF6',
    status: 'ACTIVE',
    details: {},
  },
  {
    id: 'tenant-001',
    name: 'Hassan Al-Nuaimi',
    type: 'TENANT',
    badge: 'Verified Lessee',
    description: 'Primary tenant on registered annual lease',
    color: '#10B981',
    status: 'ACTIVE',
    details: {},
  },
];

describe('ErmsZoeCopilot (Pillar 9 Verification)', () => {
  it('renders Zoe Copilot header and suggestions accurately', () => {
    render(<ErmsZoeCopilot entities={mockEntities} />);

    expect(screen.getByText('Zoe AI Relational Intelligence Copilot')).toBeInTheDocument();
    expect(screen.getByText('Autonomous Relationship Pairings')).toBeInTheDocument();
    expect(screen.getByText('Statutory Risk Radar & KYC Forecast')).toBeInTheDocument();
    expect(screen.getByText('96% Match')).toBeInTheDocument();
  });

  it('filters entities via natural language search input', () => {
    render(<ErmsZoeCopilot entities={mockEntities} />);

    const searchInput = screen.getByPlaceholderText(/Ask Zoe:/);
    fireEvent.change(searchInput, { target: { value: 'landlord' } });

    const executeBtn = screen.getByRole('button', { name: 'Execute' });
    fireEvent.click(executeBtn);

    expect(screen.getByText('Query Results (1 matches found)')).toBeInTheDocument();
  });

  it('triggers onApplySuggestedRelationship callback when pairing is accepted', () => {
    const handleApply = vi.fn();
    render(<ErmsZoeCopilot entities={mockEntities} onApplySuggestedRelationship={handleApply} />);

    const linkBtns = screen.getAllByRole('button', { name: 'Link in ERMS Graph' });
    fireEvent.click(linkBtns[0]);

    expect(handleApply).toHaveBeenCalledWith(
      'landlord-001',
      'tenant-001',
      'RENEWAL_LEAD'
    );
  });
});
