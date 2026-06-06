/**
 * P0-009: MobileCRMCommandBar component tests
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileCRMCommandBar from './MobileCRMCommandBar';
import type { CRMCommandAction } from './MobileCRMCommandBar';

vi.mock('lucide-react', () => ({
  Phone: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-phone" {...p} />,
  Calendar: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-calendar" {...p} />,
  MessageCircle: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-msg" {...p} />,
  RefreshCw: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-refresh" {...p} />,
  UserCheck: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-user-check" {...p} />,
  FileText: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file" {...p} />,
  Home: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-home" {...p} />,
  ShieldCheck: (p: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-shield" {...p} />,
}));

const baseProps = {
  leadId: 'lead-1',
  leadPhone: '+971501234567',
  propertyId: 'prop-1',
  agentId: 'agent-1',
  onAction: vi.fn(),
};

describe('MobileCRMCommandBar', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders all 8 action buttons', () => {
    render(<MobileCRMCommandBar {...baseProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(8);
  });

  it('has role="toolbar" with aria-label="CRM quick actions"', () => {
    render(<MobileCRMCommandBar {...baseProps} />);
    expect(screen.getByRole('toolbar', { name: 'CRM quick actions' })).toBeInTheDocument();
  });

  it('all buttons have aria-labels', () => {
    render(<MobileCRMCommandBar {...baseProps} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('aria-label');
    });
  });

  it('calls onAction with { type: "log_call" } when Log Call button clicked', () => {
    const onAction = vi.fn();
    render(<MobileCRMCommandBar {...baseProps} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: /log call/i }));
    expect(onAction).toHaveBeenCalledWith({ type: 'log_call' });
  });

  it('calls onAction with schedule_viewing when Schedule button clicked', () => {
    const onAction = vi.fn();
    render(<MobileCRMCommandBar {...baseProps} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: /schedule viewing/i }));
    expect(onAction).toHaveBeenCalledWith({ type: 'schedule_viewing', leadId: 'lead-1' });
  });

  it('disables WhatsApp button when leadPhone is not provided', () => {
    render(<MobileCRMCommandBar {...baseProps} leadPhone={undefined} />);
    expect(screen.getByRole('button', { name: /whatsapp/i })).toBeDisabled();
  });

  it('disables schedule_viewing button when leadId is not provided', () => {
    render(<MobileCRMCommandBar {...baseProps} leadId={undefined} />);
    expect(screen.getByRole('button', { name: /schedule viewing/i })).toBeDisabled();
  });

  it('disables request_kyc button when leadId is not provided', () => {
    render(<MobileCRMCommandBar {...baseProps} leadId={undefined} />);
    expect(screen.getByRole('button', { name: /request kyc/i })).toBeDisabled();
  });

  it('calls onAction with correct whatsapp phone when clicked', () => {
    const onAction = vi.fn();
    render(<MobileCRMCommandBar {...baseProps} onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: /whatsapp/i }));
    expect(onAction).toHaveBeenCalledWith<[CRMCommandAction]>({
      type: 'whatsapp',
      phone: '+971501234567',
    });
  });
});
