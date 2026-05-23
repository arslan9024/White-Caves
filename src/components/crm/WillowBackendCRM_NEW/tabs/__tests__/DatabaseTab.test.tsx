/**
 * @file DatabaseTab.test.tsx
 * @description Comprehensive tests for DatabaseTab CRM component
 * Tests: rendering, metrics display, progress bars, operations breakdown, edge cases
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Database: (props: any) => <svg data-testid="icon-database" {...props} />,
  HardDrive: (props: any) => <svg data-testid="icon-harddrive" {...props} />,
  Zap: (props: any) => <svg data-testid="icon-zap" {...props} />,
}));

import DatabaseTab from '../DatabaseTab';

const defaultMetrics = {
  queryPerformance: {
    avgTime: 42,
    slowQueries: 3,
    indexHits: 97,
  },
  operations: {
    reads: 15420,
    writes: 3240,
    updates: 1890,
  },
};

const defaultDbHealth = {
  connections: 45,
  connectionPercentage: 45,
  storage: '12.5 GB',
  storagePercentage: 62,
};

const defaultProps = {
  metrics: defaultMetrics,
  dbHealth: defaultDbHealth,
};

describe('DatabaseTab', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Rendering ──────────────────────────────────────────
  describe('Rendering', () => {
    it('renders the database view', () => {
      const { container } = render(<DatabaseTab {...defaultProps} />);
      expect(container.querySelector('.database-view')).toBeTruthy();
    });

    it('renders metrics grid', () => {
      const { container } = render(<DatabaseTab {...defaultProps} />);
      expect(container.querySelector('.metrics-grid')).toBeTruthy();
    });

    it('renders 4 metric cards', () => {
      const { container } = render(<DatabaseTab {...defaultProps} />);
      const cards = container.querySelectorAll('.metric-card');
      expect(cards.length).toBe(4);
    });
  });

  // ── Connections Card ───────────────────────────────────
  describe('Connections Card', () => {
    it('displays the connections count', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('displays connections label', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText('Connections')).toBeInTheDocument();
    });

    it('displays connection percentage', () => {
      render(<DatabaseTab {...defaultProps} />);
      const percentageEls = document.querySelectorAll('.metric-percentage');
      expect(percentageEls[0].textContent).toMatch(/45/);
      expect(percentageEls[0].textContent).toMatch(/% used/);
    });

    it('renders progress bar with correct width', () => {
      const { container } = render(<DatabaseTab {...defaultProps} />);
      const fills = container.querySelectorAll('.progress-fill');
      expect(fills[0]).toHaveStyle({ width: '45%' });
    });

    it('renders zap icon for connections', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByTestId('icon-zap')).toBeInTheDocument();
    });
  });

  // ── Storage Card ───────────────────────────────────────
  describe('Storage Card', () => {
    it('displays the storage value', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText('12.5 GB')).toBeInTheDocument();
    });

    it('displays storage label', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText('Storage')).toBeInTheDocument();
    });

    it('displays storage percentage', () => {
      render(<DatabaseTab {...defaultProps} />);
      const percentageEls = document.querySelectorAll('.metric-percentage');
      expect(percentageEls[1].textContent).toMatch(/62/);
      expect(percentageEls[1].textContent).toMatch(/% used/);
    });

    it('renders progress bar with correct width', () => {
      const { container } = render(<DatabaseTab {...defaultProps} />);
      const fills = container.querySelectorAll('.progress-fill');
      expect(fills[1]).toHaveStyle({ width: '62%' });
    });

    it('renders harddrive icon', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByTestId('icon-harddrive')).toBeInTheDocument();
    });
  });

  // ── Query Performance Card ─────────────────────────────
  describe('Query Performance Card', () => {
    it('displays average query time', () => {
      render(<DatabaseTab {...defaultProps} />);
      const metricValues = document.querySelectorAll('.metric-value');
      const queryVal = Array.from(metricValues).find(el => el.textContent?.includes('42'));
      expect(queryVal).toBeTruthy();
      expect(queryVal?.textContent).toMatch(/ms/);
    });

    it('displays query performance label', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText('Query Performance')).toBeInTheDocument();
    });

    it('displays slow queries count', () => {
      render(<DatabaseTab {...defaultProps} />);
      const details = document.querySelectorAll('.metric-detail');
      const slowQueriesDetail = Array.from(details).find(d => d.textContent?.includes('Slow Queries'));
      expect(slowQueriesDetail?.textContent).toMatch(/3/);
    });

    it('displays index hit rate', () => {
      render(<DatabaseTab {...defaultProps} />);
      const details = document.querySelectorAll('.metric-detail');
      const indexDetail = Array.from(details).find(d => d.textContent?.includes('Index Hit Rate'));
      expect(indexDetail?.textContent).toMatch(/97/);
    });

    it('renders zap icon', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByTestId('icon-zap')).toBeInTheDocument();
    });
  });

  // ── Operations Card ────────────────────────────────────
  describe('Operations Card', () => {
    it('displays operations label', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });

    it('displays reads count', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText(/15,?420/)).toBeInTheDocument();
    });

    it('displays writes count', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText(/3,?240/)).toBeInTheDocument();
    });

    it('displays updates count', () => {
      render(<DatabaseTab {...defaultProps} />);
      expect(screen.getByText(/1,?890/)).toBeInTheDocument();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────
  describe('Edge Cases', () => {
    it('handles zero connections', () => {
      const props = {
        ...defaultProps,
        dbHealth: { ...defaultDbHealth, connections: 0, connectionPercentage: 0 },
      };
      render(<DatabaseTab {...props} />);
      expect(screen.getByText('0')).toBeInTheDocument();
      const percentageEls = document.querySelectorAll('.metric-percentage');
      expect(percentageEls[0].textContent).toMatch(/0/);
    });

    it('handles 100% storage', () => {
      const props = {
        ...defaultProps,
        dbHealth: { ...defaultDbHealth, storagePercentage: 100 },
      };
      const { container } = render(<DatabaseTab {...props} />);
      const fills = container.querySelectorAll('.progress-fill');
      expect(fills[1]).toHaveStyle({ width: '100%' });
    });

    it('handles zero slow queries', () => {
      const props = {
        ...defaultProps,
        metrics: {
          ...defaultMetrics,
          queryPerformance: { ...defaultMetrics.queryPerformance, slowQueries: 0 },
        },
      };
      render(<DatabaseTab {...props} />);
      const details = document.querySelectorAll('.metric-detail');
      const slowQueriesDetail = Array.from(details).find(d => d.textContent?.includes('Slow Queries'));
      expect(slowQueriesDetail?.textContent).toMatch(/0/);
    });

    it('handles zero operations', () => {
      const props = {
        ...defaultProps,
        metrics: {
          ...defaultMetrics,
          operations: { reads: 0, writes: 0, updates: 0 },
        },
      };
      render(<DatabaseTab {...props} />);
      // Should render without error
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
  });
});
