import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';

describe('Henry AI 4000% Upgrade — Sovereign Record Keeper, Tenant & Landlord Tax Invoicing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with Tenant & Landlord service charge templates', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Sovereign Record Keeper/i)).toBeDefined();
    expect(screen.getByText(/1. Tenancy Contract \(E-Signature\)/i)).toBeDefined();
    expect(screen.getByText(/2. Government Ejari Certificate Vault/i)).toBeDefined();
    expect(screen.getByText(/3. Form B Viewing Register \(AI Auto-Fill\)/i)).toBeDefined();
    expect(screen.getByText(/4. Tenant Service Charge Receipt & Tax Invoice/i)).toBeDefined();
    expect(screen.getByText(/5. Landlord Property Management & Service Invoice/i)).toBeDefined();
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
    expect(tenantInvoiceHtml).toContain('FTA UAE COMPLIANT');
  });

  it('generates valid Landlord Property Management Tax Invoice with 5% VAT', () => {
    const landlordInvoiceHtml = henryPdfEngineService.generateTaxReceiptHtml({
      receiptNumber: 'INV-WC-LL-2026-088',
      receiptType: 'landlord_property_management',
      billedPartyType: 'landlord',
      paidBy: 'Tariq Al-Mansoor',
      clientTrnOrEid: '784-1982-1234567-1',
      propertyAddress: 'Villa 142, DAMAC Hills 2, Dubai',
      serviceDescription: 'Annual Comprehensive Property Management Fee & Tenant Sourcing',
      amountAed: 9250,
      vatRatePercent: 5,
      vatAmountAed: 462.5,
      totalWithVatAed: 9712.5,
      paidTo: 'WHITE CAVES REAL ESTATE L.L.C',
      whiteCavesTrn: '100488291000003',
      paymentMethod: 'uaedds',
      paymentReference: 'DDS-LL-88',
      date: '17/08/2026',
    });

    expect(landlordInvoiceHtml).toContain('LANDLORD PROPERTY MANAGEMENT & SERVICE INVOICE');
    expect(landlordInvoiceHtml).toContain('Tariq Al-Mansoor');
    expect(landlordInvoiceHtml).toContain('AED 9,712.5');
    expect(landlordInvoiceHtml).toContain('Mashreq Bank');
  });

  it('allows switching between Tenant and Landlord invoice templates in the UI', () => {
    render(<HenryDocumentStudio />);
    const tenantTab = screen.getByText(/4. Tenant Service Charge/i);
    fireEvent.click(tenantTab);
    expect(screen.getByText(/Official tax invoice & receipt for Tenant Service Charges/i)).toBeDefined();

    const landlordTab = screen.getByText(/5. Landlord Property Management/i);
    fireEvent.click(landlordTab);
    expect(screen.getByText(/Tax invoice for Landlord Annual Property Management/i)).toBeDefined();
  });
});
