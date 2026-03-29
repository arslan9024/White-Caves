import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { 
  CreditCard, QrCode, FileText, Building2, Copy, Check, 
  Download, Share2, ChevronDown, ChevronUp
} from 'lucide-react';
import './PaymentComponents.css';

// ─── Types ──────────────────────────────────────────────────────────────

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  routingCode: string;
  accountType: string;
  branch: string;
  currency: string;
}

interface QRCodeDisplayProps {
  amount?: number;
  reference: string;
  onCopy: (text: string, field?: string) => void;
}

interface ChequeInstructionsProps {
  amount?: number;
  reference: string;
  payeeName?: string;
}

interface BankTransferDetailsProps {
  amount?: number;
  reference: string;
  onCopy: (text: string, field?: string) => void;
  copied: string | null;
}

interface PaymentMethodSelectorProps {
  selected: string;
  onSelect: (method: string) => void;
}

interface PaymentInstructionDeckProps {
  amount?: number;
  reference?: string;
  clientName?: string;
  invoiceId?: string;
  onGenerateMessage?: (message: string, method: string) => void;
  showMethodSelector?: boolean;
}

// Bank details loaded from env vars at build time (not in source control).
// In production, serve via authenticated API: GET /api/payment/bank-details
const loadBankDetails = (): BankDetails => ({
  bankName: import.meta.env.VITE_BANK_NAME || 'Contact office for details',
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'WHITE CAVES REAL ESTATE L.L.C',
  accountNumber: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '***REDACTED***',
  iban: import.meta.env.VITE_BANK_IBAN || '***REDACTED***',
  swiftCode: import.meta.env.VITE_BANK_SWIFT || '***REDACTED***',
  routingCode: import.meta.env.VITE_BANK_ROUTING || '***REDACTED***',
  accountType: import.meta.env.VITE_BANK_ACCOUNT_TYPE || 'Lite',
  branch: import.meta.env.VITE_BANK_BRANCH || 'Mashreq NEOBiz Digital',
  currency: 'AED',
});

const PAYMENT_METHODS = {
  qr: {
    id: 'qr',
    name: 'QR Code Payment',
    icon: QrCode,
    description: 'Scan to pay instantly'
  },
  cheque: {
    id: 'cheque',
    name: 'Cheque Payment',
    icon: FileText,
    description: 'Bank cheque instructions'
  },
  transfer: {
    id: 'transfer',
    name: 'Bank Transfer',
    icon: Building2,
    description: 'Direct bank transfer'
  }
};

// Bank details loaded from env vars (no hardcoded secrets in source)
const BANK_DETAILS = loadBankDetails();

