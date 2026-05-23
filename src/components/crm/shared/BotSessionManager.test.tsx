/**
 * BotSessionManager — Comprehensive Unit Tests
 *
 * Covers: rendering, bot cards, status icons, create modal,
 * delete confirmation, bot selection, metrics display, QR display,
 * feature tags, form validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  QrCode: ({ size }: { size?: number }) => <span data-testid="icon-qrcode" />,
  Plus: ({ size }: { size?: number }) => <span data-testid="icon-plus" />,
  Trash2: ({ size }: { size?: number }) => <span data-testid="icon-trash" />,
  RefreshCw: ({ size }: { size?: number }) => <span data-testid="icon-refresh" />,
  Smartphone: ({ size }: { size?: number }) => <span data-testid="icon-phone" />,
  Wifi: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-wifi" className={className} />,
  WifiOff: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-wifioff" className={className} />,
  Check: ({ size }: { size?: number }) => <span data-testid="icon-check" />,
  X: ({ size }: { size?: number }) => <span data-testid="icon-x" />,
  AlertTriangle: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-alert" className={className} />,
  Clock: ({ size, className }: { size?: number; className?: string }) => <span data-testid="icon-clock" className={className} />,
  Activity: ({ size }: { size?: number }) => <span data-testid="icon-activity" />,
}));

// Mock CSS
vi.mock('./BotComponents.css', () => ({}));

import BotSessionManager from './BotSessionManager';

// ── Test Data ────────────────────────────────────────────────────

const connectedBot = {
  id: 'bot-1',
  name: 'Lion1',
  number: '+971501234567',
  status: 'connected',
  messagesProcessed: 12500,
  responseRate: 97,
  uptime: '99.9%',
  features: ['Auto-Reply', 'Lead Capture'],
};

const disconnectedBot = {
  id: 'bot-2',
  name: 'Lion2',
  number: '+971509876543',
  status: 'disconnected',
  qrCode: 'data:image/png;base64,test',
};

const pendingBot = {
  id: 'bot-3',
  name: 'Lion3',
  number: '+971507777777',
  status: 'pending',
};

const allBots = [connectedBot, disconnectedBot, pendingBot];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('BotSessionManager', () => {
  describe('rendering', () => {
    it('renders header', () => {
      render(<BotSessionManager bots={allBots} />);
      expect(screen.getByText('WhatsApp Bot Sessions')).toBeInTheDocument();
    });

    it('renders create button', () => {
      render(<BotSessionManager bots={allBots} />);
      expect(screen.getByText('Create New Bot')).toBeInTheDocument();
    });

    it('renders all bot cards', () => {
      render(<BotSessionManager bots={allBots} />);
      expect(screen.getByText('Lion1')).toBeInTheDocument();
      expect(screen.getByText('Lion2')).toBeInTheDocument();
      expect(screen.getByText('Lion3')).toBeInTheDocument();
    });

    it('renders with no bots', () => {
      render(<BotSessionManager />);
      expect(screen.getByText('WhatsApp Bot Sessions')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(BotSessionManager.displayName).toBe('BotSessionManager');
    });
  });

  describe('bot card details', () => {
    it('shows bot name', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('Lion1')).toBeInTheDocument();
    });

    it('shows bot phone number', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('+971501234567')).toBeInTheDocument();
    });

    it('shows Connected status for connected bot', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('shows Disconnected status for disconnected bot', () => {
      render(<BotSessionManager bots={[disconnectedBot]} />);
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    it('shows Awaiting QR Scan for pending bot', () => {
      render(<BotSessionManager bots={[pendingBot]} />);
      expect(screen.getByText('Awaiting QR Scan')).toBeInTheDocument();
    });
  });

  describe('metrics display', () => {
    it('shows message count for connected bot', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('12,500')).toBeInTheDocument();
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });

    it('shows response rate for connected bot', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('97%')).toBeInTheDocument();
      expect(screen.getByText('Response Rate')).toBeInTheDocument();
    });

    it('shows uptime for connected bot', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('99.9%')).toBeInTheDocument();
      expect(screen.getByText('Uptime')).toBeInTheDocument();
    });
  });

  describe('QR code display', () => {
    it('shows QR image when bot has qrCode', () => {
      render(<BotSessionManager bots={[disconnectedBot]} />);
      const img = screen.getByAltText('Scan QR Code');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/png;base64,test');
    });

    it('shows QR placeholder when no qrCode', () => {
      render(<BotSessionManager bots={[pendingBot]} />);
      expect(screen.getByText('Generating QR Code...')).toBeInTheDocument();
    });

    it('shows scan instruction with QR', () => {
      render(<BotSessionManager bots={[disconnectedBot]} />);
      expect(screen.getByText('Scan with WhatsApp')).toBeInTheDocument();
    });
  });

  describe('feature tags', () => {
    it('renders feature tags', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      expect(screen.getByText('Auto-Reply')).toBeInTheDocument();
      expect(screen.getByText('Lead Capture')).toBeInTheDocument();
    });

    it('does not render feature section when no features', () => {
      render(<BotSessionManager bots={[pendingBot]} />);
      expect(screen.queryByText('Auto-Reply')).not.toBeInTheDocument();
    });
  });

  describe('bot selection', () => {
    it('calls onSelectBot when clicking bot card', () => {
      const onSelect = vi.fn();
      render(<BotSessionManager bots={[connectedBot]} onSelectBot={onSelect} />);
      fireEvent.click(screen.getByText('Lion1').closest('.bot-card')!);
      expect(onSelect).toHaveBeenCalledWith('bot-1');
    });

    it('highlights selected bot card', () => {
      render(<BotSessionManager bots={[connectedBot]} selectedBotId="bot-1" />);
      const card = screen.getByText('Lion1').closest('.bot-card');
      expect(card?.className).toContain('selected');
    });
  });

  describe('refresh session', () => {
    it('calls onRefreshSession without selecting bot', () => {
      const onRefresh = vi.fn();
      const onSelect = vi.fn();
      render(
        <BotSessionManager bots={[connectedBot]} onRefreshSession={onRefresh} onSelectBot={onSelect} />
      );
      fireEvent.click(screen.getByTitle('Refresh Session'));
      expect(onRefresh).toHaveBeenCalledWith('bot-1');
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('create bot modal', () => {
    it('opens create modal on button click', () => {
      render(<BotSessionManager bots={[]} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      expect(screen.getByText('Create New WhatsApp Bot')).toBeInTheDocument();
    });

    it('has name and number inputs', () => {
      render(<BotSessionManager bots={[]} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      expect(screen.getByPlaceholderText('e.g., Lion3')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('+971501234567')).toBeInTheDocument();
    });

    it('disables create button when fields empty', () => {
      render(<BotSessionManager bots={[]} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      const createBtn = screen.getByRole('button', { name: /Create Bot/i });
      expect(createBtn).toBeDisabled();
    });

    it('enables create button when fields filled', () => {
      render(<BotSessionManager bots={[]} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      fireEvent.change(screen.getByPlaceholderText('e.g., Lion3'), { target: { value: 'NewBot' } });
      fireEvent.change(screen.getByPlaceholderText('+971501234567'), { target: { value: '+971500000000' } });
      const createBtn = screen.getByRole('button', { name: /Create Bot/i });
      expect(createBtn).not.toBeDisabled();
    });

    it('calls onCreateBot with name and number', () => {
      const onCreate = vi.fn();
      render(<BotSessionManager bots={[]} onCreateBot={onCreate} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      fireEvent.change(screen.getByPlaceholderText('e.g., Lion3'), { target: { value: 'MyBot' } });
      fireEvent.change(screen.getByPlaceholderText('+971501234567'), { target: { value: '+971500000000' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Bot/i }));
      expect(onCreate).toHaveBeenCalledWith({ name: 'MyBot', number: '+971500000000' });
    });

    it('closes modal after creation', () => {
      const onCreate = vi.fn();
      render(<BotSessionManager bots={[]} onCreateBot={onCreate} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      fireEvent.change(screen.getByPlaceholderText('e.g., Lion3'), { target: { value: 'MyBot' } });
      fireEvent.change(screen.getByPlaceholderText('+971501234567'), { target: { value: '+971500000000' } });
      fireEvent.click(screen.getByRole('button', { name: /Create Bot/i }));
      expect(screen.queryByText('Create New WhatsApp Bot')).not.toBeInTheDocument();
    });

    it('closes modal on Cancel', () => {
      render(<BotSessionManager bots={[]} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      expect(screen.getByText('Create New WhatsApp Bot')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Create New WhatsApp Bot')).not.toBeInTheDocument();
    });

    it('shows helper note in modal', () => {
      render(<BotSessionManager bots={[]} />);
      fireEvent.click(screen.getByText('Create New Bot'));
      expect(screen.getByText(/scan the QR code/i)).toBeInTheDocument();
    });
  });

  describe('delete bot confirmation', () => {
    it('opens delete confirmation on delete button click', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      fireEvent.click(screen.getByTitle('Delete Bot'));
      expect(screen.getByText('Delete Bot?')).toBeInTheDocument();
    });

    it('shows warning message in confirm dialog', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      fireEvent.click(screen.getByTitle('Delete Bot'));
      expect(screen.getByText(/permanently delete/i)).toBeInTheDocument();
    });

    it('calls onDeleteBot on confirm', () => {
      const onDelete = vi.fn();
      render(<BotSessionManager bots={[connectedBot]} onDeleteBot={onDelete} />);
      fireEvent.click(screen.getByTitle('Delete Bot'));
      // Click the "Delete Bot" button in the confirmation dialog
      const deleteButtons = screen.getAllByRole('button', { name: /Delete Bot/i });
      const confirmBtn = deleteButtons[deleteButtons.length - 1];
      fireEvent.click(confirmBtn);
      expect(onDelete).toHaveBeenCalledWith('bot-1');
    });

    it('closes confirm dialog on cancel', () => {
      render(<BotSessionManager bots={[connectedBot]} />);
      fireEvent.click(screen.getByTitle('Delete Bot'));
      expect(screen.getByText('Delete Bot?')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Delete Bot?')).not.toBeInTheDocument();
    });

    it('does not call onSelectBot when clicking delete', () => {
      const onSelect = vi.fn();
      render(<BotSessionManager bots={[connectedBot]} onSelectBot={onSelect} />);
      fireEvent.click(screen.getByTitle('Delete Bot'));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });
});
