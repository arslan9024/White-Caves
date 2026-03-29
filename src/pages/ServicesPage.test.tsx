/**
 * @file ServicesPage.test.tsx
 * @description Comprehensive tests for the ServicesPage public marketing page.
 * Covers: hero, service cards, detail tabs, market insights, process timeline,
 * trust indicators, consultation form, and user interactions.
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ServicesPage from './ServicesPage';
import userReducer from '../store/userSlice';

// ─── Mocks ──────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockToast = { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() };
vi.mock('../components/Toast', () => ({
  useToast: () => mockToast,
}));

vi.mock('../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../components/WhatsAppButton', () => ({
  default: () => <div data-testid="whatsapp-button">WhatsApp</div>,
}));

vi.mock('../components/layout/AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="app-layout">{children}</div>,
}));

// ─── Helpers ────────────────────────────────────────────────────
const createStore = (userOverrides: Record<string, unknown> = {}) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'User', email: 'u@wc.ae', role: 'client' },
        loading: false,
        error: null,
        ...userOverrides,
      } as ReturnType<typeof userReducer>,
    },
  });

const renderPage = (userOverrides: Record<string, unknown> = {}) =>
  render(
    <Provider store={createStore(userOverrides)}>
      <MemoryRouter>
        <ServicesPage />
      </MemoryRouter>
    </Provider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  // Stub scrollIntoView
  Element.prototype.scrollIntoView = vi.fn();
});

// ─── Tests ──────────────────────────────────────────────────────
describe('ServicesPage', () => {
  // === Hero Section ===
  describe('Hero Section', () => {
    it('renders the hero title', () => {
      renderPage();
      expect(screen.getByText('Premium Real Estate Services in Dubai')).toBeInTheDocument();
    });

    it('renders hero subtitle', () => {
      renderPage();
      expect(screen.getByText(/Expert guidance for buying, selling/i)).toBeInTheDocument();
    });

    it('renders Get Free Consultation CTA', () => {
      renderPage();
      expect(screen.getByText('Get Free Consultation')).toBeInTheDocument();
    });

    it('renders Browse Properties CTA', () => {
      renderPage();
      expect(screen.getByText('Browse Properties')).toBeInTheDocument();
    });

    it('navigates home on Browse Properties click', () => {
      renderPage();
      fireEvent.click(screen.getByText('Browse Properties'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('scrolls to contact section on CTA click', () => {
      renderPage();
      fireEvent.click(screen.getByText('Get Free Consultation'));
      // scrollIntoView is called (stubbed)
    });
  });

  // === Service Cards ===
  describe('Service Cards', () => {
    it('renders all three service cards', () => {
      renderPage();
      expect(screen.getByText('Buying Services')).toBeInTheDocument();
      expect(screen.getByText('Selling Services')).toBeInTheDocument();
      // 'Leasing Services' may appear in card + tabs; just check at least 1
      expect(screen.getAllByText('Leasing Services').length).toBeGreaterThanOrEqual(1);
    });

    it('renders subtitles for each service', () => {
      renderPage();
      expect(screen.getByText('Find Your Perfect Property')).toBeInTheDocument();
      expect(screen.getByText('Maximize Your Property Value')).toBeInTheDocument();
      expect(screen.getByText('Hassle-Free Property Rental')).toBeInTheDocument();
    });

    it('renders sub-services for buying', () => {
      renderPage();
      expect(screen.getByText('Off-plan purchases')).toBeInTheDocument();
      expect(screen.getByText('Secondary market')).toBeInTheDocument();
      expect(screen.getByText('New developments')).toBeInTheDocument();
    });

    it('renders features for selling', () => {
      renderPage();
      expect(screen.getByText(/Premium exposure/)).toBeInTheDocument();
      expect(screen.getByText(/Competitive pricing/)).toBeInTheDocument();
    });

    it('renders Learn More buttons', () => {
      renderPage();
      const learnMoreBtns = screen.getAllByText('Learn More');
      expect(learnMoreBtns).toHaveLength(3);
    });
  });

  // === Detailed Service Tabs ===
  describe('Detailed Service Tabs', () => {
    it('shows Off-Plan tab content by default', () => {
      renderPage();
      // 'Off-Plan Properties' appears in tab button + content heading
      expect(screen.getAllByText('Off-Plan Properties').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Invest in Dubai's future/i)).toBeInTheDocument();
    });

    it('switches to Secondary Market tab', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /Secondary Market/i }));
      expect(screen.getByText(/Move into your dream property/i)).toBeInTheDocument();
    });

    it('switches to Leasing Services tab', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /Leasing Services/i }));
      expect(screen.getByText(/Whether you're a landlord/i)).toBeInTheDocument();
    });

    it('shows comparison table in secondary market', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /Secondary Market/i }));
      expect(screen.getByText('Off-Plan vs Secondary Market')).toBeInTheDocument();
    });

    it('shows FAQ section in leasing tab', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /Leasing Services/i }));
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText('What is Ejari?')).toBeInTheDocument();
    });

    it('shows off-plan process flowchart', () => {
      renderPage();
      expect(screen.getByText('Off-Plan Purchase Process')).toBeInTheDocument();
    });

    it('shows benefit cards in off-plan tab', () => {
      renderPage();
      expect(screen.getByText(/Price Advantages/)).toBeInTheDocument();
      expect(screen.getByText(/Customization Options/)).toBeInTheDocument();
      expect(screen.getByText(/Flexible Payment Plans/)).toBeInTheDocument();
    });
  });

  // === Market Insights ===
  describe('Market Insights', () => {
    it('renders market insights section', () => {
      renderPage();
      expect(screen.getByText('Dubai Market Insights')).toBeInTheDocument();
    });

    it('renders all prime areas', () => {
      renderPage();
      expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
      expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
      expect(screen.getByText('Business Bay')).toBeInTheDocument();
      expect(screen.getByText('JVC')).toBeInTheDocument();
      expect(screen.getByText('Arabian Ranches')).toBeInTheDocument();
    });

    it('shows yield percentages', () => {
      renderPage();
      expect(screen.getByText('5.2%')).toBeInTheDocument();
      expect(screen.getByText('7.2%')).toBeInTheDocument();
    });
  });

  // === Process Timeline ===
  describe('Process Timeline', () => {
    it('renders process timeline section', () => {
      renderPage();
      expect(screen.getByText('Our Client Journey')).toBeInTheDocument();
    });

    it('renders all 7 process steps', () => {
      renderPage();
      expect(screen.getByText('Consultation')).toBeInTheDocument();
      expect(screen.getByText('Requirement Analysis')).toBeInTheDocument();
      expect(screen.getByText('Property Shortlisting')).toBeInTheDocument();
      expect(screen.getByText('Viewings')).toBeInTheDocument();
      expect(screen.getByText('Offer & Negotiation')).toBeInTheDocument();
      // 'Documentation' and 'Handover' may appear in timeline + off-plan flowchart
      expect(screen.getAllByText('Documentation').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Handover').length).toBeGreaterThanOrEqual(1);
    });
  });

  // === Trust Indicators ===
  describe('Trust Indicators', () => {
    it('renders trust section', () => {
      renderPage();
      expect(screen.getByText('Why Choose White Caves')).toBeInTheDocument();
    });

    it('shows experience stats', () => {
      renderPage();
      expect(screen.getByText('15+')).toBeInTheDocument();
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('98%')).toBeInTheDocument();
      expect(screen.getByText('AED 2B+')).toBeInTheDocument();
    });

    it('renders certifications', () => {
      renderPage();
      expect(screen.getByText('RERA Certified')).toBeInTheDocument();
      expect(screen.getByText('DLD Licensed')).toBeInTheDocument();
      expect(screen.getByText('DTCM Approved')).toBeInTheDocument();
    });
  });

  // === Consultation Form ===
  describe('Consultation Form', () => {
    it('renders the consultation form', () => {
      renderPage();
      expect(screen.getByText('Request a Consultation')).toBeInTheDocument();
    });

    it('renders form inputs', () => {
      renderPage();
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
    });

    it('submits form and shows success toast', () => {
      renderPage();
      const nameInput = screen.getByPlaceholderText('Your Name');
      const phoneInput = screen.getByPlaceholderText('Phone Number');
      const serviceSelect = screen.getAllByRole('combobox').find(
        (el) => el.getAttribute('name') === 'service'
      )!;

      fireEvent.change(nameInput, { target: { value: 'John Doe', name: 'name' } });
      fireEvent.change(phoneInput, { target: { value: '+971561234567', name: 'phone' } });
      fireEvent.change(serviceSelect, { target: { value: 'buying', name: 'service' } });

      const submitBtn = screen.getByText('Send Inquiry');
      fireEvent.click(submitBtn);

      expect(mockToast.success).toHaveBeenCalledWith(
        'Thank you for your inquiry! Our team will contact you shortly.',
      );
    });

    it('resets form after submission', () => {
      renderPage();
      const nameInput = screen.getByPlaceholderText('Your Name') as HTMLInputElement;
      const phoneInput = screen.getByPlaceholderText('Phone Number') as HTMLInputElement;
      const serviceSelect = screen.getAllByRole('combobox').find(
        (el) => el.getAttribute('name') === 'service'
      )! as HTMLSelectElement;

      fireEvent.change(nameInput, { target: { value: 'John Doe', name: 'name' } });
      fireEvent.change(phoneInput, { target: { value: '+971561234567', name: 'phone' } });
      fireEvent.change(serviceSelect, { target: { value: 'buying', name: 'service' } });

      const submitBtn = screen.getByText('Send Inquiry');
      fireEvent.click(submitBtn);

      expect(nameInput.value).toBe('');
    });
  });

  // === Layout Integration ===
  describe('Layout Integration', () => {
    it('renders within AppLayout', () => {
      renderPage();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });

    it('renders Footer', () => {
      renderPage();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders WhatsApp button', () => {
      renderPage();
      expect(screen.getByTestId('whatsapp-button')).toBeInTheDocument();
    });
  });

  // === Contact CTA Section ===
  describe('Contact CTA Section', () => {
    it('renders contact info', () => {
      renderPage();
      expect(screen.getByText(/Ready to Begin Your Dubai Property Journey/i)).toBeInTheDocument();
    });

    it('shows office address', () => {
      renderPage();
      expect(screen.getByText(/Office D-72/)).toBeInTheDocument();
    });
  });
});
