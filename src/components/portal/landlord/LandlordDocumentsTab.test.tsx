/**
 * LandlordDocumentsTab.test.tsx
 * Tests for Phase 2.6: Documents tab
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordDocumentsTab from './LandlordDocumentsTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockLandlord = {
  id: 'landlord-1',
  email: 'landlord@test.ae',
  name: 'Ahmed Al-Mansouri',
  role: 'landlord',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        currentUser: mockLandlord,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  });
};

const renderWithStore = (
  component: React.ReactElement,
  preloadedState?: PreloadedState<RootState>
) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('LandlordDocumentsTab', () => {
  describe('Render Basics', () => {
    it('renders tab heading and description', () => {
      renderWithStore(<LandlordDocumentsTab />);

      expect(screen.getByText('Documents')).toBeInTheDocument();
      expect(screen.getByText(/Review tenancy files/i)).toBeInTheDocument();
    });

    it('renders all document rows by default', () => {
      renderWithStore(<LandlordDocumentsTab />);

      expect(screen.getByTestId('document-row-doc-001')).toBeInTheDocument();
      expect(screen.getByTestId('document-row-doc-002')).toBeInTheDocument();
      expect(screen.getByTestId('document-row-doc-003')).toBeInTheDocument();
      expect(screen.getByTestId('document-row-doc-004')).toBeInTheDocument();
    });
  });

  describe('Search and Filter', () => {
    it('filters by document search query', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.change(screen.getByTestId('document-search'), {
        target: { value: 'Ejari Certificate' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('document-row-doc-002')).toBeInTheDocument();
        expect(screen.queryByTestId('document-row-doc-001')).not.toBeInTheDocument();
      });
    });

    it('filters by document type', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.change(screen.getByTestId('document-type-filter'), {
        target: { value: 'noc' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('document-row-doc-003')).toBeInTheDocument();
        expect(screen.queryByTestId('document-row-doc-001')).not.toBeInTheDocument();
      });
    });

    it('supports combined search and type filtering', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.change(screen.getByTestId('document-type-filter'), {
        target: { value: 'tenancy' },
      });
      fireEvent.change(screen.getByTestId('document-search'), {
        target: { value: 'Marina View' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('document-row-doc-001')).toBeInTheDocument();
        expect(screen.queryByTestId('document-row-doc-002')).not.toBeInTheDocument();
      });
    });

    it('shows empty state when no document matches', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.change(screen.getByTestId('document-search'), {
        target: { value: 'NoSuchDocument' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('documents-empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('Download and Details', () => {
    it('renders download links with external target', () => {
      renderWithStore(<LandlordDocumentsTab />);

      const link = screen.getByTestId('download-link-doc-001');
      expect(link).toHaveAttribute('href', 'https://example.com/docs/doc-001.pdf');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('opens detail modal from View Details button', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.click(screen.getByTestId('view-details-doc-002'));

      await waitFor(() => {
        expect(screen.getByTestId('document-detail-modal')).toBeInTheDocument();
      });
    });

    it('shows selected document details in modal', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.click(screen.getByTestId('view-details-doc-003'));

      await waitFor(() => {
        const modal = screen.getByTestId('document-detail-modal');
        expect(within(modal).getByText(/Document Details/i)).toBeInTheDocument();
        expect(within(modal).getByText(/doc-003/i)).toBeInTheDocument();
        expect(within(modal).getByText(/JBR Villa NOC Letter/i)).toBeInTheDocument();
        expect(within(modal).getByText(/^noc$/i)).toBeInTheDocument();
      });
    });

    it('closes detail modal on close button click', async () => {
      renderWithStore(<LandlordDocumentsTab />);

      fireEvent.click(screen.getByTestId('view-details-doc-001'));
      await waitFor(() => {
        expect(screen.getByTestId('document-detail-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('Close document details'));

      await waitFor(() => {
        expect(screen.queryByTestId('document-detail-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication', () => {
    it('shows login-required message when user is not authenticated', () => {
      renderWithStore(<LandlordDocumentsTab />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(screen.getByText(/You must be logged in to view your documents/i)).toBeInTheDocument();
    });
  });
});
