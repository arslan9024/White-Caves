import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { PWAInstallPrompt } from './PWAInstallPrompt';

describe('PWAInstallPrompt Component', () => {
  it('renders or exports component cleanly', () => {
    expect(PWAInstallPrompt).toBeDefined();
    const { container } = render(<PWAInstallPrompt />);
    expect(container).toBeDefined();
  });
});
