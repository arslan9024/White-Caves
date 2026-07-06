/**
 * SignContractPage — Unit Tests
 * Tests: rendering, token validation, loading state, error state,
 * signature flow, form validation, submit, success state, retry
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('../components/Toast', () => ({
  useToast: () => mockToast,
}));

vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}));

vi.mock('../utils', () => ({
  formatCurrency: (amount: number) => `AED ${amount?.toLocaleString() ?? '0'}`,
  formatDate: (date: string) => date || 'N/A',
}));

const mockAuthFetch = vi.fn();
vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

// Mock react-signature-canvas
vi.mock('react-signature-canvas', () => {
  let isEmpty = true;
  const MockSignatureCanvas = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      clear: () => { isEmpty = true; },
      isEmpty: () => isEmpty,
      toDataURL: () => 'data:image/png;base64,mockSignature',
    }));
    return (
      <canvas
        data-testid="signature-canvas"
        {...(props.canvasProps as Record<string, unknown>)}
        onMouseDown={() => { isEmpty = false; }}
      />
    );
  });
  MockSignatureCanvas.displayName = 'MockSignatureCanvas';
  return { default: MockSignatureCanvas };
});

import SignContractPage from './SignContractPage';

// ── Helpers ──────────────────────────────────────────────────────

const renderWithToken = (token = 'validtoken123') => {
  return render(
    <MemoryRouter initialEntries={[`/sign/${token}`]}>
      <Routes>
        <Route path="/sign/:token" element={<SignContractPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

const mockSuccessfulFetch = () => {
  mockAuthFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      success: true,
      contract: { id: 'c1', parties: ['Buyer', 'Seller'], amount: 2500000, date: '2025-06-15' },
      role: 'buyer',
      signerName: 'Ahmed Al-Rashid',
    }),
  });
};

const mockSuccessfulSign = () => {
  mockAuthFetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        contract: { id: 'c1', parties: ['Buyer', 'Seller'], amount: 2500000, date: '2025-06-15' },
        role: 'buyer',
        signerName: 'Ahmed Al-Rashid',
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
};

// ── Tests ────────────────────────────────────────────────────────

describe('SignContractPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockReset();
  });

  // ── Loading State ────────────────────────────────────────────

  describe('Loading State', () => {
    it('should show loading spinner initially', () => {
      mockAuthFetch.mockReturnValue(new Promise(() => {})); // never resolves
      renderWithToken();
      expect(screen.getByText('Loading contract...')).toBeInTheDocument();
    });
  });

  // ── Token Validation ─────────────────────────────────────────

  describe('Token Validation', () => {
    it('should show error for invalid token with special characters', async () => {
      renderWithToken('invalid!@#$token');
      await waitFor(() => {
        expect(screen.getByText('Invalid contract link. Please check the URL and try again.')).toBeInTheDocument();
      });
    });

    it('should show error for token shorter than 8 chars', async () => {
      renderWithToken('abc');
      await waitFor(() => {
        expect(screen.getByText('Invalid contract link. Please check the URL and try again.')).toBeInTheDocument();
      });
    });

    it('should accept valid alphanumeric tokens', async () => {
      mockSuccessfulFetch();
      renderWithToken('abcdef12345');
      await waitFor(() => {
        expect(screen.getByText('E-Signature')).toBeInTheDocument();
      });
    });
  });

  // ── Contract Display ─────────────────────────────────────────

  describe('Contract Display', () => {
    it('should render contract details after loading', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Contract Details')).toBeInTheDocument();
        expect(screen.getByText(/AED 2,500,000/)).toBeInTheDocument();
      });
    });

    it('should render the E-Signature header', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('E-Signature')).toBeInTheDocument();
      });
    });

    it('should render the signature section', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Here')).toBeInTheDocument();
      });
    });

    it('should pre-fill signer name from API', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        const input = screen.getByPlaceholderText('Enter your full name') as HTMLInputElement;
        expect(input.value).toBe('Ahmed Al-Rashid');
      });
    });

    it('should render signature canvas', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByTestId('signature-canvas')).toBeInTheDocument();
      });
    });

    it('should show Clear and Sign Contract buttons', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Clear')).toBeInTheDocument();
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });
    });
  });

  // ── Signature Flow ───────────────────────────────────────────

  describe('Signature Flow', () => {
    it('should show warning when signing without name', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });
      // Clear the signer name
      const input = screen.getByPlaceholderText('Enter your full name');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(screen.getByText('Sign Contract'));
      expect(mockToast.warning).toHaveBeenCalledWith('Please enter your full name before signing.');
    });

    it('should show warning when signing with empty canvas', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });
      // Name is pre-filled, but canvas is empty
      fireEvent.click(screen.getByText('Sign Contract'));
      expect(mockToast.warning).toHaveBeenCalledWith('Please provide your signature before submitting.');
    });

    it('should submit signature successfully', async () => {
      mockSuccessfulSign();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });

      // Draw on canvas (trigger mouseDown to set isEmpty = false)
      fireEvent.mouseDown(screen.getByTestId('signature-canvas'));

      // Click sign
      fireEvent.click(screen.getByText('Sign Contract'));

      await waitFor(() => {
        expect(screen.getByText(/Contract Signed Successfully/)).toBeInTheDocument();
      });
    });

    it('should call API with signature data and signer name', async () => {
      mockSuccessfulSign();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });

      fireEvent.mouseDown(screen.getByTestId('signature-canvas'));
      fireEvent.click(screen.getByText('Sign Contract'));

      await waitFor(() => {
        expect(mockAuthFetch).toHaveBeenCalledWith(
          '/api/contracts/signature/validtoken123/sign',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Ahmed Al-Rashid'),
          }),
        );
      });
    });
  });

  // ── Success State ────────────────────────────────────────────

  describe('Success State', () => {
    it('should show success message after signing', async () => {
      mockSuccessfulSign();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });
      fireEvent.mouseDown(screen.getByTestId('signature-canvas'));
      fireEvent.click(screen.getByText('Sign Contract'));

      await waitFor(() => {
        expect(screen.getByText(/Contract Signed Successfully/)).toBeInTheDocument();
        expect(screen.getByText(/Your signature has been recorded/)).toBeInTheDocument();
      });
    });

    it('should hide signature section after successful signing', async () => {
      mockSuccessfulSign();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByText('Sign Contract')).toBeInTheDocument();
      });
      fireEvent.mouseDown(screen.getByTestId('signature-canvas'));
      fireEvent.click(screen.getByText('Sign Contract'));

      await waitFor(() => {
        expect(screen.queryByText('Sign Here')).not.toBeInTheDocument();
      });
    });
  });

  // ── Error State ──────────────────────────────────────────────

  describe('Error State', () => {
    it('should show error when API returns failure', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, error: 'Contract has expired' }),
      });
      renderWithToken();

      await waitFor(() => {
        expect(screen.getByText('Contract has expired')).toBeInTheDocument();
      });
    });

    it('should show error when API fetch fails', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });
      renderWithToken();

      await waitFor(() => {
        expect(screen.getByText(/Failed to load contract/)).toBeInTheDocument();
      });
    });

    it('should show Retry and Go Home buttons on error', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      });
      renderWithToken();

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
        expect(screen.getByText('Go Home')).toBeInTheDocument();
      });
    });

    it('should navigate home on Go Home click', async () => {
      mockAuthFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      });
      renderWithToken();

      await waitFor(() => {
        expect(screen.getByText('Go Home')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Go Home'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should retry fetching on Retry click', async () => {
      mockAuthFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });
      renderWithToken();

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      mockSuccessfulFetch();
      fireEvent.click(screen.getByText('Retry'));

      await waitFor(() => {
        expect(screen.getByText('Contract Details')).toBeInTheDocument();
      });
    });
  });

  // ── Signer Name Input ───────────────────────────────────────

  describe('Signer Name Input', () => {
    it('should update signer name on input change', async () => {
      mockSuccessfulFetch();
      renderWithToken();
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
      });
      const input = screen.getByPlaceholderText('Enter your full name') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'New Name' } });
      expect(input.value).toBe('New Name');
    });
  });
});
