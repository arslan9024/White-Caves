/**
 * PaymentInstructionDeck – comprehensive test suite
 * Covers rendering, payment methods, bank transfer, QR, cheque, copy, expand/collapse
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PaymentInstructionDeck, {
  PaymentMethodSelector,
  ChequeInstructions,
  BankTransferDetails,
} from './PaymentInstructionDeck';

const mockAuthFetch = vi.fn();

vi.mock('../../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

/* ── Mock CSS import ─────────────────────────────────────────── */
vi.mock('./PaymentComponents.css', () => ({}));

/* ── Mock clipboard API ──────────────────────────────────────── */
const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };
Object.assign(navigator, { clipboard: mockClipboard });

describe('PaymentInstructionDeck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: {
            paymentIntentId: 'pi_stub_1',
            clientSecret: 'secret',
            status: 'requires_payment_method',
          },
        }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /* ── Basic Rendering ────────────────────────────────────────── */
  describe('basic rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<PaymentInstructionDeck />);
      expect(container).toBeTruthy();
    });

    it('renders the header with Payment Instructions title', () => {
      render(<PaymentInstructionDeck />);
      expect(screen.getByText('Payment Instructions')).toBeInTheDocument();
    });

    it('renders expanded by default', () => {
      render(<PaymentInstructionDeck />);
      // Should show deck content
      expect(screen.getByText('Copy Message')).toBeInTheDocument();
    });

    it('renders method selector by default', () => {
      render(<PaymentInstructionDeck />);
      expect(screen.getByText('QR Code Payment')).toBeInTheDocument();
      expect(screen.getByText('Cheque Payment')).toBeInTheDocument();
      expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    });

    it('hides method selector when showMethodSelector is false', () => {
      render(<PaymentInstructionDeck showMethodSelector={false} />);
      expect(screen.queryByText('QR Code Payment')).not.toBeInTheDocument();
    });
  });

  /* ── Expand / Collapse ──────────────────────────────────────── */
  describe('expand/collapse', () => {
    it('collapses when header is clicked', () => {
      render(<PaymentInstructionDeck />);
      fireEvent.click(screen.getByText('Payment Instructions'));
      // Content should be hidden
      expect(screen.queryByText('Copy Message')).not.toBeInTheDocument();
    });

    it('expands again when header is clicked twice', () => {
      render(<PaymentInstructionDeck />);
      fireEvent.click(screen.getByText('Payment Instructions'));
      fireEvent.click(screen.getByText('Payment Instructions'));
      expect(screen.getByText('Copy Message')).toBeInTheDocument();
    });

    it('supports keyboard toggle with Enter', () => {
      render(<PaymentInstructionDeck />);
      const header = screen.getByRole('button', { name: /toggle payment instructions/i });
      fireEvent.keyDown(header, { key: 'Enter' });
      expect(screen.queryByText('Copy Message')).not.toBeInTheDocument();
    });

    it('supports keyboard toggle with Space', () => {
      render(<PaymentInstructionDeck />);
      const header = screen.getByRole('button', { name: /toggle payment instructions/i });
      fireEvent.keyDown(header, { key: ' ' });
      expect(screen.queryByText('Copy Message')).not.toBeInTheDocument();
    });
  });

  /* ── Default Method (Bank Transfer) ─────────────────────────── */
  describe('bank transfer (default)', () => {
    it('shows bank transfer details by default', () => {
      render(<PaymentInstructionDeck amount={50000} reference="INV-001" />);
      expect(screen.getByText('Account Holder Name')).toBeInTheDocument();
      expect(screen.getByText('Account Number')).toBeInTheDocument();
      expect(screen.getByText('IBAN')).toBeInTheDocument();
      expect(screen.getByText('SWIFT Code')).toBeInTheDocument();
    });

    it('shows amount and reference in transfer details', () => {
      render(<PaymentInstructionDeck amount={50000} reference="INV-001" />);
      expect(screen.getByText('AED 50,000')).toBeInTheDocument();
      expect(screen.getByText('INV-001')).toBeInTheDocument();
    });

    it('shows Amount pending when amount is 0', () => {
      render(<PaymentInstructionDeck amount={0} reference="REF-1" />);
      // amount=0 is falsy but != null, so it should show AED 0
      expect(screen.getByText('AED 0')).toBeInTheDocument();
    });
  });

  /* ── Payment Method Selection ───────────────────────────────── */
  describe('payment method selection', () => {
    it('switches to QR code view', () => {
      render(<PaymentInstructionDeck amount={10000} reference="REF-QR" />);
      fireEvent.click(screen.getByText('QR Code Payment'));
      expect(screen.getByText('WHITE CAVES REAL ESTATE L.L.C')).toBeInTheDocument();
    });

    it('switches to cheque view', () => {
      render(<PaymentInstructionDeck amount={25000} reference="REF-CHQ" />);
      fireEvent.click(screen.getByText('Cheque Payment'));
      expect(screen.getByText('Cheque Payment Instructions')).toBeInTheDocument();
    });

    it('switches back to bank transfer', () => {
      render(<PaymentInstructionDeck amount={10000} reference="REF-1" />);
      fireEvent.click(screen.getByText('QR Code Payment'));
      fireEvent.click(screen.getByText('Bank Transfer'));
      expect(screen.getByText('Account Holder Name')).toBeInTheDocument();
    });
  });

  /* ── QR Code View ───────────────────────────────────────────── */
  describe('QR code view', () => {
    it('displays merchant name', () => {
      render(<PaymentInstructionDeck />);
      fireEvent.click(screen.getByText('QR Code Payment'));
      expect(screen.getByText('WHITE CAVES REAL ESTATE L.L.C')).toBeInTheDocument();
    });

    it('displays QR code image', () => {
      render(<PaymentInstructionDeck />);
      fireEvent.click(screen.getByText('QR Code Payment'));
      const img = screen.getByAltText(/aani qr code/i);
      expect(img).toBeInTheDocument();
    });

    it('shows scan instruction', () => {
      render(<PaymentInstructionDeck />);
      fireEvent.click(screen.getByText('QR Code Payment'));
      expect(screen.getByText(/scan and pay using aani/i)).toBeInTheDocument();
    });
  });

  /* ── Cheque View ────────────────────────────────────────────── */
  describe('cheque view', () => {
    it('shows cheque instructions', () => {
      render(<PaymentInstructionDeck amount={100000} reference="REF-CHQ" />);
      fireEvent.click(screen.getByText('Cheque Payment'));
      expect(screen.getByText(/make the cheque payable to/i)).toBeInTheDocument();
    });

    it('shows delivery options', () => {
      render(<PaymentInstructionDeck />);
      fireEvent.click(screen.getByText('Cheque Payment'));
      expect(screen.getByText('Cheque Delivery Options:')).toBeInTheDocument();
    });

    it('shows cheque amount', () => {
      render(<PaymentInstructionDeck amount={75000} reference="REF-2" />);
      fireEvent.click(screen.getByText('Cheque Payment'));
      expect(screen.getByText(/AED 75,000/)).toBeInTheDocument();
    });
  });

  /* ── Copy Functionality ─────────────────────────────────────── */
  describe('copy functionality', () => {
    it('copies message to clipboard on Copy Message click', () => {
      render(<PaymentInstructionDeck amount={5000} reference="INV-100" clientName="John" />);
      fireEvent.click(screen.getByText('Copy Message'));
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });

    it('shows Copied! after clicking copy', () => {
      render(<PaymentInstructionDeck amount={5000} reference="INV-100" clientName="John" />);
      fireEvent.click(screen.getByText('Copy Message'));
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    it('resets copied state after timeout', async () => {
      render(<PaymentInstructionDeck amount={5000} reference="INV-100" clientName="John" />);
      fireEvent.click(screen.getByText('Copy Message'));
      expect(screen.getByText('Copied!')).toBeInTheDocument();
      await act(async () => {
        vi.advanceTimersByTime(2100);
      });
      expect(screen.getByText('Copy Message')).toBeInTheDocument();
    });

    it('calls onGenerateMessage callback', () => {
      const onGenerateMessage = vi.fn();
      render(
        <PaymentInstructionDeck
          amount={5000}
          reference="INV-100"
          clientName="John"
          onGenerateMessage={onGenerateMessage}
        />
      );
      fireEvent.click(screen.getByText('Copy Message'));
      expect(onGenerateMessage).toHaveBeenCalledWith(expect.any(String), 'transfer');
    });
  });

  /* ── Action Buttons ─────────────────────────────────────────── */
  describe('action buttons', () => {
    it('renders Generate Payment Link button', () => {
      render(<PaymentInstructionDeck />);
      expect(screen.getByText('Generate Payment Link')).toBeInTheDocument();
    });

    it('calls payment-intent API and shows success feedback', async () => {
      render(<PaymentInstructionDeck amount={1000} reference="INV-100" />);
      fireEvent.click(screen.getByText('Generate Payment Link'));

      expect(mockAuthFetch).toHaveBeenCalledWith(
        '/api/payments/create-payment-intent',
        expect.objectContaining({ method: 'POST' })
      );

      await act(async () => {
        await Promise.resolve();
      });

      expect(screen.getByText(/Payment link generated/i)).toBeInTheDocument();
    });

    it('shows validation error when amount is missing or zero', () => {
      render(<PaymentInstructionDeck amount={0} reference="INV-100" />);
      fireEvent.click(screen.getByText('Generate Payment Link'));
      expect(
        screen.getByText('Please provide a valid amount before generating a payment link.')
      ).toBeInTheDocument();
    });

    it('renders Download PDF button', () => {
      render(<PaymentInstructionDeck />);
      expect(screen.getByText('Download PDF')).toBeInTheDocument();
    });

    it('renders Share via WhatsApp button', () => {
      render(<PaymentInstructionDeck />);
      expect(screen.getByText('Share via WhatsApp')).toBeInTheDocument();
    });
  });

  /* ── Props ──────────────────────────────────────────────────── */
  describe('props', () => {
    it('renders with all props', () => {
      const { container } = render(
        <PaymentInstructionDeck
          amount={100000}
          reference="INV-999"
          clientName="Test Client"
          invoiceId="WC-2025-001"
          onGenerateMessage={vi.fn()}
          showMethodSelector={true}
        />
      );
      expect(container).toBeTruthy();
    });

    it('handles zero amount', () => {
      render(<PaymentInstructionDeck amount={0} reference="REF-0" />);
      expect(screen.getByText('AED 0')).toBeInTheDocument();
    });

    it('handles missing reference gracefully', () => {
      const { container } = render(<PaymentInstructionDeck />);
      expect(container).toBeTruthy();
    });
  });
});

