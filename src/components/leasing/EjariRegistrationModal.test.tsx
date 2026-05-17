import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EjariRegistrationModal } from './EjariRegistrationModal';

// ── helpers ──────────────────────────────────────────────────────────────────
const mockProperty = {
  id: 'prop-10',
  title: 'Jumeirah Studio',
  unitNumber: 'D-3',
};

const mockLocalStorage = () => {
  vi.mocked(global.localStorage.getItem).mockImplementation((key: string) =>
    key === 'token' ? 'mock-jwt' : null
  );
};

// ── suite ─────────────────────────────────────────────────────────────────────
describe('EjariRegistrationModal', () => {
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
  it('renders modal title', () => {
    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    expect(screen.getByText(/Dubai DLD: Ejari Registration/i)).toBeInTheDocument();
  });

  // ── 2 ──────────────────────────────────────────────────────────────────────
  it('Save Ejari button is disabled when no ejariNumber entered', () => {
    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    const btn = screen.getByRole('button', { name: /Save Ejari/i });
    expect(btn).toBeDisabled();
  });

  // ── 3 ──────────────────────────────────────────────────────────────────────
  it('enables Save Ejari button once ejariNumber is typed', () => {
    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );
    const input = screen.getByPlaceholderText(/1234567890/i);
    fireEvent.change(input, { target: { value: '9876543210' } });
    const btn = screen.getByRole('button', { name: /Save Ejari/i });
    expect(btn).not.toBeDisabled();
  });

  // ── 4 ──────────────────────────────────────────────────────────────────────
  it('calls onSuccess on API ok — no error banner shown', async () => {
    const onSuccess = vi.fn();
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 200 }) as Response);

    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={onSuccess} />
    );

    fireEvent.change(screen.getByPlaceholderText(/1234567890/i), {
      target: { value: '1234567890' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Ejari/i }));

    await screen.findByRole('button', { name: /Save Ejari/i }); // re-enabled after

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // ── 5 ──────────────────────────────────────────────────────────────────────
  it('shows role="alert" with server message on API error', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'DLD system offline' }), { status: 500 }) as Response
    );

    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    fireEvent.change(screen.getByPlaceholderText(/1234567890/i), {
      target: { value: '1234567890' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Ejari/i }));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Error registering Ejari');
    expect(banner).toHaveAttribute('data-testid', 'ejari-error');
  });

  // ── 6 ──────────────────────────────────────────────────────────────────────
  it('shows generic error on network throw', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('timeout'));

    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    fireEvent.change(screen.getByPlaceholderText(/1234567890/i), {
      target: { value: '1234567890' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Ejari/i }));

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Error registering Ejari');
  });

  // ── 7 ──────────────────────────────────────────────────────────────────────
  it('never calls window.alert()', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('boom'));

    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    fireEvent.change(screen.getByPlaceholderText(/1234567890/i), {
      target: { value: '0000000000' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Ejari/i }));
    await screen.findByRole('alert');

    expect(alertSpy).not.toHaveBeenCalled();
  });

  // ── 8 ──────────────────────────────────────────────────────────────────────
  it('data-testid "ejari-error" is present on error', async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Conflict' }), { status: 409 }) as Response
    );

    render(
      <EjariRegistrationModal property={mockProperty} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    fireEvent.change(screen.getByPlaceholderText(/1234567890/i), {
      target: { value: '1111111111' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Ejari/i }));

    const banner = await screen.findByTestId('ejari-error');
    expect(banner).toBeInTheDocument();
  });
});
