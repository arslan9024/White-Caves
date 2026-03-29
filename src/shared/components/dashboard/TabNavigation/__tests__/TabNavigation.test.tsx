/**
 * @file TabNavigation.test.tsx
 * @description Comprehensive tests for TabNavigation shared component
 * Tests: rendering, tab clicks, keyboard nav, disabled tabs, badges, ARIA, TabPanel
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock CSS
vi.mock('../TabNavigation.css', () => ({}));

import TabNavigation, { TabPanel } from '../TabNavigation';
import type { Tab } from '../TabNavigation';

const sampleTabs: Tab[] = [
  { id: 'overview', label: 'Overview', count: 5 },
  { id: 'details', label: 'Details', count: 12 },
  { id: 'settings', label: 'Settings' },
  { id: 'archive', label: 'Archive', disabled: true, count: 3 },
];

const defaultProps = {
  tabs: sampleTabs,
  activeTab: 'overview',
  onTabChange: vi.fn(),
};

describe('TabNavigation', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Basic Rendering ────────────────────────────────────
  describe('Rendering', () => {
    it('renders all tab buttons', () => {
      render(<TabNavigation {...defaultProps} />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Archive')).toBeInTheDocument();
    });

    it('renders with tablist role', () => {
      render(<TabNavigation {...defaultProps} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders aria-label on tablist', () => {
      render(<TabNavigation {...defaultProps} />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Content tabs');
    });

    it('renders with default variant class', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      expect(container.querySelector('.tab-navigation.default')).toBeTruthy();
    });

    it('renders with custom variant', () => {
      const { container } = render(<TabNavigation {...defaultProps} variant="pills" />);
      expect(container.querySelector('.tab-navigation.pills')).toBeTruthy();
    });

    it('applies custom className', () => {
      const { container } = render(<TabNavigation {...defaultProps} className="custom-tabs" />);
      expect(container.querySelector('.custom-tabs')).toBeTruthy();
    });

    it('renders with empty tabs array', () => {
      const { container } = render(<TabNavigation tabs={[]} onTabChange={vi.fn()} />);
      expect(container.querySelector('.tab-navigation')).toBeTruthy();
    });
  });

  // ── Tab ARIA Attributes ────────────────────────────────
  describe('ARIA', () => {
    it('active tab has aria-selected true', () => {
      render(<TabNavigation {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('inactive tabs have aria-selected false', () => {
      render(<TabNavigation {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('active tab has tabIndex 0', () => {
      render(<TabNavigation {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
    });

    it('inactive tabs have tabIndex -1', () => {
      render(<TabNavigation {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
    });

    it('tabs have aria-controls attribute', () => {
      render(<TabNavigation {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-controls', 'tabpanel-overview');
      expect(tabs[1]).toHaveAttribute('aria-controls', 'tabpanel-details');
    });
  });

  // ── Active State ───────────────────────────────────────
  describe('Active State', () => {
    it('applies active class to active tab', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      const tabs = container.querySelectorAll('.tab-item');
      expect(tabs[0]).toHaveClass('active');
    });

    it('does not apply active class to inactive tabs', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      const tabs = container.querySelectorAll('.tab-item');
      expect(tabs[1]).not.toHaveClass('active');
    });
  });

  // ── Tab Click ──────────────────────────────────────────
  describe('Tab Click', () => {
    it('calls onTabChange with tab id on click', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} onTabChange={onTabChange} />);
      fireEvent.click(screen.getByText('Details'));
      expect(onTabChange).toHaveBeenCalledWith('details');
    });

    it('does not call onTabChange for disabled tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} onTabChange={onTabChange} />);
      fireEvent.click(screen.getByText('Archive'));
      expect(onTabChange).not.toHaveBeenCalled();
    });
  });

  // ── Disabled Tabs ──────────────────────────────────────
  describe('Disabled Tabs', () => {
    it('applies disabled class to disabled tab', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      const tabs = container.querySelectorAll('.tab-item');
      expect(tabs[3]).toHaveClass('disabled');
    });

    it('disabled tab has disabled attribute', () => {
      render(<TabNavigation {...defaultProps} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs[3]).toBeDisabled();
    });
  });

  // ── Badges ─────────────────────────────────────────────
  describe('Badges', () => {
    it('shows count badge for tabs with count > 0', () => {
      render(<TabNavigation {...defaultProps} />);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('shows badge for disabled tab with count', () => {
      render(<TabNavigation {...defaultProps} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not show badge for tab without count', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      // Settings has no count — check its button has no .tab-badge
      const settingsTab = container.querySelectorAll('.tab-item')[2];
      expect(settingsTab.querySelector('.tab-badge')).toBeFalsy();
    });

    it('hides all badges when showBadges is false', () => {
      render(<TabNavigation {...defaultProps} showBadges={false} />);
      expect(screen.queryByText('5')).not.toBeInTheDocument();
      expect(screen.queryByText('12')).not.toBeInTheDocument();
    });

    it('caps badge at 99+', () => {
      const tabs = [{ id: 'big', label: 'Big', count: 150 }];
      render(<TabNavigation tabs={tabs} activeTab="big" onTabChange={vi.fn()} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('does not show badge for count of 0', () => {
      const tabs = [{ id: 'zero', label: 'Zero', count: 0 }];
      const { container } = render(<TabNavigation tabs={tabs} activeTab="zero" onTabChange={vi.fn()} />);
      expect(container.querySelector('.tab-badge')).toBeFalsy();
    });
  });

  // ── Icons ──────────────────────────────────────────────
  describe('Icons', () => {
    it('renders icon when provided', () => {
      const tabs = [{ id: 'test', label: 'Test', icon: <span data-testid="tab-icon-test">★</span> }];
      render(<TabNavigation tabs={tabs} activeTab="test" onTabChange={vi.fn()} />);
      expect(screen.getByTestId('tab-icon-test')).toBeInTheDocument();
    });

    it('does not render icon span when no icon', () => {
      const { container } = render(<TabNavigation {...defaultProps} />);
      const firstTab = container.querySelectorAll('.tab-item')[0];
      expect(firstTab.querySelector('.tab-icon')).toBeFalsy();
    });
  });

  // ── Keyboard Navigation ────────────────────────────────
  describe('Keyboard Navigation', () => {
    it('ArrowRight moves to next tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
      expect(onTabChange).toHaveBeenCalledWith('details');
    });

    it('ArrowLeft moves to previous tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} activeTab="details" onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
      expect(onTabChange).toHaveBeenCalledWith('overview');
    });

    it('ArrowRight wraps from last to first', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} activeTab="archive" onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[3], { key: 'ArrowRight' });
      expect(onTabChange).toHaveBeenCalledWith('overview');
    });

    it('ArrowLeft wraps from first to last', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' });
      expect(onTabChange).toHaveBeenCalledWith('archive');
    });

    it('Home moves to first tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} activeTab="settings" onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[2], { key: 'Home' });
      expect(onTabChange).toHaveBeenCalledWith('overview');
    });

    it('End moves to last tab', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[0], { key: 'End' });
      expect(onTabChange).toHaveBeenCalledWith('archive');
    });

    it('other keys do not trigger tab change', () => {
      const onTabChange = vi.fn();
      render(<TabNavigation {...defaultProps} onTabChange={onTabChange} />);
      const tabs = screen.getAllByRole('tab');
      fireEvent.keyDown(tabs[0], { key: 'Enter' });
      expect(onTabChange).not.toHaveBeenCalled();
    });
  });

  // ── TabPanel ───────────────────────────────────────────
  describe('TabPanel', () => {
    it('renders children when id matches activeTab', () => {
      render(
        <TabPanel id="overview" activeTab="overview">
          <p>Panel content</p>
        </TabPanel>
      );
      expect(screen.getByText('Panel content')).toBeInTheDocument();
    });

    it('returns null when id does not match activeTab', () => {
      const { container } = render(
        <TabPanel id="overview" activeTab="details">
          <p>Hidden</p>
        </TabPanel>
      );
      expect(container.firstChild).toBeNull();
    });

    it('has correct role and aria attributes', () => {
      render(
        <TabPanel id="overview" activeTab="overview">
          Content
        </TabPanel>
      );
      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('id', 'tabpanel-overview');
      expect(panel).toHaveAttribute('aria-labelledby', 'tab-overview');
    });

    it('applies custom className', () => {
      const { container } = render(
        <TabPanel id="test" activeTab="test" className="custom-panel">
          Content
        </TabPanel>
      );
      expect(container.querySelector('.custom-panel')).toBeTruthy();
    });
  });
});
