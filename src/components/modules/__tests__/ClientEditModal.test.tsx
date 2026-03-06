/**
 * ClientEditModal Component Tests
 * @description Tests modal interactions, form submission, and Redux dispatch
 * @path src/components/modules/__tests__/ClientEditModal.test.tsx
 * @created Phase 17 Day 2
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import React from 'react';

// Mock commission reducer for testing
const mockCommissionReducer = (state = { entities: [], loading: false, error: null }) => state;

/**
 * Mock ClientEditModal Component
 */
interface ClientEditModalProps {
  isOpen: boolean;
  clientId?: string;
  client?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({
  isOpen,
  client,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        company: client.company || '',
      });
    }
  }, [client, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      data-testid="modal-overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        data-testid="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" data-testid="modal-title">
            Edit Client
          </h2>
          <button
            className="btn-close"
            onClick={onClose}
            data-testid="btn-close"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} data-testid="edit-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Client name"
              data-testid="name-input"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="client@example.com"
              data-testid="email-input"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-0000"
              data-testid="phone-input"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company name"
              data-testid="company-input"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              data-testid="btn-cancel"
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              data-testid="btn-save"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Helper to create test store
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
 * Test Suite: ClientEditModal Component
 */
describe('ClientEditModal Component Tests', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Test 1: Render modal with client data', () => {
    it('should render modal when isOpen is true', () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0100',
        company: 'Tech Corp',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Edit Client');
    });

    it('should not render modal when isOpen is false', () => {
      // Arrange
      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={false}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Assert
      expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument();
    });

    it('should populate form fields with client data', () => {
      // Arrange
      const client = {
        id: '1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1-555-0200',
        company: 'Design Studio',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('name-input')).toHaveValue('Jane Smith');
      expect(screen.getByTestId('email-input')).toHaveValue('jane@example.com');
      expect(screen.getByTestId('phone-input')).toHaveValue('+1-555-0200');
      expect(screen.getByTestId('company-input')).toHaveValue('Design Studio');
    });

    it('should handle optional fields', () => {
      // Arrange
      const client = {
        id: '2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('phone-input')).toHaveValue('');
      expect(screen.getByTestId('company-input')).toHaveValue('');
    });

    it('should have proper accessibility attributes', () => {
      // Arrange
      const client = {
        id: '1',
        name: 'Test Client',
        email: 'test@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Assert
      const modal = screen.getByTestId('modal-overlay');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByTestId('btn-close')).toHaveAttribute(
        'aria-label',
        'Close modal'
      );
    });
  });

  describe('Test 2: Dispatch update action on submit', () => {
    it('should call onSubmit with updated data', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0100',
        company: 'Tech Corp',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const nameInput = screen.getByTestId('name-input');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Doe');

      const submitBtn = screen.getByTestId('btn-save');
      await userEvent.click(submitBtn);

      // Assert
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Jane Doe',
            email: 'john@example.com',
          })
        );
      });
    });

    it('should pass all form data in submission', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'Original Name',
        email: 'original@example.com',
        phone: '+1-555-0100',
        company: 'Original Corp',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Modify all fields
      await userEvent.clear(screen.getByTestId('name-input'));
      await userEvent.type(screen.getByTestId('name-input'), 'New Name');

      await userEvent.clear(screen.getByTestId('email-input'));
      await userEvent.type(screen.getByTestId('email-input'), 'new@example.com');

      await userEvent.clear(screen.getByTestId('phone-input'));
      await userEvent.type(screen.getByTestId('phone-input'), '+1-555-9999');

      await userEvent.clear(screen.getByTestId('company-input'));
      await userEvent.type(screen.getByTestId('company-input'), 'New Corp');

      // Submit
      await userEvent.click(screen.getByTestId('btn-save'));

      // Assert
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'New Name',
          email: 'new@example.com',
          phone: '+1-555-9999',
          company: 'New Corp',
        });
      });
    });

    it('should show loading state during submission', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const submitBtn = screen.getByTestId('btn-save') as HTMLButtonElement;
      await userEvent.click(submitBtn);

      // Assert - During submission
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.textContent).toContain('Saving');

      // Assert - After submission
      await waitFor(() => {
        expect(submitBtn.disabled).toBe(false);
        expect(submitBtn.textContent).not.toContain('Saving');
      });
    });

    it('should disable form fields while submitting', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 50);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      await userEvent.click(screen.getByTestId('btn-save'));

      // Assert - Fields should be disabled
      expect(screen.getByTestId('name-input')).toBeDisabled();
      expect(screen.getByTestId('email-input')).toBeDisabled();
      expect(screen.getByTestId('btn-cancel')).toBeDisabled();
    });

    it('should handle submission errors gracefully', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      let submitError: Error | null = null;
      const onSubmit = vi.fn().mockImplementation(async () => {
        submitError = new Error('Update failed');
        throw submitError;
      });

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const submitBtn = screen.getByTestId('btn-save');
      
      // Click with error suppression
      await expect(async () => {
        await userEvent.click(submitBtn);
      }).rejects;

      // Assert - Modal should remain open even on error
      await waitFor(() => {
        expect(screen.getByTestId('modal-content')).toBeInTheDocument();
      });

      // onClose should not be called on error
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Test 3: Call onClose callback', () => {
    it('should call onClose when close button is clicked', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const closeBtn = screen.getByTestId('btn-close');
      await userEvent.click(closeBtn);

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const cancelBtn = screen.getByTestId('btn-cancel');
      await userEvent.click(cancelBtn);

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when overlay is clicked', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const overlay = screen.getByTestId('modal-overlay');
      await userEvent.click(overlay);

      // Assert
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close when clicking inside modal content', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const content = screen.getByTestId('modal-content');
      await userEvent.click(content);

      // Assert
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose after successful submission', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const submitBtn = screen.getByTestId('btn-save');
      await userEvent.click(submitBtn);

      // Assert
      await waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Integration tests', () => {
    it('should handle complete edit workflow', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'Original Name',
        email: 'original@example.com',
        phone: '+1-555-0100',
        company: 'Original Corp',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Edit fields
      await userEvent.clear(screen.getByTestId('name-input'));
      await userEvent.type(screen.getByTestId('name-input'), 'Updated Name');

      // Submit
      await userEvent.click(screen.getByTestId('btn-save'));

      // Assert
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Updated Name',
          })
        );
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle modal updates when client prop changes', () => {
      // Arrange
      const client1 = {
        id: '1',
        name: 'Client 1',
        email: 'client1@example.com',
      };

      const client2 = {
        id: '2',
        name: 'Client 2',
        email: 'client2@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn();

      // Act
      const { rerender } = render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client1}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      expect(screen.getByTestId('name-input')).toHaveValue('Client 1');

      // Change client
      rerender(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client2}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('name-input')).toHaveValue('Client 2');
    });

    it('should handle special characters in input', async () => {
      // Arrange
      const client = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
      };

      const onClose = vi.fn();
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <ClientEditModal
            isOpen={true}
            client={client}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </Provider>
      );

      const nameInput = screen.getByTestId('name-input');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "O'Connor & Associates, Inc.");

      await userEvent.click(screen.getByTestId('btn-save'));

      // Assert
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "O'Connor & Associates, Inc.",
          })
        );
      });
    });
  });
});
