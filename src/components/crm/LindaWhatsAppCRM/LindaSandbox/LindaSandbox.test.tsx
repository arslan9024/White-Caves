// FILE: src/components/crm/LindaWhatsAppCRM/LindaSandbox/LindaSandbox.test.tsx
/**
 * White Caves Real Estate LLC - AI Linda WhatsApp Sandbox Test Suite
 * Standard: Vitest + Testing Library
 */

import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { parseLeadIntent } from './LindaSandbox.logic';
import { LindaSandboxView } from './LindaSandboxView';

afterEach(() => {
  cleanup();
});

describe('parseLeadIntent NLP parser', () => {
  it('correctly detects English 4BR villa intent in DAMAC Hills 2', () => {
    const res = parseLeadIntent('Looking for 4BR villa in DAMAC Hills 2 under 3.5M');
    expect(res.bedrooms).toBe(4);
    expect(res.locationKeyword).toBe('DAMAC Hills 2');
    expect(res.isArabic).toBe(false);
  });

  it('correctly detects Arabic intent and bedroom count', () => {
    const res = parseLeadIntent('ابحث عن فيلا 5 غرف في دبي مع مسبح خاص');
    expect(res.isArabic).toBe(true);
    expect(res.bedrooms).toBe(5);
  });

  it('correctly detects viewing appointment booking request', () => {
    const res = parseLeadIntent('Can we schedule a VIP viewing tomorrow?');
    expect(res.wantsViewing).toBe(true);
  });
});

describe('LindaSandboxView mounting and interactive execution', () => {
  it('renders simulator root container, title, and initial greeting', () => {
    render(<LindaSandboxView />);
    expect(screen.getByTestId('linda-sandbox-root')).toBeInTheDocument();
    expect(screen.getByText(/AI Linda · WhatsApp Lead Concierge/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am AI Linda/i)).toBeInTheDocument();
  });

  it('allows user to send message and triggers simulated response', async () => {
    render(<LindaSandboxView />);
    const input = screen.getByTestId('linda-sandbox-input');
    const sendBtn = screen.getByTestId('linda-sandbox-send-btn');

    fireEvent.change(input, { target: { value: 'Schedule a VIP viewing' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText('Schedule a VIP viewing')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/VIP Viewing Confirmed/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
