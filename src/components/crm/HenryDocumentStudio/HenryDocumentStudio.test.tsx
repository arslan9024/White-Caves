import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';

describe('Henry AI 4000% Upgrade — Sovereign Record Keeper & Document Studio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with 4 document classification streams', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Sovereign Record Keeper/i)).toBeDefined();
    expect(screen.getByText(/1. Tenancy Contract \(E-Signature\)/i)).toBeDefined();
    expect(screen.getByText(/2. Government Ejari Certificate Vault/i)).toBeDefined();
    expect(screen.getByText(/3. Form B Viewing Register \(AI Auto-Fill\)/i)).toBeDefined();
    expect(screen.getByText(/4. Broker Commission Tax Invoice/i)).toBeDefined();
  });

  it('generates valid Tenancy Contract HTML with PDC schedule and E-Signature banner', () => {
    const html = henryPdfEngineService.generateTenancyContractHtml({
      contractNumber: 'WC-TC-TEST-001',
      propertyTitle: 'Test Penthouse',
      unitNumber: 'Unit 901',
      community: 'Downtown Dubai',
      annualRentAed: 240000,
      securityDepositAed: 12000,
      leaseStartDate: '01/01/2026',
      leaseEndDate: '31/12/2026',
      landlord: { name: 'Owner Name', emiratesIdOrPassport: '784-001', email: 'owner@test.com', phone: '+971501111111' },
      tenant: { name: 'Tenant Name', emiratesIdOrPassport: '784-002', email: 'tenant@test.com', phone: '+971502222222' },
      broker: { name: 'Broker Name', brnNumber: '123', agencyOrn: '44483', detLicense: '1388443' },
      pdcSchedule: [
        { chequeNumber: '001', dueDate: '01/01/2026', amountAed: 60000, bankName: 'ENBD', status: 'cleared' },
      ],
      esignToken: 'token-abc-123',
    });

    expect(html).toContain('WC-TC-TEST-001');
    expect(html).toContain('E-SIGNATURE LINK READY FOR SHARING');
    expect(html).toContain('https://whitecaves.ae/sign/token-abc-123');
    expect(html).toContain('Downtown Dubai');
  });

  it('generates Government Ejari Archive HTML with official Ejari Number and DLD REST QR', () => {
    const archiveHtml = henryPdfEngineService.generateGovernmentEjariArchiveHtml({
      ejariNumber: '0120250814005322',
      contractReference: 'WC-TC-TEST-001',
      issueDate: '14/08/2025',
      expiryDate: '13/08/2026',
      registeredRentAed: 185000,
      propertyAddress: 'Villa 142, Cluster V, DAMAC Hills 2',
      landlordName: 'Tariq Al-Mansoor',
      tenantName: 'Alexander Wright',
      brokerName: 'Arslan Malik',
      brokerBrn: '59821',
      dldBarcodeHash: 'DLD-HASH-0120250814005322',
      archivedAt: '2026-08-17',
    });

    expect(archiveHtml).toContain('0120250814005322');
    expect(archiveHtml).toContain('HENRY SOVEREIGN VAULT — OFFICIAL GOVERNMENT RECORD');
    expect(archiveHtml).toContain('DLD REST QR');
  });

  it('generates Form B Viewing Register and Tax Invoice with TRN', () => {
    const viewingHtml = henryPdfEngineService.generateViewingFormHtml({
      formId: 'VIEW-001',
      clientName: 'Client Test',
      clientPhone: '+971500000000',
      clientPassportOrEid: '784-999',
      propertyTitle: 'Luxury Villa',
      propertyAddress: 'DAMAC Hills 2',
      viewingDate: '17/08/2026',
      viewingTime: '17:00 PM',
      agentName: 'Arslan Malik',
      agentBrn: '59821',
    });
    expect(viewingHtml).toContain('1-CLICK AI AUTO-FILLED');

    const taxHtml = henryPdfEngineService.generateTaxReceiptHtml({
      receiptNumber: 'INV-001',
      receiptType: 'agency_commission',
      amountAed: 10000,
      vatRatePercent: 5,
      vatAmountAed: 500,
      totalWithVatAed: 10500,
      paidBy: 'Client Test',
      paidTo: 'White Caves Real Estate LLC',
      whiteCavesTrn: '100488291000003',
      paymentMethod: 'bank_transfer',
      paymentReference: 'REF-123',
      date: '17/08/2026',
    });
    expect(taxHtml).toContain('100488291000003');
    expect(taxHtml).toContain('OFFICIAL TAX INVOICE');
  });

  it('allows copying e-sign link and switching document streams', () => {
    render(<HenryDocumentStudio />);
    const shareBtn = screen.getByTitle(/Copy E-Signature Link/i);
    fireEvent.click(shareBtn);
    expect(screen.getByText(/Link Copied!/i)).toBeDefined();

    const govtEjariBtn = screen.getByText(/2. Government Ejari Certificate Vault/i);
    fireEvent.click(govtEjariBtn);
    expect(screen.getByText(/Official DLD registered certificate/i)).toBeDefined();
  });
});
