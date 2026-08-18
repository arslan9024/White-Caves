/**
 * PwaInstallPromptModal.test.tsx — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PwaInstallPromptModal } from './PwaInstallPromptModal';

vi.mock('./logic/PwaInstallPromptModal.logic', () => ({
  usePwaInstallPromptLogic: vi.fn(),
}));

import { usePwaInstallPromptLogic } from './logic/PwaInstallPromptModal.logic';

const mockHook = usePwaInstallPromptLogic as ReturnType<typeof vi.fn>;

describe('PwaInstallPromptModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders nothing when canInstall is false', () => {
    mockHook.mockReturnValue({ canInstall: false, handleInstall: vi.fn(), handleDismiss: vi.fn() });
    const { container } = render(<PwaInstallPromptModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when canInstall is true', () => {
    mockHook.mockReturnValue({ canInstall: true, handleInstall: vi.fn(), handleDismiss: vi.fn() });
    render(<PwaInstallPromptModal />);
    expect(screen.getByTestId('pwa-install-modal')).toBeDefined();
    expect(screen.getByText(/Install White Caves CRM/i)).toBeDefined();
  });

  it('calls handleInstall on button click', () => {
    const handleInstall = vi.fn();
    mockHook.mockReturnValue({ canInstall: true, handleInstall, handleDismiss: vi.fn() });
    render(<PwaInstallPromptModal />);
    fireEvent.click(screen.getByText(/Install App/i));
    expect(handleInstall).toHaveBeenCalled();
  });

  it('calls handleDismiss on "Not now"', () => {
    const handleDismiss = vi.fn();
    mockHook.mockReturnValue({ canInstall: true, handleInstall: vi.fn(), handleDismiss });
    render(<PwaInstallPromptModal />);
    fireEvent.click(screen.getByText(/Not now/i));
    expect(handleDismiss).toHaveBeenCalled();
  });
});
