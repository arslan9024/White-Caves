import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTotp2faSetupLogic, DUMMY_SECRET, BACKUP_CODES } from './Totp2faSetupCard.logic';

describe('useTotp2faSetupLogic Hook', () => {
  it('initializes with default secret and empty token', () => {
    const { result } = renderHook(() => useTotp2faSetupLogic());
    expect(result.current.token).toBe('');
    expect(result.current.isVerified).toBe(false);
    expect(result.current.secretKey).toBe(DUMMY_SECRET);
    expect(result.current.backupCodes).toEqual(BACKUP_CODES);
  });

  it('rejects invalid token length and sets error message', () => {
    const { result } = renderHook(() => useTotp2faSetupLogic());
    act(() => {
      result.current.setToken('123');
    });
    act(() => {
      result.current.verifyToken();
    });
    expect(result.current.isVerified).toBe(false);
    expect(result.current.errorMessage).toBe('Please enter a valid 6-digit TOTP security code.');
  });

  it('verifies valid 6-digit TOTP code successfully', () => {
    const { result } = renderHook(() => useTotp2faSetupLogic());
    act(() => {
      result.current.setToken('123456');
    });
    act(() => {
      result.current.verifyToken();
    });
    expect(result.current.isVerified).toBe(true);
    expect(result.current.errorMessage).toBe('');
  });
});
