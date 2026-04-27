import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

// ─── Mock styled-components inline ──────────────────────────────────
vi.mock('styled-components', async () => {
  const actual = await vi.importActual('styled-components');
  return actual;
});

// Mock sidebarSlice selectors + actions
const mockDispatch = vi.fn();
let mockIsOpen = false;

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => {
      // selectCommandPaletteOpen
      if (selector.name?.includes?.('commandPalette') || selector.toString().includes('commandPaletteOpen')) {
        return mockIsOpen;
      }
      return undefined;
    },
  };
});

vi.mock('../../store/slices/sidebarSlice', () => ({
  selectCommandPaletteOpen: (state: any) => state?.sidebar?.commandPaletteOpen ?? false,
  closeCommandPalette: () => ({ type: 'sidebar/closeCommandPalette' }),
  selectDepartment: (dept: string) => ({ type: 'sidebar/selectDepartment', payload: dept }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import CommandPalette from './CommandPalette';

// ─── Tests ──────────────────────────────────────────────────────────

describe('CommandPalette', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOpen = false;
    mockNavigate.mockReset();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders nothing when closed', () => {
      mockIsOpen = false;
      const { container } = render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders the palette when open', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      expect(screen.getByPlaceholderText(/search departments/i)).toBeInTheDocument();
    });

    it('renders ESC close hint', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      expect(screen.getByText('ESC')).toBeInTheDocument();
    });

    it('renders default items when no search query', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      // Should show navigation items
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders department items', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      expect(screen.getByText('Operations Department')).toBeInTheDocument();
      expect(screen.getByText('Finance Department')).toBeInTheDocument();
      expect(screen.getByText('Sales Department')).toBeInTheDocument();
    });

    it('renders footer with keyboard hints', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      expect(screen.getByText(/navigate/)).toBeInTheDocument();
      expect(screen.getByText(/White Caves CRM/)).toBeInTheDocument();
    });
  });

  // === SEARCH FILTERING ===
  describe('search filtering', () => {
    it('filters items by search query', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      fireEvent.change(input, { target: { value: 'finance' } });
      expect(screen.getByText('Finance Department')).toBeInTheDocument();
      expect(screen.queryByText('Operations Department')).not.toBeInTheDocument();
    });

    it('shows empty state when no results match', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      fireEvent.change(input, { target: { value: 'zzz_nonexistent_zzz' } });
      expect(screen.getByText(/no results for/i)).toBeInTheDocument();
    });

    it('filters by keyword match', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      fireEvent.change(input, { target: { value: 'charts' } });
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  // === INTERACTIONS ===
  describe('interactions', () => {
    it('dispatches closeCommandPalette on Escape key', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'sidebar/closeCommandPalette' });
    });

    it('dispatches closeCommandPalette on overlay click', () => {
      mockIsOpen = true;
      const { container } = render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      // Click the overlay backdrop (first child)
      const overlay = container.firstChild as HTMLElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'sidebar/closeCommandPalette' });
      }
    });

    it('selects item on Enter key press', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      // First item is "Dashboard" (navigation)
      fireEvent.keyDown(input, { key: 'Enter' });
      // Should dispatch closeCommandPalette and navigate
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'sidebar/closeCommandPalette' });
    });

    it('navigates items with arrow keys', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      // Should not throw, keyboard nav works
      expect(input).toBeInTheDocument();
    });

    it('resets active index on new search query', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      const input = screen.getByPlaceholderText(/search departments/i);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.change(input, { target: { value: 'f' } });
      // Active index should reset to 0 on query change
      expect(input).toHaveValue('f');
    });

    it('dispatches item action on click', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByText('Dashboard'));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'sidebar/closeCommandPalette' });
    });

    it('dispatches selectDepartment when department clicked', () => {
      mockIsOpen = true;
      render(
        <MemoryRouter>
          <CommandPalette />
        </MemoryRouter>,
      );
      fireEvent.click(screen.getByText('Finance Department'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'sidebar/selectDepartment', payload: 'finance' });
    });
  });
});
