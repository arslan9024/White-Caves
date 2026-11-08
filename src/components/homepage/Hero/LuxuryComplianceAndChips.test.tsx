import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LuxuryComplianceTrustBadge } from './LuxuryComplianceTrustBadge';
import { DeveloperFilterQuickChips } from './DeveloperFilterQuickChips';

describe('LuxuryComplianceTrustBadge (Targets T-0002 & T-0003)', () => {
  it('renders Bayut TruCheck badge and permit number', () => {
    render(<LuxuryComplianceTrustBadge trakheesiPermit="TRAK-990011" />);
    expect(screen.getByText('TruCheck™ Verified')).toBeInTheDocument();
    expect(screen.getByText('TRAK-990011')).toBeInTheDocument();
  });

  it('reveals DLD QR code inspection popover on hover', () => {
    render(<LuxuryComplianceTrustBadge trakheesiPermit="TRAK-990011" />);
    const permitButton = screen.getByRole('button', { name: /Verify DLD Trakheesi Permit/i });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.mouseEnter(permitButton.parentElement!);
    expect(screen.getByRole('dialog', { name: /DLD Trakheesi Permit Details/i })).toBeInTheDocument();
    expect(screen.getByText(/Dubai Law No. 7\/2013/i)).toBeInTheDocument();

    fireEvent.mouseLeave(permitButton.parentElement!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('DeveloperFilterQuickChips (Target T-0004)', () => {
  it('renders developer quick-chips and triggers onSelectDeveloper', () => {
    const handleSelect = vi.fn();
    render(
      <DeveloperFilterQuickChips
        developers={['Emaar', 'DAMAC', 'Sobha']}
        selectedDeveloper="DAMAC"
        onSelectDeveloper={handleSelect}
      />
    );

    const damacBtn = screen.getByRole('button', { name: 'DAMAC' });
    expect(damacBtn).toBeInTheDocument();
    expect(damacBtn.className).toContain('from-red-600');

    const emaarBtn = screen.getByRole('button', { name: 'Emaar' });
    fireEvent.click(emaarBtn);
    expect(handleSelect).toHaveBeenCalledWith('Emaar');
  });
});
