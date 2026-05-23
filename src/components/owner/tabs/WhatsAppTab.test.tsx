/**
 * WhatsAppTab — Comprehensive Unit Tests
 *
 * Covers: loading state, stats display, broadcast message,
 * action callbacks, button states, recent messages, templates
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('./TabStyles.css', () => ({}));

import WhatsAppTab from './WhatsAppTab';

// ── Test data ────────────────────────────────────────────────────

const mockWhatsAppData = {
  whatsappStats: {
    totalContacts: 2450,
    activeConversations: 32,
    messagesThisMonth: 8750,
    responseRate: 94,
    avgResponseTime: '2.3m',
    leadsGenerated: 178,
  },
};

describe('WhatsAppTab', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────── Loading State ──────

  describe('loading state', () => {
    it('shows loading spinner when loading is true', () => {
      render(<WhatsAppTab data={{}} loading={true} />);
      expect(screen.getByText('Loading WhatsApp data...')).toBeInTheDocument();
    });

    it('has loading role and aria-label', () => {
      render(<WhatsAppTab data={{}} loading={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not render stats when loading', () => {
      render(<WhatsAppTab data={mockWhatsAppData} loading={true} />);
      expect(screen.queryByText('2,450')).not.toBeInTheDocument();
    });
  });

  // ────── Header ──────

  describe('header', () => {
    it('renders "WhatsApp Business" title', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('WhatsApp Business')).toBeInTheDocument();
    });

    it('renders Analytics button', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });

    it('renders Open WhatsApp button', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Open WhatsApp')).toBeInTheDocument();
    });

    it('calls onAction("viewAnalytics") on Analytics click', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      fireEvent.click(screen.getByText('Analytics'));
      expect(mockOnAction).toHaveBeenCalledWith('viewAnalytics');
    });

    it('calls onAction("openWhatsApp") on Open WhatsApp click', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      fireEvent.click(screen.getByText('Open WhatsApp'));
      expect(mockOnAction).toHaveBeenCalledWith('openWhatsApp');
    });
  });

  // ────── Stats Grid ──────

  describe('stats display', () => {
    it('renders all 6 stat values', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('2,450')).toBeInTheDocument();
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('8,750')).toBeInTheDocument();
      expect(screen.getByText('94%')).toBeInTheDocument();
      expect(screen.getByText('2.3m')).toBeInTheDocument();
      expect(screen.getByText('178')).toBeInTheDocument();
    });

    it('renders all 6 stat labels', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Total Contacts')).toBeInTheDocument();
      expect(screen.getByText('Active Chats')).toBeInTheDocument();
      expect(screen.getByText('Messages This Month')).toBeInTheDocument();
      expect(screen.getByText('Response Rate')).toBeInTheDocument();
      expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
      expect(screen.getByText('Leads Generated')).toBeInTheDocument();
    });

    it('shows zero defaults when data is empty', () => {
      render(<WhatsAppTab data={{}} onAction={mockOnAction} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getByText('—')).toBeInTheDocument();
    });
  });

  // ────── Broadcast Message ──────

  describe('broadcast message', () => {
    it('renders broadcast section title', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Broadcast Message')).toBeInTheDocument();
    });

    it('renders broadcast textarea', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByPlaceholderText('Type your broadcast message...')).toBeInTheDocument();
    });

    it('renders recipient select with all options', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('All Contacts')).toBeInTheDocument();
      expect(screen.getByText('Active Leads')).toBeInTheDocument();
      expect(screen.getByText('Buyers')).toBeInTheDocument();
      expect(screen.getByText('Sellers')).toBeInTheDocument();
      expect(screen.getByText('Tenants')).toBeInTheDocument();
    });

    it('Send Broadcast button is disabled when empty', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      const sendBtn = screen.getByText('Send Broadcast');
      expect(sendBtn.closest('button')).toBeDisabled();
    });

    it('enables Send Broadcast when message is typed', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      const textarea = screen.getByPlaceholderText('Type your broadcast message...');
      fireEvent.change(textarea, { target: { value: 'Hello everyone!' } });
      const sendBtn = screen.getByText('Send Broadcast');
      expect(sendBtn.closest('button')).not.toBeDisabled();
    });

    it('calls onAction("sendBroadcast") with message content', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      const textarea = screen.getByPlaceholderText('Type your broadcast message...');
      fireEvent.change(textarea, { target: { value: 'New listing!' } });
      fireEvent.click(screen.getByText('Send Broadcast'));
      expect(mockOnAction).toHaveBeenCalledWith('sendBroadcast', 'New listing!');
    });
  });

  // ────── Recent Messages ──────

  describe('recent messages', () => {
    it('renders "Recent Messages" heading', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Recent Messages')).toBeInTheDocument();
    });

    it('renders "View All Messages" link', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('View All Messages →')).toBeInTheDocument();
    });

    it('calls onAction("viewAllMessages") on link click', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      fireEvent.click(screen.getByText('View All Messages →'));
      expect(mockOnAction).toHaveBeenCalledWith('viewAllMessages');
    });
  });

  // ────── Templates ──────

  describe('templates', () => {
    it('renders "Message Templates" heading', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Message Templates')).toBeInTheDocument();
    });

    it('renders "Add Template" button', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      expect(screen.getByText('Add Template')).toBeInTheDocument();
    });

    it('calls onAction("addTemplate") on button click', () => {
      render(<WhatsAppTab data={mockWhatsAppData} onAction={mockOnAction} />);
      fireEvent.click(screen.getByText('Add Template'));
      expect(mockOnAction).toHaveBeenCalledWith('addTemplate');
    });
  });

  // ────── No onAction ──────

  describe('when onAction is not provided', () => {
    it('renders without error', () => {
      render(<WhatsAppTab data={mockWhatsAppData} />);
      expect(screen.getByText('WhatsApp Business')).toBeInTheDocument();
    });

    it('buttons do not throw when clicked', () => {
      render(<WhatsAppTab data={mockWhatsAppData} />);
      expect(() => fireEvent.click(screen.getByText('Analytics'))).not.toThrow();
    });
  });
});
