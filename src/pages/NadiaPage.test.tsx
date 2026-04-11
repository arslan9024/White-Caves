/**
 * NadiaPage.test.tsx — Smoke tests for NADIA CRM page
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock the NADIADashboard component (lazy-loaded)
vi.mock('@/components/nadia', () => ({
  NADIADashboard: ({ conversationId }: { conversationId?: string }) => (
    <div data-testid="nadia-dashboard">
      NADIA Dashboard{conversationId ? ` - ${conversationId}` : ''}
    </div>
  ),
}));

import NadiaPage from './NadiaPage';

describe('NadiaPage', () => {
  it('renders NADIA dashboard inside Suspense', () => {
    render(<NadiaPage />);
    expect(screen.getByTestId('nadia-dashboard')).toBeTruthy();
    expect(screen.getByText('NADIA Dashboard')).toBeTruthy();
  });

  it('accepts conversationId prop without crashing', () => {
    const { container } = render(<NadiaPage conversationId="conv-123" />);
    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId('nadia-dashboard')).toBeTruthy();
  });

  it('renders without conversationId prop', () => {
    render(<NadiaPage />);
    expect(screen.getByText('NADIA Dashboard')).toBeTruthy();
  });

  it('wraps content in styled container', () => {
    const { container } = render(<NadiaPage />);
    // The PageContainer styled component wraps the content
    const wrapper = container.firstChild;
    expect(wrapper).toBeTruthy();
  });
});
