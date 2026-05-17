/**
 * PropertyManagementPage — Unit Tests
 * Tests: rendering, stats, search/filters, property cards, modals,
 * pagination, empty states, loading/error banners
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../shared/components/ui/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) =>
    isOpen ? (
      <div data-testid="modal" role="dialog">
        <h2>{title}</h2>
        <button data-testid="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    ) : null,
}));

vi.mock('../../components/ui', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid={`badge-${variant || 'default'}`}>{children}</span>
  ),
  Pagination: ({ currentPage, totalItems, itemsPerPage, onPageChange }: { currentPage: number; totalItems: number; itemsPerPage: number; onPageChange: (p: number) => void }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return totalPages > 1 ? (
      <div data-testid="pagination">
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>Prev</button>
      </div>
    ) : null;
  },
}));

vi.mock('../../utils/authFetch', () => ({
  authFetch: vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) }),
}));

import { authFetch } from '../../utils/authFetch';

import PropertyManagementPage from './PropertyManagementPage';
import crmDataReducer from '../../store/crmDataSlice';

// ── Test Data ────────────────────────────────────────────────────

const mockProperties = [
  { id: '1', title: 'Luxury Villa - Palm Jumeirah', type: 'villa', status: 'available', featured: true, location: 'Palm Jumeirah, Dubai', price: 15000000, bedrooms: 5, bathrooms: 6, sqft: 8500, agent_name: 'Ahmed Al Rashid', description: 'Stunning beachfront villa', area: 'Palm Jumeirah' },
  { id: '2', title: 'Modern Apartment - Downtown', type: 'apartment', status: 'reserved', featured: false, location: 'Downtown Dubai', price: 3500000, bedrooms: 2, bathrooms: 2, sqft: 1200, agent_name: 'Sara Khan', description: 'City view apartment', area: 'Downtown' },
  { id: '3', title: 'Penthouse - Marina', type: 'penthouse', status: 'sold', featured: false, location: 'Dubai Marina', price: 8000000, bedrooms: 3, bathrooms: 4, sqft: 3200, agent_name: 'Omar Hassan', description: 'Premium penthouse', area: 'Marina' },
  { id: '4', title: 'Commercial Office - Business Bay', type: 'commercial', status: 'available', featured: false, location: 'Business Bay', price: 5000000, bedrooms: 0, bathrooms: 2, sqft: 2000, agent_name: 'Fatima Ali', description: 'Office space', area: 'Business Bay' },
];

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = (properties = mockProperties, loading = false, error: string | null = null) => {
  return configureStore({
    reducer: { crmData: crmDataReducer },
    preloadedState: {
      crmData: {
        properties: { items: properties, selected: null, loading, error },
        leads: { items: [], selected: null, loading: false, error: null },
        clients: { items: [], selected: null, loading: false, error: null },
        agents: { items: [], selected: null, loading: false, error: null },
        commissions: { items: [], loading: false, error: null },
        activities: { items: [], loading: false, error: null },
        overview: null,
        lastUpdated: new Date().toISOString(),
      } as unknown as ReturnType<typeof crmDataReducer>,
    },
  });
};

const renderPage = (properties = mockProperties, loading = false, error: string | null = null) => {
  const store = createMockStore(properties, loading, error);
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <PropertyManagementPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('PropertyManagementPage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the page title', () => {
      renderPage();
      expect(screen.getByText(/Property Portfolio/)).toBeInTheDocument();
    });

    it('should render back link', () => {
      renderPage();
      expect(screen.getByText(/Back to CRM Hub/)).toBeInTheDocument();
    });

    it('should render Add Property button', () => {
      renderPage();
      expect(screen.getByText(/Add Property/)).toBeInTheDocument();
    });

    it('should render search input', () => {
      renderPage();
      expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument();
    });

    it('should render status filter', () => {
      renderPage();
      expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
    });

    it('should render type filter', () => {
      renderPage();
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    });

    it('should render Grid and List view toggles', () => {
      renderPage();
      expect(screen.getByText('Grid')).toBeInTheDocument();
      expect(screen.getByText('List')).toBeInTheDocument();
    });
  });

  // ── Stats Cards ──────────────────────────────────────────────

  describe('Stats Cards', () => {
    it('should render Total Properties stat', () => {
      renderPage();
      expect(screen.getByText('Total Properties')).toBeInTheDocument();
    });

    it('should render Available stat', () => {
      renderPage();
      const matches = screen.getAllByText('Available');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('should render Reserved stat', () => {
      renderPage();
      const matches = screen.getAllByText('Reserved');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('should render Sold stat', () => {
      renderPage();
      const matches = screen.getAllByText('Sold');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('should render Portfolio Value stat', () => {
      renderPage();
      expect(screen.getByText('Portfolio Value')).toBeInTheDocument();
    });

    it('should show correct total count', () => {
      renderPage();
      expect(screen.getByText('4')).toBeInTheDocument(); // 4 properties
    });
  });

  // ── Property Cards ───────────────────────────────────────────

  describe('Property Cards', () => {
    it('should render property titles', () => {
      renderPage();
      expect(screen.getByText('Luxury Villa - Palm Jumeirah')).toBeInTheDocument();
      expect(screen.getByText('Modern Apartment - Downtown')).toBeInTheDocument();
      expect(screen.getByText('Penthouse - Marina')).toBeInTheDocument();
    });

    it('should render property locations', () => {
      renderPage();
      expect(screen.getByText(/Palm Jumeirah, Dubai/)).toBeInTheDocument();
      expect(screen.getByText(/Downtown Dubai/)).toBeInTheDocument();
    });

    it('should render featured badge on featured properties', () => {
      renderPage();
      expect(screen.getByText(/Featured/)).toBeInTheDocument();
    });

    it('should render Edit and Delete buttons on each card', () => {
      renderPage();
      const editBtns = screen.getAllByText('Edit');
      const deleteBtns = screen.getAllByText('Delete');
      expect(editBtns.length).toBe(4);
      expect(deleteBtns.length).toBe(4);
    });

    it('should render bedroom and bathroom counts', () => {
      renderPage();
      expect(screen.getByText(/5 Bed/)).toBeInTheDocument();
      expect(screen.getByText(/6 Bath/)).toBeInTheDocument();
    });

    it('should render agent names', () => {
      renderPage();
      expect(screen.getByText(/Ahmed Al Rashid/)).toBeInTheDocument();
      expect(screen.getByText(/Sara Khan/)).toBeInTheDocument();
    });
  });

  // ── Search ───────────────────────────────────────────────────

  describe('Search', () => {
    it('should filter properties by search text', () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'Villa' } });
      expect(screen.getByText('Luxury Villa - Palm Jumeirah')).toBeInTheDocument();
      expect(screen.queryByText('Modern Apartment - Downtown')).not.toBeInTheDocument();
    });

    it('should search by location', () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'Marina' } });
      expect(screen.getByText('Penthouse - Marina')).toBeInTheDocument();
    });

    it('should search by agent name', () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'Ahmed' } });
      expect(screen.getByText('Luxury Villa - Palm Jumeirah')).toBeInTheDocument();
    });
  });

  // ── Filters ──────────────────────────────────────────────────

  describe('Filters', () => {
    it('should filter by status', () => {
      renderPage();
      const statusSelect = screen.getByDisplayValue('All Status');
      fireEvent.change(statusSelect, { target: { value: 'available' } });
      expect(screen.getByText('Luxury Villa - Palm Jumeirah')).toBeInTheDocument();
      expect(screen.queryByText('Modern Apartment - Downtown')).not.toBeInTheDocument(); // reserved
    });

    it('should filter by type', () => {
      renderPage();
      const typeSelect = screen.getByDisplayValue('All Types');
      fireEvent.change(typeSelect, { target: { value: 'villa' } });
      expect(screen.getByText('Luxury Villa - Palm Jumeirah')).toBeInTheDocument();
      expect(screen.queryByText('Modern Apartment - Downtown')).not.toBeInTheDocument();
    });
  });

  // ── Modals ───────────────────────────────────────────────────

  describe('Modals', () => {
    it('should open create modal when Add Property is clicked', async () => {
      renderPage();
      fireEvent.click(screen.getByText(/Add Property/));
      await waitFor(() => {
        expect(screen.getByText('Add New Property')).toBeInTheDocument();
      });
    });

    it('should open edit modal when Edit button is clicked', async () => {
      renderPage();
      const editBtns = screen.getAllByText('Edit');
      fireEvent.click(editBtns[0]);
      await waitFor(() => {
        expect(screen.getByText(/Edit:/)).toBeInTheDocument();
      });
    });

    it('should open delete confirm when Delete button is clicked', async () => {
      renderPage();
      const deleteBtns = screen.getAllByText('Delete');
      fireEvent.click(deleteBtns[0]);
      await waitFor(() => {
        expect(screen.getByText('Delete Property')).toBeInTheDocument();
      });
    });

    it('should show confirmation message in delete modal', async () => {
      renderPage();
      const deleteBtns = screen.getAllByText('Delete');
      fireEvent.click(deleteBtns[0]);
      await waitFor(() => {
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
        expect(screen.getByText(/cannot be undone/)).toBeInTheDocument();
      });
    });
  });

  // ── Loading State ────────────────────────────────────────────

  describe('Loading State', () => {
    it('should show loading banner when loading', () => {
      renderPage(mockProperties, true);
      expect(screen.getByText(/Loading properties/)).toBeInTheDocument();
    });
  });

  // ── Error State ──────────────────────────────────────────────

  describe('Error State', () => {
    it('should show error banner when fetch fails', async () => {
      (authFetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
      const store = createMockStore(mockProperties, false, null);
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PropertyManagementPage />
          </MemoryRouter>
        </Provider>,
      );
      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
      });
    });

    it('should show Retry button when fetch fails', async () => {
      (authFetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Timeout'));
      const store = createMockStore(mockProperties, false, null);
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PropertyManagementPage />
          </MemoryRouter>
        </Provider>,
      );
      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });
  });

  // ── Empty State ──────────────────────────────────────────────

  describe('Empty State', () => {
    it('should show empty message when no properties', () => {
      renderPage([]);
      expect(screen.getByText(/No properties yet/)).toBeInTheDocument();
    });

    it('should show no-match message when filters have no results', () => {
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'zzzznonexistent' } });
      expect(screen.getByText(/No properties match your filters/)).toBeInTheDocument();
    });
  });

  // ── Back Navigation ──────────────────────────────────────────

  describe('Navigation', () => {
    it('should navigate back when back link is clicked', () => {
      renderPage();
      fireEvent.click(screen.getByText(/Back to CRM Hub/));
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm');
    });
  });
});
