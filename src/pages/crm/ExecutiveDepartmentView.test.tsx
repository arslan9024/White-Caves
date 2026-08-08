import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockFetchCorporateDocuments = vi.fn();
const mockFetchCorporateAlerts = vi.fn();

vi.mock('../../hooks/crm/useCompliance', () => ({
  useCompliance: () => ({
    corporateSummary: {
      total: 6,
      active: 3,
      expiringSoon: 2,
      expired: 1,
      archived: 0,
      referenceStored: 0,
      openAlerts: 2,
      acknowledgedAlerts: 1,
      authorityBreakdown: [
        { authority: 'DET', count: 3 },
        { authority: 'RERA', count: 2 },
        { authority: 'DLD', count: 1 },
      ],
    },
    documentsLoading: false,
    documentsError: null,
    fetchCorporateDocuments: mockFetchCorporateDocuments,
    fetchCorporateAlerts: mockFetchCorporateAlerts,
  }),
}));

import ExecutiveDepartmentView from './ExecutiveDepartmentView';

describe('ExecutiveDepartmentView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the corporate credential exposure panel for board-level visibility', async () => {
    render(<ExecutiveDepartmentView />);

    expect(screen.getByRole('heading', { name: /corporate credential exposure/i })).toBeInTheDocument();
    expect(screen.getByText('Tracked')).toBeInTheDocument();
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument();
    expect(screen.getByText('Open Alerts')).toBeInTheDocument();
    expect(screen.getByText('Authority Breakdown')).toBeInTheDocument();
    expect(screen.getByText('DET')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetchCorporateDocuments).toHaveBeenCalled();
      expect(mockFetchCorporateAlerts).toHaveBeenCalled();
    });
  });
});