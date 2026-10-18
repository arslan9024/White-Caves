import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../components/auth/AuthModal', () => ({
  default: ({ mode, presentation }: { mode: string; presentation: string }) => (
    <div data-testid="shared-auth-view" data-mode={mode} data-presentation={presentation} />
  ),
}));

import SignInPage from './SignInPage';

const renderAtRoute = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignInPage />} />
        <Route path="/forgot-password" element={<SignInPage />} />
        <Route path="/reset-password" element={<SignInPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('SignInPage route adapter', () => {
  it('renders the shared auth view in sign-in page mode', () => {
    renderAtRoute('/signin');
    expect(screen.getByTestId('shared-auth-view')).toHaveAttribute('data-mode', 'signin');
    expect(screen.getByTestId('shared-auth-view')).toHaveAttribute('data-presentation', 'page');
  });

  it('selects signup mode from direct route navigation', () => {
    renderAtRoute('/signup');
    expect(screen.getByTestId('shared-auth-view')).toHaveAttribute('data-mode', 'signup');
  });

  it.each(['/forgot-password', '/reset-password'])(
    'keeps recovery routes on the shared auth page for %s',
    path => {
      renderAtRoute(path);
      expect(screen.getByTestId('shared-auth-view')).toBeInTheDocument();
      expect(screen.getByTestId('shared-auth-view')).toHaveAttribute('data-presentation', 'page');
    }
  );
});
