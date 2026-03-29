/**
 * ContractManagementPage — Unit Tests
 * Tests: loading state, contracts list, create form, form validation,
 * API calls, error handling, double-submit prevention
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockAuthFetch = vi.fn();
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('../../components/Toast', () => ({
  useToast: () => mockToast,
}));

// Mock signature canvas
vi.mock('react-signature-canvas', () => {
  const MockSigCanvas = React.forwardRef((_props: Record<string, unknown>, ref: React.Ref<unknown>) => {
    React.useImperativeHandle(ref, () => ({
      clear: vi.fn(),
      isEmpty: () => true,
      toDataURL: () => 'data:image/png;base64,mock',
    }));
    return <canvas data-testid="signature-canvas" />;
  });
  MockSigCanvas.displayName = 'MockSignatureCanvas';
  return { default: MockSigCanvas };
});

import ContractManagementPage from './ContractManagementPage';

// ── Helpers ──────────────────────────────────────────────────────

function makeJsonResponse(data: Record<string, unknown>, status = 200, ok = true) {
  return Promise.resolve({
    ok,
    status,
    headers: { get: () => 'application/json' },
    json: () => Promise.resolve(data),
  });
}

const sampleContracts = [
  { id: 'c1', contractNumber: 'TC-001', lessorName: 'White Caves LLC', tenantName: 'Ahmed Hassan', propertyType: 'Apartment', annualRent: 80000 },
  { id: 'c2', contractNumber: 'TC-002', lessorName: 'Dubai Holdings', tenantName: 'Sara Ali', propertyType: 'Villa', annualRent: 150000 },
];

// ── Tests ────────────────────────────────────────────────────────

describe('ContractManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading while fetching contracts', () => {
      mockAuthFetch.mockReturnValue(new Promise(() => {})); // never resolves
      render(<ContractManagementPage />);
      expect(screen.getByText('Loading contracts...')).toBeInTheDocument();
    });
  });

  describe('Contracts List', () => {
    it('displays contracts after successful fetch', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: sampleContracts })
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('Contract Management')).toBeInTheDocument();
      });
      expect(screen.getByText('White Caves LLC - Ahmed Hassan')).toBeInTheDocument();
      expect(screen.getByText('Dubai Holdings - Sara Ali')).toBeInTheDocument();
    });

    it('shows empty message when no contracts', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: [] })
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('No contracts created yet. Create one to get started.')).toBeInTheDocument();
      });
    });

    it('displays contract details (property type and rent)', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: sampleContracts })
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText(/Apartment.*AED 80000\/year/)).toBeInTheDocument();
        expect(screen.getByText(/Villa.*AED 150000\/year/)).toBeInTheDocument();
      });
    });

    it('shows View and Generate Signature Link buttons for each contract', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: [sampleContracts[0]] })
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('View')).toBeInTheDocument();
        expect(screen.getByText('Generate Signature Link')).toBeInTheDocument();
      });
    });

    it('shows error toast when fetch fails', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ error: 'Server error' }, 500, false)
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Server error');
      });
    });
  });

  describe('Create Contract Form', () => {
    beforeEach(() => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: [] })
      );
    });

    it('toggles create form on button click', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('Create New Contract')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Create New Contract'));
      expect(screen.getByText('Create New Tenancy Contract')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter lessor name')).toBeInTheDocument();
    });

    it('hides create form when Cancel button is clicked', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('Create New Contract')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Create New Contract'));
      expect(screen.getByText('Create New Tenancy Contract')).toBeInTheDocument();
      // Use the second Cancel button within the form
      const cancelButtons = screen.getAllByText('Cancel');
      fireEvent.click(cancelButtons[cancelButtons.length - 1]);
      expect(screen.queryByText('Create New Tenancy Contract')).not.toBeInTheDocument();
    });

    it('shows form fields: Lessor Name, Tenant Name, Property Type, Annual Rent', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));
      expect(screen.getByPlaceholderText('Enter lessor name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter tenant name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter annual rent')).toBeInTheDocument();
      // Property Type is a select - check for its options
      expect(screen.getByText('Apartment')).toBeInTheDocument();
    });

    it('updates form fields on input', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      const lessorInput = screen.getByPlaceholderText('Enter lessor name');
      fireEvent.change(lessorInput, { target: { name: 'lessorName', value: 'Test Lessor' } });
      expect(lessorInput).toHaveValue('Test Lessor');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: [] })
      );
    });

    it('shows warning when lessor name is empty', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create Contract'));
      expect(mockToast.warning).toHaveBeenCalledWith('Lessor name is required');
    });

    it('shows warning when tenant name is empty', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Test' } });
      fireEvent.click(screen.getByText('Create Contract'));
      expect(mockToast.warning).toHaveBeenCalledWith('Tenant name is required');
    });

    it('shows warning when annual rent is 0 or negative', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Lessor' } });
      fireEvent.change(screen.getByPlaceholderText('Enter tenant name'), { target: { name: 'tenantName', value: 'Tenant' } });
      fireEvent.change(screen.getByPlaceholderText('Enter annual rent'), { target: { name: 'annualRent', value: '0' } });
      fireEvent.click(screen.getByText('Create Contract'));
      expect(mockToast.warning).toHaveBeenCalledWith('Annual rent must be greater than 0');
    });
  });

  describe('Create Contract API', () => {
    beforeEach(() => {
      // First call: fetchContracts, second call: createContract
      mockAuthFetch
        .mockReturnValueOnce(makeJsonResponse({ success: true, contracts: [] }))
        .mockReturnValueOnce(makeJsonResponse({
          success: true,
          contract: { id: 'c-new', contractNumber: 'TC-003', lessorName: 'Test Lessor', tenantName: 'Test Tenant', propertyType: 'Apartment', annualRent: 100000 }
        }));
    });

    it('creates contract and shows success toast', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Test Lessor' } });
      fireEvent.change(screen.getByPlaceholderText('Enter tenant name'), { target: { name: 'tenantName', value: 'Test Tenant' } });
      fireEvent.change(screen.getByPlaceholderText('Enter annual rent'), { target: { name: 'annualRent', value: '100000' } });

      await act(async () => {
        fireEvent.click(screen.getByText('Create Contract'));
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Contract created successfully!');
      });
    });

    it('adds created contract to the list', async () => {
      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Test Lessor' } });
      fireEvent.change(screen.getByPlaceholderText('Enter tenant name'), { target: { name: 'tenantName', value: 'Test Tenant' } });
      fireEvent.change(screen.getByPlaceholderText('Enter annual rent'), { target: { name: 'annualRent', value: '100000' } });

      await act(async () => {
        fireEvent.click(screen.getByText('Create Contract'));
      });

      await waitFor(() => {
        expect(screen.getByText('Test Lessor - Test Tenant')).toBeInTheDocument();
      });
    });

    it('shows error toast when create API fails', async () => {
      mockAuthFetch
        .mockReset()
        .mockReturnValueOnce(makeJsonResponse({ success: true, contracts: [] }))
        .mockReturnValueOnce(makeJsonResponse({ error: 'Duplicate contract' }, 409, false));

      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText('Enter tenant name'), { target: { name: 'tenantName', value: 'Tenant' } });
      fireEvent.change(screen.getByPlaceholderText('Enter annual rent'), { target: { name: 'annualRent', value: '50000' } });

      await act(async () => {
        fireEvent.click(screen.getByText('Create Contract'));
      });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Duplicate contract');
      });
    });

    it('shows generic error toast when create throws', async () => {
      mockAuthFetch
        .mockReset()
        .mockReturnValueOnce(makeJsonResponse({ success: true, contracts: [] }))
        .mockRejectedValueOnce(new Error('Network fail'));

      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText('Enter tenant name'), { target: { name: 'tenantName', value: 'Tenant' } });
      fireEvent.change(screen.getByPlaceholderText('Enter annual rent'), { target: { name: 'annualRent', value: '50000' } });

      await act(async () => {
        fireEvent.click(screen.getByText('Create Contract'));
      });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Failed to create contract. Please try again.');
      });
    });
  });

  describe('UI Elements', () => {
    it('renders page header and description', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: sampleContracts })
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('Contract Management')).toBeInTheDocument();
        expect(screen.getByText('Create and manage tenancy contracts')).toBeInTheDocument();
      });
    });

    it('renders Your Contracts section', async () => {
      mockAuthFetch.mockReturnValue(
        makeJsonResponse({ success: true, contracts: sampleContracts })
      );
      render(<ContractManagementPage />);
      await waitFor(() => {
        expect(screen.getByText('Your Contracts')).toBeInTheDocument();
      });
    });
  });

  describe('Double-Submit Prevention', () => {
    it('disables button while submitting', async () => {
      // First call: fetch, second call: never-resolving create
      mockAuthFetch
        .mockReturnValueOnce(makeJsonResponse({ success: true, contracts: [] }))
        .mockReturnValueOnce(new Promise(() => {}));

      render(<ContractManagementPage />);
      await waitFor(() => screen.getByText('Create New Contract'));
      fireEvent.click(screen.getByText('Create New Contract'));

      fireEvent.change(screen.getByPlaceholderText('Enter lessor name'), { target: { name: 'lessorName', value: 'Test' } });
      fireEvent.change(screen.getByPlaceholderText('Enter tenant name'), { target: { name: 'tenantName', value: 'Tenant' } });
      fireEvent.change(screen.getByPlaceholderText('Enter annual rent'), { target: { name: 'annualRent', value: '50000' } });

      await act(async () => {
        fireEvent.click(screen.getByText('Create Contract'));
      });

      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });
  });
});
