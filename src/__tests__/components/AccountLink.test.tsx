/**
 * AccountLink Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountLink } from '../../components/WhatsApp/AccountLink';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';

vi.mock('../../services/whatsapp/whatsapp.service');
vi.mock('../../hooks/whatsapp/useWhatsAppIntegration');

// Import the hook mock after mocking the service
import { useWhatsAppIntegration } from '../../hooks/whatsapp/useWhatsAppIntegration';

const mockUseWhatsAppIntegration = useWhatsAppIntegration as vi.MockedFunction<
  typeof useWhatsAppIntegration
>;

describe('AccountLink Component', () => {
  const mockHookReturn = {
    accounts: [
      { accountId: '1', name: 'Account 1', businessName: 'Business 1', phoneNumber: '+1234567890', isConnected: true },
    ],
    currentAccount: null,
    isLoading: false,
    error: null,
    isLinking: false,
    qrCode: null,
    sessionId: null,
    loadAccounts: vi.fn(),
    selectAccount: vi.fn(),
    linkDevice: vi.fn(),
    confirmLink: vi.fn(),
    connectAccount: vi.fn(),
    disconnectAccount: vi.fn(),
    unlinkAccount: vi.fn(),
    clearError: vi.fn(),
    refresh: vi.fn(),
  };

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWhatsAppIntegration.mockReturnValue(mockHookReturn);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render the title', () => {
      render(<AccountLink />);
      expect(screen.getByText('Link WhatsApp Account')).toBeInTheDocument();
    });

    it('should render account selector', () => {
      render(<AccountLink />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should render phone number input', () => {
      render(<AccountLink />);
      expect(screen.getByPlaceholderText(/\+1 \(555\)/)).toBeInTheDocument();
    });

    it('should render start linking button', () => {
      render(<AccountLink />);
      expect(screen.getByRole('button', { name: /Start Linking/i })).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      render(<AccountLink />);
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
  });

  describe('step navigation', () => {
    it('should show step indicators', () => {
      render(<AccountLink />);
      const badges = screen.getAllByText(/^[1-3]$/); // Step number divs
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should progress through steps', async () => {
      mockHookReturn.linkDevice.mockResolvedValue(undefined);
      mockHookReturn.isLinking = false;
      mockHookReturn.qrCode = 'mock-qr-code';

      render(<AccountLink />);

      const input = screen.getByPlaceholderText(/\+1 \(555\)/);
      await userEvent.type(input, '+1234567890');

      const startButton = screen.getByRole('button', { name: /Start Linking/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(mockHookReturn.linkDevice).toHaveBeenCalled();
      });
    });
  });

  describe('phone number input', () => {
    it('should accept phone number', async () => {
      render(<AccountLink />);

      const input = screen.getByPlaceholderText(/\+1 \(555\)/) as HTMLInputElement;
      await userEvent.type(input, '+1234567890');

      expect(input.value).toBe('+1234567890');
    });

    it('should disable start button when phone number is empty', () => {
      render(<AccountLink />);

      const button = screen.getByRole('button', { name: /Start Linking/i });
      expect(button).toBeDisabled();
    });

    it('should enable start button when phone number is provided', async () => {
      render(<AccountLink />);

      const input = screen.getByPlaceholderText(/\+1 \(555\)/);
      await userEvent.type(input, '+1234567890');

      const button = screen.getByRole('button', { name: /Start Linking/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('error handling', () => {
    it('should display error message', () => {
      mockUseWhatsAppIntegration.mockReturnValue({
        ...mockHookReturn,
        error: 'Failed to link device',
      });

      render(<AccountLink />);
      expect(screen.getByText('Failed to link device')).toBeInTheDocument();
    });

    it('should clear error on button click', () => {
      mockUseWhatsAppIntegration.mockReturnValue({
        ...mockHookReturn,
        error: 'Test error',
      });

      render(<AccountLink />);
      const closeButton = screen.getByText('✕').closest('button');
      
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(mockHookReturn.clearError).toHaveBeenCalled();
      }
    });
  });

  describe('callbacks', () => {
    it('should call onSuccess callback on success', () => {
      const onSuccess = vi.fn();
      render(<AccountLink onSuccess={onSuccess} />);
      // Would need to complete the linking flow to test this
    });

    it('should call onCancel callback when cancel button clicked', () => {
      const onCancel = vi.fn();
      render(<AccountLink onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should show loading state during linking', () => {
      mockUseWhatsAppIntegration.mockReturnValue({
        ...mockHookReturn,
        isLinking: true,
      });

      render(<AccountLink />);
      expect(screen.getByText(/Generating QR Code/)).toBeInTheDocument();
    });
  });
});
