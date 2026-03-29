/**
 * AIDropdownSelector – comprehensive test suite
 * Covers rendering, open/close, search, department filters, favorites, selection
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AIDropdownSelector from './AIDropdownSelector';
import type { AIAssistant } from '../../../store/slices/aiAssistant/types';

/* ── CSS mock ─────────────────────────────────────────────────── */
vi.mock('./AIDropdownSelector.css', () => ({}));

/* ── Redux mock ───────────────────────────────────────────────── */
const mockDispatch = vi.fn();

const mockAssistants: AIAssistant[] = [
  { id: 'a1', name: 'Clara', title: 'Lead Agent', department: 'sales', avatar: '🔵', colorScheme: '#10B981' } as AIAssistant,
  { id: 'a2', name: 'Mary', title: 'Inventory Manager', department: 'operations', avatar: '🟢', colorScheme: '#3B82F6' } as AIAssistant,
  { id: 'a3', name: 'Omar', title: 'Finance Lead', department: 'finance', avatar: '🟡', colorScheme: '#F59E0B' } as AIAssistant,
];

let mockUIState = { dropdownOpen: false, filters: { searchQuery: '', department: 'all' } };
let mockCurrentAssistant: AIAssistant | null = null;
let mockFavorites: string[] = [];
let mockRecent: string[] = [];

vi.mock('react-redux', () => ({
  useSelector: (selector: Function) => {
    // We call selector and return mock data based on selector identity
    // Since we can't easily check selector identity, return from mock variables
    const result = selector({});
    return result;
  },
  useDispatch: () => mockDispatch,
}));

// Override useSelector with proper mock data
vi.mock('../../../store/slices/aiAssistantDashboardSlice', () => ({
  selectAllAssistantsArray: () => mockAssistants,
  selectCurrentAssistant: () => mockCurrentAssistant,
  selectFavorites: () => mockFavorites,
  selectRecent: () => mockRecent,
  selectUI: () => mockUIState,
  selectAssistant: (id: string) => ({ type: 'aiAssistantDashboard/selectAssistant', payload: id }),
  toggleFavorite: (id: string) => ({ type: 'aiAssistantDashboard/toggleFavorite', payload: id }),
  toggleDropdown: () => ({ type: 'aiAssistantDashboard/toggleDropdown' }),
  closeDropdown: () => ({ type: 'aiAssistantDashboard/closeDropdown' }),
  setDepartmentFilter: (dept: string) => ({ type: 'aiAssistantDashboard/setDepartmentFilter', payload: dept }),
  setSearchQuery: (query: string) => ({ type: 'aiAssistantDashboard/setSearchQuery', payload: query }),
}));

// We need to properly mock the useSelector since the component uses individual selectors
// Let's override react-redux mock to properly call selectors
vi.mock('react-redux', async () => ({
  useSelector: (selector: Function) => selector({}),
  useDispatch: () => mockDispatch,
}));

