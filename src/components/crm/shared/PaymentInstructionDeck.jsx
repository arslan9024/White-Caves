import React, { memo, useState, useCallback } from 'react';
import { 
  CreditCard, QrCode, FileText, Building2, Copy, Check, 
  Download, Share2, ChevronDown, ChevronUp
} from 'lucide-react';
import './PaymentComponents.css';

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

const BANK_DETAILS = {
  bankName: 'Mashreq NEOBiz',
  accountName: 'WHITE CAVES REAL ESTATE L.L.C',
  accountNumber: '019101501006',
  iban: 'AE960330000019101501006',
  swiftCode: 'BOMLAEAD',
  routingCode: '203320101',
  accountType: 'Lite',
  branch: 'Mashreq NEOBiz Digital',
  currency: 'AED'
};

const QRCodeDisplay = memo(({ amount, reference, onCopy }) => {
  const paymentInfo = `Merchant: WHITE CAVES REAL ESTATE L.L.C\nAmount: AED ${amount?.toLocaleString()}\nReference: ${reference}\nPayment Method: Aani - Scan with enabled bank apps`;
  
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
        />
        <p className="qr-instruction">Scan and pay using Aani enabled bank apps</p>
      </div>
      <div className="qr-details">
        <p className="qr-amount">Amount: <strong>AED {amount?.toLocaleString()}</strong></p>
        <p className="qr-reference">Reference: <strong>{reference}</strong></p>
        <button className="copy-btn" onClick={() => onCopy(paymentInfo)}>
          <Copy size={14} /> Copy Payment Info
        </button>
      </div>
    </div>
  );
});

QRCodeDisplay.displayName = 'QRCodeDisplay';

const ChequeInstructions = memo(({ amount, reference, payeeName }) => (
  <div className="cheque-instructions">
    <div className="instruction-card">
      <h4>Cheque Payment Instructions</h4>
      <ol className="instruction-list">
        <li>Make the cheque payable to: <strong>{payeeName || BANK_DETAILS.accountName}</strong></li>
        <li>Amount: <strong>AED {amount?.toLocaleString()}</strong> (in words on the cheque)</li>
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

const BankTransferDetails = memo(({ amount, reference, onCopy, copied }) => (
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
        <span className="detail-value">AED {amount?.toLocaleString()}</span>
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

const PaymentMethodSelector = memo(({ selected, onSelect }) => (
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
}) => {
  const [selectedMethod, setSelectedMethod] = useState('transfer');
  const [copied, setCopied] = useState(null);
  const [expanded, setExpanded] = useState(true);
  
  const handleCopy = useCallback((text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
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
    setTimeout(() => setCopied(null), 2000);
  }, [selectedMethod, amount, reference, clientName, invoiceId, onGenerateMessage]);
  
  return (
    <div className="payment-instruction-deck">
      <div className="deck-header" onClick={() => setExpanded(!expanded)}>
        <div className="deck-title">
          <CreditCard size={20} />
          <h3>Payment Instructions</h3>
        </div>
        <button className="expand-btn">
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

export { PaymentMethodSelector, QRCodeDisplay, ChequeInstructions, BankTransferDetails, BANK_DETAILS };
