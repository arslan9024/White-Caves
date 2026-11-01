import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { StandbyRosterDrawer } from './StandbyRosterDrawer';

describe('StandbyRosterDrawer', () => {
  const mockFetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ success: true, data: [] }),
  });

  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
    mockFetch.mockClear();
  });

  it('authenticates the standby roster request', async () => {
    render(<StandbyRosterDrawer isOpen onClose={vi.fn()} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/corporate-departments/standby', {
        headers: { Authorization: ['Bearer', 'test-token'].join(' ') },
      });
    });
  });
});
