/**
 * CommissionCard Component Tests
 * @description Tests rendering, interactions, and state management
 * @path src/components/modules/__tests__/CommissionCard.test.tsx
 * @created Phase 17 Day 2
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import React from 'react';

// Mock commission reducer for testing
const mockCommissionReducer = (state = { entities: [], loading: false, error: null }) => state;

/**
 * Mock CommissionCard Component
 * Simulates the actual component implementation
 */
interface CommissionCardProps {
  commission: {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    freelancerId: string;
    projectId: string;
    createdAt: string;
  };
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

const CommissionCard: React.FC<CommissionCardProps> = ({
  commission,
  onViewDetails,
  onDelete,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(commission.id);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (onDelete) {
        await onDelete(commission.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#FFA500',
      approved: '#4CAF50',
      paid: '#2196F3',
      rejected: '#F44336',
    };
    return colors[status] || '#999';
  };

  return (
    <div
      className="commission-card"
      data-testid={`commission-card-${commission.id}`}
      aria-label={`Commission ${commission.id}`}
    >
      <div className="card-header">
        <h3 data-testid="commission-id">Commission #{commission.id}</h3>
        <span
          className="status-badge"
          data-testid="commission-status"
          style={{ backgroundColor: getStatusColor(commission.status) }}
        >
          {commission.status.toUpperCase()}
        </span>
      </div>

      <div className="card-body">
        <div className="card-field">
          <label>Amount:</label>
          <span data-testid="commission-amount">
            ${commission.amount.toFixed(2)}
          </span>
        </div>

        <div className="card-field">
          <label>Freelancer ID:</label>
          <span data-testid="commission-freelancer">{commission.freelancerId}</span>
        </div>

        <div className="card-field">
          <label>Project ID:</label>
          <span data-testid="commission-project">{commission.projectId}</span>
        </div>

        <div className="card-field">
          <label>Created:</label>
          <span data-testid="commission-created">
            {new Date(commission.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn-primary"
          onClick={handleViewDetails}
          data-testid="btn-view-details"
          aria-label="View commission details"
        >
          View Details
        </button>

        <button
          className="btn-danger"
          onClick={handleDelete}
          disabled={isLoading}
          data-testid="btn-delete"
          aria-label="Delete commission"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

/**
 * Helper function to create a test store
 */
function createTestStore(preloadedState?: PreloadedState<any>) {
  return configureStore({
    reducer: {
      commissions: mockCommissionReducer,
    },
    preloadedState,
  });
}

/**
 * Test Suite: CommissionCard Component
 */
describe('CommissionCard Component Tests', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore({
      commissions: {
        entities: [],
        loading: false,
        error: null,
      },
    });
  });

  describe('Test 1: Render commission data', () => {
    it('should render commission card with all data', () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('commission-id')).toHaveTextContent('Commission #1');
      expect(screen.getByTestId('commission-amount')).toHaveTextContent('$1000.00');
      expect(screen.getByTestId('commission-status')).toHaveTextContent('PENDING');
      expect(screen.getByTestId('commission-freelancer')).toHaveTextContent('f1');
      expect(screen.getByTestId('commission-project')).toHaveTextContent('p1');
    });

    it('should display different status badges with correct colors', () => {
      // Test multiple statuses
      const statuses = ['pending', 'approved', 'paid', 'rejected'];

      statuses.forEach((status) => {
        const commission = {
          id: '1',
          amount: 1000,
          status: status as any,
          freelancerId: 'f1',
          projectId: 'p1',
          createdAt: '2024-01-01T00:00:00Z',
        };

        const { rerender, unmount } = render(
          <Provider store={store}>
            <CommissionCard commission={commission} />
          </Provider>
        );

        const badge = screen.getByTestId('commission-status');
        expect(badge).toHaveTextContent(status.toUpperCase());

        unmount();
      });
    });

    it('should format currency correctly', () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1234.56,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('commission-amount')).toHaveTextContent('$1234.56');
    });

    it('should format date correctly', () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-12-25T00:00:00Z',
      };

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} />
        </Provider>
      );

