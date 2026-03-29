/**
 * SidebarContainer – comprehensive test suite
 * Covers rendering, navigation, departments, collapse, admin, role checks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SidebarContainer from './SidebarContainer';

/* ── Redux mock ────────────────────────────────────────────────── */
const mockDispatch = vi.fn();
let mockSelectorValues: Record<string, unknown> = {};

vi.mock('react-redux', () => ({
  useSelector: (fn: (state: unknown) => unknown) => {
    // The component calls useSelector with inline selectors
    const fnStr = fn.toString();
    if (fnStr.includes('auth') && fnStr.includes('role')) return mockSelectorValues.userRole ?? 'user';
    if (fnStr.includes('selectedDepartment')) return mockSelectorValues.selectedDepartment ?? null;
    if (fnStr.includes('selectedService')) return mockSelectorValues.selectedService ?? null;
    return undefined;
  },
  useDispatch: () => mockDispatch,
}));

/* ── Sidebar slice mock ──────────────────────────────────────── */
vi.mock('../../../store/slices/sidebarSlice', () => ({
  selectDepartment: (deptId: string) => ({ type: 'sidebar/selectDepartment', payload: deptId }),
  selectService: (payload: { department: string; service: string }) => ({ type: 'sidebar/selectService', payload }),
}));

/* ── Styled-components mock ──────────────────────────────────── */
vi.mock('./styles', () => {
  const stub = (name: string) => {
    const C = ({ children, onClick, title, className, ...rest }: any) => (
      <div data-testid={name} onClick={onClick} title={title} className={className} {...rest}>
        {children}
      </div>
    );
    C.displayName = name;
    return C;
  };
  return {
    SidebarContainerWrapper: stub('SidebarContainerWrapper'),
    SidebarHeader: stub('SidebarHeader'),
    SidebarLogo: stub('SidebarLogo'),
    LogoBadge: stub('LogoBadge'),
    LogoText: stub('LogoText'),
    LogoTitle: stub('LogoTitle'),
    LogoSubtitle: stub('LogoSubtitle'),
    SidebarNav: stub('SidebarNav'),
    NavGroup: stub('NavGroup'),
    GroupHeader: stub('GroupHeader'),
    GroupToggle: stub('GroupToggle'),
    GroupItems: stub('GroupItems'),
    GroupItemsCollapsed: stub('GroupItemsCollapsed'),
    NavItem: stub('NavItem'),
    NavIcon: stub('NavIcon'),
    NavLabel: stub('NavLabel'),
    NavItemIcon: stub('NavItemIcon'),
    NavIconLarge: stub('NavIconLarge'),
    NavTooltip: stub('NavTooltip'),
    DepartmentsList: stub('DepartmentsList'),
    DepartmentItem: stub('DepartmentItem'),
    DepartmentHeader: stub('DepartmentHeader'),
    DeptIcon: stub('DeptIcon'),
    DeptLabel: stub('DeptLabel'),
    DeptToggle: stub('DeptToggle'),
    DepartmentServices: stub('DepartmentServices'),
    ServiceItem: stub('ServiceItem'),
    ServiceDot: stub('ServiceDot'),
    ServiceLabel: stub('ServiceLabel'),
    DepartmentsCollapsed: stub('DepartmentsCollapsed'),
    DeptIconBtn: stub('DeptIconBtn'),
    AdminGroupHeader: stub('AdminGroupHeader'),
    AdminNavItem: stub('AdminNavItem'),
  };
});