const QRCodeDisplay = memo(({ amount, reference, onCopy }: QRCodeDisplayProps) => {
  const displayAmount = amount != null ? `AED ${amount.toLocaleString()}` : 'Amount pending';
  const paymentInfo = `Merchant: WHITE CAVES REAL ESTATE L.L.C\nAmount: ${displayAmount}\nReference: ${reference}\nPayment Method: Aani - Scan with enabled bank apps`;
  
  return (
    <div className="qr-code-container">
      <div className="qr-code-wrapper">
        <div className="qr-merchant-name">
          <span className="merchant-label">Merchant name</span>
          <h4>WHITE CAVES REAL ESTATE L.L.C</h4>
        </div>
        <img 
          src="/images/aani-qr-code.png" 
          alt="Aani QR Code - WHITE CAVES REAL ESTATE L.L.C"
          className="aani-qr-image"
          loading="lazy"
          width={200}
          height={200}
        />
        <p className="qr-instruction">Scan and pay using Aani enabled bank apps</p>
      </div>
      <div className="qr-details">
        <p className="qr-amount">Amount: <strong>{displayAmount}</strong></p>
        <p className="qr-reference">Reference: <strong>{reference}</strong></p>
        <button className="copy-btn" onClick={() => onCopy(paymentInfo)}>
          <Copy size={14} /> Copy Payment Info
        </button>
      </div>
    </div>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

const ChequeInstructions = memo(({ amount, reference, payeeName }: ChequeInstructionsProps) => (
  <div className="cheque-instructions">
    <div className="instruction-card">
      <h4>Cheque Payment Instructions</h4>
      <ol className="instruction-list">
        <li>Make the cheque payable to: <strong>{payeeName || BANK_DETAILS.accountName}</strong></li>
        <li>Amount: <strong>{amount != null ? `AED ${amount.toLocaleString()}` : 'Amount pending'}</strong> (in words on the cheque)</li>
        <li>Write reference number on the back: <strong>{reference}</strong></li>
        <li>Cross the cheque with "Account Payee Only"</li>
        <li>Date the cheque with today's date or post-dated as agreed</li>
      </ol>
      <div className="warning-note">
        <strong>Important:</strong> Please ensure the cheque is signed by authorized signatories.
      </div>
    </div>
    <div className="delivery-info">
      <h5>Cheque Delivery Options:</h5>
      <ul>
        <li>Hand delivery to our office (Business Bay)</li>
        <li>Courier to: White Caves Real Estate, Bay Square, Building 12, Dubai</li>
        <li>Bank deposit directly to our account</li>
      </ul>
    </div>
  </div>
));

ChequeInstructions.displayName = 'ChequeInstructions';

const BankTransferDetails = memo(({ amount, reference, onCopy, copied }: BankTransferDetailsProps) => (
  <div className="bank-transfer-details">
    <div className="bank-header">
      <Building2 size={24} />
      <div>
        <h4>{BANK_DETAILS.bankName}</h4>
        <p>{BANK_DETAILS.branch}</p>
      </div>
    </div>
    
    <div className="details-grid">
      <div className="detail-row">
        <span className="detail-label">Account Holder Name</span>
        <span className="detail-value">{BANK_DETAILS.accountName}</span>
        <button className="copy-icon" onClick={() => onCopy(BANK_DETAILS.accountName, 'accountName')}>
          {copied === 'accountName' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="detail-row">
        <span className="detail-label">Account Number</span>
        <span className="detail-value">{BANK_DETAILS.accountNumber}</span>
        <button className="copy-icon" onClick={() => onCopy(BANK_DETAILS.accountNumber, 'accountNumber')}>
          {copied === 'accountNumber' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="detail-row">
        <span className="detail-label">IBAN</span>
        <span className="detail-value">{BANK_DETAILS.iban}</span>
        <button className="copy-icon" onClick={() => onCopy(BANK_DETAILS.iban, 'iban')}>
          {copied === 'iban' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="detail-row">
        <span className="detail-label">Account Type</span>
        <span className="detail-value">{BANK_DETAILS.accountType}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">Routing Code</span>
        <span className="detail-value">{BANK_DETAILS.routingCode}</span>
        <button className="copy-icon" onClick={() => onCopy(BANK_DETAILS.routingCode, 'routing')}>
          {copied === 'routing' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="detail-row">
        <span className="detail-label">SWIFT Code</span>
        <span className="detail-value">{BANK_DETAILS.swiftCode}</span>
        <button className="copy-icon" onClick={() => onCopy(BANK_DETAILS.swiftCode, 'swift')}>
          {copied === 'swift' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <div className="detail-row">
        <span className="detail-label">Currency</span>
        <span className="detail-value">{BANK_DETAILS.currency}</span>
      </div>
      <div className="detail-row highlight">
        <span className="detail-label">Amount</span>
        <span className="detail-value">{amount != null ? `AED ${amount.toLocaleString()}` : 'Amount pending'}</span>
      </div>
      <div className="detail-row highlight">
        <span className="detail-label">Reference</span>
        <span className="detail-value">{reference}</span>
        <button className="copy-icon" onClick={() => onCopy(reference, 'reference')}>
          {copied === 'reference' ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
    
    <div className="transfer-note">
      Please include the reference number in your transfer description for faster processing.
    </div>
  </div>
));

BankTransferDetails.displayName = 'BankTransferDetails';

const PaymentMethodSelector = memo(({ selected, onSelect }: PaymentMethodSelectorProps) => (
  <div className="payment-method-selector">
    {Object.values(PAYMENT_METHODS).map(method => {
      const IconComponent = method.icon;
      return (
        <button
          key={method.id}
          className={`method-btn ${selected === method.id ? 'active' : ''}`}
          onClick={() => onSelect(method.id)}
        >
          <IconComponent size={20} />
          <span className="method-name">{method.name}</span>
          <span className="method-desc">{method.description}</span>
        </button>
      );
    })}
  </div>
));

PaymentMethodSelector.displayName = 'PaymentMethodSelector';

const PaymentInstructionDeck = memo(({ 
  amount = 0,
  reference = '',
  clientName = '',
  invoiceId = '',
  onGenerateMessage,
  showMethodSelector = true
}: PaymentInstructionDeckProps) => {
  const [selectedMethod, setSelectedMethod] = useState('transfer');
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(copyTimerRef.current);
  }, []);
  
  const handleCopy = useCallback((text: string, field?: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field ?? null);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(null), 2000);
  }, []);
  
  const generateMessage = useCallback(() => {
    let message = '';
    
    if (selectedMethod === 'qr') {
      message = `Dear ${clientName},\n\nPlease scan the Aani QR code for your payment of AED ${amount.toLocaleString()}.\n\nMerchant: WHITE CAVES REAL ESTATE L.L.C\nReference: ${reference}\nInvoice: ${invoiceId}\n\nScan the QR code using any Aani-enabled bank app to complete the payment.\n\nThank you,\nWhite Caves Real Estate`;
    } else if (selectedMethod === 'cheque') {
      message = `Dear ${clientName},\n\nCheque Payment Instructions:\n\nPayable to: ${BANK_DETAILS.accountName}\nAmount: AED ${amount.toLocaleString()}\nReference: ${reference}\n\nPlease write the reference number on the back of the cheque and cross it "Account Payee Only".\n\nDelivery: White Caves Real Estate, Bay Square, Building 12, Dubai\n\nThank you,\nWhite Caves Real Estate`;
    } else {
      message = `Dear ${clientName},\n\nBank Transfer Details:\n\nBank: ${BANK_DETAILS.bankName}\nAccount Holder Name: ${BANK_DETAILS.accountName}\nAccount Number: ${BANK_DETAILS.accountNumber}\nIBAN: ${BANK_DETAILS.iban}\nAccount Type: ${BANK_DETAILS.accountType}\nRouting Code: ${BANK_DETAILS.routingCode}\nSWIFT Code: ${BANK_DETAILS.swiftCode}\n\nAmount: AED ${amount.toLocaleString()}\nReference: ${reference}\n\nPlease include the reference number in your transfer description.\n\nThank you,\nWhite Caves Real Estate`;
    }
    
    if (onGenerateMessage) {
      onGenerateMessage(message, selectedMethod);
    }
    
    navigator.clipboard.writeText(message);
    setCopied('message');
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(null), 2000);
  }, [selectedMethod, amount, reference, clientName, invoiceId, onGenerateMessage]);
  
  return (
    <div className="payment-instruction-deck">
      <div className="deck-header" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }} aria-expanded={expanded} aria-label="Toggle payment instructions">
        <div className="deck-title">
          <CreditCard size={20} />
          <h3>Payment Instructions</h3>
        </div>
        <button className="expand-btn" tabIndex={-1} aria-hidden="true">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {expanded && (
        <div className="deck-content">
          {showMethodSelector && (
            <PaymentMethodSelector 
              selected={selectedMethod} 
              onSelect={setSelectedMethod} 
            />
          )}
          
          <div className="payment-details">
            {selectedMethod === 'qr' && (
              <QRCodeDisplay 
                amount={amount} 
                reference={reference}
                onCopy={handleCopy}
              />
            )}
            
            {selectedMethod === 'cheque' && (
              <ChequeInstructions 
                amount={amount}
                reference={reference}
                payeeName={BANK_DETAILS.accountName}
              />
            )}
            
            {selectedMethod === 'transfer' && (
              <BankTransferDetails 
                amount={amount}
                reference={reference}
                onCopy={handleCopy}
                copied={copied}
              />
            )}
          </div>
          
          <div className="deck-actions">
            <button className="action-btn primary" onClick={generateMessage}>
              {copied === 'message' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'message' ? 'Copied!' : 'Copy Message'}
            </button>
            <button className="action-btn secondary">
              <Download size={16} />
              Download PDF
            </button>
            <button className="action-btn secondary">
              <Share2 size={16} />
              Share via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

PaymentInstructionDeck.displayName = 'PaymentInstructionDeck';
export default PaymentInstructionDeck;

export { PaymentMethodSelector, QRCodeDisplay, ChequeInstructions, BankTransferDetails };
