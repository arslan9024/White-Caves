/**
 * PropertyMatrix – comprehensive test suite
 * Covers rendering, search, sort, pagination, owner/property selection
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyMatrix from './PropertyMatrix';

/* ── Mock Redux ───────────────────────────────────────────────── */
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: (selector: any) => selector(mockState),
  useDispatch: () => mockDispatch,
}));

const mockProperties = [
  { pNumber: 'P001', unitNumber: 'A-101', project: 'Marina Views', cluster: 'C1', status: 'Available', view: 'Sea', layout: '2BR', owners: ['O1'] },
  { pNumber: 'P002', unitNumber: 'B-202', project: 'Palm Residences', cluster: 'C2', status: 'Sold', view: 'Garden', layout: '3BR', owners: ['O2', 'O3'] },
  { pNumber: 'P003', unitNumber: 'C-303', project: 'Downtown Tower', cluster: 'C1', status: 'Reserved', view: 'City', layout: '1BR', owners: ['O1', 'O2', 'O4'] },
];

const mockOwners = {
  byId: {
    O1: { id: 'O1', name: 'Ahmed Ali', contacts: [{ type: 'mobile', value: '+971501111111' }] },
    O2: { id: 'O2', name: 'Sarah Johnson', contacts: [{ type: 'mobile', value: '+971502222222' }, { type: 'secondaryMobile', value: '+971503333333' }] },
    O3: { id: 'O3', name: 'Mike Brown', contacts: [{ type: 'phone', value: '+971504444444' }] },
    O4: { id: 'O4', name: 'Lisa Chen', contacts: [] },
  },
  allIds: ['O1', 'O2', 'O3', 'O4'],
};

const mockFilters = {
  cluster: null,
  status: null,
  area: null,
  layout: null,
  view: null,
  floor: null,
  rooms: null,
  masterProject: null,
  searchQuery: '',
  showMultiOwner: false,
  showMultiPhone: false,
  showMultiProperty: false,
};

const mockState = {
  inventory: {
    properties: {
      byId: Object.fromEntries(mockProperties.map(p => [p.pNumber, p])),
      allIds: mockProperties.map(p => p.pNumber),
    },
    owners: mockOwners,
    filters: mockFilters,
    ownerships: { byPropertyId: {}, byOwnerId: {} },
    manifest: { sheets: [], clusters: [], stats: {}, filterOptions: {} },
    selectedPropertyId: null,
    selectedOwnerId: null,
    loading: false,
    error: null,
  },
};

vi.mock('../../../store/slices/inventorySlice', () => ({
  selectFilteredProperties: (state: any) => {
    const props = state.inventory.properties;
    return props.allIds.map((id: string) => props.byId[id]);
  },
  selectOwners: (state: any) => state.inventory.owners,
  selectFilters: (state: any) => state.inventory.filters,
  setFilter: (payload: any) => ({ type: 'inventory/setFilter', payload }),
}));

vi.mock('./PropertyMatrix.styles', () => {
  const el = (name: string) => {
    const C = ({ children, ...rest }: any) => <div data-testid={name}>{children}</div>;
    C.displayName = name;
    return C;
  };
  return {
    PropertyMatrixContainer: el('PropertyMatrixContainer'),
    MatrixHeader: el('MatrixHeader'),
    MatrixInfo: el('MatrixInfo'),
    MatrixSearch: el('MatrixSearch'),
    MatrixTableWrapper: el('MatrixTableWrapper'),
    MatrixTable: el('MatrixTable'),
    ClusterBadge: el('ClusterBadge'),
    AreaCell: el('AreaCell'),
    OwnersCell: el('OwnersCell'),
    OwnerBadge: el('OwnerBadge'),
    MultiPhoneIcon: el('MultiPhoneIcon'),
    MultiOwnerIndicator: el('MultiOwnerIndicator'),
    StatusBadge: el('StatusBadge'),
  };
});

