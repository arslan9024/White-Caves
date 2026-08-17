import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';
import henryEmiratesIdScannerService from '../../../services/HenryEmiratesIdScannerService';

describe('Henry AI 4000% Upgrade — Emirates ID Optical Scanner & Variable Auto-Fill Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with Emirates ID Scanner template', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Sovereign Record Keeper/i)).toBeDefined();
    expect(screen.getByText(/6. Emirates ID AI Optical Scanner & Auto-Fill/i)).toBeDefined();
    expect(screen.getByText(/UAE Resident Identity Card \(Emirates ID\) Ingestion Hub/i)).toBeDefined();
    expect(screen.getByText(/784-1993-1805733-0/i)).toBeDefined();
    expect(screen.getByText(/Arslan Malik Bashir Ahmad/i)).toBeDefined();
    expect(screen.getByText(/ارسلان مالك بشير احمد/i)).toBeDefined();
  });

  it('provides 1-click variable actions to auto-fill Tenancy and Form B registers', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(as Tenant\)/i)).toBeDefined();
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(as Landlord\)/i)).toBeDefined();
    expect(screen.getByText(/Auto-Fill Form B Viewing Register/i)).toBeDefined();
    expect(screen.getByText(/Export Variables \(JSON\)/i)).toBeDefined();
  });

  it('executes auto-fill as Tenant and switches cleanly to Tenancy Lease E-Sign template', () => {
    render(<HenryDocumentStudio />);
    const autoFillTenantBtn = screen.getByText(/Auto-Fill Tenancy Lease \(as Tenant\)/i);
    fireEvent.click(autoFillTenantBtn);

    expect(screen.getByText(/Tenancy Lease auto-filled with Arslan Malik Bashir Ahmad as Tenant!/i)).toBeDefined();
  });

  it('generates valid Tenant Service Charge Tax Invoice with TRN and 5% VAT', () => {
    const tenantInvoiceHtml = henryPdfEngineService.generateTaxReceiptHtml({
      receiptNumber: 'INV-WC-TNT-2026-041',
      receiptType: 'tenant_service_charges',
      billedPartyType: 'tenant',
      paidBy: 'Alexander Wright',
      clientTrnOrEid: '784-1990-7654321-2',
      propertyAddress: 'Villa 142, DAMAC Hills 2, Dubai',
      serviceDescription: 'Tenant Agency Brokerage Commission & Ejari Service Fee',
      amountAed: 5000,
      vatRatePercent: 5,
      vatAmountAed: 250,
      totalWithVatAed: 5250,
      paidTo: 'WHITE CAVES REAL ESTATE L.L.C',
      whiteCavesTrn: '100488291000003',
      paymentMethod: 'bank_transfer',
      paymentReference: 'TXN-TNT-991',
      date: '17/08/2026',
    });

    expect(tenantInvoiceHtml).toContain('TENANT SERVICE CHARGE & INVOICE');
    expect(tenantInvoiceHtml).toContain('Alexander Wright');
    expect(tenantInvoiceHtml).toContain('100488291000003');
    expect(tenantInvoiceHtml).toContain('AED 5,250');
    expect(tenantInvoiceHtml).toContain('AE960330000019101501006');
  });
});
