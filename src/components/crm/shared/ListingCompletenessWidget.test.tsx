/**
 * ListingCompletenessWidget tests — W18.1-P0-011
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { ListingCompletenessWidget } from './ListingCompletenessWidget';

const MOCK_DATA = {
  propertyId: 'prop-1',
  title: 'Marina Heights',
  score: 85,
  passed: ['Title', 'Price', 'Location', 'Images', 'Description', 'Area'],
  failed: [
    { key: 'buildingPermit', label: 'Building Permit', hint: 'Add DLD building permit number' },
  ],
  totalCriteria: 7,
};

function mockFetchSuccess(data = MOCK_DATA) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, data }),
  } as Response);
}

function mockFetchError() {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ error: 'Server Error' }),
  } as unknown as Response);
}

describe('ListingCompletenessWidget', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('shows loading state initially', () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {})); // never resolves
    render(<ListingCompletenessWidget propertyId="prop-1" />);
    expect(screen.getByTestId('completeness-loading')).toBeInTheDocument();
  });

  it('renders score ring when data loads', async () => {
    mockFetchSuccess();
    render(<ListingCompletenessWidget propertyId="prop-1" />);
    await waitFor(() => expect(screen.getByTestId('score-ring')).toBeInTheDocument());
    expect(screen.getByTestId('score-text')).toHaveTextContent('85%');
  });

  it('renders remediation checklist items', async () => {
    mockFetchSuccess();
    render(<ListingCompletenessWidget propertyId="prop-1" />);
    await waitFor(() => expect(screen.getByTestId('completeness-checklist')).toBeInTheDocument());
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Building Permit')).toBeInTheDocument();
    expect(screen.getByText(/Add DLD/)).toBeInTheDocument();
  });

  it('shows error state on fetch failure', async () => {
    mockFetchError();
    render(<ListingCompletenessWidget propertyId="prop-1" />);
    await waitFor(() => expect(screen.getByTestId('completeness-error')).toBeInTheDocument());
    expect(screen.getByTestId('completeness-error')).toHaveTextContent('Score unavailable');
  });

  it('compact mode hides checklist', async () => {
    mockFetchSuccess();
    render(<ListingCompletenessWidget propertyId="prop-1" compact />);
    await waitFor(() => expect(screen.getByTestId('score-ring')).toBeInTheDocument());
    expect(screen.queryByTestId('completeness-checklist')).not.toBeInTheDocument();
  });

  it('score ≥80 has green color class', async () => {
    mockFetchSuccess({ ...MOCK_DATA, score: 80 });
    render(<ListingCompletenessWidget propertyId="prop-1" />);
    await waitFor(() => expect(screen.getByTestId('score-ring')).toBeInTheDocument());
    expect(document.querySelector('.completeness-score-green')).toBeInTheDocument();
  });

  it('score <50 has red color class', async () => {
    mockFetchSuccess({ ...MOCK_DATA, score: 40 });
    render(<ListingCompletenessWidget propertyId="prop-1" />);
    await waitFor(() => expect(screen.getByTestId('score-ring')).toBeInTheDocument());
    expect(document.querySelector('.completeness-score-red')).toBeInTheDocument();
  });

  it('calls the correct API endpoint', async () => {
    mockFetchSuccess();
    render(<ListingCompletenessWidget propertyId="prop-abc" />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/properties/prop-abc/completeness'));
  });

  it('showChecklist=false hides checklist even when not compact', async () => {
    mockFetchSuccess();
    render(<ListingCompletenessWidget propertyId="prop-1" showChecklist={false} />);
    await waitFor(() => expect(screen.getByTestId('score-ring')).toBeInTheDocument());
    expect(screen.queryByTestId('completeness-checklist')).not.toBeInTheDocument();
  });
});
