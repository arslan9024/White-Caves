import React from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

interface Invoice {
  id: string | number;
  client: string;
  amount: number;
  status: string;
  dueDate: string;
}

interface PaymentsTabProps {
  selectedInvoice: Invoice | null;
  generatedMessage: string;
  onGenerateMessage: () => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ selectedInvoice, generatedMessage, onGenerateMessage }) => {
  if (!selectedInvoice) {
    return (
      <div className="payments-view">
        <h3>Payment Processing</h3>
        <div className="empty-state">
          <CreditCard size={48} />
          <p>Select an invoice to process payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-view">
      <h3>Payment Processing</h3>
      
      <div className="payment-details">
        <div className="invoice-summary">
          <h4>Invoice Details</h4>
          <div className="summary-row">
            <span>Invoice ID:</span>
            <strong>{selectedInvoice.id}</strong>
          </div>
          <div className="summary-row">
            <span>Client:</span>
            <strong>{selectedInvoice.client}</strong>
          </div>
          <div className="summary-row">
            <span>Amount Due:</span>
            <strong>AED {selectedInvoice.amount.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>Status:</span>
            <span className={`status-badge status-${selectedInvoice.status}`}>
              {selectedInvoice.status}
            </span>
          </div>
          <div className="summary-row">
            <span>Due Date:</span>
            <strong>{selectedInvoice.dueDate}</strong>
          </div>
        </div>

        <div className="payment-methods">
          <h4>Payment Methods</h4>
          <div className="method-grid">
            <div className="method-option">
              <CreditCard size={20} />
              <span>Bank Transfer</span>
            </div>
            <div className="method-option">
              <span>💳</span>
              <span>Credit Card</span>
            </div>
            <div className="method-option">
              <span>📱</span>
              <span>Digital Wallet</span>
            </div>
            <div className="method-option">
              <span>💰</span>
              <span>Cash Payment</span>
            </div>
          </div>
        </div>

        <div className="payment-messages">
          <h4>Payment Reminders</h4>
          <div className="message-templates">
            <div className="template-item">
              <p>Hi {selectedInvoice.client}, your invoice {selectedInvoice.id} is due on {selectedInvoice.dueDate}. Please process payment at your earliest convenience.</p>
              <button className="btn-send">Send Reminder</button>
            </div>
            {generatedMessage && (
              <div className="template-item generated">
                <p>{generatedMessage}</p>
                <button className="btn-send">Send Message</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