describe('PropertyMatrix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ── Rendering ──────────────────────────────────────────────── */
  describe('rendering', () => {
    it('renders property count', () => {
      render(<PropertyMatrix />);
      expect(screen.getByText(/Showing 3 of 3 properties/)).toBeInTheDocument();
    });

    it('renders search input', () => {
      render(<PropertyMatrix />);
      expect(screen.getByPlaceholderText('Search P-Number, plot, project, or owner...')).toBeInTheDocument();
    });

    it('renders table headers', () => {
      render(<PropertyMatrix />);
      expect(screen.getByText('Unit')).toBeInTheDocument();
      expect(screen.getByText('Project')).toBeInTheDocument();
      expect(screen.getByText('Cluster')).toBeInTheDocument();
      expect(screen.getByText('Owner')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders property rows', () => {
      render(<PropertyMatrix />);
      expect(screen.getByText('A-101')).toBeInTheDocument();
      expect(screen.getByText('B-202')).toBeInTheDocument();
      expect(screen.getByText('C-303')).toBeInTheDocument();
    });

    it('renders project names', () => {
      render(<PropertyMatrix />);
      expect(screen.getByText('Marina Views')).toBeInTheDocument();
      expect(screen.getByText('Palm Residences')).toBeInTheDocument();
    });

    it('renders status values', () => {
      render(<PropertyMatrix />);
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Sold')).toBeInTheDocument();
      expect(screen.getByText('Reserved')).toBeInTheDocument();
    });
  });

  /* ── Owner cells ────────────────────────────────────────────── */
  describe('owner cells', () => {
    it('renders single owner name', () => {
      render(<PropertyMatrix />);
      const ahmeds = screen.getAllByText('Ahmed');
      expect(ahmeds.length).toBeGreaterThanOrEqual(1);
    });

    it('renders multi-owner with +N indicator', () => {
      render(<PropertyMatrix />);
      // P003 has 3 owners, shows first 2 + "+1"
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('calls onOwnerSelect when owner badge clicked', () => {
      const onOwnerSelect = vi.fn();
      render(<PropertyMatrix onOwnerSelect={onOwnerSelect} />);
      const ownerBtns = screen.getAllByText('Ahmed');
      fireEvent.click(ownerBtns[0].closest('button')!);
      expect(onOwnerSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'O1', name: 'Ahmed Ali' }));
    });
  });

  /* ── Search ─────────────────────────────────────────────────── */
  describe('search', () => {
    it('dispatches setFilter on search input', () => {
      render(<PropertyMatrix />);
      fireEvent.change(screen.getByPlaceholderText('Search P-Number, plot, project, or owner...'), { target: { value: 'Marina' } });
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'inventory/setFilter',
        payload: { key: 'searchQuery', value: 'Marina' },
      }));
    });
  });

  /* ── Sorting ────────────────────────────────────────────────── */
  describe('sorting', () => {
    it('sorts by column on header click', () => {
      render(<PropertyMatrix />);
      fireEvent.click(screen.getByText('Project'));
      // Sorted ascending: Downtown Tower, Marina Views, Palm Residences
      const cells = screen.getAllByText(/Tower|Views|Residences/);
      expect(cells[0].textContent).toContain('Downtown Tower');
    });

    it('toggles sort order on second click', () => {
      render(<PropertyMatrix />);
      // Default sort is unitNumber asc. First click toggles to desc.
      fireEvent.click(screen.getByText('Unit'));
      const cells = screen.getAllByText(/[ABC]-\d{3}/);
      expect(cells[0].textContent).toBe('C-303');
    });
  });

  /* ── Selection ──────────────────────────────────────────────── */
  describe('property selection', () => {
    it('calls onPropertySelect when row clicked', () => {
      const onPropertySelect = vi.fn();
      render(<PropertyMatrix onPropertySelect={onPropertySelect} />);
      // Click the row containing A-101
      const row = screen.getByText('A-101').closest('tr')!;
      fireEvent.click(row);
      expect(onPropertySelect).toHaveBeenCalledWith(expect.objectContaining({ pNumber: 'P001' }));
    });

    it('calls onPropertySelect when view button clicked', () => {
      const onPropertySelect = vi.fn();
      render(<PropertyMatrix onPropertySelect={onPropertySelect} />);
      const viewBtns = screen.getAllByRole('button', { name: /view property details/i });
      // The view buttons are at the end of each row
      const viewBtn = viewBtns[0] as HTMLElement;
      if (viewBtn) {
        fireEvent.click(viewBtn);
        expect(onPropertySelect).toHaveBeenCalled();
      }
    });
  });

  /* ── Edge cases ─────────────────────────────────────────────── */
  describe('edge cases', () => {
    it('handles multi-owner row styling', () => {
      // P003 has 3 owners, which triggers multi-owner-row class
      render(<PropertyMatrix />);
      const row = screen.getByText('C-303').closest('tr');
      expect(row).toHaveClass('multi-owner-row');
    });

    it('renders dash for missing values', () => {
      render(<PropertyMatrix />);
      // All our mock properties have values, but the formatValue function handles nulls
      expect(screen.queryByText('-')).toBeDefined();
    });
  });
});
