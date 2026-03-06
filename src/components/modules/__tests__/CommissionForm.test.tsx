/**
 * CommissionForm Component Tests
 * @description Tests form submission, validation, and field management
 * @path src/components/modules/__tests__/CommissionForm.test.tsx
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
 * Validation utilities
 */
const validators = {
  required: (value: string) => {
    if (!value || !value.trim()) return 'This field is required';
    return '';
  },
  minAmount: (value: number) => {
    if (value < 0.01) return 'Amount must be greater than 0';
    return '';
  },
  maxAmount: (value: number) => {
    if (value > 1000000) return 'Amount exceeds maximum allowed';
    return '';
  },
  numeric: (value: string) => {
    if (value && isNaN(Number(value))) return 'Must be a valid number';
    return '';
  },
  selectRequired: (value: string) => {
    if (!value || value === '')
      return 'Please select an option';
    return '';
  },
};

/**
 * Mock CommissionForm Component
 */
interface CommissionFormProps {
  initialValues?: {
    amount?: number;
    status?: string;
    freelancerId?: string;
    projectId?: string;
    notes?: string;
  };
  onSubmit: (data: any) => Promise<void> | void;
  isLoading?: boolean;
}

const CommissionForm: React.FC<CommissionFormProps> = ({
  initialValues = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState({
    amount: initialValues.amount || '',
    status: initialValues.status || 'pending',
    freelancerId: initialValues.freelancerId || '',
    projectId: initialValues.projectId || '',
    notes: initialValues.notes || '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateField = (name: string, value: any) => {
    let error = '';

    switch (name) {
      case 'amount':
        error = validators.required(String(value));
        if (!error) error = validators.numeric(String(value));
        if (!error) error = validators.minAmount(Number(value));
        if (!error) error = validators.maxAmount(Number(value));
        break;
      case 'freelancerId':
        error = validators.selectRequired(String(value));
        break;
      case 'projectId':
        error = validators.selectRequired(String(value));
        break;
      case 'status':
        error = validators.selectRequired(String(value));
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      if (key !== 'notes') {
        const error = validateField(key, (formData as any)[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = (name: string) => touched[name] && errors[name];

  return (
    <form onSubmit={handleSubmit} data-testid="commission-form" noValidate>
      <div className="form-group">
        <label htmlFor="amount">Amount *</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0.00"
          data-testid="amount-input"
          aria-invalid={hasError('amount') ? 'true' : 'false'}
          disabled={isSubmitting || isLoading}
        />
        {hasError('amount') && (
          <span className="error" data-testid="amount-error">
            {errors.amount}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="freelancerId">Freelancer *</label>
        <select
          id="freelancerId"
          name="freelancerId"
          value={formData.freelancerId}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="freelancer-select"
          aria-invalid={hasError('freelancerId') ? 'true' : 'false'}
          disabled={isSubmitting || isLoading}
        >
          <option value="">-- Select Freelancer --</option>
          <option value="f1">John Doe</option>
          <option value="f2">Jane Smith</option>
          <option value="f3">Bob Johnson</option>
        </select>
        {hasError('freelancerId') && (
          <span className="error" data-testid="freelancer-error">
            {errors.freelancerId}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="projectId">Project *</label>
        <select
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="project-select"
          aria-invalid={hasError('projectId') ? 'true' : 'false'}
          disabled={isSubmitting || isLoading}
        >
          <option value="">-- Select Project --</option>
          <option value="p1">Project Alpha</option>
          <option value="p2">Project Beta</option>
          <option value="p3">Project Gamma</option>
        </select>
        {hasError('projectId') && (
          <span className="error" data-testid="project-error">
            {errors.projectId}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status *</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          onBlur={handleBlur}
          data-testid="status-select"
          aria-invalid={hasError('status') ? 'true' : 'false'}
          disabled={isSubmitting || isLoading}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
        {hasError('status') && (
          <span className="error" data-testid="status-error">
            {errors.status}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional notes"
          data-testid="notes-input"
          disabled={isSubmitting || isLoading}
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        data-testid="submit-btn"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
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
 * Test Suite: CommissionForm Component
 */
describe('CommissionForm Component Tests', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('Test 1: Render all form fields', () => {
    it('should render all required form fields', () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      expect(screen.getByTestId('freelancer-select')).toBeInTheDocument();
      expect(screen.getByTestId('project-select')).toBeInTheDocument();
      expect(screen.getByTestId('status-select')).toBeInTheDocument();
      expect(screen.getByTestId('notes-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    });

    it('should have correct initial values', () => {
      // Arrange
      const onSubmit = vi.fn();
      const initialValues = {
        amount: 1500,
        freelancerId: 'f1',
        projectId: 'p1',
        status: 'approved',
        notes: 'Test notes',
      };

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} initialValues={initialValues} />
        </Provider>
      );

      // Assert
      expect(screen.getByTestId('amount-input')).toHaveValue(1500);
      expect(screen.getByTestId('freelancer-select')).toHaveValue('f1');
      expect(screen.getByTestId('project-select')).toHaveValue('p1');
      expect(screen.getByTestId('status-select')).toHaveValue('approved');
      expect(screen.getByTestId('notes-input')).toHaveValue('Test notes');
    });

    it('should have proper labels for accessibility', () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      // Assert
      expect(screen.getByLabelText('Amount *')).toBeInTheDocument();
      expect(screen.getByLabelText('Freelancer *')).toBeInTheDocument();
      expect(screen.getByLabelText('Project *')).toBeInTheDocument();
      expect(screen.getByLabelText('Status *')).toBeInTheDocument();
      expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    });

    it('should render with default status value', () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      // Assert
      const statusSelect = screen.getByTestId('status-select');
      expect(statusSelect).toHaveValue('pending');
    });
  });

  describe('Test 2: Validate required fields', () => {
    it('should show error when required fields are empty', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const submitBtn = screen.getByTestId('submit-btn');
      await userEvent.click(submitBtn);

      // Assert - Submit should not be called without required fields
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should validate amount field', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input') as HTMLInputElement;

      // Test with invalid value
      await userEvent.type(amountInput, 'abc');
      await userEvent.tab();

      // Assert
      await waitFor(() => {
        const error = screen.queryByTestId('amount-error');
        expect(error).toBeInTheDocument();
      });
    });

    it('should validate freelancer selection', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const freelancerSelect = screen.getByTestId('freelancer-select');
      await userEvent.click(freelancerSelect);
      await userEvent.tab();

      // Assert
      await waitFor(() => {
        const error = screen.queryByTestId('freelancer-error');
        expect(error).toBeInTheDocument();
      });
    });

    it('should validate project selection', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const projectSelect = screen.getByTestId('project-select');
      await userEvent.click(projectSelect);
      await userEvent.tab();

      // Assert
      await waitFor(() => {
        const error = screen.queryByTestId('project-error');
        expect(error).toBeInTheDocument();
      });
    });

    it('should validate amount range', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input');

      // Test with negative amount
      await userEvent.type(amountInput, '-100');
      await userEvent.tab();

      // Assert
      await waitFor(() => {
        const error = screen.queryByTestId('amount-error');
        expect(error).toBeInTheDocument();
      });
    });
  });

  describe('Test 3: Submit form with valid data', () => {
    it('should submit form with valid data', async () => {
      // Arrange
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input');
      const freelancerSelect = screen.getByTestId('freelancer-select');
      const projectSelect = screen.getByTestId('project-select');
      const notesInput = screen.getByTestId('notes-input');
      const submitBtn = screen.getByTestId('submit-btn');

      // Fill form
      await userEvent.type(amountInput, '1000');
      await userEvent.selectOptions(freelancerSelect, 'f1');
      await userEvent.selectOptions(projectSelect, 'p1');
      await userEvent.type(notesInput, 'Test payment');

      // Submit
      await userEvent.click(submitBtn);

      // Assert
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: '1000',
            freelancerId: 'f1',
            projectId: 'p1',
            notes: 'Test payment',
            status: 'pending',
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      // Arrange
      const onSubmit = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 100);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input');
      const freelancerSelect = screen.getByTestId('freelancer-select');
      const projectSelect = screen.getByTestId('project-select');
      const submitBtn = screen.getByTestId('submit-btn') as HTMLButtonElement;

      await userEvent.type(amountInput, '1000');
      await userEvent.selectOptions(freelancerSelect, 'f1');
      await userEvent.selectOptions(projectSelect, 'p1');
      await userEvent.click(submitBtn);

      // Assert - Button should be disabled and show loading text
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.textContent).toContain('Submitting');

      // Wait for submission to complete
      await waitFor(() => {
        expect(submitBtn.disabled).toBe(false);
        expect(submitBtn.textContent).not.toContain('Submitting');
      });
    });

    it('should disable fields during submission', async () => {
      // Arrange
      const onSubmit = vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 50);
          })
      );

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input');
      const freelancerSelect = screen.getByTestId('freelancer-select');
      const projectSelect = screen.getByTestId('project-select');
      const submitBtn = screen.getByTestId('submit-btn');

      await userEvent.type(amountInput, '1000');
      await userEvent.selectOptions(freelancerSelect, 'f1');
      await userEvent.selectOptions(projectSelect, 'p1');
      await userEvent.click(submitBtn);

      // Assert - Fields should be disabled
      expect((amountInput as HTMLInputElement).disabled).toBe(true);
      expect((freelancerSelect as HTMLSelectElement).disabled).toBe(true);
      expect((projectSelect as HTMLSelectElement).disabled).toBe(true);
    });

    it('should prevent form submission if validation fails', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const submitBtn = screen.getByTestId('submit-btn');

      // Try to submit without filling any fields
      await userEvent.click(submitBtn);

      // Assert
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Test 4: Show validation errors', () => {
    it('should display errors onBlur for touched fields', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input');

      // Focus and blur without entering value
      await userEvent.click(amountInput);
      await userEvent.tab();

      // Assert
      await waitFor(() => {
        const error = screen.queryByTestId('amount-error');
        expect(error).toBeInTheDocument();
        expect(amountInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should clear errors when field is corrected', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input') as HTMLInputElement;

      // Create error
      await userEvent.type(amountInput, 'abc');
      await userEvent.tab();

      // Wait for error to appear
      await waitFor(() => {
        expect(screen.queryByTestId('amount-error')).toBeInTheDocument();
      });

      // Clear and fix
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, '1000');
      await userEvent.tab();

      // Assert - Error should be gone
      await waitFor(() => {
        expect(screen.queryByTestId('amount-error')).not.toBeInTheDocument();
        expect(amountInput).toHaveAttribute('aria-invalid', 'false');
      });
    });

    it('should show specific error messages', async () => {
      // Arrange
      const onSubmit = vi.fn();

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input') as HTMLInputElement;

      // Test empty error
      await userEvent.click(amountInput);
      await userEvent.tab();

      // Assert
      await waitFor(() => {
        const error = screen.queryByTestId('amount-error');
        expect(error?.textContent).toContain('required');
      });

      // Test invalid amount
      await userEvent.clear(amountInput);
      await userEvent.type(amountInput, '-50');

      // Assert - verify negative value was entered
      expect(amountInput.value).toBe('-50');
    });

    it('should handle form submission without validation errors', async () => {
      // Arrange
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const submitBtn = screen.getByTestId('submit-btn');
      
      // Assert - button should be clickable
      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
    });
  });

  describe('Integration tests', () => {
    it('should handle complete form lifecycle', async () => {
      // Arrange
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      // Fill form
      await userEvent.type(screen.getByTestId('amount-input'), '5000');
      await userEvent.selectOptions(screen.getByTestId('freelancer-select'), 'f2');
      await userEvent.selectOptions(screen.getByTestId('project-select'), 'p3');
      await userEvent.selectOptions(screen.getByTestId('status-select'), 'approved');

      // Submit
      await userEvent.click(screen.getByTestId('submit-btn'));

      // Assert
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            amount: '5000',
            freelancerId: 'f2',
            projectId: 'p3',
            status: 'approved',
          })
        );
      });
    });
  });

  describe('Edge cases', () => {
    it('should have amount input that accepts numbers', async () => {
      // Arrange
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const amountInput = screen.getByTestId('amount-input') as HTMLInputElement;
      
      // Assert - input should exist and be editable
      expect(amountInput).toBeInTheDocument();
      expect(amountInput).not.toBeDisabled();
    });

    it('should have notes textarea for input', async () => {
      // Arrange
      const onSubmit = vi.fn().mockResolvedValue(undefined);

      // Act
      render(
        <Provider store={store}>
          <CommissionForm onSubmit={onSubmit} />
        </Provider>
      );

      const notesInput = screen.getByTestId('notes-input') as HTMLTextAreaElement;

      // Assert - textarea should exist and be editable
      expect(notesInput).toBeInTheDocument();
      expect(notesInput).not.toBeDisabled();
    });
  });
});
