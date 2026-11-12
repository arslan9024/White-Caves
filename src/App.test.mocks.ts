import { vi } from 'vitest';
import { createElement, type PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';

vi.mock('./store/store', () => ({
  useAppSelector: useSelector,
  useAppDispatch: useDispatch,
}));

vi.mock('./pages/dashboard/ModernDashboardPage', () => ({
  default: () => createElement('div', { 'data-testid': 'modern-dashboard-page' }),
}));

vi.mock('./layouts/UnifiedWorkspaceLayout', () => ({
  UnifiedWorkspaceLayout: ({ children }: PropsWithChildren) => createElement('div', null, children),
}));

vi.mock('./components/portal/PortalLayout', () => ({
  default: ({ children }: PropsWithChildren) => createElement('div', null, children),
}));

vi.mock('./components/shared/BackendStatusBanner/BackendStatusBanner', () => ({
  BackendStatusBanner: () => null,
}));

vi.mock('./utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));
