/**
 * ErmsErdDdlExporter.test.tsx
 * Targeted Vitest test suite for ErmsErdDdlExporter
 * Verifies Prisma Schema and PostgreSQL DDL code generation for UML models
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErmsErdDdlExporter } from './ErmsErdDdlExporter';
import type { ERDClassModel } from './RelationshipManager.types';

const mockModels: ERDClassModel[] = [
  {
    name: 'TenancyContract',
    stereotype: '«Entity»',
    domain: 'LEASING',
    attributes: [
      { name: 'id', type: 'string', isPk: true },
      { name: 'ejariNumber', type: 'string', nullable: true },
      { name: 'annualRentAED', type: 'number' },
    ],
  },
];

describe('ErmsErdDdlExporter (Pillar 3 Verification)', () => {
  it('renders Prisma schema model definition by default', () => {
    render(<ErmsErdDdlExporter models={mockModels} relations={[]} />);

    expect(screen.getByText('Live Schema & DDL Generator')).toBeInTheDocument();
    expect(screen.getByText(/model TenancyContract/)).toBeInTheDocument();
    expect(screen.getByText(/annualRentAED\s+Float/)).toBeInTheDocument();
  });

  it('switches to PostgreSQL DDL on format toggle', () => {
    render(<ErmsErdDdlExporter models={mockModels} relations={[]} />);

    const sqlToggle = screen.getByRole('button', { name: 'PostgreSQL DDL' });
    fireEvent.click(sqlToggle);

    expect(screen.getByText(/CREATE TABLE "tenancycontract"/)).toBeInTheDocument();
    expect(screen.getByText(/"id" VARCHAR\(255\) NOT NULL PRIMARY KEY/)).toBeInTheDocument();
  });
});
