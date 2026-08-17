import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';
import henryPassportScannerService from '../../../services/HenryPassportScannerService';

describe('Henry AI 4000% Upgrade — International Passport, Title Deed & Emirates ID Optical AI Scanners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with International Passport Scanner template', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Sovereign Record Keeper/i)).toBeDefined();
    expect(screen.getByText(/8. International Passport AI Scanner & KYC Hub/i)).toBeDefined();
    expect(screen.getByText(/International Passport & goAML KYC Ingestion Hub/i)).toBeDefined();
    expect(screen.getAllByText(/DR0760143/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Arslan Malik/i)).toBeDefined();
    expect(screen.getByText(/Bashir Ahmad/i)).toBeDefined();
    expect(screen.getByText(/32303-4339014-9/i)).toBeDefined();
    expect(screen.getByText(/MUZAFFARGARH, PAK/i)).toBeDefined();
    expect(screen.getByText(/10 Years \(Active & Valid\)/i)).toBeDefined();
  });

  it('provides 1-click Passport actions to auto-fill Tenancy and create KYC records', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(as Non-Resident Tenant\)/i)).toBeDefined();
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(as Non-Resident Landlord\)/i)).toBeDefined();
    expect(screen.getByText(/Create goAML KYC Audit Record/i)).toBeDefined();
  });

  it('executes auto-fill from Passport as Tenant and updates Tenancy Lease state cleanly', () => {
    render(<HenryDocumentStudio />);
    const autoFillBtn = screen.getByText(/Auto-Fill Tenancy Lease \(as Non-Resident Tenant\)/i);
    fireEvent.click(autoFillBtn);

    expect(screen.getByText(/Tenancy Lease auto-filled with Arslan Malik \(Passport DR0760143\) as Tenant!/i)).toBeDefined();
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

  it('opens interactive DLD Tenancy Contract preparation modal when Prepare button is clicked', () => {
    render(<HenryDocumentStudio />);
    const prepareBtn = screen.getByTestId('prepare-tenancy-btn');
    expect(prepareBtn).toBeDefined();

    fireEvent.click(prepareBtn);
    expect(screen.getByTestId('henry-tenancy-modal')).toBeDefined();
    expect(screen.getByText(/Bilingual Dubai Land Department Tenancy Contract Form/i)).toBeDefined();
    expect(screen.getByText(/1. Property & Owner/i)).toBeDefined();
  });
});
