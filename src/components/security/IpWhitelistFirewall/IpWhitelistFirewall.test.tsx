import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { IpWhitelistFirewall } from './IpWhitelistFirewall';

describe('IpWhitelistFirewall Component', () => {
  it('renders zero-trust IP whitelist firewall and active rule list', () => {
    render(<IpWhitelistFirewall />);
    expect(screen.getByTestId('ip-whitelist-firewall')).toBeDefined();
    expect(screen.getByText(/Zero-Trust Administrative IP Whitelist Firewall/i)).toBeDefined();
    expect(screen.getByText(/ACTIVE DEFENSE/i)).toBeDefined();
    expect(screen.getByText(/White Caves HQ \(Downtown Office\)/i)).toBeDefined();
    expect(screen.getByText('194.187.168.22')).toBeDefined();
  });
});