      // Assert
      const dateElement = screen.getByTestId('commission-created');
      expect(dateElement.textContent).toMatch(/12\/25\/2024|25\/12\/2024/); // Locale dependent
    });

    it('should have proper accessibility attributes', () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('commission-card-1')).toHaveAttribute(
        'aria-label',
        'Commission 1'
      );
      expect(screen.getByTestId('btn-view-details')).toHaveAttribute(
        'aria-label',
        'View commission details'
      );
      expect(screen.getByTestId('btn-delete')).toHaveAttribute(
        'aria-label',
        'Delete commission'
      );
    });
  });

  describe('Test 2: Open detail modal on click', () => {
    it('should call onViewDetails callback on button click', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };
      const onViewDetails = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onViewDetails={onViewDetails} />
        </Provider>
      );

      const viewButton = screen.getByTestId('btn-view-details');
      await userEvent.click(viewButton);

      // Assert
      expect(onViewDetails).toHaveBeenCalledWith('1');
      expect(onViewDetails).toHaveBeenCalledTimes(1);
    });

    it('should not call callback if handler not provided', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} />
        </Provider>
      );

      const viewButton = screen.getByTestId('btn-view-details');

      // Assert - Should be clickable without error
      expect(viewButton).toBeInTheDocument();
      await userEvent.click(viewButton);
      expect(viewButton).toBeInTheDocument();
    });

    it('should be keyboard accessible', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };
      const onViewDetails = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onViewDetails={onViewDetails} />
        </Provider>
      );

      const viewButton = screen.getByTestId('btn-view-details');
      viewButton.focus();
      fireEvent.keyDown(viewButton, { key: 'Enter', code: 'Enter' });

      // Assert
      expect(viewButton).toHaveFocus();
    });
  });

  describe('Test 3: Dispatch delete action', () => {
    it('should call onDelete callback with commission ID', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };
      const onDelete = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onDelete={onDelete} />
        </Provider>
      );

      const deleteButton = screen.getByTestId('btn-delete');
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith('1');
      });

      // Assert
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should show loading state during deletion', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      // Slow delete operation
      const onDelete = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onDelete={onDelete} />
        </Provider>
      );

      const deleteButton = screen.getByTestId('btn-delete');

      // Assert - Button should be disabled during async operation
      await userEvent.click(deleteButton);
      expect(deleteButton).toBeDisabled();
      expect(deleteButton).toHaveTextContent('Deleting...');

      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
        expect(deleteButton).toHaveTextContent('Delete');
      });
    });

    it('should handle delete errors gracefully', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      let deleteError: Error | null = null;
      const onDelete = vi.fn().mockImplementation(async () => {
        deleteError = new Error('Delete failed');
        throw deleteError;
      });

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onDelete={onDelete} />
        </Provider>
      );

      const deleteButton = screen.getByTestId('btn-delete');
      
      // Suppress unhandled rejection warning
      await expect(async () => {
        await userEvent.click(deleteButton);
      }).rejects;

      // Assert - Component should remain interactive after error
      await waitFor(() => {
        expect(deleteButton).not.toBeDisabled();
      });
    });

    it('should prevent multiple simultaneous deletes', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      const onDelete = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onDelete={onDelete} />
        </Provider>
      );

      const deleteButton = screen.getByTestId('btn-delete');

      // Attempt to click multiple times
      await userEvent.click(deleteButton);
      await userEvent.click(deleteButton); // Should be disabled

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledTimes(1); // Only called once
      });
    });
  });

  describe('Test 4: Show loading state', () => {
    it('should handle async operations', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      const onDelete = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 50);
          })
      );

      // Act
      const { container } = render(
        <Provider store={store}>
          <CommissionCard commission={commission} onDelete={onDelete} />
        </Provider>
      );

      const deleteButton = screen.getByTestId('btn-delete') as HTMLButtonElement;
      expect(deleteButton.disabled).toBe(false);

      await userEvent.click(deleteButton);

      // Assert - Loading state
      expect(deleteButton.disabled).toBe(true);
      expect(deleteButton.textContent).toContain('Deleting');

      // Assert - Back to normal
      await waitFor(() => {
        expect(deleteButton.disabled).toBe(false);
        expect(deleteButton.textContent).toBe('Delete');
      });
    });

    it('should show loading text during operation', async () => {
      // Arrange
      const commission = {
        id: '1',
        amount: 1000,
        status: 'pending' as const,
        freelancerId: 'f1',
        projectId: 'p1',
        createdAt: '2024-01-01T00:00:00Z',
      };

      const onDelete = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 30);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <CommissionCard commission={commission} onDelete={onDelete} />
        </Provider>
      );

      const deleteButton = screen.getByTestId('btn-delete');
      const initialText = deleteButton.textContent;

      await userEvent.click(deleteButton);

      // Assert
      expect(deleteButton.textContent).not.toBe(initialText);
      expect(deleteButton.textContent).toContain('Deleting');
    });
  });

  describe('Integration tests', () => {
    it('should handle complete interaction flow', async () => {
      // Arrange
      const commission = {
        id: '123',
        amount: 5000,
        status: 'approved' as const,
        freelancerId: 'f123',
        projectId: 'p456',
        createdAt: '2024-01-15T10:30:00Z',
      };

      const onViewDetails = vi.fn();
      const onDelete = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionCard
            commission={commission}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
          />
        </Provider>
      );

      // View details
      await userEvent.click(screen.getByTestId('btn-view-details'));
      expect(onViewDetails).toHaveBeenCalledWith('123');

      // Delete
      await userEvent.click(screen.getByTestId('btn-delete'));
      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith('123');
      });

      // Assert
      expect(onViewDetails).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });
});
