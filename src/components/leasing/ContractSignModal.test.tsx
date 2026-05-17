import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ContractSignModal } from './ContractSignModal';

// ── helpers ──────────────────────────────────────────────────────────────────
const propertyWithContract = {
  id: 'prop-1',
  title: 'Palm Villa',
  unitNumber: 'B-12',
  documents: ['uploads/contract_B-12.pdf'],
};

const propertyWithoutContract = {
  id: 'prop-2',
  title: 'Marina Apt',
  unitNumber: 'C-5',
  documents: [],
};

const mockLocalStorage = () => {
  vi.mocked(global.localStorage.getItem).mockImplementation((key: string) =>
    key === 'token' ? 'mock-jwt' : null
  );
};

// ── suite ─────────────────────────────────────────────────────────────────────
describe('ContractSignModal', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(window, 'fetch');
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockLocalStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── 1 ──────────────────────────────────────────────────────────────────────
  it('renders modal title with unit number', () => {
    render(
      <ContractSignModal
        property={propertyWithContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );
    expect(screen.getByText(/E-Sign Contract: B-12/i)).toBeInTheDocument();
  });

  // ── 2 ──────────────────────────────────────────────────────────────────────
  it('shows "being generated" message when property has no contract document', () => {
    render(
      <ContractSignModal
        property={propertyWithoutContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );
    expect(screen.getByText(/contract is being generated/i)).toBeInTheDocument();
  });

  // ── 3 ──────────────────────────────────────────────────────────────────────
  it('disables E-Sign button when no contract document', () => {
    render(
      <ContractSignModal
        property={propertyWithoutContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );
    const btn = screen.getByRole('button', { name: /E-Sign Document/i });
    expect(btn).toBeDisabled();
  });

  // ── 4 ──────────────────────────────────────────────────────────────────────
  it('calls onSignSuccess and shows no error when API returns ok', async () => {
    const onSignSuccess = vi.fn();
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 200 }) as Response);

    render(
      <ContractSignModal
        property={propertyWithContract}
        onClose={vi.fn()}
        onSignSuccess={onSignSuccess}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /E-Sign Document/i }));
    await screen.findByRole('button', { name: /E-Sign Document/i }); // re-enabled after

    expect(onSignSuccess).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── 5 ──────────────────────────────────────────────────────────────────────
  it('shows role="alert" ErrorBanner on API error', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Signature server offline' }), {
        status: 500,
      }) as Response
    );

    render(
      <ContractSignModal
        property={propertyWithContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /E-Sign Document/i }));
    const banner = await screen.findByRole('alert');

    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('Error signing contract');
    expect(banner).toHaveAttribute('data-testid', 'contract-sign-error');
  });

  // ── 6 ──────────────────────────────────────────────────────────────────────
  it('shows generic error banner on network throw', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network down'));

    render(
      <ContractSignModal
        property={propertyWithContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /E-Sign Document/i }));
    const banner = await screen.findByRole('alert');

    expect(banner).toHaveTextContent('Error signing contract');
  });

  // ── 7 ──────────────────────────────────────────────────────────────────────
  it('never calls window.alert()', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('boom'));

    render(
      <ContractSignModal
        property={propertyWithContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /E-Sign Document/i }));
    await screen.findByRole('alert');

    expect(alertSpy).not.toHaveBeenCalled();
  });

  // ── 8 ──────────────────────────────────────────────────────────────────────
  it('data-testid "contract-sign-error" is present on error', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Auth failed' }), { status: 401 }) as Response
    );

    render(
      <ContractSignModal
        property={propertyWithContract}
        onClose={vi.fn()}
        onSignSuccess={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /E-Sign Document/i }));
    const banner = await screen.findByTestId('contract-sign-error');
    expect(banner).toBeInTheDocument();
  });
});
