import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

/* Stub react-redux */
vi.mock('react-redux', () => ({
  useSelector: vi.fn(() => 'dark'),
  useDispatch: () => vi.fn(),
}));

/* Stub react-router-dom */
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

/* Stub TranslationContext */
vi.mock('../../context/TranslationContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
    setLanguage: vi.fn(),
  }),
  Text: ({ id }: { id: string }) => <span>{id}</span>,
}));

/* Stub lucide-react — provide simple span stubs for all icons */
vi.mock('lucide-react', () => {
  const IconStub = () => <span data-testid="lucide-icon" />;
  const icons = [
    'Search', 'Bell', 'User', 'Moon', 'Sun', 'Menu', 'LogOut', 'Settings',
    'HelpCircle', 'ChevronDown', 'LayoutDashboard', 'CreditCard', 'Bot',
    'MessageSquare', 'Building2', 'Target', 'Users', 'TrendingUp', 'Home',
    'Wallet', 'Megaphone', 'Shield', 'Server', 'Palette', 'Database', 'Scale',
    'Eye', 'Zap', 'Activity', 'Clock', 'Command', 'FileText', 'BarChart3',
    'Lightbulb', 'Code', 'Wrench', 'Crown', 'PieChart', 'Map', 'Star',
    'Heart', 'Send',
  ];
  const mod: Record<string, unknown> = {};
  for (const name of icons) mod[name] = IconStub;
  return mod;
});

/* Stub CSS import */
vi.mock('./DashboardHeader.css', () => ({}));

/* Stub store slices */
vi.mock('../../store/appSlice', () => ({
  setMainViewContent: vi.fn((v: unknown) => ({ type: 'SET_MAIN', payload: v })),
}));
vi.mock('../../store/navigationSlice', () => ({
  setTheme: vi.fn((v: unknown) => ({ type: 'SET_THEME', payload: v })),
}));

import DashboardHeader from './DashboardHeader';

describe('DashboardHeader', () => {
  const baseProps = {
    activeAssistant: null,
    onFeatureSelect: vi.fn(),
    onMenuToggle: vi.fn(),
    notifications: [],
    user: { displayName: 'Arslan Khalid', email: 'arslan@whitecaves.ae', photoURL: null },
    onLogout: vi.fn(),
  };

  it('renders the header element', () => {
    const { container } = render(<DashboardHeader {...baseProps} />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('displays user initials when no photo is provided', () => {
    render(<DashboardHeader {...baseProps} />);
    const initials = screen.getAllByText('AK');
    expect(initials.length).toBeGreaterThanOrEqual(1);
  });

  it('renders search input with placeholder', () => {
    render(<DashboardHeader {...baseProps} />);
    expect(screen.getByPlaceholderText(/Search .*/)).toBeInTheDocument();
  });

  it('renders the header with correct CSS class', () => {
    const { container } = render(<DashboardHeader {...baseProps} />);
    expect(container.querySelector('.dashboard-header-crimson')).toBeInTheDocument();
  });

  it('defaults to "WC" initials when no user is provided', () => {
    render(<DashboardHeader {...baseProps} user={null} />);
    const initials = screen.getAllByText('WC');
    expect(initials.length).toBeGreaterThanOrEqual(1);
  });
});
