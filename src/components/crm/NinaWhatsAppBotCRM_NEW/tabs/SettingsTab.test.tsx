import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NinaSettingsTab } from './SettingsTab';

// ── helpers ──────────────────────────────────────────────────────────────────
const makeData = () => ({
  showSettings: true,
  setShowSettings: vi.fn(),
});

// ── suite ─────────────────────────────────────────────────────────────────────
describe('NinaSettingsTab', () => {
  let alertSpy: ReturnType<typeof vi.spyOn>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock fetch to avoid jsdom "Invalid URL" for relative paths
    fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  // ── 1 ──────────────────────────────────────────────────────────────────────
  it('renders Settings heading', () => {
    render(<NinaSettingsTab data={makeData()} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  // ── 2 ──────────────────────────────────────────────────────────────────────
  it('renders Save Settings button', () => {
    render(<NinaSettingsTab data={makeData()} />);
    expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
  });

  // ── 3 ──────────────────────────────────────────────────────────────────────
  it('no saved banner on initial render', () => {
    render(<NinaSettingsTab data={makeData()} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  // ── 4 ──────────────────────────────────────────────────────────────────────
  it('shows role="status" saved banner on Save click', async () => {
    render(<NinaSettingsTab data={makeData()} />);
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));

    const banner = await screen.findByRole('status');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('Nina settings saved');
    expect(banner).toHaveAttribute('data-testid', 'nina-settings-saved');
  });

  // ── 5 ──────────────────────────────────────────────────────────────────────
  it('saved banner auto-hides after 4 seconds', async () => {
    vi.useFakeTimers();
    render(<NinaSettingsTab data={makeData()} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));
      // Flush the fetch promise
      await fetchMock.mock.results[0]?.value;
    });

    expect(screen.getByRole('status')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4100);
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  // ── 6 ──────────────────────────────────────────────────────────────────────
  it('never calls window.alert()', () => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<NinaSettingsTab data={makeData()} />);
    fireEvent.click(screen.getByRole('button', { name: /Save Settings/i }));
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
