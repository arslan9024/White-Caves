/**
 * @file ContactPage.test.tsx
 * @description Comprehensive tests for the ContactPage public contact form.
 * Covers: hero, contact cards, form validation, submission, accessibility,
 * success/error states, and business info rendering.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import ContactPage from './ContactPage';

// ─── Mocks ──────────────────────────────────────────────────────
vi.mock('../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../components/layout/PublicLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="public-layout">{children}</div>
  ),
}));

vi.mock('../utils/authFetch', () => ({
  authFetch: vi.fn(async () => ({
    ok: true,
    json: async () => ({ success: true }),
  })),
}));

// ─── Helpers ────────────────────────────────────────────────────
const renderPage = () =>
  render(
    <LanguageProvider>
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    </LanguageProvider>
  );

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── Tests ──────────────────────────────────────────────────────
describe('ContactPage', () => {
  // === Hero Section ===
  describe('Hero Section', () => {
    it('renders the hero title', () => {
      renderPage();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('renders the hero subtitle', () => {
      renderPage();
      expect(screen.getByText(/premier luxury real estate experts/i)).toBeInTheDocument();
    });
  });

  // === Company Info ===
  describe('Company Information', () => {
    it('renders company name', () => {
      renderPage();
      expect(screen.getByText('White Caves Real Estate LLC')).toBeInTheDocument();
    });

    it('renders company tagline', () => {
      renderPage();
      expect(screen.getByText('Your Gateway to Luxury Living in Dubai')).toBeInTheDocument();
    });

    it('renders office address', () => {
      renderPage();
      expect(screen.getByText('Office D-72, El-Shaye-4')).toBeInTheDocument();
      expect(screen.getByText('Port Saeed, Deira')).toBeInTheDocument();
      expect(screen.getByText('Dubai, United Arab Emirates')).toBeInTheDocument();
    });

    it('renders phone numbers', () => {
      renderPage();
      expect(screen.getByText('Phone Numbers')).toBeInTheDocument();
    });

    it('renders email addresses', () => {
      renderPage();
      expect(screen.getByText('Email Addresses')).toBeInTheDocument();
      expect(screen.getByText(/admin@whitecaves.com/)).toBeInTheDocument();
    });

    it('renders business hours', () => {
      renderPage();
      expect(screen.getByText('Business Hours')).toBeInTheDocument();
      expect(screen.getByText(/9:00 AM - 6:00 PM/)).toBeInTheDocument();
      expect(screen.getByText(/By Appointment Only/)).toBeInTheDocument();
    });

    it('renders online presence info', () => {
      renderPage();
      expect(screen.getByText('Online Presence')).toBeInTheDocument();
      expect(screen.getByText(/www.whitecaves.com/)).toBeInTheDocument();
    });

    it('renders license information', () => {
      renderPage();
      expect(screen.getByText('License Information')).toBeInTheDocument();
      expect(screen.getByText('RERA Certified')).toBeInTheDocument();
      expect(screen.getByText('DED Licensed')).toBeInTheDocument();
    });
  });

  // === Quick Actions ===
  describe('Quick Actions', () => {
    it('renders quick action links', () => {
      renderPage();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Call Office')).toBeInTheDocument();
      expect(screen.getAllByText('WhatsApp').length).toBeGreaterThan(0);
      expect(screen.getByText('Send Email')).toBeInTheDocument();
      expect(screen.getByText('Get Directions')).toBeInTheDocument();
    });

    it('has correct phone link', () => {
      renderPage();
      const phoneLink = screen.getByText('Call Office').closest('a');
      expect(phoneLink).toHaveAttribute('href', 'tel:+971563616136');
    });

    it('has correct WhatsApp link', () => {
      renderPage();
      const waLink = screen
        .getAllByRole('link', { name: /whatsapp/i })
        .find(link => link.getAttribute('href')?.includes('wa.me'));
      expect(waLink).toHaveAttribute('href', 'https://wa.me/971563616136');
      expect(waLink).toHaveAttribute('target', '_blank');
    });

    it('has correct email link', () => {
      renderPage();
      const emailLink = screen.getByText('Send Email').closest('a');
      expect(emailLink).toHaveAttribute('href', 'mailto:admin@whitecaves.com');
    });
  });

  // === Contact Form ===
  describe('Contact Form', () => {
    it('renders all form fields', () => {
      renderPage();
      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Subject/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
    });

    it('renders subject options', () => {
      renderPage();
      const select = screen.getByLabelText(/Subject/) as HTMLSelectElement;
      expect(select).toBeInTheDocument();
      // Check a few options exist
      expect(screen.getByText('Buying a Property')).toBeInTheDocument();
      expect(screen.getByText('Selling a Property')).toBeInTheDocument();
      expect(screen.getByText('Investment Opportunities')).toBeInTheDocument();
    });

    it('allows typing in form fields', () => {
      renderPage();
      const nameInput = screen.getByLabelText(/Full Name/) as HTMLInputElement;
      fireEvent.change(nameInput, { target: { name: 'name', value: 'John Doe' } });
      expect(nameInput.value).toBe('John Doe');
    });

    it('renders submit button', () => {
      renderPage();
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  // === Form Validation ===
  describe('Form Validation', () => {
    const submitEmptyForm = () => {
      const form = screen.getByText('Send Message').closest('form')!;
      // Bypass native HTML5 required validation so custom validate() runs
      (form as HTMLFormElement).noValidate = true;
      fireEvent.submit(form);
    };

    it('shows error when name is empty', () => {
      renderPage();
      submitEmptyForm();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('shows error when email is empty', () => {
      renderPage();
      submitEmptyForm();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('shows error for invalid email', () => {
      renderPage();
      const emailInput = screen.getByLabelText(/Email Address/);
      fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid' } });
      submitEmptyForm();
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('prevents submission when subject is not selected', () => {
      renderPage();
      // Fill everything except subject
      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email Address/);
      const messageInput = screen.getByLabelText(/^Message/);
      fireEvent.change(nameInput, { target: { name: 'name', value: 'John' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'john@test.com' } });
      fireEvent.change(messageInput, { target: { name: 'message', value: 'Test message' } });
      submitEmptyForm();
      // Should NOT show success (validation blocks it)
      expect(screen.queryByText(/Thank you for your message/i)).not.toBeInTheDocument();
    });

    it('prevents submission when message is empty', () => {
      renderPage();
      // Fill everything except message
      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email Address/);
      const subjectSelect = screen.getByLabelText(/Subject/);
      fireEvent.change(nameInput, { target: { name: 'name', value: 'John' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'john@test.com' } });
      fireEvent.change(subjectSelect, { target: { name: 'subject', value: 'buy' } });
      submitEmptyForm();
      expect(screen.queryByText(/Thank you for your message/i)).not.toBeInTheDocument();
    });

    it('shows error for invalid phone number', () => {
      renderPage();
      const phoneInput = screen.getByLabelText(/Phone Number/);
      fireEvent.change(phoneInput, { target: { name: 'phone', value: '123' } });
      submitEmptyForm();
      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
    });

    it('clears field error on change', () => {
      renderPage();
      submitEmptyForm();
      expect(screen.getByText('Name is required')).toBeInTheDocument();

      const nameInput = screen.getByLabelText(/Full Name/);
      fireEvent.change(nameInput, { target: { name: 'name', value: 'J' } });
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });

  // === Form Submission ===
  describe('Form Submission', () => {
    const fillValidForm = () => {
      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email Address/);
      const subjectSelect = screen.getByLabelText(/Subject/);
      const messageInput = screen.getByLabelText(/^Message/);

      fireEvent.change(nameInput, { target: { name: 'name', value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { name: 'email', value: 'john@example.com' } });
      fireEvent.change(subjectSelect, { target: { name: 'subject', value: 'buy' } });
      fireEvent.change(messageInput, {
        target: { name: 'message', value: 'I want to buy a property' },
      });
    };

    const submitForm = () => {
      const form = screen.getByText('Send Message').closest('form')!;
      (form as HTMLFormElement).noValidate = true;
      fireEvent.submit(form);
    };

    it('shows success message on valid submission', async () => {
      renderPage();
      fillValidForm();
      submitForm();
      await waitFor(() => {
        expect(screen.getByText(/Thank you for your message/i)).toBeInTheDocument();
      });
    });

    it('resets form on successful submission', async () => {
      renderPage();
      fillValidForm();
      submitForm();

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/Full Name/) as HTMLInputElement;
        expect(nameInput.value).toBe('');
      });
    });

    it('hides success message after timeout', async () => {
      renderPage();
      fillValidForm();
      submitForm();

      // Advance 5 seconds
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      await waitFor(() => {
        expect(screen.queryByText(/Thank you for your message/i)).not.toBeInTheDocument();
      });
    });

    it('does not submit with invalid data', () => {
      renderPage();
      submitForm();
      expect(screen.queryByText(/Thank you for your message/i)).not.toBeInTheDocument();
    });
  });

  // === Accessibility ===
  describe('Accessibility', () => {
    const submitForm = () => {
      const form = screen.getByText('Send Message').closest('form')!;
      (form as HTMLFormElement).noValidate = true;
      fireEvent.submit(form);
    };

    it('has aria-invalid on fields with errors', () => {
      renderPage();
      submitForm();
      const nameInput = screen.getByLabelText(/Full Name/);
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('has aria-describedby linking to error messages', () => {
      renderPage();
      submitForm();
      const nameInput = screen.getByLabelText(/Full Name/);
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    });

    it('error messages have role=alert', () => {
      renderPage();
      submitForm();
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('form fields have proper labels', () => {
      renderPage();
      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Subject/)).toBeInTheDocument();
    });
  });

  // === Map Section ===
  describe('Map Section', () => {
    it('renders map title', () => {
      renderPage();
      expect(screen.getByText('Find Us')).toBeInTheDocument();
    });

    it('renders map iframe with proper title', () => {
      renderPage();
      const iframe = screen.getByTitle('White Caves Location');
      expect(iframe).toBeInTheDocument();
    });

    it('renders map address', () => {
      renderPage();
      expect(screen.getAllByText(/Office D-72, El-Shaye-4, Port Saeed/).length).toBeGreaterThan(0);
    });
  });

  // === Form heading ===
  describe('Form heading', () => {
    it('renders form heading and instructions', () => {
      renderPage();
      expect(screen.getByText('Send Us a Message')).toBeInTheDocument();
      expect(screen.getByText(/Fill out the form below/i)).toBeInTheDocument();
    });
  });
});
