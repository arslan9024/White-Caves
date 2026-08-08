import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

const mockFetchOverview = vi.fn();
const mockFetchCorporateDocuments = vi.fn();
const mockFetchCorporateAlerts = vi.fn();
const mockAcknowledgeCorporateAlert = vi.fn();
const mockImportCorporateRegistry = vi.fn();

vi.mock('../../hooks/crm/useCompliance', () => ({
  useCompliance: () => ({
    overview: { overallScore: 88 },
    loading: false,
    error: null,
    documentsLoading: false,
    documentsError: null,
    corporateDocuments: [
      {
        id: 'doc-1',
        title: 'DET Commercial License',
        authority: 'DET',
        referenceNumber: '1388443',
        licenseNumber: '1388443',
        expiryDate: '2026-09-30T00:00:00.000Z',
        status: 'expiring_soon',
      },
      {
        id: 'doc-2',
        title: 'RERA Certificate',
        authority: 'RERA',
        referenceNumber: '44483',
        expiryDate: '2026-07-30T00:00:00.000Z',
        status: 'expired',
      },
    ],
    corporateAlerts: [
      {
        id: 'alert-1',
        documentId: 'doc-1',
        alertType: 'expiry_warning',
        status: 'open',
        message: 'Corporate document will expire soon.',
        document: { id: 'doc-1', title: 'DET Commercial License', authority: 'DET', status: 'expiring_soon' },
      },
    ],
    corporateSummary: {
      total: 2,
      active: 0,
      expiringSoon: 1,
      expired: 1,
      archived: 0,
      referenceStored: 0,
      openAlerts: 1,
      acknowledgedAlerts: 0,
      authorityBreakdown: [
        { authority: 'DET', count: 1 },
        { authority: 'RERA', count: 1 },
      ],
    },
    fetchOverview: mockFetchOverview,
    fetchCorporateDocuments: mockFetchCorporateDocuments,
    fetchCorporateAlerts: mockFetchCorporateAlerts,
    acknowledgeCorporateAlert: mockAcknowledgeCorporateAlert,
    importCorporateRegistry: mockImportCorporateRegistry,
  }),
}));

import ComplianceDepartmentView from './ComplianceDepartmentView';

describe('ComplianceDepartmentView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImportCorporateRegistry.mockResolvedValue({ created: 1, updated: 1 });
    mockAcknowledgeCorporateAlert.mockResolvedValue({ id: 'alert-1', status: 'acknowledged' });
  });

  it('renders the Wave 31 corporate credential register and live metrics', async () => {
    render(<ComplianceDepartmentView />);

    const registerSection = screen.getByLabelText(/corporate documents compliance register/i);
    const registerTable = within(registerSection).getAllByRole('table')[0];

    expect(screen.getByRole('heading', { name: /corporate credentials register/i })).toBeInTheDocument();
    expect(within(registerTable).getByText('DET Commercial License')).toBeInTheDocument();
    expect(within(registerTable).getByText('RERA Certificate')).toBeInTheDocument();
    expect(screen.getByText('Authority breakdown')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetchOverview).toHaveBeenCalled();
      expect(mockFetchCorporateDocuments).toHaveBeenCalled();
      expect(mockFetchCorporateAlerts).toHaveBeenCalled();
    });
  });

  it('filters corporate documents by search input', () => {
    render(<ComplianceDepartmentView />);

    const registerSection = screen.getByLabelText(/corporate documents compliance register/i);
    const registerTable = within(registerSection).getAllByRole('table')[0];

    fireEvent.change(screen.getByLabelText(/search corporate documents/i), {
      target: { value: 'RERA' },
    });

    expect(within(registerTable).getByText('RERA Certificate')).toBeInTheDocument();
    expect(within(registerTable).queryByText('DET Commercial License')).not.toBeInTheDocument();
  });

  it('supports registry import and alert acknowledgement actions', async () => {
    render(<ComplianceDepartmentView />);

    fireEvent.click(screen.getByRole('button', { name: /import registry/i }));
    fireEvent.click(screen.getByRole('button', { name: /acknowledge/i }));

    await waitFor(() => {
      expect(mockImportCorporateRegistry).toHaveBeenCalled();
      expect(mockAcknowledgeCorporateAlert).toHaveBeenCalledWith('alert-1');
    });
  });
});