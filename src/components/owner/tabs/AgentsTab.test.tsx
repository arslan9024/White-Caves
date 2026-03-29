/**
 * AgentsTab — Comprehensive Unit Tests
 *
 * Covers: loading state, stats row, agent cards, search/filter,
 * star ratings, action callbacks, empty state, avatar fallback
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

vi.mock('./TabStyles.css', () => ({}));

import AgentsTab from './AgentsTab';

// ── Test data ────────────────────────────────────────────────────

const mockAgents = [
  {
    id: 1,
    name: 'Ahmed Khan',
    email: 'ahmed@whitecaves.ae',
    phone: '+971 50 123 4567',
    role: 'Senior Agent',
    properties: 24,
    leads: 18,
    dealsClosed: 12,
    revenue: 3500000,
    rating: 4.5,
    online: true,
    avatar: null,
  },
  {
    id: 2,
    name: 'Sara Ali',
    email: 'sara@whitecaves.ae',
    phone: '+971 55 987 6543',
    role: 'Junior Agent',
    properties: 10,
    leads: 8,
    dealsClosed: 3,
    revenue: 850000,
    rating: 3.8,
    online: false,
    avatar: 'https://example.com/sara.jpg',
  },
  {
    id: 3,
    name: 'Omar Hassan',
    email: 'omar@whitecaves.ae',
    phone: '+971 56 111 2222',
    role: 'Senior Agent',
    properties: 30,
    leads: 22,
    dealsClosed: 15,
    revenue: 5200000,
    rating: 4.9,
    online: true,
    avatar: null,
  },
];

const mockData = { agents: mockAgents };

describe('AgentsTab', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────── Loading State ──────

  describe('loading state', () => {
    it('shows loading text when loading is true', () => {
      render(<AgentsTab data={{ agents: [] }} loading={true} />);
      expect(screen.getByText('Loading agents...')).toBeInTheDocument();
    });

    it('has status role on loader', () => {
      render(<AgentsTab data={{ agents: [] }} loading={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not render agent cards when loading', () => {
      render(<AgentsTab data={mockData} loading={true} />);
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
    });
  });

  // ────── Header ──────

  describe('header', () => {
    it('renders "Agent Management" title', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByText('Agent Management')).toBeInTheDocument();
    });

    it('renders "Add Agent" button', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByText(/Add Agent/)).toBeInTheDocument();
    });

    it('calls onAction("addAgent") on Add Agent click', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      fireEvent.click(screen.getByText(/Add Agent/));
      expect(mockOnAction).toHaveBeenCalledWith('addAgent');
    });
  });

  // ────── Stats Row ──────

  describe('stats row', () => {
    it('shows total agents count', () => {
      const { container } = render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const statsRow = container.querySelector('.agent-stats-row')!;
      expect(within(statsRow).getByText('3')).toBeInTheDocument();
      expect(within(statsRow).getByText('Total Agents')).toBeInTheDocument();
    });

    it('shows online agents count', () => {
      const { container } = render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const statsRow = container.querySelector('.agent-stats-row')!;
      // 2 agents online (Ahmed + Omar)
      expect(within(statsRow).getByText('Online Now')).toBeInTheDocument();
      expect(within(statsRow).getByText('2')).toBeInTheDocument();
    });

    it('shows total deals closed', () => {
      const { container } = render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const statsRow = container.querySelector('.agent-stats-row')!;
      // 12 + 3 + 15 = 30
      expect(within(statsRow).getByText('30')).toBeInTheDocument();
      expect(within(statsRow).getByText('Total Deals')).toBeInTheDocument();
    });

    it('shows total revenue', () => {
      const { container } = render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const statsRow = container.querySelector('.agent-stats-row')!;
      // (3500000 + 850000 + 5200000) / 1000000 = 9.6M
      expect(within(statsRow).getByText(/AED 9.6M/)).toBeInTheDocument();
      expect(within(statsRow).getByText('Total Revenue')).toBeInTheDocument();
    });
  });

  // ────── Agent Cards ──────

  describe('agent cards', () => {
    it('renders all agent cards', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.getByText('Omar Hassan')).toBeInTheDocument();
    });

    it('shows agent roles', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const seniorAgents = screen.getAllByText('Senior Agent');
      expect(seniorAgents.length).toBe(2);
      expect(screen.getByText('Junior Agent')).toBeInTheDocument();
    });

    it('shows agent emails', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByText('ahmed@whitecaves.ae')).toBeInTheDocument();
      expect(screen.getByText('sara@whitecaves.ae')).toBeInTheDocument();
    });

    it('shows online/offline status', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const onlineStatuses = screen.getAllByText('Online');
      const offlineStatuses = screen.getAllByText('Offline');
      expect(onlineStatuses.length).toBe(2);
      expect(offlineStatuses.length).toBe(1);
    });

    it('shows metrics (properties, leads, deals)', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      // Each agent card has these labels, so there are 3 of each
      expect(screen.getAllByText('Properties').length).toBe(3);
      expect(screen.getAllByText('Leads').length).toBe(3);
      expect(screen.getAllByText('Deals').length).toBe(3);
    });

    it('shows agent revenue', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByText('AED 3,500,000')).toBeInTheDocument();
      expect(screen.getByText('AED 850,000')).toBeInTheDocument();
    });

    it('shows avatar initial when no avatar url', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      // Ahmed Khan has no avatar, should show 'A'
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('shows avatar image when url provided', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const img = screen.getByAltText('Sara Ali');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/sara.jpg');
    });
  });

  // ────── Star Ratings ──────

  describe('star ratings', () => {
    it('renders star ratings for each agent', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('3.8')).toBeInTheDocument();
      expect(screen.getByText('4.9')).toBeInTheDocument();
    });

    it('renders 5 stars per agent', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      // Total stars: 3 agents × 5 stars = 15
      const allStars = screen.getAllByText('★');
      expect(allStars.length).toBe(15);
    });
  });

  // ────── Search ──────

  describe('search filter', () => {
    it('renders search input', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      expect(screen.getByPlaceholderText('Search agents...')).toBeInTheDocument();
    });

    it('filters by agent name', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search agents...'), {
        target: { value: 'Ahmed' },
      });
      expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      expect(screen.queryByText('Sara Ali')).not.toBeInTheDocument();
      expect(screen.queryByText('Omar Hassan')).not.toBeInTheDocument();
    });

    it('filters by email', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search agents...'), {
        target: { value: 'sara@' },
      });
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
    });

    it('filters by role', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search agents...'), {
        target: { value: 'Junior' },
      });
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
    });

    it('shows no cards for non-matching search', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search agents...'), {
        target: { value: 'zzzzzzz' },
      });
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
      expect(screen.queryByText('Sara Ali')).not.toBeInTheDocument();
    });

    it('search is case-insensitive', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search agents...'), {
        target: { value: 'AHMED' },
      });
      expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
    });
  });

  // ────── Action Callbacks ──────

  describe('action callbacks', () => {
    it('calls onAction("viewAgent") on view click', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const viewBtns = screen.getAllByTitle('View Profile');
      fireEvent.click(viewBtns[0]);
      expect(mockOnAction).toHaveBeenCalledWith('viewAgent', 1);
    });

    it('calls onAction("messageAgent") on message click', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const msgBtns = screen.getAllByTitle('Message');
      fireEvent.click(msgBtns[1]);
      expect(mockOnAction).toHaveBeenCalledWith('messageAgent', 2);
    });

    it('calls onAction("editAgent") on edit click', () => {
      render(<AgentsTab data={mockData} onAction={mockOnAction} />);
      const editBtns = screen.getAllByTitle('Edit');
      fireEvent.click(editBtns[2]);
      expect(mockOnAction).toHaveBeenCalledWith('editAgent', 3);
    });
  });

  // ────── Empty State ──────

  describe('empty state', () => {
    it('renders with no agents', () => {
      const { container } = render(<AgentsTab data={{ agents: [] }} onAction={mockOnAction} />);
      expect(screen.getByText('Agent Management')).toBeInTheDocument();
      const statsRow = container.querySelector('.agent-stats-row')!;
      // All stats should be 0
      const zeros = within(statsRow).getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(1);
    });

    it('renders when data.agents is undefined', () => {
      render(<AgentsTab data={{}} onAction={mockOnAction} />);
      expect(screen.getByText('Agent Management')).toBeInTheDocument();
    });
  });

  // ────── No onAction ──────

  describe('when onAction is not provided', () => {
    it('renders without error', () => {
      render(<AgentsTab data={mockData} />);
      expect(screen.getByText('Agent Management')).toBeInTheDocument();
    });

    it('buttons do not throw when clicked', () => {
      render(<AgentsTab data={mockData} />);
      const viewBtns = screen.getAllByTitle('View Profile');
      expect(() => fireEvent.click(viewBtns[0])).not.toThrow();
    });
  });
});