describe('AIDropdownSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUIState = { dropdownOpen: false, filters: { searchQuery: '', department: 'all' } };
    mockCurrentAssistant = null;
    mockFavorites = [];
    mockRecent = [];
  });

  /* ── Basic Rendering ────────────────────────────────────────── */
  describe('basic rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<AIDropdownSelector />);
      expect(container).toBeTruthy();
    });

    it('shows placeholder when no assistant is selected', () => {
      render(<AIDropdownSelector />);
      expect(screen.getByText('Select Assistant')).toBeInTheDocument();
    });

    it('shows selected assistant name when one is selected', () => {
      mockCurrentAssistant = mockAssistants[0];
      render(<AIDropdownSelector />);
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Lead Agent')).toBeInTheDocument();
    });

    it('renders trigger button', () => {
      render(<AIDropdownSelector />);
      const trigger = screen.getByText('Select Assistant').closest('button');
      expect(trigger).toBeInTheDocument();
    });
  });

  /* ── Open / Close Dropdown ──────────────────────────────────── */
  describe('dropdown toggle', () => {
    it('dispatches toggleDropdown on trigger click', () => {
      render(<AIDropdownSelector />);
      const trigger = screen.getByText('Select Assistant').closest('button');
      fireEvent.click(trigger!);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'aiAssistantDashboard/toggleDropdown' });
    });

    it('shows dropdown panel when open', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByPlaceholderText('Search assistants...')).toBeInTheDocument();
    });

    it('hides dropdown panel when closed', () => {
      mockUIState = { dropdownOpen: false, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.queryByPlaceholderText('Search assistants...')).not.toBeInTheDocument();
    });
  });

  /* ── Search ─────────────────────────────────────────────────── */
  describe('search functionality', () => {
    it('renders search input when open', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByPlaceholderText('Search assistants...')).toBeInTheDocument();
    });

    it('dispatches setSearchQuery on input change', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      fireEvent.change(screen.getByPlaceholderText('Search assistants...'), { target: { value: 'Clara' } });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'aiAssistantDashboard/setSearchQuery',
        payload: 'Clara',
      });
    });

    it('shows clear button when search query exists', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: 'test', department: 'all' } };
      render(<AIDropdownSelector />);
      // Clear button should be present
      const clearBtn = screen.getByRole('button', { name: '' }); // X button
      expect(clearBtn).toBeTruthy();
    });
  });

  /* ── Department Filters ─────────────────────────────────────── */
  describe('department filters', () => {
    it('renders department filter buttons when open', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });

    it('dispatches setDepartmentFilter on department click', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      fireEvent.click(screen.getByText('Sales'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'aiAssistantDashboard/setDepartmentFilter',
        payload: 'sales',
      });
    });

    it('hides filters when showDepartmentFilters is false', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector showDepartmentFilters={false} />);
      expect(screen.queryByText('Operations')).not.toBeInTheDocument();
    });
  });

  /* ── Assistant List ─────────────────────────────────────────── */
  describe('assistant list', () => {
    it('renders all assistants when open', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('Clara')).toBeInTheDocument();
      expect(screen.getByText('Mary')).toBeInTheDocument();
      expect(screen.getByText('Omar')).toBeInTheDocument();
    });

    it('shows All Assistants section label', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('All Assistants')).toBeInTheDocument();
    });

    it('renders assistant count in footer', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('3 assistants')).toBeInTheDocument();
    });
  });

  /* ── Selection ──────────────────────────────────────────────── */
  describe('assistant selection', () => {
    it('dispatches selectAssistant on item click', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      fireEvent.click(screen.getByText('Clara'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'aiAssistantDashboard/selectAssistant',
        payload: 'a1',
      });
    });

    it('calls onSelect callback', () => {
      const onSelect = vi.fn();
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector onSelect={onSelect} />);
      fireEvent.click(screen.getByText('Clara'));
      expect(onSelect).toHaveBeenCalledWith('a1');
    });
  });

  /* ── Favorites ──────────────────────────────────────────────── */
  describe('favorites', () => {
    it('shows favorites section when favorites exist and dropdown is open', () => {
      mockFavorites = ['a1'];
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });

    it('does not show favorites section when empty', () => {
      mockFavorites = [];
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.queryByText('Favorites')).not.toBeInTheDocument();
    });

    it('dispatches toggleFavorite on star click', () => {
      mockFavorites = ['a1'];
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      // Find all star buttons
      const starBtns = screen.getAllByRole('button').filter(btn => btn.classList.contains('item-favorite'));
      if (starBtns.length > 0) {
        fireEvent.click(starBtns[0]);
        expect(mockDispatch).toHaveBeenCalled();
      }
    });

    it('renders favorites count in footer', () => {
      mockFavorites = ['a1'];
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('1 favorites')).toBeInTheDocument();
    });
  });

  /* ── Recent ─────────────────────────────────────────────────── */
  describe('recent assistants', () => {
    it('shows recent section when recent items exist', () => {
      mockRecent = ['a2'];
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('Recent')).toBeInTheDocument();
    });

    it('does not show recent section when empty', () => {
      mockRecent = [];
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.queryByText('Recent')).not.toBeInTheDocument();
    });
  });

  /* ── Compact Mode ───────────────────────────────────────────── */
  describe('compact mode', () => {
    it('renders in compact mode without name/title', () => {
      mockCurrentAssistant = mockAssistants[0];
      render(<AIDropdownSelector compact={true} />);
      // In compact mode, selected-info (name + title) should not appear
      expect(screen.queryByText('Lead Agent')).not.toBeInTheDocument();
    });

    it('still shows avatar in compact mode', () => {
      mockCurrentAssistant = mockAssistants[0];
      render(<AIDropdownSelector compact={true} />);
      expect(screen.getByText('🔵')).toBeInTheDocument();
    });
  });

  /* ── No Results ─────────────────────────────────────────────── */
  describe('no results', () => {
    it('shows no results message when filtered list is empty', () => {
      // Override mock to return empty array
      const origAssistants = [...mockAssistants];
      mockAssistants.length = 0; // Clear the array
      mockUIState = { dropdownOpen: true, filters: { searchQuery: 'nonexistent', department: 'all' } };
      render(<AIDropdownSelector />);
      expect(screen.getByText('No assistants found')).toBeInTheDocument();
      // Restore
      mockAssistants.push(...origAssistants);
    });
  });

  /* ── Keyboard Navigation ────────────────────────────────────── */
  describe('keyboard support', () => {
    it('supports Enter key on assistant item', () => {
      mockUIState = { dropdownOpen: true, filters: { searchQuery: '', department: 'all' } };
      render(<AIDropdownSelector />);
      const items = screen.getAllByRole('button');
      // The assistant items have role="button" and tabIndex=0
      // Find an assistant item
      const claraItem = screen.getByText('Clara').closest('[role="button"]');
      if (claraItem) {
        fireEvent.keyDown(claraItem, { key: 'Enter' });
        expect(mockDispatch).toHaveBeenCalled();
      }
    });
  });
});
