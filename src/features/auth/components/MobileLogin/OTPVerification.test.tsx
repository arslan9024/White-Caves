import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./MobileLogin.css', () => ({}));

import OTPVerification from './OTPVerification';

const defaultProps = {
  phoneNumber: '0501234567',
  onVerify: vi.fn(),
  onResend: vi.fn(),
  loading: false,
  error: '',
};

const renderOTP = (props = {}) => render(<OTPVerification {...defaultProps} {...props} />);

describe('OTPVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders verification heading', () => {
      renderOTP();
      expect(screen.getByText('Verify your phone')).toBeInTheDocument();
    });

    it('renders masked phone number', () => {
      renderOTP();
      // "0501234567" → "050****567"
      expect(screen.getByText(/050\*{4}567/)).toBeInTheDocument();
    });

    it('renders 6 OTP input fields', () => {
      renderOTP();
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBe(6);
    });

    it('renders aria-labels for each digit', () => {
      renderOTP();
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByLabelText(`Digit ${i}`)).toBeInTheDocument();
      }
    });

    it('renders Verify OTP button', () => {
      renderOTP();
      expect(screen.getByText('Verify OTP')).toBeInTheDocument();
    });

    it('renders resend timer', () => {
      renderOTP();
      expect(screen.getByText(/Resend code in 60s/)).toBeInTheDocument();
    });
  });

  // ── Input Handling ─────────────────────────────────────────
  describe('input handling', () => {
    it('accepts digit input', () => {
      renderOTP();
      const input = screen.getByLabelText('Digit 1') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5' } });
      expect(input.value).toBe('5');
    });

    it('rejects non-digit input', () => {
      renderOTP();
      const input = screen.getByLabelText('Digit 1') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'a' } });
      expect(input.value).toBe('');
    });

    it('focuses auto input fields are numeric mode', () => {
      renderOTP();
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('inputMode', 'numeric');
      });
    });

    it('sets maxLength to 1 per input', () => {
      renderOTP();
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('maxLength', '1');
      });
    });
  });

  // ── Submit Behavior ────────────────────────────────────────
  describe('submit', () => {
    it('disables submit if OTP is incomplete', () => {
      renderOTP();
      const btn = screen.getByText('Verify OTP');
      expect(btn).toBeDisabled();
    });

    it('enables submit when all 6 digits are entered', () => {
      renderOTP();
      for (let i = 1; i <= 6; i++) {
        fireEvent.change(screen.getByLabelText(`Digit ${i}`), { target: { value: String(i) } });
      }
      expect(screen.getByText('Verify OTP')).not.toBeDisabled();
    });

    it('calls onVerify with OTP string on submit', () => {
      const onVerify = vi.fn();
      renderOTP({ onVerify });
      for (let i = 1; i <= 6; i++) {
        fireEvent.change(screen.getByLabelText(`Digit ${i}`), { target: { value: String(i) } });
      }
      fireEvent.submit(screen.getByText('Verify OTP').closest('form')!);
      expect(onVerify).toHaveBeenCalledWith('123456');
    });

    it('does not call onVerify with incomplete OTP', () => {
      const onVerify = vi.fn();
      renderOTP({ onVerify });
      fireEvent.change(screen.getByLabelText('Digit 1'), { target: { value: '1' } });
      fireEvent.submit(screen.getByText('Verify OTP').closest('form')!);
      expect(onVerify).not.toHaveBeenCalled();
    });
  });

  // ── Loading State ──────────────────────────────────────────
  describe('loading', () => {
    it('shows Verifying... when loading', () => {
      renderOTP({ loading: true });
      expect(screen.getByText('Verifying...')).toBeInTheDocument();
    });

    it('disables submit button when loading', () => {
      renderOTP({ loading: true });
      expect(screen.getByText('Verifying...')).toBeDisabled();
    });

    it('disables all inputs when loading', () => {
      renderOTP({ loading: true });
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });
  });

  // ── Error State ────────────────────────────────────────────
  describe('error', () => {
    it('renders error message', () => {
      renderOTP({ error: 'Invalid OTP' });
      expect(screen.getByText('Invalid OTP')).toBeInTheDocument();
    });

    it('does not render error when empty', () => {
      renderOTP();
      expect(screen.queryByText('Invalid OTP')).not.toBeInTheDocument();
    });

    it('adds error class to inputs when error is present', () => {
      renderOTP({ error: 'Wrong code' });
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input.className).toContain('error');
      });
    });
  });

  // ── Paste Handling ─────────────────────────────────────────
  describe('paste', () => {
    it('fills all digits on paste of 6-digit code', () => {
      renderOTP();
      const container = screen.getByLabelText('Digit 1').parentElement!;
      const clipboardData = { getData: () => '789012' };
      fireEvent.paste(container, { clipboardData });
      expect((screen.getByLabelText('Digit 1') as HTMLInputElement).value).toBe('7');
      expect((screen.getByLabelText('Digit 2') as HTMLInputElement).value).toBe('8');
      expect((screen.getByLabelText('Digit 3') as HTMLInputElement).value).toBe('9');
      expect((screen.getByLabelText('Digit 4') as HTMLInputElement).value).toBe('0');
      expect((screen.getByLabelText('Digit 5') as HTMLInputElement).value).toBe('1');
      expect((screen.getByLabelText('Digit 6') as HTMLInputElement).value).toBe('2');
    });

    it('strips non-digits from pasted data', () => {
      renderOTP();
      const container = screen.getByLabelText('Digit 1').parentElement!;
      const clipboardData = { getData: () => '12-34-56' };
      fireEvent.paste(container, { clipboardData });
      expect((screen.getByLabelText('Digit 1') as HTMLInputElement).value).toBe('1');
      expect((screen.getByLabelText('Digit 2') as HTMLInputElement).value).toBe('2');
    });
  });

  // ── Backspace Behavior ─────────────────────────────────────
  describe('backspace', () => {
    it('moves focus to previous input on backspace of empty input', () => {
      renderOTP();
      const digit1 = screen.getByLabelText('Digit 1') as HTMLInputElement;
      const digit2 = screen.getByLabelText('Digit 2') as HTMLInputElement;
      fireEvent.change(digit1, { target: { value: '1' } });
      digit2.focus();
      fireEvent.keyDown(digit2, { key: 'Backspace' });
      expect(document.activeElement).toBe(digit1);
    });
  });
});
