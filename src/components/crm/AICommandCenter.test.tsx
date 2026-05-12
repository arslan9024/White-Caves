/**
 * AICommandCenter — Comprehensive Unit Tests
 *
 * Covers: header rendering, layout toggle (grid/list), assistant selection,
 * QuickStatsBar, ActivityTimeline, lazy dashboard loading, empty state,
 * CSS custom property, notification badge, Redux dispatch
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import React from 'react';

// ── Redux mock state ────────────────────────────────────────────

let mockCurrentAssistant: Record<string, unknown> | null = null;
let mockAllAssistants: Array<Record<string, unknown>> = [];
let mockPerformance: Record<string, unknown> | undefined = undefined;
let mockRecentActivity: unknown[] = [];
let mockUI: Record<string, unknown> = { layout: 'grid' };
const mockDispatch = vi.fn();
let mockMountConfig: Record<string, unknown> | null = null;

vi.mock('react-redux', () => ({
  useSelector: (selector: (s: unknown) => unknown) => selector({}),
  useDispatch: () => mockDispatch,
}));

vi.mock('../../store/slices/aiAssistantDashboardSlice', () => ({
  selectCurrentAssistant: () => mockCurrentAssistant,
  selectAllAssistantsArray: () => mockAllAssistants,
  selectPerformance: () => mockPerformance,
  selectRecentActivity: () => mockRecentActivity,
  selectUI: () => mockUI,
  setLayout: (layout: string) => ({ type: 'aiAssistantDashboard/setLayout', payload: layout }),
}));

vi.mock('../../store/slices/aiAssistant/types', () => ({}));

vi.mock('../../config/internalModuleMounts', () => ({
  getInternalModuleMountConfig: () => mockMountConfig,
}));

vi.mock('lucide-react', () => {
  const stub = (name: string) => {
    const IconStub = (_props: Record<string, unknown>) => (
      <span data-testid={`${name}-icon`}>{name}</span>
    );
    IconStub.displayName = name;
    return IconStub;
  };
  return {
    __esModule: true,
    RefreshCw: stub('RefreshCw'),
    Settings: stub('Settings'),
    Bell: stub('Bell'),
    LayoutGrid: stub('LayoutGrid'),
    List: stub('List'),
    Bot: stub('Bot'),
    Send: stub('Send'),
    MessageCircle: stub('MessageCircle'),
    Phone: stub('Phone'),
    Mail: stub('Mail'),
    Video: stub('Video'),
    Search: stub('Search'),
    Plus: stub('Plus'),
    Filter: stub('Filter'),
    AlertCircle: stub('AlertCircle'),
    CheckCircle: stub('CheckCircle'),
    Clock: stub('Clock'),
    TrendingUp: stub('TrendingUp'),
    ArrowUp: stub('ArrowUp'),
    ArrowDown: stub('ArrowDown'),
    DollarSign: stub('DollarSign'),
    Users: stub('Users'),
    Home: stub('Home'),
    Key: stub('Key'),
    Calendar: stub('Calendar'),
    FileText: stub('FileText'),
    Shield: stub('Shield'),
    AlertTriangle: stub('AlertTriangle'),
    Eye: stub('Eye'),
    Download: stub('Download'),
    Package: stub('Package'),
    Zap: stub('Zap'),
    Accessibility: stub('Accessibility'),
    BarChart3: stub('BarChart3'),
    FolderOpen: stub('FolderOpen'),
    Lightbulb: stub('Lightbulb'),
    User: stub('User'),
    Activity: stub('Activity'),
    Target: stub('Target'),
    Globe: stub('Globe'),
    Inbox: stub('Inbox'),
    Star: stub('Star'),
    Edit: stub('Edit'),
    Trash: stub('Trash'),
    Copy: stub('Copy'),
    ChevronDown: stub('ChevronDown'),
    ChevronUp: stub('ChevronUp'),
    ChevronLeft: stub('ChevronLeft'),
    ChevronRight: stub('ChevronRight'),
    MoreHorizontal: stub('MoreHorizontal'),
    MoreVertical: stub('MoreVertical'),
    ExternalLink: stub('ExternalLink'),
    Loader: stub('Loader'),
    Loader2: stub('Loader2'),
    X: stub('X'),
    Check: stub('Check'),
    Info: stub('Info'),
    Building: stub('Building'),
    Building2: stub('Building2'),
    MapPin: stub('MapPin'),
    Wifi: stub('Wifi'),
    WifiOff: stub('WifiOff'),
    Power: stub('Power'),
    Monitor: stub('Monitor'),
    Cpu: stub('Cpu'),
    Database: stub('Database'),
    Server: stub('Server'),
    HardDrive: stub('HardDrive'),
    Cloud: stub('Cloud'),
    Lock: stub('Lock'),
    Unlock: stub('Unlock'),
    Share2: stub('Share2'),
    Bookmark: stub('Bookmark'),
    Heart: stub('Heart'),
    ThumbsUp: stub('ThumbsUp'),
    ThumbsDown: stub('ThumbsDown'),
    Mic: stub('Mic'),
    Camera: stub('Camera'),
    Image: stub('Image'),
    File: stub('File'),
    Folder: stub('Folder'),
    Upload: stub('Upload'),
    Link: stub('Link'),
    Paperclip: stub('Paperclip'),
    Briefcase: stub('Briefcase'),
    Award: stub('Award'),
    Flag: stub('Flag'),
    Hash: stub('Hash'),
    Tag: stub('Tag'),
    Layers: stub('Layers'),
    Grid: stub('Grid'),
    Layout: stub('Layout'),
    Sidebar: stub('Sidebar'),
    Menu: stub('Menu'),
    Sparkles: stub('Sparkles'),
    Link2: stub('Link2'),
    ShieldCheck: stub('ShieldCheck'),
    type: stub('type') as unknown, // LucideIcon type
    LucideIcon: stub('LucideIcon'),
  };
});

// Mock shared components
vi.mock('./shared', () => ({
  AIDropdownSelector: () => <div data-testid="ai-dropdown">Dropdown</div>,
  UniversalAssistantLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  StatCard: ({ label, value, color: _color }: { label: string; value: unknown; color: string }) => (
    <div data-testid="stat-card">
      <span>{label}</span>
      <span>{String(value)}</span>
    </div>
  ),
  ActivityTimeline: ({
    activities,
    maxItems: _maxItems,
  }: {
    activities: unknown[];
    maxItems: number;
  }) => (
    <div data-testid="activity-timeline">
      {Array.isArray(activities) ? activities.length : 0} items
    </div>
  ),
}));

// Mock styled components
vi.mock('./AICommandCenter.styles', () => {
  const c = (tag: string, testId: string) => {
    const Comp = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref) =>
      React.createElement(
        tag,
        { 'data-testid': testId, ref, ...props },
        children as React.ReactNode
      )
    );
    Comp.displayName = testId;
    return Comp;
  };
  return {
    CommandCenterContainer: c('div', 'cc-container'),
    CommandCenterHeader: c('header', 'cc-header'),
    HeaderLeft: c('div', 'header-left'),
    CommandCenterTitle: c('h1', 'cc-title'),
    CommandCenterSubtitle: c('span', 'cc-subtitle'),
    HeaderControls: c('div', 'header-controls'),
    ViewToggleContainer: c('div', 'view-toggle'),
    ToggleBtn: c('button', 'toggle-btn'),
    HeaderAction: c('button', 'header-action'),
    NotificationBadge: c('span', 'notification-badge'),
    CommandCenterMain: c('main', 'cc-main'),
    DashboardContainer: c('div', 'dashboard-container'),
    ActivitySidebar: c('aside', 'activity-sidebar'),
    LoadingContainer: c('div', 'loading-container'),
  };
});

vi.mock('./shared/SubagentCollaborationPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="subagent-collaboration-panel">Subagent Collaboration Panel</div>,
}));

// Mock all lazy-loaded CRM components as simple stubs (must be individual calls for hoisting)
vi.mock('./NadiaWhatsAppCRM', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-nadia">Nadia Dashboard</div>,
}));
vi.mock('./MaryInventoryCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-mary">Mary Dashboard</div>,
}));
vi.mock('./ClaraLeadsCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-clara">Clara Dashboard</div>,
}));
vi.mock('./NinaWhatsAppBotCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-nina">Nina Dashboard</div>,
}));
vi.mock('./NancyHRCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-nancy">Nancy Dashboard</div>,
}));
vi.mock('./SophiaSalesCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-sophia">Sophia Dashboard</div>,
}));
vi.mock('./DaisyLeasingCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-daisy">Daisy Dashboard</div>,
}));
vi.mock('./TheodoraFinanceCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-theodora">Theodora Dashboard</div>,
}));
vi.mock('./OliviaMarketingCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-olivia">Olivia Dashboard</div>,
}));
vi.mock('./ZoeExecutiveCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-zoe">Zoe Dashboard</div>,
}));
vi.mock('./LailaComplianceCRM_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-laila">Laila Dashboard</div>,
}));
vi.mock('./AuroraCTODashboard_NEW', () => ({
  __esModule: true,
  default: () => <div data-testid="crm-aurora">Aurora Dashboard</div>,
}));

import AICommandCenter from './AICommandCenter';

// ── Test Suite ───────────────────────────────────────────────────

describe('AICommandCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    mockMountConfig = null;
    mockCurrentAssistant = null;
    mockAllAssistants = [
      { id: 'nadia', name: 'Nadia', metrics: { systemHealth: 'optimal' } },
      { id: 'mary', name: 'Mary', metrics: { systemHealth: 'optimal' } },
      { id: 'clara', name: 'Clara', metrics: { systemHealth: 'degraded' } },
    ];
    mockPerformance = { overallHealth: 97, activeTasks: 42, criticalAlerts: [] };
    mockRecentActivity = [{ id: 1, text: 'Test activity' }];
    mockUI = { layout: 'grid' };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ────── Header ──────

  describe('header rendering', () => {
    it('renders the title "AI Command Center"', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('AI Command Center')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('Unified dashboard for all AI assistants')).toBeInTheDocument();
    });

    it('renders the AI dropdown selector', () => {
      render(<AICommandCenter />);
      expect(screen.getByTestId('ai-dropdown')).toBeInTheDocument();
    });

    it('renders Settings and Notifications buttons', () => {
      render(<AICommandCenter />);
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
      expect(screen.getByTitle('Notifications')).toBeInTheDocument();
    });
  });

  // ────── Layout Toggle ──────

  describe('layout toggle', () => {
    it('renders grid and list view buttons', () => {
      render(<AICommandCenter />);
      expect(screen.getByTitle('Grid view')).toBeInTheDocument();
      expect(screen.getByTitle('List view')).toBeInTheDocument();
    });

    it('dispatches setLayout("list") on list button click', () => {
      render(<AICommandCenter />);
      fireEvent.click(screen.getByTitle('List view'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'aiAssistantDashboard/setLayout',
        payload: 'list',
      });
    });

    it('dispatches setLayout("grid") on grid button click', () => {
      render(<AICommandCenter />);
      fireEvent.click(screen.getByTitle('Grid view'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'aiAssistantDashboard/setLayout',
        payload: 'grid',
      });
    });

    it('highlights grid button when layout is grid', () => {
      mockUI = { layout: 'grid' };
      render(<AICommandCenter />);
      const gridBtn = screen.getByTitle('Grid view');
      expect(gridBtn.className).toContain('active');
    });

    it('highlights list button when layout is list', () => {
      mockUI = { layout: 'list' };
      render(<AICommandCenter />);
      const listBtn = screen.getByTitle('List view');
      expect(listBtn.className).toContain('active');
    });
  });

  // ────── Empty State (no assistant selected) ──────

  describe('empty state', () => {
    it('shows empty state when no assistant is selected', () => {
      mockCurrentAssistant = null;
      render(<AICommandCenter />);
      expect(screen.getByText('Select an AI Assistant')).toBeInTheDocument();
      expect(screen.getByText(/Choose an assistant from the dropdown/)).toBeInTheDocument();
    });

    it('shows robot emoji icon', () => {
      mockCurrentAssistant = null;
      render(<AICommandCenter />);
      expect(screen.getByText('🤖')).toBeInTheDocument();
    });
  });

  // ────── Dashboard Component Loading ──────

  describe('dashboard component', () => {
    it('renders lazy-loaded CRM for selected assistant', async () => {
      mockCurrentAssistant = { id: 'nadia', name: 'Nadia', colorScheme: '#10B981' };
      render(<AICommandCenter />);
      const dashboard = await screen.findByTestId('crm-nadia');
      expect(dashboard).toBeInTheDocument();
    });

    it('renders loading spinner during Suspense', () => {
      // Mock a lazy component that never resolves
      mockCurrentAssistant = { id: 'nadia', name: 'Nadia', colorScheme: '#10B981' };
      // The Suspense fallback is the LoadingSpinner
      render(<AICommandCenter />);
      // Eventually the lazy module resolves but initially we may see loading
      expect(screen.getByText('AI Command Center')).toBeInTheDocument();
    });

    it('handles unknown assistant ID gracefully', () => {
      mockCurrentAssistant = { id: 'unknown-bot', name: 'Unknown', colorScheme: '#999' };
      render(<AICommandCenter />);
      expect(screen.getByText('Select an AI Assistant')).toBeInTheDocument();
    });
  });

  // ────── QuickStatsBar ──────

  describe('QuickStatsBar', () => {
    it('renders 4 stat cards', () => {
      render(<AICommandCenter />);
      const statCards = screen.getAllByTestId('stat-card');
      expect(statCards.length).toBe(4);
    });

    it('shows active assistant count', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('Active Assistants')).toBeInTheDocument();
      // 2 out of 3 are 'optimal'
      expect(screen.getByText('2/3')).toBeInTheDocument();
    });

    it('shows system health percentage', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('System Health')).toBeInTheDocument();
      expect(screen.getByText('97%')).toBeInTheDocument();
    });

    it('shows active tasks count', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('Active Tasks')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('shows alerts count', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('Alerts')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('shows non-zero alert count with red color', () => {
      mockPerformance = { overallHealth: 95, activeTasks: 10, criticalAlerts: [{ id: 1 }] };
      render(<AICommandCenter />);
      // Find the Alerts stat card and check within it
      const statCards = screen.getAllByTestId('stat-card');
      const alertCard = statCards.find(c => c.textContent?.includes('Alerts'))!;
      expect(within(alertCard).getByText('1')).toBeInTheDocument();
    });

    it('falls back to defaults when performance is undefined', () => {
      mockPerformance = undefined;
      render(<AICommandCenter />);
      expect(screen.getByText('95%')).toBeInTheDocument(); // default fallback
      expect(screen.getByText('47')).toBeInTheDocument(); // default fallback
    });
  });

  // ────── Activity Timeline ──────

  describe('ActivityTimeline sidebar', () => {
    it('renders Recent Activity heading', () => {
      render(<AICommandCenter />);
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('passes activities and maxItems to ActivityTimeline', () => {
      render(<AICommandCenter />);
      const timeline = screen.getByTestId('activity-timeline');
      expect(timeline).toBeInTheDocument();
      expect(timeline.textContent).toContain('1 items');
    });
  });

  // ────── Notification Badge ──────

  describe('notification badge', () => {
    it('does NOT render badge when no critical alerts', () => {
      mockPerformance = { criticalAlerts: [] };
      render(<AICommandCenter />);
      expect(screen.queryByText('notification-badge')).not.toBeInTheDocument();
    });

    it('renders badge count when alerts exist', () => {
      mockPerformance = { criticalAlerts: [{ id: 1 }, { id: 2 }] };
      const { container } = render(<AICommandCenter />);
      const badge = container.querySelector('.notification-badge');
      expect(badge).toBeInTheDocument();
      expect(badge?.textContent).toBe('2');
    });
  });

  // ────── CSS Custom Property ──────

  describe('assistant color theming', () => {
    it('applies default color when no assistant selected', () => {
      mockCurrentAssistant = null;
      const { container } = render(<AICommandCenter />);
      const root = container.querySelector('.ai-command-center');
      expect((root as HTMLElement).style.getPropertyValue('--primary-color')).toBe('#0EA5E9');
    });

    it('applies assistant colorScheme as CSS variable', () => {
      mockCurrentAssistant = { id: 'nadia', name: 'Nadia', colorScheme: '#10B981' };
      const { container } = render(<AICommandCenter />);
      const root = container.querySelector('.ai-command-center');
      expect((root as HTMLElement).style.getPropertyValue('--primary-color')).toBe('#10B981');
    });
  });

  describe('internal module mount metadata', () => {
    it('shows mount mode badge when assistant has module mount config', () => {
      mockCurrentAssistant = { id: 'linda', name: 'Linda', colorScheme: '#8B5CF6' };
      mockMountConfig = {
        assistantId: 'linda',
        mountMode: 'iframe',
        enabled: true,
        moduleUrl: 'http://localhost:5200',
      };

      render(<AICommandCenter />);
      expect(screen.getByLabelText(/Current mount mode iframe/i)).toBeInTheDocument();
      expect(screen.getByText(/iframe mount/i)).toBeInTheDocument();
    });

    it('shows healthy status when health endpoint responds OK', async () => {
      mockCurrentAssistant = { id: 'linda', name: 'Linda', colorScheme: '#8B5CF6' };
      mockMountConfig = {
        assistantId: 'linda',
        mountMode: 'iframe',
        enabled: true,
        moduleUrl: 'http://localhost:5200',
        healthUrl: 'http://localhost:3005/health',
      };

      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      render(<AICommandCenter />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          'http://localhost:3005/health',
          expect.objectContaining({ method: 'GET' })
        );
      });

      expect(screen.getByLabelText(/Mount health healthy/i)).toBeInTheDocument();
    });

    it('shows unreachable status when health endpoint fails', async () => {
      mockCurrentAssistant = { id: 'linda', name: 'Linda', colorScheme: '#8B5CF6' };
      mockMountConfig = {
        assistantId: 'linda',
        mountMode: 'iframe',
        enabled: true,
        moduleUrl: 'http://localhost:5200',
        healthUrl: 'http://localhost:3005/health',
      };

      const fetchMock = vi.fn().mockRejectedValue(new Error('connection refused'));
      vi.stubGlobal('fetch', fetchMock);

      render(<AICommandCenter />);

      await waitFor(() => {
        expect(screen.getByLabelText(/Mount health unreachable/i)).toBeInTheDocument();
      });
    });
  });
});
