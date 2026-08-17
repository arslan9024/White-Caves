import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';
import henryTitleDeedScannerService from '../../../services/HenryTitleDeedScannerService';

describe('Henry AI 4000% Upgrade — DLD Title Deed & Emirates ID Optical AI Scanners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with DLD Title Deed Scanner template', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Sovereign Record Keeper/i)).toBeDefined();
    expect(screen.getByText(/7. DLD Title Deed AI Optical Scanner & Ingestion/i)).toBeDefined();
    expect(screen.getByText(/Dubai Land Department \(DLD\) Title Deed Ingestion Hub/i)).toBeDefined();
    expect(screen.getByText(/VIRIDIS A/i)).toBeDefined();
    expect(screen.getByText(/Unit 504/i)).toBeDefined();
    expect(screen.getByText(/AKRAM DIB NEHME/i)).toBeDefined();
    expect(screen.getByText(/أكرم ديب نعمة/i)).toBeDefined();
    expect(screen.getAllByText(/38.76 m²/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/417.21 sq.ft/i)).toBeDefined();
    expect(screen.getByText(/AED 353,000/i)).toBeDefined();
  });

  it('provides 1-click Title Deed actions to auto-fill Tenancy and create CRM listings', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(Property & Landlord\)/i)).toBeDefined();
    expect(screen.getByText(/Create CRM Property Inventory Listing/i)).toBeDefined();
    expect(screen.getByText(/Auto-Fill Form A Seller Mandate/i)).toBeDefined();
  });

  it('executes auto-fill from Title Deed and updates Tenancy Lease state cleanly', () => {
    render(<HenryDocumentStudio />);
    const autoFillBtn = screen.getByText(/Auto-Fill Tenancy Lease \(Property & Landlord\)/i);
    fireEvent.click(autoFillBtn);

    expect(screen.getByText(/Tenancy Lease updated with VIRIDIS A Unit 504 and Landlord AKRAM DIB NEHME!/i)).toBeDefined();
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
  });
});
