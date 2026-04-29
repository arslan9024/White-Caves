/**
 * useWhatsAppIntegration Hook
 * 
 * Main hook for managing WhatsApp integration state
 * Handles account management, device linking, and connection state
 */

import { useState, useCallback, useEffect } from 'react';
import { whatsappService, Account } from '../../services/whatsapp/whatsapp.service';

interface UseWhatsAppIntegrationReturn {
  accounts: Account[];
  currentAccount: Account | null;
  isLoading: boolean;
  error: string | null;
  isLinking: boolean;
  qrCode: string | null;
  sessionId: string | null;
  
  // Account methods
  loadAccounts: () => Promise<void>;
  selectAccount: (accountId: string) => void;
  linkDevice: (accountId: string, phoneNumber: string) => Promise<void>;
  confirmLink: (sessionId: string, authToken: string, phoneNumber: string) => Promise<void>;
  connectAccount: (accountId: string) => Promise<void>;
  disconnectAccount: (accountId: string) => Promise<void>;
  unlinkAccount: (accountId: string) => Promise<void>;
  
  // Utility methods
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useWhatsAppIntegration = (): UseWhatsAppIntegrationReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Load all accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await whatsappService.listAccounts();
      setAccounts(response.data.accounts);
      
      // Set first account as current if available
      if (response.data.accounts.length > 0) {
        setCurrentAccount(response.data.accounts[0]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load accounts';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectAccount = useCallback((accountId: string) => {
    const account = accounts.find(a => a.accountId === accountId);
    if (account) {
      setCurrentAccount(account);
    }
  }, [accounts]);

  const linkDevice = useCallback(async (accountId: string, phoneNumber: string) => {
    try {
      setIsLinking(true);
      setError(null);
      
      const response = await whatsappService.initiateDeviceLink(accountId, phoneNumber);
      setQrCode(response.data.qrCode);
      setSessionId(response.data.sessionId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to link device';
      setError(message);
      throw err;
    } finally {
      setIsLinking(false);
    }
  }, []);

  const confirmLink = useCallback(async (sessionId: string, authToken: string, phoneNumber: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await whatsappService.confirmDeviceLink(sessionId, authToken, phoneNumber);
      
      // Clear QR code and reload accounts
      setQrCode(null);
      setSessionId(null);
      await loadAccounts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm link';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadAccounts]);

  const connectAccount = useCallback(async (accountId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await whatsappService.connectAccount(accountId);
      
      // Update account in list
      setAccounts(prev =>
        prev.map(a => (a.accountId === accountId ? response.data : a))
      );
      
      if (currentAccount?.accountId === accountId) {
        setCurrentAccount(response.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect account';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const disconnectAccount = useCallback(async (accountId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await whatsappService.disconnectAccount(accountId);
      
      // Update account in list
      setAccounts(prev =>
        prev.map(a => (a.accountId === accountId ? response.data : a))
      );
      
      if (currentAccount?.accountId === accountId) {
        setCurrentAccount(response.data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect account';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const unlinkAccount = useCallback(async (accountId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await whatsappService.unlinkAccount(accountId);
      
      // Remove from list and reload
      setAccounts(prev => prev.filter(a => a.accountId !== accountId));
      if (currentAccount?.accountId === accountId) {
        setCurrentAccount(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unlink account';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    await loadAccounts();
  }, [loadAccounts]);

  return {
    accounts,
    currentAccount,
    isLoading,
    error,
    isLinking,
    qrCode,
    sessionId,
    loadAccounts,
    selectAccount,
    linkDevice,
    confirmLink,
    connectAccount,
    disconnectAccount,
    unlinkAccount,
    clearError,
    refresh,
  };
};