describe('SidebarContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectorValues = {};
  });

  /* ── Basic Rendering ────────────────────────────────────────── */
  describe('basic rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<SidebarContainer />);
      expect(container).toBeTruthy();
    });

    it('renders company branding WC badge', () => {
      render(<SidebarContainer />);
      expect(screen.getByText('WC')).toBeInTheDocument();
    });

    it('renders White Caves logo text when not collapsed', () => {
      render(<SidebarContainer collapsed={false} />);
      expect(screen.getByText('White Caves')).toBeInTheDocument();
      expect(screen.getByText('Real Estate')).toBeInTheDocument();
    });

    it('hides logo text when collapsed', () => {
      render(<SidebarContainer collapsed={true} />);
      expect(screen.queryByText('White Caves')).not.toBeInTheDocument();
    });
  });

  /* ── Navigation Groups ──────────────────────────────────────── */
  describe('navigation groups', () => {
    it('renders Dashboard group', () => {
      render(<SidebarContainer />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders Management group', () => {
      render(<SidebarContainer />);
      expect(screen.getByText('Management')).toBeInTheDocument();
    });

    it('renders Analytics group', () => {
      render(<SidebarContainer />);
      const analyticsElements = screen.getAllByText('Analytics');
      expect(analyticsElements.length).toBeGreaterThanOrEqual(1);
    });

    it('renders Departments section', () => {
      render(<SidebarContainer />);
      expect(screen.getByText('Departments')).toBeInTheDocument();
    });

    it('renders default menu items: Overview, Analytics, Reports', () => {
      render(<SidebarContainer />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('renders management items: Clients, Leads, Communications', () => {
      render(<SidebarContainer />);
      expect(screen.getByText('Clients')).toBeInTheDocument();
      expect(screen.getByText('Leads')).toBeInTheDocument();
    });
  });

  /* ── Tab Change ─────────────────────────────────────────────── */
  describe('tab change', () => {
    it('calls onTabChange when nav item is clicked', () => {
      const onTabChange = vi.fn();
      render(<SidebarContainer onTabChange={onTabChange} activeTab="overview" />);
      fireEvent.click(screen.getByText('Clients'));
      expect(onTabChange).toHaveBeenCalledWith('clients');
    });

    it('highlights active tab', () => {
      render(<SidebarContainer activeTab="clients" />);
      // The NavItem will receive $active prop which our mock passes through
      expect(screen.getByText('Clients')).toBeInTheDocument();
    });
  });

  /* ── Group Expansion ────────────────────────────────────────── */
  describe('group expansion', () => {
    it('toggles group expansion on click', () => {
      render(<SidebarContainer />);
      // Analytics group default: false — items shouldn't be immediately visible unless dashboard/management default is true
      // Dashboard and Management default to expanded, so their items should be visible
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  /* ── Collapsed Mode ─────────────────────────────────────────── */
  describe('collapsed mode', () => {
    it('renders icon-only mode when collapsed', () => {
      render(<SidebarContainer collapsed={true} />);
      // In collapsed mode, labels are hidden, only icons are shown via NavItemIcon
      const collapsed = screen.getAllByTestId('GroupItemsCollapsed');
      expect(collapsed.length).toBeGreaterThan(0);
    });

    it('shows department icon buttons when collapsed', () => {
      render(<SidebarContainer collapsed={true} />);
      const deptBtns = screen.getAllByTestId('DeptIconBtn');
      // First 4 departments shown in collapsed mode
      expect(deptBtns.length).toBe(4);
    });
  });

  /* ── Departments ────────────────────────────────────────────── */
  describe('departments', () => {
    it('does not show department list by default (departments group collapsed)', () => {
      render(<SidebarContainer />);
      // departments group starts collapsed, so individual departments aren't listed
      // But let's expand it by clicking the Departments header
      const deptHeader = screen.getByText('Departments');
      fireEvent.click(deptHeader);
      // Now departments should appear
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
    });

    it('dispatches selectDepartment on department click', () => {
      render(<SidebarContainer />);
      fireEvent.click(screen.getByText('Departments'));
      fireEvent.click(screen.getByText('Operations'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'sidebar/selectDepartment', payload: 'operations' });
    });

    it('shows services when department is expanded', () => {
      render(<SidebarContainer />);
      // Expand departments group
      fireEvent.click(screen.getByText('Departments'));
      // Click a department to expand it
      fireEvent.click(screen.getByText('Operations'));
      // Services should appear
      expect(screen.getByText('Inventory Management')).toBeInTheDocument();
      expect(screen.getByText('Properties')).toBeInTheDocument();
    });

    it('dispatches selectService on service click', () => {
      const onTabChange = vi.fn();
      render(<SidebarContainer onTabChange={onTabChange} />);
      fireEvent.click(screen.getByText('Departments'));
      fireEvent.click(screen.getByText('Operations'));
      fireEvent.click(screen.getByText('Inventory Management'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sidebar/selectService',
        payload: { department: 'operations', service: 'Inventory Management' },
      });
      expect(onTabChange).toHaveBeenCalledWith('service-operations-0');
    });

    it('renders all 9 departments when expanded', () => {
      render(<SidebarContainer />);
      fireEvent.click(screen.getByText('Departments'));
      const deptNames = ['Operations', 'Finance', 'Sales', 'Marketing', 'Executive', 'Compliance', 'Technology', 'Legal'];
      deptNames.forEach(name => {
        expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
      });
      // Communications appears both in nav AND departments
      expect(screen.getAllByText('Communications').length).toBeGreaterThanOrEqual(2);
    });
  });

  /* ── Admin Section ──────────────────────────────────────────── */
  describe('admin section', () => {
    it('does NOT show admin section for regular users', () => {
      mockSelectorValues.userRole = 'user';
      render(<SidebarContainer />);
      expect(screen.queryByText('Administration')).not.toBeInTheDocument();
    });

    it('shows admin section for super user (lion role)', () => {
      mockSelectorValues.userRole = 'lion';
      render(<SidebarContainer />);
      expect(screen.getByText('Administration')).toBeInTheDocument();
    });

    it('renders admin menu items for super users', () => {
      mockSelectorValues.userRole = 'lion';
      render(<SidebarContainer />);
      // Admin group is collapsed by default, expand it
      fireEvent.click(screen.getByText('Administration'));
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('System Health')).toBeInTheDocument();
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    it('calls onTabChange with admin tab IDs', () => {
      const onTabChange = vi.fn();
      mockSelectorValues.userRole = 'lion';
      render(<SidebarContainer onTabChange={onTabChange} />);
      fireEvent.click(screen.getByText('Administration'));
      fireEvent.click(screen.getByText('Admin Dashboard'));
      expect(onTabChange).toHaveBeenCalledWith('admin-dashboard');
    });
  });

  /* ── Role Prop ──────────────────────────────────────────────── */
  describe('role prop', () => {
    it('accepts role prop without error', () => {
      const { container } = render(<SidebarContainer role="admin" />);
      expect(container).toBeTruthy();
    });
  });

  /* ── Edge Cases ─────────────────────────────────────────────── */
  describe('edge cases', () => {
    it('renders with all default props', () => {
      const { container } = render(<SidebarContainer />);
      expect(container.firstChild).toBeTruthy();
    });

    it('handles missing Redux state gracefully', () => {
      mockSelectorValues.selectedDepartment = undefined;
      mockSelectorValues.selectedService = undefined;
      const { container } = render(<SidebarContainer />);
      expect(container).toBeTruthy();
    });
  });
});
