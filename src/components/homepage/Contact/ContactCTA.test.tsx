import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./ContactCTA.css', () => ({}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v !== 'object' || k === 'style' || k === 'className') filtered[k] = v;
        else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') filtered[k] = v;
      }
      return <div {...filtered}>{children}</div>;
    },
    a: ({ children, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v !== 'object' || k === 'style' || k === 'className' || k === 'href') filtered[k] = v;
      }
      return <a {...filtered}>{children}</a>;
    },
    button: ({ children, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v !== 'object' || k === 'style' || k === 'className') filtered[k] = v;
        else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') filtered[k] = v;
      }
      return <button {...filtered}>{children}</button>;
    },
    p: ({ children, ...props }: any) => {
      const filtered: any = {};
      for (const [k, v] of Object.entries(props)) {
        if (typeof v !== 'object' || k === 'style' || k === 'className') filtered[k] = v;
        else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') filtered[k] = v;
      }
      return <p {...filtered}>{children}</p>;
    },
  },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Send: (props: any) => <span data-testid="icon-send" {...props} />,
  Phone: (props: any) => <span data-testid="icon-phone" {...props} />,
  Mail: (props: any) => <span data-testid="icon-mail" {...props} />,
  MapPin: (props: any) => <span data-testid="icon-map" {...props} />,
  MessageCircle: (props: any) => <span data-testid="icon-msg" {...props} />,
  MessageSquare: (props: any) => <span data-testid="icon-msg-square" {...props} />,
  ArrowRight: (props: any) => <span data-testid="icon-arrow" {...props} />,
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

// Mock config
vi.mock('../../../config/constants', () => ({
  Config: {
    COMPANY: {
      PHONE: '+971 4 123 4567',
      EMAIL: 'info@whitecaves.ae',
    },
  },
}));

import ContactCTA from './ContactCTA';

