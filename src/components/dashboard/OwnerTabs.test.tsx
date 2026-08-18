/**
 * OwnerTabs.test.tsx — Smoke tests for all 5 owner/admin dashboard sub-tabs
 * ──────────────────────────────────────────────────────────────────────────
 * OwnerOverview, BusinessAnalytics, WhatsAppDashboard, SystemHealth, SystemSettings
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import {
  OwnerOverview,
  BusinessAnalytics,
  WhatsAppDashboard,
  SystemHealth,
  SystemSettings,
} from './OwnerTabs';

const mockAuthFetch = vi.fn() as Mock;
vi.mock('../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

function jsonRes(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('OwnerTabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthFetch.mockResolvedValue(jsonRes({ success: true, data: 0, count: 0 }));
  });

  // ── OwnerOverview ──────────────────────────────────────────────────
  describe('OwnerOverview', () => {
    it('renders heading', async () => {
      render(<OwnerOverview />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Business Overview/i));
    });

    it('renders subtitle with company name', async () => {
      render(<OwnerOverview />);
      await waitFor(() => expect(screen.getByText(/White Caves Real Estate/i)).toBeInTheDocument());
    });

    it('renders AI assistant cards', async () => {
      render(<OwnerOverview />);
      await waitFor(() => {
        expect(screen.getByText(/Nadia/i)).toBeInTheDocument();
        expect(screen.getByText(/Nina/i)).toBeInTheDocument();
        expect(screen.getByText(/Linda/i)).toBeInTheDocument();
      });
    });

    it('calls count APIs', async () => {
      render(<OwnerOverview />);
      await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
      const urls = mockAuthFetch.mock.calls.map((c: unknown[]) => c[0] as string);
      expect(urls.some(u => u.includes('/api/properties'))).toBe(true);
      expect(urls.some(u => u.includes('/api/leads'))).toBe(true);
    });
  });

  // ── BusinessAnalytics ──────────────────────────────────────────────
  describe('BusinessAnalytics', () => {
    it('renders heading', async () => {
      render(<BusinessAnalytics />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Business Analytics/i));
    });

    it('displays analytic stat cards', async () => {
      render(<BusinessAnalytics />);
      await waitFor(() => expect(screen.getByText(/Total Revenue/i)).toBeInTheDocument());
    });
  });

  // ── WhatsAppDashboard ──────────────────────────────────────────────
  describe('WhatsAppDashboard', () => {
    it('renders heading', async () => {
      render(<WhatsAppDashboard />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/WhatsApp Integration/i));
    });

    it('renders bot cards (hardcoded, no API)', () => {
      render(<WhatsAppDashboard />);
      expect(screen.getByText(/Nadia/i)).toBeInTheDocument();
      expect(screen.getByText(/Nina/i)).toBeInTheDocument();
      expect(screen.getByText(/Linda/i)).toBeInTheDocument();
    });
  });

  // ── SystemHealth ───────────────────────────────────────────────────
  describe('SystemHealth', () => {
    it('renders heading', async () => {
      render(<SystemHealth />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/System Health/i));
    });

    it('renders service status cards', async () => {
      render(<SystemHealth />);
      await waitFor(() => {
        expect(screen.getByText(/Express Server/i)).toBeInTheDocument();
        expect(screen.getByText(/MongoDB \/ Prisma/i)).toBeInTheDocument();
        expect(screen.getByText(/Firebase Auth/i)).toBeInTheDocument();
      });
    });

    it('renders environment info', async () => {
      render(<SystemHealth />);
      await waitFor(() => {
        expect(screen.getByText(/Node\.js/i)).toBeInTheDocument();
        expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
      });
    });
  });

  // ── SystemSettings ─────────────────────────────────────────────────
  describe('SystemSettings', () => {
    it('renders heading', async () => {
      render(<SystemSettings />);
      await waitFor(() => expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/System Settings/i));
    });

    it('renders form sections (no API call)', () => {
      render(<SystemSettings />);
      expect(screen.getByText(/Organization/i)).toBeInTheDocument();
    });

    it('renders security section', () => {
      render(<SystemSettings />);
      expect(screen.getByText(/Security/i)).toBeInTheDocument();
    });
  });
});
