/**
 * @file SettingsTab.test.tsx
 * @description Comprehensive tests for the SettingsTab owner dashboard component.
 * Covers: company info form, feature toggles, integrations status, system health,
 * danger zone actions, save callback, and form interactions.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsTab from './SettingsTab';
import type { SettingsTabProps } from './types';

// ─── Mocks ──────────────────────────────────────────────────────
vi.mock('../../../config/constants', () => ({
  Config: {
    COMPANY: {
      NAME: 'White Caves Real Estate LLC',
      EMAIL: 'info@whitecaves.ae',
      PHONE: '+971 56 361 6136',
      ADDRESS: 'Dubai, United Arab Emirates',
    },
  },
}));

// ─── Helpers ────────────────────────────────────────────────────
const defaultProps: SettingsTabProps = {
  data: {},
  onAction: vi.fn(),
  onSave: vi.fn(),
};

const renderTab = (props: Partial<SettingsTabProps> = {}) =>
  render(<SettingsTab {...defaultProps} {...props} />);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Tests ──────────────────────────────────────────────────────
describe('SettingsTab', () => {
  // === Header ===
  describe('Header', () => {
    it('renders the settings header', () => {
      renderTab();
      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });

    it('renders the Save Changes button', () => {
      renderTab();
      expect(screen.getByText(/Save Changes/)).toBeInTheDocument();
    });
  });

  // === Company Information ===
  describe('Company Information', () => {
    it('renders company information card', () => {
      renderTab();
      expect(screen.getByText('Company Information')).toBeInTheDocument();
    });

    it('pre-fills company name from Config', () => {
      renderTab();
      const input = screen.getByDisplayValue('White Caves Real Estate LLC');
      expect(input).toBeInTheDocument();
    });

    it('pre-fills email from Config', () => {
      renderTab();
      const input = screen.getByDisplayValue('info@whitecaves.ae');
      expect(input).toBeInTheDocument();
    });

    it('pre-fills phone from Config', () => {
      renderTab();
      const input = screen.getByDisplayValue('+971 56 361 6136');
      expect(input).toBeInTheDocument();
    });

    it('pre-fills address from Config', () => {
      renderTab();
      const textarea = screen.getByDisplayValue('Dubai, United Arab Emirates');
      expect(textarea).toBeInTheDocument();
    });

    it('renders RERA number field', () => {
      renderTab();
      expect(screen.getByDisplayValue('RERA-12345')).toBeInTheDocument();
    });

    it('renders Established field', () => {
      renderTab();
      expect(screen.getByDisplayValue('2009')).toBeInTheDocument();
    });

    it('allows editing company name', () => {
      renderTab();
      const input = screen.getByDisplayValue('White Caves Real Estate LLC') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'WC Updated' } });
      expect(input.value).toBe('WC Updated');
    });

    it('allows editing email', () => {
      renderTab();
      const input = screen.getByDisplayValue('info@whitecaves.ae') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'new@wc.ae' } });
      expect(input.value).toBe('new@wc.ae');
    });
  });

  // === Feature Toggles ===
  describe('Feature Toggles', () => {
    it('renders Feature Toggles card', () => {
      renderTab();
      expect(screen.getByText('Feature Toggles')).toBeInTheDocument();
    });

    it('renders all toggle labels', () => {
      renderTab();
      expect(screen.getByText('WhatsApp Integration')).toBeInTheDocument();
      expect(screen.getByText('AI Chatbot')).toBeInTheDocument();
      expect(screen.getByText('UAE Pass Login')).toBeInTheDocument();
      expect(screen.getByText('Auto Lead Assignment')).toBeInTheDocument();
    });

    it('renders toggle descriptions', () => {
      renderTab();
      expect(screen.getByText('Enable WhatsApp Business messaging')).toBeInTheDocument();
      expect(screen.getByText('Enable automated chatbot responses')).toBeInTheDocument();
      expect(screen.getByText('Enable UAE Pass authentication')).toBeInTheDocument();
      expect(screen.getByText('Automatically assign leads to agents')).toBeInTheDocument();
    });

    it('toggles WhatsApp integration checkbox', () => {
      renderTab();
      const checkboxes = screen.getAllByRole('checkbox');
      // WhatsApp toggle is first — starts checked
      const waCheckbox = checkboxes[0] as HTMLInputElement;
      expect(waCheckbox.checked).toBe(true);
      fireEvent.click(waCheckbox);
      expect(waCheckbox.checked).toBe(false);
    });

    it('toggles AI Chatbot checkbox', () => {
      renderTab();
      const checkboxes = screen.getAllByRole('checkbox');
      // Chatbot toggle is second
      const chatbotCheckbox = checkboxes[1] as HTMLInputElement;
      expect(chatbotCheckbox.checked).toBe(true);
      fireEvent.click(chatbotCheckbox);
      expect(chatbotCheckbox.checked).toBe(false);
    });
  });

  // === Integrations Status ===
  describe('Integrations Status', () => {
    it('renders Integration Status card', () => {
      renderTab();
      expect(screen.getByText('Integrations Status')).toBeInTheDocument();
    });

    it('renders all integrations', () => {
      renderTab();
      expect(screen.getByText('Firebase Auth')).toBeInTheDocument();
      expect(screen.getByText('MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Stripe Payments')).toBeInTheDocument();
      expect(screen.getByText('Google APIs')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Business')).toBeInTheDocument();
      expect(screen.getByText('UAE Pass')).toBeInTheDocument();
    });

    it('shows connected status for connected integrations', () => {
      renderTab();
      const connectedBadges = screen.getAllByText('● Connected');
      expect(connectedBadges.length).toBe(5); // 5 connected
    });

    it('shows pending status for UAE Pass', () => {
      renderTab();
      expect(screen.getByText('○ Pending')).toBeInTheDocument();
    });

    it('calls onAction when configure button is clicked', () => {
      const onAction = vi.fn();
      renderTab({ onAction });
      // Click the first configure button (⚙️)
      const configButtons = screen.getAllByText('⚙️');
      fireEvent.click(configButtons[0]);
      expect(onAction).toHaveBeenCalledWith('configureIntegration', 'firebase');
    });
  });

  // === System Health ===
  describe('System Health', () => {
    it('renders System Health card', () => {
      renderTab();
      expect(screen.getByText('System Health')).toBeInTheDocument();
    });

    it('renders all system services', () => {
      renderTab();
      expect(screen.getByText('API Server')).toBeInTheDocument();
      expect(screen.getByText('Database')).toBeInTheDocument();
      expect(screen.getByText('File Storage')).toBeInTheDocument();
      expect(screen.getByText('Email Service')).toBeInTheDocument();
    });

    it('shows uptime percentages', () => {
      renderTab();
      expect(screen.getByText('99.9%')).toBeInTheDocument();
      expect(screen.getByText('99.8%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('99.5%')).toBeInTheDocument();
    });

    it('renders View Detailed Health button', () => {
      renderTab();
      expect(screen.getByText(/View Detailed Health/)).toBeInTheDocument();
    });

    it('calls onAction on View Detailed Health click', () => {
      const onAction = vi.fn();
      renderTab({ onAction });
      fireEvent.click(screen.getByText(/View Detailed Health/));
      expect(onAction).toHaveBeenCalledWith('viewSystemHealth');
    });
  });

  // === Danger Zone ===
  describe('Danger Zone', () => {
    it('renders Danger Zone section', () => {
      renderTab();
      expect(screen.getByText(/Danger Zone/)).toBeInTheDocument();
    });

    it('renders warning text', () => {
      renderTab();
      expect(screen.getByText(/irreversible/i)).toBeInTheDocument();
    });

    it('renders Clear Cache button', () => {
      renderTab();
      expect(screen.getByText(/Clear Cache/)).toBeInTheDocument();
    });

    it('renders Reset Analytics button', () => {
      renderTab();
      expect(screen.getByText(/Reset Analytics/)).toBeInTheDocument();
    });

    it('renders Export All Data button', () => {
      renderTab();
      expect(screen.getByText(/Export All Data/)).toBeInTheDocument();
    });

    it('calls onAction for Clear Cache', () => {
      const onAction = vi.fn();
      renderTab({ onAction });
      fireEvent.click(screen.getByText(/Clear Cache/));
      expect(onAction).toHaveBeenCalledWith('clearCache');
    });

    it('calls onAction for Reset Analytics', () => {
      const onAction = vi.fn();
      renderTab({ onAction });
      fireEvent.click(screen.getByText(/Reset Analytics/));
      expect(onAction).toHaveBeenCalledWith('resetAnalytics');
    });

    it('calls onAction for Export All Data', () => {
      const onAction = vi.fn();
      renderTab({ onAction });
      fireEvent.click(screen.getByText(/Export All Data/));
      expect(onAction).toHaveBeenCalledWith('exportData');
    });
  });

  // === Save Callback ===
  describe('Save Callback', () => {
    it('calls onSave with settings when Save Changes is clicked', () => {
      const onSave = vi.fn();
      renderTab({ onSave });
      fireEvent.click(screen.getByText(/Save Changes/));
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: 'White Caves Real Estate LLC',
          companyEmail: 'info@whitecaves.ae',
          companyPhone: '+971 56 361 6136',
          whatsappEnabled: true,
          chatbotEnabled: true,
          uaepassEnabled: true,
          leadAutoAssign: true,
        }),
      );
    });

    it('calls onSave with updated values after editing', () => {
      const onSave = vi.fn();
      renderTab({ onSave });
      const input = screen.getByDisplayValue('White Caves Real Estate LLC') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Updated Name' } });
      fireEvent.click(screen.getByText(/Save Changes/));
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ companyName: 'Updated Name' }),
      );
    });
  });

  // === Edge Cases ===
  describe('Edge Cases', () => {
    it('renders without onAction prop', () => {
      render(<SettingsTab data={{}} />);
      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });

    it('renders without onSave prop', () => {
      render(<SettingsTab data={{}} />);
      fireEvent.click(screen.getByText(/Save Changes/));
      // Should not throw
      expect(screen.getByText('System Settings')).toBeInTheDocument();
    });
  });
});