describe('ContactCTA', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true, data: { leadId: 'lead-1' } }),
    } as Response);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the section', () => {
      const { container } = render(<ContactCTA />);
      expect(container.querySelector('.contact-cta-section')).toBeInTheDocument();
    });

    it('applies the dubai-luxury-theme class to the section', () => {
      const { container } = render(<ContactCTA />);
      const section = container.querySelector('.contact-cta-section');
      expect(section?.classList.contains('dubai-luxury-theme')).toBe(true);
    });

    it('renders Get In Touch tag', () => {
      render(<ContactCTA />);
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    });

    it('renders title', () => {
      render(<ContactCTA />);
      expect(screen.getByText(/Ready to Find Your/)).toBeInTheDocument();
      expect(screen.getByText('Dream Property?')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<ContactCTA />);
      expect(screen.getByText(/luxury real estate market/)).toBeInTheDocument();
    });

    it('renders form title', () => {
      render(<ContactCTA />);
      expect(screen.getByText('Send Us a Message')).toBeInTheDocument();
    });
  });

  describe('contact info', () => {
    it('renders phone number from config', () => {
      render(<ContactCTA />);
      expect(screen.getByText('+971 4 123 4567')).toBeInTheDocument();
    });

    it('renders email from config', () => {
      render(<ContactCTA />);
      expect(screen.getByText('info@whitecaves.ae')).toBeInTheDocument();
    });

    it('renders office address', () => {
      render(<ContactCTA />);
      expect(screen.getByText(/Office D-72.*Port Saeed/)).toBeInTheDocument();
    });

    it('renders contact method labels', () => {
      render(<ContactCTA />);
      expect(screen.getByText('Call Us')).toBeInTheDocument();
      expect(screen.getByText('Email Us')).toBeInTheDocument();
      expect(screen.getByText('Visit Us')).toBeInTheDocument();
    });
  });

  describe('quick links', () => {
    it('renders Browse Properties link', () => {
      render(<ContactCTA />);
      const link = screen.getByText('Browse Properties');
      expect(link.closest('a')).toHaveAttribute('href', '/properties');
    });

    it('renders About White Caves link', () => {
      render(<ContactCTA />);
      const link = screen.getByText('About White Caves');
      expect(link.closest('a')).toHaveAttribute('href', '/about');
    });
  });

  describe('form fields', () => {
    it('renders name input', () => {
      render(<ContactCTA />);
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    });

    it('renders email input', () => {
      render(<ContactCTA />);
      expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    });

    it('renders phone input', () => {
      render(<ContactCTA />);
      expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    });

    it('renders message textarea', () => {
      render(<ContactCTA />);
      expect(screen.getByPlaceholderText('Your Message...')).toBeInTheDocument();
    });

    it('renders submit button', () => {
      render(<ContactCTA />);
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  describe('form interaction', () => {
    it('updates name field', () => {
      render(<ContactCTA />);
      const input = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Test User' } });
      expect(input.value).toBe('Test User');
    });

    it('updates email field', () => {
      render(<ContactCTA />);
      const input = screen.getByPlaceholderText('Email Address') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test@test.com' } });
      expect(input.value).toBe('test@test.com');
    });

    it('updates message field', () => {
      render(<ContactCTA />);
      const textarea = screen.getByPlaceholderText('Your Message...') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'Hello there' } });
      expect(textarea.value).toBe('Hello there');
    });
  });

  describe('validation', () => {
    it('does not submit with empty required fields', async () => {
      render(<ContactCTA />);
      const form = screen.getByText('Send Message').closest('form')!;
      
      await act(async () => fireEvent.submit(form));
      
      // Should still show the form (not success message)
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    it('does not submit with invalid email', async () => {
      render(<ContactCTA />);
      
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'not-an-email' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message...'), { target: { value: 'Hello' } });
      
      const form = screen.getByText('Send Message').closest('form')!;
      await act(async () => fireEvent.submit(form));
      
      // Should still show form
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });
  });

  describe('submission', () => {
    it('shows submitting state', async () => {
      render(<ContactCTA />);
      
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message...'), { target: { value: 'Hello world' } });
      
      const form = screen.getByText('Send Message').closest('form')!;
      
      // Start submit but don't advance timers
      act(() => { fireEvent.submit(form); });
      
      // During submission, button text changes
      expect(screen.getByText(/Sending/)).toBeInTheDocument();
    });

    it('shows success message after submission', async () => {
      render(<ContactCTA />);
      
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message...'), { target: { value: 'Hello world' } });
      
      const form = screen.getByText('Send Message').closest('form')!;
      
      await act(async () => {
        fireEvent.submit(form);
        // Advance past the 1500ms simulated delay
        vi.advanceTimersByTime(2000);
      });
      
      expect(screen.getByText('Message Sent!')).toBeInTheDocument();
    });

    it('auto-dismisses success message after 5 seconds', async () => {
      render(<ContactCTA />);
      
      fireEvent.change(screen.getByPlaceholderText('Your Name'), { target: { value: 'John' } });
      fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message...'), { target: { value: 'Hello world' } });
      
      const form = screen.getByText('Send Message').closest('form')!;
      
      await act(async () => {
        fireEvent.submit(form);
        vi.advanceTimersByTime(2000);
      });
      
      expect(screen.getByText('Message Sent!')).toBeInTheDocument();
      
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      
      // Success message gone, form is back
      expect(screen.queryByText('Message Sent!')).not.toBeInTheDocument();
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    it('clears form fields after submission', async () => {
      render(<ContactCTA />);
      
      const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText('Email Address') as HTMLInputElement;
      
      fireEvent.change(nameInput, { target: { value: 'John' } });
      fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Your Message...'), { target: { value: 'Hello world' } });
      
      const form = screen.getByText('Send Message').closest('form')!;
      
      await act(async () => {
        fireEvent.submit(form);
        vi.advanceTimersByTime(2000);
      });
      
      // After success auto-dismiss, form should have empty fields
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });
      
      const newNameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      expect(newNameInput.value).toBe('');
    });
  });
});

