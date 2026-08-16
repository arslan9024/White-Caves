import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PwaInstallAppBanner } from './PwaInstallAppBanner';

describe('PwaInstallAppBanner Component', () => {
  it('renders PWA install app banner and handles dismiss', () => {
    render(<PwaInstallAppBanner />);
    expect(screen.getByTestId('pwa-install-app-banner')).toBeDefined();
    expect(screen.getByText(/White Caves Sovereign Mobile App/i)).toBeDefined();
    expect(screen.getByText(/📲 Install App/i)).toBeDefined();

    // Dismiss banner
    const dismissBtn = screen.getByText('Dismiss');
    fireEvent.click(dismissBtn);
    expect(screen.queryByTestId('pwa-install-app-banner')).toBeNull();
  });
});
