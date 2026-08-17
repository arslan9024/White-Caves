import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HenryDocumentStudio } from './HenryDocumentStudio';
import henryPdfEngineService from '../../../services/HenryPdfEngineService';

describe('Henry AI 4000% Upgrade — HenryDocumentStudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Henry Document Studio with executive header and templates list', () => {
    render(<HenryDocumentStudio />);
    expect(screen.getByTestId('henry-document-studio')).toBeDefined();
    expect(screen.getByText(/Henry AI — Document Studio/i)).toBeDefined();
    expect(screen.getByText(/Ejari Form 7 Unified Tenancy Contract/i)).toBeDefined();
    expect(screen.getByText(/Form 12 — 12-Month Eviction Notice/i)).toBeDefined();
  });

  it('generates valid Ejari Contract HTML with PDC repayments table and compliance badges', () => {
    const html = henryPdfEngineService.generateEjariContractHtml({
      contractNumber: 'EJARI-TEST-001',
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
    });

    expect(html).toContain('EJARI-TEST-001');
    expect(html).toContain('Downtown Dubai');
    expect(html).toContain('RERA ORN: 44483');
    expect(html).toContain('DET License: 1388443');
    expect(html).toContain('WHITE CAVES LLC');
  });

  it('generates Form 12 Legal Notice HTML pursuant to Dubai Law 33 of 2008', () => {
    const noticeHtml = henryPdfEngineService.generateForm12LegalNoticeHtml(
      'EJARI-999',
      'Villa 10, Palm Jumeirah',
      'Sheikh Landlord',
      'John Tenant',
      'sale',
      '31/12/2026'
    );

    expect(noticeHtml).toContain('FORM 12 — NOTARIZED 12-MONTH LEGAL NOTICE TO VACATE');
    expect(noticeHtml).toContain('Dubai Law No. 33 of 2008');
    expect(noticeHtml).toContain('Villa 10, Palm Jumeirah');
  });

  it('allows switching templates and zooming preview in Henry Studio', () => {
    render(<HenryDocumentStudio />);
    const legalNoticeBtn = screen.getByText(/Form 12 — 12-Month Eviction Notice/i);
    fireEvent.click(legalNoticeBtn);

    const zoomInBtn = screen.getByTitle(/Zoom In/i);
    fireEvent.click(zoomInBtn);
    expect(screen.getByText(/Live Print Preview — Zoom: 115%/i)).toBeDefined();
  });
});
