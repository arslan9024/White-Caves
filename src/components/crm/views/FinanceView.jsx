import React from 'react';
import { Wallet, CreditCard, Receipt, Percent, PieChart, TrendingUp } from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, type: 'Payment Received', amount: 'AED 250,000', client: 'Ahmad Hassan', date: '2024-01-10', status: 'completed' },
  { id: 2, type: 'Commission Payout', amount: 'AED 12,500', agent: 'Sarah Ahmed', date: '2024-01-09', status: 'completed' },
  { id: 3, type: 'Security Deposit', amount: 'AED 45,000', client: 'Chen Wei', date: '2024-01-08', status: 'pending' },
];

const REVENUE_BREAKDOWN = [
  { category: 'Property Sales', amount: 'AED 1.8M', percentage: 45 },
  { category: 'Rental Commissions', amount: 'AED 850K', percentage: 25 },
  { category: 'Property Management', amount: 'AED 420K', percentage: 15 },
  { category: 'Consulting Services', amount: 'AED 380K', percentage: 15 },
];

export default function FinanceView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderTransactions = () => (
    <div className="transactions-view">
      <h2 className="view-title">Transactions</h2>
      <p className="view-subtitle">Financial transactions history</p>
      
      <div className="transactions-summary">
        <div className="summary-card">
          <TrendingUp size={24} color="#10B981" />
          <div className="summary-value">AED 2.45M</div>
          <div className="summary-label">This Month</div>
        </div>
        <div className="summary-card">
          <TrendingUp size={24} color="#3B82F6" />
          <div className="summary-value">+18%</div>
          <div className="summary-label">vs Last Month</div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <div className="table-cell">Type</div>
          <div className="table-cell">Amount</div>
          <div className="table-cell">Client/Agent</div>
          <div className="table-cell">Date</div>
          <div className="table-cell">Status</div>
        </div>
        {TRANSACTIONS.map(txn => (
          <div key={txn.id} className="table-row">
            <div className="table-cell">{txn.type}</div>
            <div className="table-cell">{txn.amount}</div>
            <div className="table-cell">{txn.client || txn.agent}</div>
            <div className="table-cell">{txn.date}</div>
            <div className="table-cell">
              <span className={`status-badge ${txn.status}`}>{txn.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="invoices-view">
      <h2 className="view-title">Invoices</h2>
      <p className="view-subtitle">Invoice generation and tracking</p>
      <div className="invoice-stats">
        <div className="invoice-stat">
          <Receipt size={32} color="var(--crm-gold)" />
          <div className="invoice-value">45</div>
          <div className="invoice-label">Pending</div>
        </div>
        <div className="invoice-stat">
          <Receipt size={32} color="#10B981" />
          <div className="invoice-value">234</div>
          <div className="invoice-label">Paid This Month</div>
        </div>
      </div>
    </div>
  );

  const renderCommissions = () => (
    <div className="commissions-view">
      <h2 className="view-title">Agent Commissions</h2>
      <p className="view-subtitle">Commission tracking and payouts</p>
      <div className="commission-stats">
        <div className="commission-stat">
          <Percent size={32} color="var(--crm-gold)" />
          <div className="commission-value">AED 125K</div>
          <div className="commission-label">Pending Payouts</div>
        </div>
        <div className="commission-stat">
          <CreditCard size={32} color="#10B981" />
          <div className="commission-value">AED 450K</div>
          <div className="commission-label">Paid This Month</div>
        </div>
      </div>
    </div>
  );

  const renderRevenueReports = () => (
    <div className="revenue-view">
      <h2 className="view-title">Revenue Reports</h2>
      <p className="view-subtitle">Financial performance analysis</p>
      <div className="revenue-breakdown">
        {REVENUE_BREAKDOWN.map(item => (
          <div key={item.category} className="revenue-item">
            <div className="revenue-info">
              <span className="revenue-category">{item.category}</span>
              <span className="revenue-amount">{item.amount}</span>
            </div>
            <div className="revenue-bar">
              <div className="revenue-progress" style={{ width: `${item.percentage}%` }} />
            </div>
            <span className="revenue-percent">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'transactions':
        return renderTransactions();
      case 'invoices':
        return renderInvoices();
      case 'commissions':
        return renderCommissions();
      case 'revenue-reports':
        return renderRevenueReports();
      default:
        return renderTransactions();
    }
  };

  return (
    <div className="view-container finance-view">
      {renderContent()}
    </div>
  );
}
