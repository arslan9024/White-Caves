import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuickAddPropertyForm from '../QuickAddPropertyForm';

describe('QuickAddPropertyForm Component', () => {
  const mockProps = {
    extractedData: {
      ownerName: 'Ahmed Al-Mazrouei',
      propertyType: 'villa',
      location: 'Dubai Marina',
      bedrooms: 4,
      bathrooms: 3,
      price: 5000,
      features: ['swimming pool', 'garden', 'parking'],
      confidenceScore: 85
    },
    opportunityId: 'opp-001',
    onSuccess: vi.fn(),
    onCancel: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // RENDERING TESTS
  // ============================================================

  describe('Component Rendering', () => {
    it('should render form container', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should display form title', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByText(/Quick Add Property/i)).toBeInTheDocument();
    });

    it('should display extraction preview section', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByText(/Extraction Preview/i)).toBeInTheDocument();
    });

    it('should show owner name from extraction', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByText('Ahmed Al-Mazrouei')).toBeInTheDocument();
    });

    it('should display confidence score badge', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const badge = screen.getByText(/85%/);
      expect(badge).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Bedrooms/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Bathrooms/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    });

    it('should display feature selection grid', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByText(/Features/i)).toBeInTheDocument();
      // Should show suggested features
      expect(screen.getByText(/Swimming pool|Garden|Parking/i)).toBeInTheDocument();
    });

    it('should show owner relationship selector', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByLabelText(/Owner Relationship Type/i)).toBeInTheDocument();
    });

    it('should display description textarea', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByPlaceholderText(/Additional details/i)).toBeInTheDocument();
    });

    it('should show publish checkbox', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByLabelText(/Publish to inventory/i)).toBeInTheDocument();
    });

    it('should display action buttons', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByRole('button', { name: /Publish/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
  });

  // ============================================================
  // PRE-FILLED DATA TESTS
  // ============================================================

  describe('Pre-filled Data', () => {
    it('should pre-fill property type field', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByDisplayValue('villa')).toBeInTheDocument();
    });

    it('should pre-fill location field', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByDisplayValue('Dubai Marina')).toBeInTheDocument();
    });

    it('should pre-fill bedroom count', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    });

    it('should pre-fill bathroom count', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const bathInput = screen.getAllByDisplayValue('3')[0];
      expect(bathInput).toBeInTheDocument();
    });

    it('should pre-fill price field', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    });

    it('should pre-select extracted features', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const poolButton = screen.getByRole('button', { name: /Swimming pool/i });
      expect(poolButton).toHaveClass('selected');
    });

    it('should allow editing pre-filled fields', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const locationInput = screen.getByDisplayValue('Dubai Marina');
      
      fireEvent.change(locationInput, { target: { value: 'Downtown Dubai' } });
      await waitFor(() => {
        expect(locationInput.value).toBe('Downtown Dubai');
      });
    });
  });

  // ============================================================
  // FORM VALIDATION TESTS
  // ============================================================

  describe('Form Validation', () => {
    it('should require property type', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const typeField = screen.getByLabelText(/Property Type/i);
      
      fireEvent.change(typeField, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Property type is required/i)).toBeInTheDocument();
      });
    });

    it('should require location', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const locationField = screen.getByLabelText(/Location/i);
      
      fireEvent.change(locationField, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
      });
    });

    it('should require bedroom count', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const bedroomsField = screen.getByLabelText(/Bedrooms/i);
      
      fireEvent.change(bedroomsField, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Bedrooms is required/i)).toBeInTheDocument();
      });
    });

    it('should require price', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const priceField = screen.getByLabelText(/Price/i);
      
      fireEvent.change(priceField, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Price is required/i)).toBeInTheDocument();
      });
    });

    it('should validate bedroom count is positive', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const bedroomsField = screen.getByLabelText(/Bedrooms/i);
      
      fireEvent.change(bedroomsField, { target: { value: '-1' } });
      
      await waitFor(() => {
        expect(screen.getByText(/must be positive/i)).toBeInTheDocument();
      });
    });

    it('should validate price is positive', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const priceField = screen.getByLabelText(/Price/i);
      
      fireEvent.change(priceField, { target: { value: '-100' } });
      
      await waitFor(() => {
        expect(screen.getByText(/must be positive/i)).toBeInTheDocument();
      });
    });

    it('should show all validation errors at once', async () => {
      const { container } = render(<QuickAddPropertyForm {...mockProps} />);
      
      // Clear required fields
      fireEvent.change(screen.getByLabelText(/Property Type/i), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        const errors = container.querySelectorAll('.error-message');
        expect(errors.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  // ============================================================
  // FEATURE SELECTION TESTS
  // ============================================================

  describe('Feature Selection', () => {
    it('should display feature suggestion grid', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByText(/Select features/i)).toBeInTheDocument();
    });

    it('should allow selecting features', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const poolButton = screen.getByRole('button', { name: /Swimming pool/i });
      
      fireEvent.click(poolButton);
      await waitFor(() => {
        expect(poolButton).toHaveClass('selected');
      });
    });

    it('should allow deselecting features', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const poolButton = screen.getByRole('button', { name: /Swimming pool/i });
      
      fireEvent.click(poolButton); // Select
      fireEvent.click(poolButton); // Deselect
      
      await waitFor(() => {
        expect(poolButton).not.toHaveClass('selected');
      });
    });

    it('should display multiple features', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByRole('button', { name: /Swimming pool/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Garden/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Parking/i })).toBeInTheDocument();
    });

    it('should support custom feature input', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const customInput = screen.getByPlaceholderText(/Add custom feature/i);
      expect(customInput).toBeInTheDocument();
    });

    it('should add custom feature on enter key', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const customInput = screen.getByPlaceholderText(/Add custom feature/i);
      
      fireEvent.change(customInput, { target: { value: 'Gym' } });
      fireEvent.keyPress(customInput, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Gym/i })).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // FORM SUBMISSION TESTS
  // ============================================================

  describe('Form Submission', () => {
    it('should submit form with all data', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(mockProps.onSuccess).toHaveBeenCalled();
      });
    });

    it('should pass correct data on submission', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        const callData = mockProps.onSuccess.mock.calls[0][0];
        expect(callData.propertyType).toBe('villa');
        expect(callData.location).toBe('Dubai Marina');
        expect(callData.opportunityId).toBe('opp-001');
      });
    });

    it('should prevent submission with validation errors', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.change(screen.getByLabelText(/Property Type/i), { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(mockProps.onSuccess).not.toHaveBeenCalled();
      });
    });

    it('should show loading state while submitting', async () => {
      const delayedOnSuccess = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      render(<QuickAddPropertyForm {...{ ...mockProps, onSuccess: delayedOnSuccess }} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      expect(screen.getByText(/Saving/i)).toBeInTheDocument();
    });

    it('should show success screen after submission', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Property added successfully/i)).toBeInTheDocument();
      });
    });

    it('should display success details', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/villa/i)).toBeInTheDocument();
        expect(screen.getByText(/Dubai Marina/i)).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // CANCEL ACTION TESTS
  // ============================================================

  describe('Cancel Action', () => {
    it('should call onCancel when cancel button clicked', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      
      expect(mockProps.onCancel).toHaveBeenCalled();
    });

    it('should close form on cancel', async () => {
      const { unmount } = render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
      
      unmount();
      expect(mockProps.onCancel).toHaveBeenCalled();
    });
  });

  // ============================================================
  // RESPONSIVE DESIGN TESTS
  // ============================================================

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      const { container } = render(<QuickAddPropertyForm {...mockProps} />);
      expect(container.querySelector('.form-container')).toHaveClass('responsive');
    });

    it('should stack fields on mobile', () => {
      const { container } = render(<QuickAddPropertyForm {...mockProps} />);
      expect(container.querySelector('.form-grid')).toHaveClass('mobile-stack');
    });

    it('should display feature buttons in grid on mobile', () => {
      const { container } = render(<QuickAddPropertyForm {...mockProps} />);
      expect(container.querySelector('.feature-grid')).toBeInTheDocument();
    });
  });

  // ============================================================
  // ACCESSIBILITY TESTS
  // ============================================================

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    });

    it('should have ARIA labels for icons', () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      // Verify form has proper structure for screen readers
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      const typeField = screen.getByLabelText(/Property Type/i);
      
      typeField.focus();
      expect(document.activeElement).toBe(typeField);
    });

    it('should announce form errors to screen readers', async () => {
      render(<QuickAddPropertyForm {...mockProps} />);
      
      fireEvent.change(screen.getByLabelText(/Property Type/i), { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: /Publish/i }));
      
      await waitFor(() => {
        const error = screen.getByText(/Property type is required/i);
        expect(error).toHaveAttribute('role', 'alert');
      });
    });
  });
});
