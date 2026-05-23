/**
 * ActivityTimeline — Comprehensive Unit Tests
 *
 * Covers: rendering, empty state, max items, timestamp display,
 * compact mode, status icons, activity targets, time formatting
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckCircle: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-check" className={className} />,
  AlertCircle: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-alert" className={className} />,
  Clock: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-clock" className={className} />,
  Zap: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-zap" className={className} />,
  User: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-user" className={className} />,
}));

// Mock CSS
vi.mock('./SharedComponents.css', () => ({}));

import ActivityTimeline from './ActivityTimeline';

// ── Test Data ────────────────────────────────────────────────────

const now = Date.now();

const testActivities = [
  {
    id: '1',
    type: 'success',
    action: 'Lead converted to client',
    target: 'Ahmed Khan',
    timestamp: new Date(now - 30 * 60000).toISOString(), // 30 min ago
  },
  {
    id: '2',
    type: 'warning',
    action: 'Follow-up overdue',
    target: 'Sara Ali',
    timestamp: new Date(now - 3 * 3600000).toISOString(), // 3 hours ago
  },
  {
    id: '3',
    type: 'error',
    action: 'Payment failed',
    target: 'Invoice #1234',
    timestamp: new Date(now - 2 * 86400000).toISOString(), // 2 days ago
  },
  {
    id: '4',
    type: 'active',
    action: 'New inquiry received',
    timestamp: new Date(now - 10 * 1000).toISOString(), // 10 seconds ago
  },
  {
    id: '5',
    action: 'System update applied',
    timestamp: new Date(now - 5 * 3600000).toISOString(), // 5 hours ago
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ActivityTimeline', () => {
  describe('rendering', () => {
    it('renders all activities', () => {
      render(<ActivityTimeline activities={testActivities} />);
      expect(screen.getByText('Lead converted to client')).toBeInTheDocument();
      expect(screen.getByText('Follow-up overdue')).toBeInTheDocument();
      expect(screen.getByText('Payment failed')).toBeInTheDocument();
      expect(screen.getByText('New inquiry received')).toBeInTheDocument();
      expect(screen.getByText('System update applied')).toBeInTheDocument();
    });

    it('renders activity targets', () => {
      render(<ActivityTimeline activities={testActivities} />);
      expect(screen.getByText('Ahmed Khan')).toBeInTheDocument();
      expect(screen.getByText('Sara Ali')).toBeInTheDocument();
      expect(screen.getByText('Invoice #1234')).toBeInTheDocument();
    });

    it('does not render target for activities without one', () => {
      render(<ActivityTimeline activities={[testActivities[3]]} />);
      expect(screen.getByText('New inquiry received')).toBeInTheDocument();
      // No target span
      expect(screen.queryByText('Ahmed Khan')).not.toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(ActivityTimeline.displayName).toBe('ActivityTimeline');
    });
  });

  describe('empty state', () => {
    it('shows empty message when no activities', () => {
      render(<ActivityTimeline activities={[]} />);
      expect(screen.getByText('No recent activity')).toBeInTheDocument();
    });

    it('shows empty message when activities is empty array', () => {
      render(<ActivityTimeline activities={[]} />);
      expect(screen.getByText('No recent activity')).toBeInTheDocument();
    });
  });

  describe('maxItems', () => {
    it('limits displayed activities to maxItems', () => {
      render(<ActivityTimeline activities={testActivities} maxItems={2} />);
      expect(screen.getByText('Lead converted to client')).toBeInTheDocument();
      expect(screen.getByText('Follow-up overdue')).toBeInTheDocument();
      expect(screen.queryByText('Payment failed')).not.toBeInTheDocument();
    });

    it('shows all when maxItems exceeds count', () => {
      render(<ActivityTimeline activities={testActivities} maxItems={100} />);
      expect(screen.getByText('Lead converted to client')).toBeInTheDocument();
      expect(screen.getByText('System update applied')).toBeInTheDocument();
    });

    it('defaults to 10 maxItems', () => {
      const manyActivities = Array.from({ length: 15 }, (_, i) => ({
        id: String(i),
        action: `Activity ${i}`,
        timestamp: new Date(now - i * 60000).toISOString(),
      }));
      render(<ActivityTimeline activities={manyActivities} />);
      expect(screen.getByText('Activity 0')).toBeInTheDocument();
      expect(screen.getByText('Activity 9')).toBeInTheDocument();
      expect(screen.queryByText('Activity 10')).not.toBeInTheDocument();
    });
  });

  describe('timestamp display', () => {
    it('shows timestamps by default', () => {
      render(<ActivityTimeline activities={[testActivities[0]]} />);
      expect(screen.getByText('30m ago')).toBeInTheDocument();
    });

    it('shows "Just now" for very recent', () => {
      render(<ActivityTimeline activities={[testActivities[3]]} />);
      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('shows hours ago', () => {
      render(<ActivityTimeline activities={[testActivities[1]]} />);
      expect(screen.getByText('3h ago')).toBeInTheDocument();
    });

    it('shows days ago', () => {
      render(<ActivityTimeline activities={[testActivities[2]]} />);
      expect(screen.getByText('2d ago')).toBeInTheDocument();
    });

    it('hides timestamps when showTimestamp=false', () => {
      render(<ActivityTimeline activities={[testActivities[0]]} showTimestamp={false} />);
      expect(screen.queryByText('30m ago')).not.toBeInTheDocument();
    });
  });

  describe('compact mode', () => {
    it('adds compact class when compact=true', () => {
      const { container } = render(
        <ActivityTimeline activities={testActivities} compact />
      );
      expect(container.querySelector('.compact')).toBeInTheDocument();
    });

    it('does not add compact class by default', () => {
      const { container } = render(
        <ActivityTimeline activities={testActivities} />
      );
      expect(container.querySelector('.compact')).not.toBeInTheDocument();
    });
  });

  describe('status icons', () => {
    it('shows check icon for success type', () => {
      render(<ActivityTimeline activities={[testActivities[0]]} />);
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });

    it('shows clock icon for warning type', () => {
      render(<ActivityTimeline activities={[testActivities[1]]} />);
      expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
    });

    it('shows alert icon for error type', () => {
      render(<ActivityTimeline activities={[testActivities[2]]} />);
      expect(screen.getByTestId('icon-alert')).toBeInTheDocument();
    });

    it('shows zap icon for active type', () => {
      render(<ActivityTimeline activities={[testActivities[3]]} />);
      expect(screen.getByTestId('icon-zap')).toBeInTheDocument();
    });

    it('shows user icon for default type', () => {
      render(<ActivityTimeline activities={[testActivities[4]]} />);
      expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    });

    it('falls back to status field when type is missing', () => {
      const activity = {
        id: '99',
        status: 'success',
        action: 'Status-based activity',
        timestamp: new Date().toISOString(),
      };
      render(<ActivityTimeline activities={[activity]} />);
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });
  });

  describe('activity lines', () => {
    it('renders connector lines between activities', () => {
      const { container } = render(
        <ActivityTimeline activities={testActivities.slice(0, 3)} />
      );
      const lines = container.querySelectorAll('.activity-line');
      // 3 items, 2 connector lines (last item has no line)
      expect(lines).toHaveLength(2);
    });

    it('does not render line for single activity', () => {
      const { container } = render(
        <ActivityTimeline activities={[testActivities[0]]} />
      );
      const lines = container.querySelectorAll('.activity-line');
      expect(lines).toHaveLength(0);
    });
  });

  describe('custom color', () => {
    it('applies custom color as CSS variable', () => {
      const { container } = render(
        <ActivityTimeline activities={testActivities} color="#FF5733" />
      );
      const timeline = container.querySelector('.activity-timeline');
      expect(timeline).toHaveStyle({ '--timeline-accent': '#FF5733' });
    });
  });
});
