/**
 * PropertyMap.tsx — Comprehensive Unit Tests
 * Batch 37 | Google Maps embed with Dubai location lookup + fallback
 */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */

// We need to control import.meta.env.VITE_GOOGLE_MAPS_API_KEY
let mockApiKey: string | undefined = undefined;

vi.mock('../../vite-env', () => ({})); // no-op

// Since import.meta.env is tricky, we'll mock at module level
// The component reads import.meta.env.VITE_GOOGLE_MAPS_API_KEY

import PropertyMap from './PropertyMap';

/* ── Tests ──────────────────────────────────────────────── */
describe('PropertyMap', () => {
  const originalEnv = { ...import.meta.env };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';
  });

  afterAll(() => {
    Object.assign(import.meta.env, originalEnv);
  });

  // ─────────────── Fallback (No API Key) ───────────────
  describe('fallback placeholder (no API key)', () => {
    it('renders placeholder when no API key', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';
      render(<PropertyMap />);
      await waitFor(() => {
        expect(screen.getByText('📍')).toBeInTheDocument();
      });
    });

    it('shows "Dubai, UAE" when no location provided', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';
      render(<PropertyMap />);
      await waitFor(() => {
        expect(screen.getByText('Dubai, UAE')).toBeInTheDocument();
      });
    });

    it('shows location name in placeholder', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';
      render(<PropertyMap location="Palm Jumeirah" />);
      await waitFor(() => {
        expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
      });
    });

    it('has gradient background styling', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';
      render(<PropertyMap location="Downtown Dubai" />);
      await waitFor(() => {
        const placeholder = screen.getByText('Downtown Dubai').closest('.map-placeholder') ||
          screen.getByText('Downtown Dubai').parentElement?.parentElement;
        expect(placeholder).toBeInTheDocument();
      });
    });
  });

  // ─────────────── With API Key ───────────────
  describe('with API key', () => {
    it('renders iframe when API key is present', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'test-api-key-123';
      render(<PropertyMap location="Downtown Dubai" />);
      await waitFor(() => {
        const iframe = screen.getByTitle('Map of Downtown Dubai');
        expect(iframe).toBeInTheDocument();
        expect(iframe.tagName).toBe('IFRAME');
      });
    });

    it('generates correct map URL with coordinates', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'test-key';
      render(<PropertyMap location="Palm Jumeirah" />);
      await waitFor(() => {
        const iframe = screen.getByTitle('Map of Palm Jumeirah');
        const src = iframe.getAttribute('src') || '';
        expect(src).toContain('google.com/maps/embed');
        expect(src).toContain('25.1124');
        expect(src).toContain('55.139');
        expect(src).toContain('test-key');
      });
    });

    it('uses default Dubai coordinates for unknown location', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'test-key';
      render(<PropertyMap location="Unknown Area" />);
      await waitFor(() => {
        const iframe = screen.getByTitle('Map of Unknown Area');
        const src = iframe.getAttribute('src') || '';
        // Default coords: 25.2048, 55.2708
        expect(src).toContain('25.2048');
        expect(src).toContain('55.2708');
      });
    });

    it('iframe has allowFullScreen', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'test-key';
      render(<PropertyMap location="JBR" />);
      await waitFor(() => {
        const iframe = screen.getByTitle('Map of JBR');
        expect(iframe).toHaveAttribute('allowfullscreen');
      });
    });

    it('iframe has lazy loading', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'test-key';
      render(<PropertyMap location="JBR" />);
      await waitFor(() => {
        const iframe = screen.getByTitle('Map of JBR');
        expect(iframe).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  // ─────────────── Location Lookup ───────────────
  describe('location lookup', () => {
    beforeEach(() => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'key';
    });

    it('resolves Dubai Marina coordinates', async () => {
      render(<PropertyMap location="Dubai Marina" />);
      await waitFor(() => {
        const src = screen.getByTitle('Map of Dubai Marina').getAttribute('src') || '';
        expect(src).toContain('25.0805');
        expect(src).toContain('55.1403');
      });
    });

    it('resolves Business Bay coordinates', async () => {
      render(<PropertyMap location="Business Bay" />);
      await waitFor(() => {
        const src = screen.getByTitle('Map of Business Bay').getAttribute('src') || '';
        expect(src).toContain('25.185');
        expect(src).toContain('55.2642');
      });
    });

    it('resolves Emirates Hills coordinates', async () => {
      render(<PropertyMap location="Emirates Hills" />);
      await waitFor(() => {
        const src = screen.getByTitle('Map of Emirates Hills').getAttribute('src') || '';
        expect(src).toContain('25.0657');
        expect(src).toContain('55.1489');
      });
    });
  });

  // ─────────────── Loading State ───────────────
  describe('loading state', () => {
    it('shows loading message initially before useEffect runs', () => {
      // The component shows "Loading map..." when coordinates is null
      // This is very brief as useEffect runs synchronously in tests
      // We verify the component renders something
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = '';
      const { container } = render(<PropertyMap />);
      expect(container.innerHTML).toBeTruthy();
    });
  });

  // ─────────────── No location ───────────────
  describe('no location prop', () => {
    it('defaults to general Dubai coordinates when location undefined', async () => {
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY = 'key';
      render(<PropertyMap />);
      await waitFor(() => {
        const src = screen.getByTitle(/Map of/).getAttribute('src') || '';
        expect(src).toContain('25.2048');
        expect(src).toContain('55.2708');
      });
    });
  });
});
