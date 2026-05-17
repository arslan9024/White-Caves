/**
 * useWhatsAppIntegration Hook Tests
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useWhatsAppIntegration } from '../../hooks/whatsapp/useWhatsAppIntegration';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';

// Mock the service
vi.mock('../../services/whatsapp/whatsapp.service');

describe('useWhatsAppIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: listAccounts returns empty list so the mount effect doesn't set error
    vi.mocked(whatsappService.listAccounts).mockResolvedValue({
      success: true,
      data: { accounts: [], count: 0 },
    });
  });

  describe('initialization', () => {
    it('should initialize with empty state', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      // Wait for the mount-time loadAccounts() effect to settle
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.accounts).toEqual([]);
      expect(result.current.currentAccount).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load accounts on mount', async () => {
      const mockAccounts = [
        { accountId: '1', name: 'Account 1', isConnected: true },
      ];

      (whatsappService.listAccounts as vi.Mock).mockResolvedValue({
        data: { accounts: mockAccounts },
      });

      const { result } = renderHook(() => useWhatsAppIntegration());

      await waitFor(() => {
        expect(result.current.accounts).toHaveLength(1);
      });

      expect(result.current.accounts[0].name).toBe('Account 1');
    });
  });

  describe('linkDevice', () => {
    it('should initiate device linking', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      (whatsappService.initiateDeviceLink as vi.Mock).mockResolvedValue({
        data: { qrCode: 'qr-data', sessionId: 'session-123' },
      });

      await act(async () => {
        await result.current.linkDevice('account-1', '+1234567890');
      });

      expect(result.current.qrCode).toBe('qr-data');
      expect(result.current.sessionId).toBe('session-123');
    });

    it('should handle linking errors', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      const error = new Error('Link failed');
      (whatsappService.initiateDeviceLink as vi.Mock).mockRejectedValue(
        error
      );

      await act(async () => {
        try {
          await result.current.linkDevice('account-1', '+1234567890');
        } catch (e) {
          // Error is expected
        }
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('confirmLink', () => {
    it('should confirm device link', async () => {
      const mockAccount = { accountId: '1', name: 'Account 1', isConnected: true };

      (whatsappService.listAccounts as vi.Mock).mockResolvedValue({
        data: { accounts: [mockAccount] },
      });

      (whatsappService.confirmDeviceLink as vi.Mock).mockResolvedValue({
        data: mockAccount,
      });

      const { result } = renderHook(() => useWhatsAppIntegration());

      await act(async () => {
        await result.current.confirmLink('session-123', '123456', '+1234567890');
      });

      await waitFor(() => {
        expect(result.current.qrCode).toBeNull();
      });
    });
  });

  describe('connectAccount', () => {
    it('should connect an account', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      const connectedAccount = {
        accountId: '1',
        name: 'Account 1',
        isConnected: true,
      };

      (whatsappService.connectAccount as vi.Mock).mockResolvedValue({
        data: connectedAccount,
      });

      await act(async () => {
        await result.current.connectAccount('account-1');
      });

      expect(whatsappService.connectAccount).toHaveBeenCalledWith('account-1');
    });
  });

  describe('disconnectAccount', () => {
    it('should disconnect an account', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      const disconnectedAccount = {
        accountId: '1',
        name: 'Account 1',
        isConnected: false,
      };

      (whatsappService.disconnectAccount as vi.Mock).mockResolvedValue({
        data: disconnectedAccount,
      });

      await act(async () => {
        await result.current.disconnectAccount('account-1');
      });

      expect(whatsappService.disconnectAccount).toHaveBeenCalledWith('account-1');
    });
  });

  describe('unlinkAccount', () => {
    it('should unlink an account', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      (whatsappService.unlinkAccount as vi.Mock).mockResolvedValue({});

      await act(async () => {
        await result.current.unlinkAccount('account-1');
      });

      expect(whatsappService.unlinkAccount).toHaveBeenCalledWith('account-1');
    });
  });

  describe('error handling', () => {
    it('should clear errors', async () => {
      const { result } = renderHook(() => useWhatsAppIntegration());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Trigger an error
      (whatsappService.listAccounts as vi.Mock).mockRejectedValue(
        new Error('Load failed')
      );

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
