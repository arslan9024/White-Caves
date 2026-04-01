/**
 * RightPanelContainer â€“ Unit Tests (Redux-driven, no props)
 * The component reads isOpen / selectedAssistant from Redux sidebarSlice.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer, { openRightPanel, closeRightPanel, selectAssistant } from '../../../store/slices/sidebarSlice';

// Minimal auth slice so useSelector doesn't crash
const authReducer = (state = { user: null }) => state;

// We DO NOT mock styled-components â€” we just let them render as-is (or mock lightly)
// But we mock lucide-react so it doesn't pull in SVGs
vi.mock('lucide-react', async () => {
  const stub = (name: string) =>
    React.forwardRef(({ size, ...props }: any, ref: any) => (
      <span data-testid={`icon-${name.toLowerCase()}`} ref={ref} {...props} />
    ));
  return {
    X: stub('X'),
    Search: stub('Search'),
    Bot: stub('Bot'),
    MessageSquare: stub('MessageSquare'),
    BarChart3: stub('BarChart3'),
    Settings: stub('Settings'),
    ChevronDown: stub('ChevronDown'),
  };
});

import RightPanelContainer from './RightPanelContainer';

// â”€â”€ Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function makeStore(sidebarOverrides: Record<string, unknown> = {}) {
  return configureStore({
    reducer: { sidebar: sidebarReducer, auth: authReducer },
    preloadedState: {
      sidebar: {
        flyoutOpen: false,
        flyoutDepartment: null,
        aiCommandOpen: false,
        aiAssistantSearch: '',
        aiAssistantFilter: 'all' as const,
        rightPanelOpen: false,
        selectedAssistant: null,
        selectedDepartment: null,
        selectedService: null,
        commandPaletteOpen: false,
        mobileSheetOpen: false,
        ...sidebarOverrides,
      } as ReturnType<typeof sidebarReducer>,
    },
  });
}

function renderPanel(sidebarOverrides: Record<string, unknown> = {}) {
  const store = makeStore(sidebarOverrides);
  const utils = render(
    <Provider store={store}>
      <RightPanelContainer />
    </Provider>,
  );
  return { store, ...utils };
}

// â”€â”€ Tests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

describe('RightPanelContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders panel title "AI Assistants"', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('AI Assistants')).toBeInTheDocument();
    });

    it('renders search input', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByPlaceholderText('Search assistants...')).toBeInTheDocument();
    });

    it('renders close button', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByLabelText('Close panel')).toBeInTheDocument();
    });

    it('renders Esc keyboard hint in footer', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('Esc')).toBeInTheDocument();
    });
  });

  describe('groups', () => {
    it('renders CRM group', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('CRM (2)')).toBeInTheDocument();
    });

    it('renders Operations group', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('Operations (3)')).toBeInTheDocument();
    });

    it('renders Technical group', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('Technical (2)')).toBeInTheDocument();
    });

    it('shows Hazel assistant in CRM group', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('Hazel')).toBeInTheDocument();
    });

    it('shows Clara assistant in CRM group', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('Clara')).toBeInTheDocument();
    });

    it('shows Mary assistant in Operations group', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      expect(screen.getByText('Mary')).toBeInTheDocument();
    });

    it('collapses a group on click', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      // CRM group shows Hazel by default
      expect(screen.getByText('Hazel')).toBeInTheDocument();
      // Click the CRM group header to collapse (text is "CRM (2)")
      const crmHeader = screen.getByText('CRM (2)');
      fireEvent.click(crmHeader);
      // Hazel should disappear
      expect(screen.queryByText('Hazel')).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('dispatches closeRightPanel when close button clicked', () => {
      const { store } = renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      fireEvent.click(screen.getByLabelText('Close panel'));
      expect(store.getState().sidebar.aiCommandOpen).toBe(false);
    });

    it('dispatches selectAssistant when assistant clicked', () => {
      const { store } = renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      fireEvent.click(screen.getByText('Hazel'));
      expect(store.getState().sidebar.selectedAssistant).toBe('hazel');
    });

    it('dispatches closeRightPanel on Escape key', () => {
      const { store } = renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(store.getState().sidebar.aiCommandOpen).toBe(false);
    });
  });

  describe('search', () => {
    it('filters assistants by name', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      const input = screen.getByPlaceholderText('Search assistants...');
      fireEvent.change(input, { target: { value: 'hazel' } });
      expect(screen.getByText('Hazel')).toBeInTheDocument();
      expect(screen.queryByText('Mary')).not.toBeInTheDocument();
    });

    it('filters assistants by description', () => {
      renderPanel({ rightPanelOpen: true, aiCommandOpen: true });
      const input = screen.getByPlaceholderText('Search assistants...');
      fireEvent.change(input, { target: { value: 'inventory' } });
      expect(screen.getByText('Mary')).toBeInTheDocument();
      expect(screen.queryByText('Alex')).not.toBeInTheDocument();
    });
  });
});
