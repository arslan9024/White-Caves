/**
 * TenantScreeningPage — Unit Tests
 * Tests: render, tab switching, screening checklist, pending applications,
 * guidelines/red flags, best practices, checkbox interaction, progress bars
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import TenantScreeningPage from './TenantScreeningPage';

// ═══════════════════════════════════════════════════════════════════

describe('TenantScreeningPage', () => {
  // ── Render & Header ─────────────────────────────────────────────
  it('renders the page header', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Tenant Screening')).toBeDefined();
    expect(screen.getByText('Verify tenant credentials and manage applications')).toBeDefined();
  });

  it('renders all three tabs', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Screening Checklist')).toBeDefined();
    expect(screen.getByText('Pending Applications')).toBeDefined();
    expect(screen.getByText('Guidelines')).toBeDefined();
  });

  // ── Screening Checklist Tab (default) ──────────────────────────
  it('shows screening checklist tab by default', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Identity Verification')).toBeDefined();
    expect(screen.getByText('Employment & Income')).toBeDefined();
    expect(screen.getByText('Rental History')).toBeDefined();
  });

  it('renders all identity verification items', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Valid Emirates ID')).toBeDefined();
    expect(screen.getByText('Valid Passport with UAE Visa')).toBeDefined();
    expect(screen.getByText(/Visa validity check/i)).toBeDefined();
  });

  it('renders all employment & income items', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText(/Salary Certificate/i)).toBeDefined();
    expect(screen.getByText('Employment Contract')).toBeDefined();
    expect(screen.getByText(/Bank Statements/i)).toBeDefined();
  });

  it('renders all rental history items', () => {
    render(<TenantScreeningPage />);
    expect(screen.getByText('Previous landlord reference')).toBeDefined();
    expect(screen.getByText('Previous tenancy contract')).toBeDefined();
    expect(screen.getByText(/No rental dispute history/i)).toBeDefined();
  });

  it('shows Required badges on required items', () => {
    render(<TenantScreeningPage />);
    const requiredBadges = screen.getAllByText('Required');
    // Identity: 3 required, Employment: 2 required (Certificate + Bank), Rental: 1 required (RDC)
    expect(requiredBadges.length).toBe(6);
  });

  it('renders checkboxes for all checklist items', () => {
    render(<TenantScreeningPage />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 3 identity + 3 employment + 3 rental = 9
    expect(checkboxes.length).toBe(9);
  });

  it('toggles checkbox state', () => {
    render(<TenantScreeningPage />);
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0] as HTMLInputElement;
    
    expect(firstCheckbox.checked).toBe(false);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);
  });

  // ── Pending Applications Tab ───────────────────────────────────
  it('switches to Pending Applications tab', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));
    expect(screen.getByText('Pending Tenant Applications')).toBeDefined();
  });

  it('shows all pending applications', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    expect(screen.getByText('Ahmed Al-Rashid')).toBeDefined();
    expect(screen.getByText('Sarah Johnson')).toBeDefined();
    expect(screen.getByText('Mohammed Khan')).toBeDefined();
  });

  it('shows properties for each application', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    expect(screen.getByText('Marina View 2BR')).toBeDefined();
    expect(screen.getByText('Downtown Studio')).toBeDefined();
    expect(screen.getByText('JBR 3BR')).toBeDefined();
  });

  it('shows salary information', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    expect(screen.getByText(/Salary: AED 25,000\/mo/)).toBeDefined();
    expect(screen.getByText(/Salary: AED 18,000\/mo/)).toBeDefined();
    expect(screen.getByText(/Salary: AED 45,000\/mo/)).toBeDefined();
  });

  it('shows status badges', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    expect(screen.getByText('Documents Pending')).toBeDefined();
    expect(screen.getByText('Under Review')).toBeDefined();
    expect(screen.getByText('Approved')).toBeDefined();
  });

  it('shows verification progress percentages', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    expect(screen.getByText(/Verification Progress: 60%/)).toBeDefined();
    expect(screen.getByText(/Verification Progress: 80%/)).toBeDefined();
    expect(screen.getByText(/Verification Progress: 100%/)).toBeDefined();
  });

  it('renders progress bars with correct widths', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Pending Applications'));

    const progressBars = document.querySelectorAll('.progress-bar-fill');
    expect(progressBars.length).toBe(3);
    expect((progressBars[0] as HTMLElement).style.width).toBe('60%');
    expect((progressBars[1] as HTMLElement).style.width).toBe('80%');
    expect((progressBars[2] as HTMLElement).style.width).toBe('100%');
  });

  // ── Guidelines Tab ─────────────────────────────────────────────
  it('switches to Guidelines tab', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));
    expect(screen.getByText('Red Flags to Watch')).toBeDefined();
    expect(screen.getByText('Best Practices')).toBeDefined();
  });

  it('shows all red flags', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));

    expect(screen.getByText('Salary less than 3x monthly rent')).toBeDefined();
    expect(screen.getByText('Visa expiring within 6 months')).toBeDefined();
    expect(screen.getByText('Previous rental disputes or evictions')).toBeDefined();
    expect(screen.getByText('Bounced cheques history')).toBeDefined();
    expect(screen.getByText('Inconsistent employment history')).toBeDefined();
  });

  it('shows warning icons for red flags', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));

    const flagIcons = screen.getAllByText('⚠️');
    expect(flagIcons.length).toBe(5);
  });

  it('shows all best practices', () => {
    render(<TenantScreeningPage />);
    fireEvent.click(screen.getByText('Guidelines'));

    expect(screen.getByText('Always verify original documents before accepting copies')).toBeDefined();
    expect(screen.getByText(/Check visa validity and employment status/i)).toBeDefined();
    expect(screen.getByText(/Contact previous landlords/i)).toBeDefined();
    expect(screen.getByText(/Verify salary through employment letter/i)).toBeDefined();
    expect(screen.getByText(/Run basic background check through DED/i)).toBeDefined();
  });

  // ── Tab Switching Round-trip ───────────────────────────────────
  it('switches between all tabs correctly', () => {
    render(<TenantScreeningPage />);

    // Default is checklist
    expect(screen.getByText('Identity Verification')).toBeDefined();

    // Switch to applications
    fireEvent.click(screen.getByText('Pending Applications'));
    expect(screen.getByText('Ahmed Al-Rashid')).toBeDefined();

    // Switch to guidelines
    fireEvent.click(screen.getByText('Guidelines'));
    expect(screen.getByText('Red Flags to Watch')).toBeDefined();

    // Switch back to checklist
    fireEvent.click(screen.getByText('Screening Checklist'));
    expect(screen.getByText('Identity Verification')).toBeDefined();
  });

  // ── Active Tab Styling ─────────────────────────────────────────
  it('applies active class to current tab button', () => {
    render(<TenantScreeningPage />);
    const checklistTab = screen.getByText('Screening Checklist').closest('button');
    expect(checklistTab?.className).toContain('active');
  });

  it('moves active class when switching tabs', () => {
    render(<TenantScreeningPage />);
    
    fireEvent.click(screen.getByText('Pending Applications'));
    const appTab = screen.getByText('Pending Applications').closest('button');
    expect(appTab?.className).toContain('active');

    const checklistTab = screen.getByText('Screening Checklist').closest('button');
    expect(checklistTab?.className).not.toContain('active');
  });
});
