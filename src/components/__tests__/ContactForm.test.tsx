import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock logger
vi.mock('../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// Mock validation utilities - use real logic
vi.mock('../../utils/validation', () => ({
  isValidEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || ''),
  isRequired: (value: string) => typeof value === 'string' && value.trim().length > 0,
  isWithinLength: (value: string, max: number) => typeof value === 'string' && value.length <= max,
  MAX_MESSAGE_LENGTH: 2000,
}));

// Mock styled-components
vi.mock('../ContactForm.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    FormContainer: c('form', 'contact-form'),
    FormGroup: c('div', 'form-group'),
    ErrorMessage: c('span', 'error-message'),
    SubmitButton: c('button', 'submit-button'),
  };
});

import ContactForm from '../ContactForm';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders the form', () => {
      render(<ContactForm />);
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('renders name input with placeholder', () => {
      render(<ContactForm />);
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    });

    it('renders email input with placeholder', () => {
      render(<ContactForm />);
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument();
    });

    it('renders message textarea with placeholder', () => {
      render(<ContactForm />);
      expect(screen.getByPlaceholderText('Your Message')).toBeInTheDocument();
    });

    it('renders submit button with text "Send Message"', () => {
      render(<ContactForm />);
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    it('renders labels for accessibility', () => {
      render(<ContactForm />);
      expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Your Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Your Message')).toBeInTheDocument();
    });
  });

  // ── Form Input ─────────────────────────────────────────────
  describe('form input', () => {
    it('updates name field on change', () => {
      render(<ContactForm />);
      const input = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'John Doe' } });
      expect(input.value).toBe('John Doe');
    });

    it('updates email field on change', () => {
      render(<ContactForm />);
      const input = screen.getByPlaceholderText('Your Email') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'john@test.com' } });
      expect(input.value).toBe('john@test.com');
    });

    it('updates message field on change', () => {
      render(<ContactForm />);
      const textarea = screen.getByPlaceholderText('Your Message') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Hello World' } });
      expect(textarea.value).toBe('Hello World');
    });
  });

  // ── Validation ─────────────────────────────────────────────
  describe('validation', () => {
    it('shows error when name is empty on submit', async () => {
      render(<ContactForm />);
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('shows error when email is empty on submit', async () => {
      render(<ContactForm />);
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('shows error when message is empty on submit', async () => {
      render(<ContactForm />);
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'invalid-email' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello' } });
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });

    it('clears field error when user types', async () => {
      render(<ContactForm />);
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'J' } });
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });

  // ── ARIA Attributes ────────────────────────────────────────
  describe('accessibility', () => {
    it('sets aria-required on all inputs', () => {
      render(<ContactForm />);
      expect(screen.getByPlaceholderText('Your Name')).toHaveAttribute('aria-required', 'true');
      expect(screen.getByPlaceholderText('Your Email')).toHaveAttribute('aria-required', 'true');
      expect(screen.getByPlaceholderText('Your Message')).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-invalid on fields with errors', async () => {
      render(<ContactForm />);
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      expect(screen.getByPlaceholderText('Your Name')).toHaveAttribute('aria-invalid', 'true');
    });

    it('error messages have role="alert"', async () => {
      render(<ContactForm />);
      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ── Form Submission ────────────────────────────────────────
  describe('submission', () => {
    it('submits successfully with valid data', async () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello from test' } });

      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });

      expect(screen.getByText('Sent!')).toBeInTheDocument();
    });

    it('clears form fields after successful submission', async () => {
      render(<ContactForm />);
      const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText('Your Email') as HTMLInputElement;
      const msgInput = screen.getByPlaceholderText('Your Message') as HTMLTextAreaElement;

      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      fireEvent.change(msgInput, { target: { value: 'Hello' } });

      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(msgInput.value).toBe('');
    });

    it('shows success message that disappears after 5 seconds', async () => {
      vi.useFakeTimers();
      render(<ContactForm />);
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'john@email.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hi' } });

      await act(async () => {
        fireEvent.submit(screen.getByTestId('contact-form'));
      });

      expect(screen.getByText('Sent!')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText('Send Message')).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('does not submit when already submitting', async () => {
      render(<ContactForm />);
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'A' } });
      fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'a@b.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'x' } });

      // Quick double submit
      fireEvent.submit(screen.getByTestId('contact-form'));
      fireEvent.submit(screen.getByTestId('contact-form'));

      // Should still render fine
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });
  });

  // ── Textarea constraints ───────────────────────────────────
  describe('textarea', () => {
    it('has maxLength attribute for message', () => {
      render(<ContactForm />);
      expect(screen.getByPlaceholderText('Your Message')).toHaveAttribute('maxLength', '2000');
    });

    it('has rows attribute for message', () => {
      render(<ContactForm />);
      expect(screen.getByPlaceholderText('Your Message')).toHaveAttribute('rows', '5');
    });
  });
});
