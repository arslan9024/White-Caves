import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuditTrailExporter } from './AuditTrailExporter';

describe('AuditTrailExporter Component', () => {
  it('renders corporate financial audit exporter and export options', () => {
    render(<AuditTrailExporter />);
    expect(screen.getByTestId('audit-trail-exporter')).toBeDefined();
    expect(screen.getByText(/Corporate Financial & Escrow Audit Exporter/i)).toBeDefined();
    expect(screen.getByText(/FTA & RERA EXPORT/i)).toBeDefined();
    expect(screen.getByText(/Structured CSV Format/i)).toBeDefined();
    expect(screen.getByText(/Microsoft Excel XML Workbook/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Download Audit CSV/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Download Excel Workbook/i })).toBeDefined();
  });
});