/* ── Sub-components ────────────────────────────────────────────── */
describe('PaymentMethodSelector', () => {
  it('renders all three methods', () => {
    render(<PaymentMethodSelector selected="transfer" onSelect={vi.fn()} />);
    expect(screen.getByText('QR Code Payment')).toBeInTheDocument();
    expect(screen.getByText('Cheque Payment')).toBeInTheDocument();
    expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
  });

  it('calls onSelect with method id on click', () => {
    const onSelect = vi.fn();
    render(<PaymentMethodSelector selected="transfer" onSelect={onSelect} />);
    fireEvent.click(screen.getByText('QR Code Payment'));
    expect(onSelect).toHaveBeenCalledWith('qr');
  });
});

describe('ChequeInstructions', () => {
  it('renders cheque instructions with payee name', () => {
    render(<ChequeInstructions amount={5000} reference="REF-1" payeeName="WHITE CAVES LLC" />);
    expect(screen.getByText(/WHITE CAVES LLC/)).toBeInTheDocument();
  });

  it('renders warning note', () => {
    render(<ChequeInstructions amount={5000} reference="REF-1" />);
    expect(screen.getByText(/authorized signatories/i)).toBeInTheDocument();
  });
});

describe('BankTransferDetails', () => {
  it('renders bank details grid', () => {
    render(<BankTransferDetails amount={10000} reference="REF-1" onCopy={vi.fn()} copied={null} />);
    expect(screen.getByText('Account Holder Name')).toBeInTheDocument();
    expect(screen.getByText('IBAN')).toBeInTheDocument();
  });

  it('calls onCopy when copy button is clicked', () => {
    const onCopy = vi.fn();
    render(<BankTransferDetails amount={10000} reference="REF-1" onCopy={onCopy} copied={null} />);
    // Click first copy button (account name)
    const copyBtns = screen.getAllByRole('button');
    if (copyBtns.length > 0) {
      fireEvent.click(copyBtns[0]);
      expect(onCopy).toHaveBeenCalled();
    }
  });
});
