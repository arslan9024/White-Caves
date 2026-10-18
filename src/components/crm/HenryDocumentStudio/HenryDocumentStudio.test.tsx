import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';

describe('Henry AI 4000% Upgrade — International Passport, Title Deed & Emirates ID Optical AI Scanners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with International Passport Scanner template', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Sovereign Record Keeper/i)).toBeDefined();
    expect(screen.getByText(/8. International Passport AI Scanner & KYC Hub/i)).toBeDefined();
    expect(screen.getByText(/International Passport — Demo Preview/i)).toBeDefined();
    expect(screen.getAllByText(/DR0760143/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Arslan Malik/i)).toBeDefined();
    expect(screen.getByText(/Bashir Ahmad/i)).toBeDefined();
    expect(screen.getByText(/32303-4339014-9/i)).toBeDefined();
    expect(screen.getByText(/MUZAFFARGARH, PAK/i)).toBeDefined();
    expect(screen.getByText(/10 Years \(derived date span, not current validity\)/i)).toBeDefined();
    expect(screen.getByText(/neither authenticity nor signatures are verified/)).toBeInTheDocument();
    expect(screen.getByText(/Ejari certificates, licences/)).toBeInTheDocument();
    expect(screen.queryByText(/0120260721003974|KYC VERIFIED|BLOCKCHAIN VERIFIED|extract verified data|100% OCR & MRZ ACCURACY/)).not.toBeInTheDocument();
  });

  it('provides 1-click Passport actions to auto-fill Tenancy and create KYC records', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(as Non-Resident Tenant\)/i)).toBeDefined();
    expect(screen.getByText(/Auto-Fill Tenancy Lease \(as Non-Resident Landlord\)/i)).toBeDefined();
    expect(screen.getByText(/Create goAML KYC Audit Record/i)).toBeDefined();
  });

  it('rejects benchmark Passport autofill without opening a populated lease', () => {
    render(<HenryDocumentStudio />);
    const autoFillBtn = screen.getByText(/Auto-Fill Tenancy Lease \(as Non-Resident Tenant\)/i);
    fireEvent.click(autoFillBtn);

    expect(screen.getByText('Review required. Benchmark or unconfirmed data cannot autofill or create records.')).toBeInTheDocument();
    expect(screen.queryByText(/Tenancy Lease auto-filled/)).not.toBeInTheDocument();
    expect(screen.getByText(/International Passport — Demo Preview/i)).toBeInTheDocument();
  });

  it('generates valid Tenant Service Charge Tax Invoice with TRN and 5% VAT', async () => {
    const tenantInvoiceHtml = await henryPdfEngineService.generateTaxReceiptHtml({
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
    expect(screen.getAllByText(/Prepare New Tenancy Contract/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Official DLD Unified Template/i)).toBeDefined();
    expect(screen.getByText(/1. Title Deed & Unit/i)).toBeDefined();
  });

  it('navigates to Stream 9 Tenancy Contract AI Scanner and displays filled extraction with 92% completeness', () => {
    render(<HenryDocumentStudio />);
    const stream9Tab = screen.getByText(/9. Tenancy Contract Scanner Demo/i);
    expect(stream9Tab).toBeDefined();

    fireEvent.click(stream9Tab);
    expect(screen.getByText(/Tenancy Contract Scanner — Demo Preview/i)).toBeDefined();
    expect(screen.getByText('TENANCY CONTRACT DEMO PREVIEW')).toBeDefined();
    expect(screen.getByText(/Demo field coverage \(92% Score\)/i)).toBeDefined();
    expect(screen.getByText(/SANIT SINGH NAGPAL/i)).toBeDefined();
    expect(screen.getByText(/KESHIVANI MAYADEVAN/i)).toBeDefined();
    expect(screen.getByText(/CAMELIA Unit 608/i)).toBeDefined();
    expect(screen.getByText(/AED 112,000/i)).toBeDefined();
    expect(screen.getByText(/3 CHEQUES/i)).toBeDefined();
    expect(screen.getByText(/1. Addendum is part of contract./i)).toBeDefined();
  });
  it('never offers a working signing link or an official archived Ejari record', () => {
    const clipboard = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText: clipboard } });
    try {
      render(<HenryDocumentStudio />);
      fireEvent.click(screen.getByText(/1. Tenancy Contract Preparation Preview/));
      fireEvent.click(screen.getByText('E-signature unavailable'));
      expect(screen.getByText(/No link was generated, copied or sent/)).toBeInTheDocument();
      expect(clipboard).not.toHaveBeenCalled();
      fireEvent.click(screen.getByText(/2. Ejari Layout Demo \(Not a Certificate\)/));
      expect(screen.queryByText(/Official Record|E-Sign Link Ready|Link Copied!/)).not.toBeInTheDocument();
    } finally { vi.unstubAllGlobals(); }
  });
  it('keeps demo scanner accuracy, ownership and execution claims unverified on every tab', () => {
    render(<HenryDocumentStudio />);
    for (const tab of [/6. Emirates ID AI Optical Scanner/, /7. DLD Title Deed AI Optical Scanner/, /9. Tenancy Contract Scanner Demo/]) {
      fireEvent.click(screen.getByText(tab));
      expect(screen.queryByText(/100% OCR & MRZ ACCURACY|BLOCKCHAIN VERIFIED|FILLED & VALIDATED|terms present & validated!/)).not.toBeInTheDocument();
      expect(screen.getByText(/Studio scanner cards show synthetic demo data/)).toBeInTheDocument();
    }
  });
});
