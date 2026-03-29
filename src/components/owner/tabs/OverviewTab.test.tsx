/**
 * @file OverviewTab.test.tsx
 * @description Comprehensive tests for the OverviewTab owner dashboard component.
 * Covers: loading state, stats grid, quick actions, revenue chart, property distribution,
 * recent activity timeline, and callback interactions.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OverviewTab from './OverviewTab';
import type { OverviewTabProps, OverviewData } from './types';

// ─── Mocks ──────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Helpers ────────────────────────────────────────────────────
const defaultData: OverviewData = {
  totalProperties: 120,
  activeAgents: 15,
  monthlyRevenue: 2500000,
  whatsappLeads: 45,
  uaepassUsers: 80,
  chatbotConversations: 320,
  recentActivities: [
    {
      type: 'lead',
      title: 'New Lead',
      description: 'Ahmad from Dubai Marina inquiry',
      timestamp: '2026-01-15T10:30:00Z',
    },
    {
      type: 'property',
      title: 'Property Listed',
      description: 'Villa in Palm Jumeirah added',
      timestamp: '2026-01-15T09:00:00Z',
    },
  ],
};

const defaultProps: OverviewTabProps = {
  data: defaultData,
  loading: false,
  onQuickAction: vi.fn(),
};

const renderTab = (props: Partial<OverviewTabProps> = {}) =>
  render(
    <MemoryRouter>
      <OverviewTab {...defaultProps} {...props} />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ──────────────────────────────────────────────────────
describe('OverviewTab', () => {
  // === Loading State ===
  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      renderTab({ loading: true });
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading dashboard overview...')).toBeInTheDocument();
    });

    it('does not render stats when loading', () => {
      renderTab({ loading: true });
      expect(screen.queryByText('Total Properties')).not.toBeInTheDocument();
    });
  });

  // === Stats Grid ===
  describe('Stats Grid', () => {
    it('renders all 6 stat cards', () => {
      renderTab();
      expect(screen.getByText('Total Properties')).toBeInTheDocument();
      expect(screen.getByText('Active Agents')).toBeInTheDocument();
      expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Leads')).toBeInTheDocument();
      // 'UAE Pass Users' appears in stats + quick actions
      expect(screen.getAllByText('UAE Pass Users').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Chatbot Chats')).toBeInTheDocument();
    });

    it('displays correct property count', () => {
      renderTab();
      expect(screen.getByText('120')).toBeInTheDocument();
    });

    it('displays correct agent count', () => {
      renderTab();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('formats revenue with AED and commas', () => {
      renderTab();
      expect(screen.getByText('AED 2,500,000')).toBeInTheDocument();
    });

    it('displays WhatsApp leads count', () => {
      renderTab();
      expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('displays UAE Pass users count', () => {
      renderTab();
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('displays chatbot conversations count', () => {
      renderTab();
      expect(screen.getByText('320')).toBeInTheDocument();
    });

    it('shows change percentages', () => {
      renderTab();
      expect(screen.getByText('+12%')).toBeInTheDocument();
      expect(screen.getByText('+18%')).toBeInTheDocument();
      expect(screen.getByText('+25%')).toBeInTheDocument();
    });

    it('handles zero/missing data gracefully', () => {
      renderTab({ data: {} });
      // Multiple zeros appear for different stats; just check they are present
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('AED 0')).toBeInTheDocument();
    });
  });

  // === Quick Actions ===
  describe('Quick Actions', () => {
    it('renders quick actions section', () => {
      renderTab();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('renders all 6 quick action buttons', () => {
      renderTab();
      expect(screen.getByText('Add Property')).toBeInTheDocument();
      expect(screen.getByText('Assign Agent')).toBeInTheDocument();
      expect(screen.getByText('Generate Report')).toBeInTheDocument();
      expect(screen.getByText('Train Chatbot')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Broadcast')).toBeInTheDocument();
      // 'UAE Pass Users' appears in stats + quick actions, check both exist
      expect(screen.getAllByText('UAE Pass Users').length).toBe(2);
    });

    it('calls onQuickAction with correct action on Add Property click', () => {
      const onQuickAction = vi.fn();
      renderTab({ onQuickAction });
      fireEvent.click(screen.getByText('Add Property'));
      expect(onQuickAction).toHaveBeenCalledWith('addProperty');
    });

    it('calls onQuickAction for Assign Agent', () => {
      const onQuickAction = vi.fn();
      renderTab({ onQuickAction });
      fireEvent.click(screen.getByText('Assign Agent'));
      expect(onQuickAction).toHaveBeenCalledWith('assignAgent');
    });

    it('calls onQuickAction for Generate Report', () => {
      const onQuickAction = vi.fn();
      renderTab({ onQuickAction });
      fireEvent.click(screen.getByText('Generate Report'));
      expect(onQuickAction).toHaveBeenCalledWith('generateReport');
    });

    it('calls onQuickAction for Train Chatbot', () => {
      const onQuickAction = vi.fn();
      renderTab({ onQuickAction });
      fireEvent.click(screen.getByText('Train Chatbot'));
      expect(onQuickAction).toHaveBeenCalledWith('trainChatbot');
    });

    it('calls onQuickAction for WhatsApp Broadcast', () => {
      const onQuickAction = vi.fn();
      renderTab({ onQuickAction });
      fireEvent.click(screen.getByText('WhatsApp Broadcast'));
      expect(onQuickAction).toHaveBeenCalledWith('whatsappBroadcast');
    });

    it('calls onQuickAction for UAE Pass Users', () => {
      const onQuickAction = vi.fn();
      renderTab({ onQuickAction });
      // There are two 'UAE Pass Users' elements - stat card and quick action button
      const uaeButtons = screen.getAllByText('UAE Pass Users');
      // Click the one that's inside a button (quick action)
      const btn = uaeButtons.find(el => el.closest('button.quick-action-btn'));
      fireEvent.click(btn || uaeButtons[1]);
      expect(onQuickAction).toHaveBeenCalledWith('viewUaePassUsers');
    });
  });

  // === Charts ===
  describe('Charts', () => {
    it('renders Revenue Trend chart', () => {
      renderTab();
      expect(screen.getByText('Revenue Trend (2024)')).toBeInTheDocument();
    });

    it('renders revenue chart legend', () => {
      renderTab();
      expect(screen.getByText('Revenue in Millions (AED)')).toBeInTheDocument();
    });

    it('renders Property Distribution chart', () => {
      renderTab();
      expect(screen.getByText('Property Distribution')).toBeInTheDocument();
    });

    it('renders property type segments', () => {
      renderTab();
      expect(screen.getByText('Apartments 45%')).toBeInTheDocument();
      expect(screen.getByText('Villas 25%')).toBeInTheDocument();
      expect(screen.getByText('Townhouses 15%')).toBeInTheDocument();
      expect(screen.getByText('Commercial 10%')).toBeInTheDocument();
      expect(screen.getByText('Land 5%')).toBeInTheDocument();
    });

    it('renders month labels for revenue chart', () => {
      renderTab();
      // Multiple months start with same letters (J=Jan/Jun/Jul, M=Mar/May)
      // Just check chart labels exist by checking several unique ones
      expect(screen.getByText('F')).toBeInTheDocument();
      expect(screen.getByText('O')).toBeInTheDocument();
      expect(screen.getByText('N')).toBeInTheDocument();
      expect(screen.getByText('D')).toBeInTheDocument();
    });
  });

  // === Recent Activity ===
  describe('Recent Activity', () => {
    it('renders activity section', () => {
      renderTab();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('renders activity items from data', () => {
      renderTab();
      expect(screen.getByText('New Lead')).toBeInTheDocument();
      expect(screen.getByText('Ahmad from Dubai Marina inquiry')).toBeInTheDocument();
      expect(screen.getByText('Property Listed')).toBeInTheDocument();
      expect(screen.getByText('Villa in Palm Jumeirah added')).toBeInTheDocument();
    });

    it('renders timestamps', () => {
      renderTab();
      // Activity timestamps should be rendered as localeString
      const timestampEls = screen.getAllByText(/2026/);
      expect(timestampEls.length).toBeGreaterThan(0);
    });

    it('handles empty activities', () => {
      renderTab({ data: { ...defaultData, recentActivities: [] } });
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      // No activity items rendered
    });
  });

  // === Edge Cases ===
  describe('Edge Cases', () => {
    it('handles undefined data properties', () => {
      renderTab({ data: {} as OverviewData });
      expect(screen.getByText('Total Properties')).toBeInTheDocument();
      // Multiple zeros for different stats
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
    });

    it('renders without onQuickAction callback', () => {
      render(
        <MemoryRouter>
          <OverviewTab data={defaultData} />
        </MemoryRouter>,
      );
      // Should not throw when clicking action without callback
      fireEvent.click(screen.getByText('Add Property'));
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });

    it('handles null recentActivities', () => {
      renderTab({ data: { ...defaultData, recentActivities: undefined } });
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });
});
