import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePwaInstallPromptLogic } from './PwaInstallPromptModal.logic';

describe('PwaInstallPromptModal.logic', () => {
  const storage: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => storage[k] || null,
    setItem: (k: string, v: string) => {
      storage[k] = v;
    },
    removeItem: (k: string) => {
      delete storage[k];
    },
    clear: () => {
      for (const k in storage) delete storage[k];
    },
  });

  it('initializes with install state', () => {
    const { result } = renderHook(() => usePwaInstallPromptLogic());

    expect(typeof result.current.canInstall).toBe('boolean');
    expect(typeof result.current.isInstalled).toBe('boolean');
    expect(typeof result.current.isDismissed).toBe('boolean');
  });

  it('handles dismiss action by persisting key to localStorage', () => {
    const { result } = renderHook(() => usePwaInstallPromptLogic());

    act(() => {
      result.current.handleDismiss();
    });

    expect(result.current.isDismissed).toBe(true);
    expect(localStorage.getItem('wc_pwa_install_dismissed')).toBe('1');
  });
});
