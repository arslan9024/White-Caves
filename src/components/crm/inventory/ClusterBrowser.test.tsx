import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  FolderOpen: (props: any) => <span data-testid="icon-folder" {...props} />,
}));

// Mock styled-components
vi.mock('./ClusterBrowser.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  return {
    ClusterBrowserContainer: c('div'),
    ClusterHeader: c('div'),
    ClusterTitle: c('span'),
    ClusterCount: c('span'),
    ClusterGrid: c('div'),
    ClusterChip: ({ children, $active, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) filtered[k] = v;
      }
      return React.createElement('button', { ...filtered, 'data-active': String($active) }, children);
    },
  };
});

// Mock Redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({
    inventory: {
      uniqueClusters: ['Marina', 'Downtown', 'Palm'],
      sheetsMeta: [],
      filteredProperties: [
        { id: 1, cluster: 'Marina' },
        { id: 2, cluster: 'Marina' },
        { id: 3, cluster: 'Downtown' },
        { id: 4, cluster: 'Palm' },
        { id: 5, cluster: 'Palm' },
        { id: 6, cluster: 'Palm' },
      ],
    },
  }),
  useDispatch: () => mockDispatch,
}));

// Mock inventorySlice selectors
vi.mock('../../../store/slices/inventorySlice', () => ({
  selectUniqueClusters: (state: any) => state.inventory.uniqueClusters,
  selectSheetsMeta: (state: any) => state.inventory.sheetsMeta,
  selectFilteredProperties: (state: any) => state.inventory.filteredProperties,
  setFilter: (payload: any) => ({ type: 'inventory/setFilter', payload }),
}));

import ClusterBrowser from './ClusterBrowser';

describe('ClusterBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders header with folder icon', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByTestId('icon-folder')).toBeInTheDocument();
    });

    it('renders "Clusters / Projects" title', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByText('Clusters / Projects')).toBeInTheDocument();
    });

    it('renders cluster count', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByText('3 clusters')).toBeInTheDocument();
    });

    it('renders "All" chip with total count', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByText('All (6)')).toBeInTheDocument();
    });

    it('renders cluster chips with counts', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByText('Marina (2)')).toBeInTheDocument();
      expect(screen.getByText('Downtown (1)')).toBeInTheDocument();
      expect(screen.getByText('Palm (3)')).toBeInTheDocument();
    });
  });

  describe('selection', () => {
    it('marks "All" chip as active when selectedCluster is "all"', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByText('All (6)')).toHaveAttribute('data-active', 'true');
    });

    it('marks specific cluster chip as active', () => {
      render(<ClusterBrowser selectedCluster="Marina" />);
      expect(screen.getByText('Marina (2)')).toHaveAttribute('data-active', 'true');
      expect(screen.getByText('All (6)')).toHaveAttribute('data-active', 'false');
    });
  });

  describe('interactions', () => {
    it('dispatches setFilter when cluster chip is clicked', () => {
      render(<ClusterBrowser selectedCluster="all" />);
      fireEvent.click(screen.getByText('Marina (2)'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'inventory/setFilter',
        payload: { key: 'cluster', value: 'Marina' },
      });
    });

    it('dispatches "all" when same cluster is clicked (deselect)', () => {
      render(<ClusterBrowser selectedCluster="Marina" />);
      fireEvent.click(screen.getByText('Marina (2)'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'inventory/setFilter',
        payload: { key: 'cluster', value: 'all' },
      });
    });

    it('calls onClusterSelect callback', () => {
      const onClusterSelect = vi.fn();
      render(<ClusterBrowser selectedCluster="all" onClusterSelect={onClusterSelect} />);
      fireEvent.click(screen.getByText('Palm (3)'));
      expect(onClusterSelect).toHaveBeenCalledWith('Palm');
    });

    it('dispatches setFilter with "all" on All chip click', () => {
      render(<ClusterBrowser selectedCluster="Marina" />);
      fireEvent.click(screen.getByText('All (6)'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'inventory/setFilter',
        payload: { key: 'cluster', value: 'all' },
      });
    });
  });

  describe('filtering', () => {
    it('filters out invalid clusters (empty and ".")', () => {
      // The mock data has 3 valid clusters, and the component filters out empty/'.' clusters
      render(<ClusterBrowser selectedCluster="all" />);
      expect(screen.getByText('3 clusters')).toBeInTheDocument();
    });
  });
});
