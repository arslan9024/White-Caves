import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrakheesiPermitRenewalRadar from './TrakheesiPermitRenewalRadar';

describe('TrakheesiPermitRenewalRadar Component', () => {
  it('renders header, statutory tag, and metrics deck properly', () => {
    render(<TrakheesiPermitRenewalRadar />);

    expect(screen.getByTestId('trakheesi-permit-renewal-radar')).toBeInTheDocument();
    expect(screen.getByText(/DLD Trakheesi Permit Expiry & Auto-Renewal Radar/i)).toBeInTheDocument();
    expect(screen.getByText(/RERA 180-Day Mandate/i)).toBeInTheDocument();
    expect(screen.getByTestId('metric-critical-count')).toHaveTextContent('2');
  });

  it('filters permits by type pill correctly', () => {
    render(<TrakheesiPermitRenewalRadar />);

    const brokerPill = screen.getByTestId('filter-pill-broker-card');
    fireEvent.click(brokerPill);

    expect(screen.getByText(/Elena Rostova/i)).toBeInTheDocument();
    expect(screen.queryByText(/Palm Jumeirah Signature Villa/i)).not.toBeInTheDocument();
  });

  it('searches permits by permit number or keyword', () => {
    render(<TrakheesiPermitRenewalRadar />);

    const searchInput = screen.getByTestId('trakheesi-search-input');
    fireEvent.change(searchInput, { target: { value: 'TRK-2026-444830' } });

    expect(screen.getByText('White Caves Real Estate LLC')).toBeInTheDocument();
    expect(screen.queryByText('Downtown Burj Crown Penthouse')).not.toBeInTheDocument();
  });

  it('triggers renewal queue action and displays notification toast', () => {
    const handleRenewal = vi.fn();
    render(<TrakheesiPermitRenewalRadar onTriggerRenewal={handleRenewal} />);

    const renewBtn = screen.getByTestId('btn-renew-tp-01');
    fireEvent.click(renewBtn);

    expect(handleRenewal).toHaveBeenCalledWith('tp-01', 1020);
    expect(screen.getByTestId('trakheesi-alert-banner')).toBeInTheDocument();
    expect(screen.getByText(/DLD Trakheesi renewal queued for tp-01/i)).toBeInTheDocument();
  });

  it('harmonizes with DLD gateway on sync button click', () => {
    const handleSync = vi.fn();
    render(<TrakheesiPermitRenewalRadar onSyncDldPortal={handleSync} />);

    const syncBtn = screen.getByTestId('btn-sync-trakheesi-gateway');
    fireEvent.click(syncBtn);

    expect(handleSync).toHaveBeenCalled();
    expect(screen.getByText(/Successfully harmonized all permits with DLD Trakheesi Gateway API/i)).toBeInTheDocument();
  });
});
