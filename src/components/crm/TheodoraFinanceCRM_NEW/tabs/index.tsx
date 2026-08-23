import React, { useState, useEffect } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import OverviewTab from './OverviewTab';
import InvoicesTab from './InvoicesTab';
import PaymentsTab from './PaymentsTab';
import ExpensesTab from './ExpensesTab';
import ReportsTab from './ReportsTab';
import CommissionsTab from './CommissionsTab';
import DirectorsLoanTab from './DirectorsLoanTab';
import VatReturnTab from './VatReturnTab';
import CorporateTaxTab from './CorporateTaxTab';
import FinancialStatementsTab from './FinancialStatementsTab';
import AssistantLifecycleTab from '../../shared/AssistantLifecycleTab';
import '../TheodoraFinanceCRM.css';

interface TheodoraFinanceCRMProps {
  moduleId?: string;
  role?: string;
  user?: any;
}

const TheodoraFinanceCRM: React.FC<TheodoraFinanceCRMProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Synchronize incoming sub-item moduleId from sidebar (e.g. 3.14.5 "theodora-expenses")
  useEffect(() => {
    if (!moduleId) return;
    const tabMap: Record<string, string> = {
      'theodora-invoices': 'invoices',
      'theodora-payments': 'payments',
      'theodora-commissions': 'commissions',
      'theodora-receivables': 'invoices',
      'theodora-expenses': 'expenses',
      'theodora-directors-loan': 'directors-loan',
      'theodora-receipts': 'expenses',
      'theodora-vat-return': 'vat-return',
      'theodora-corporate-tax': 'corporate-tax',
      'theodora-pnl': 'financial-statements',
      'theodora-balance-sheet': 'financial-statements',
      'theodora-cashflow': 'financial-statements',
      'theodora-audit-report': 'financial-statements',
    };
    if (tabMap[moduleId]) {
      setActiveTab(tabMap[moduleId]);
    }
  }, [moduleId]);

  const {
    invoices,
    expenses,
    selectedInvoice,
    generatedMessage,
    financeStats,
    setSelectedInvoice,
    handleGeneratePaymentMessage,
    handleApproveExpense,
    handleRejectExpense,
    features,
    commissions,
    pendingCommissions,
    approvedCommissions,
    paidCommissions,
    commissionsLoading,
    handleCreateCommission,
    handleUpdateCommission,
    handleBulkPay,
    handleRefreshCommissions,
  } = useFinanceData();

  const tabGroups = [
    {
      group: 'Core',
      items: [{ id: 'overview', label: 'Overview', icon: '📊' }],
    },
    {
      group: 'Receivables & Income',
      items: [
        { id: 'invoices', label: '3.14.1 Tax Invoices', icon: '📄' },
        { id: 'payments', label: '3.14.2 Payments & Escrow', icon: '💳' },
        { id: 'commissions', label: '3.14.3 Commissions', icon: '💵' },
      ],
    },
    {
      group: 'Payables & Expenditures',
      items: [
        { id: 'expenses', label: '3.14.5 42 Master Expenses', icon: '💰' },
        { id: 'directors-loan', label: '3.14.6 Director Loan Advances', icon: '🏦' },
      ],
    },
    {
      group: 'UAE Tax & Compliance',
      items: [
        { id: 'vat-return', label: '3.14.8 FTA Form 201 VAT', icon: '🏛️' },
        { id: 'corporate-tax', label: '3.14.9 Corporate Tax 9%', icon: '⚖️' },
      ],
    },
    {
      group: 'Financial Statements & Audit',
      items: [
        { id: 'financial-statements', label: '3.14.10 P&L / Balance Sheet / Audit', icon: '📈' },
        { id: 'reports', label: 'Custom Analytics', icon: '🔍' },
        { id: 'lifecycle', label: 'AI Health', icon: '🔄' },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab financeStats={financeStats} />;
      case 'commissions':
        return (
          <CommissionsTab
            commissions={commissions}
            pendingCommissions={pendingCommissions}
            approvedCommissions={approvedCommissions}
            paidCommissions={paidCommissions}
            loading={commissionsLoading ?? false}
            onApprove={(id) => handleUpdateCommission({ id, status: 'approved' })}
            onReject={(id) => handleUpdateCommission({ id, status: 'cancelled' })}
            onBulkPay={handleBulkPay}
            onCreate={(data) =>
              handleCreateCommission(
                data as {
                  agentId: string;
                  amount: number;
                  percentage?: number;
                  type?: string;
                  notes?: string;
                  leadId?: string;
                  propertyId?: string;
                }
              )
            }
            onRefresh={handleRefreshCommissions}
          />
        );
      case 'invoices':
        return <InvoicesTab invoices={invoices} onSelectInvoice={setSelectedInvoice} />;
      case 'payments':
        return (
          <PaymentsTab
            selectedInvoice={selectedInvoice}
            generatedMessage={generatedMessage}
            onGenerateMessage={handleGeneratePaymentMessage}
          />
        );
      case 'expenses':
        return <ExpensesTab expenses={expenses} onApprove={handleApproveExpense} onReject={handleRejectExpense} />;
      case 'directors-loan':
        return <DirectorsLoanTab />;
      case 'vat-return':
        return <VatReturnTab />;
      case 'corporate-tax':
        return <CorporateTaxTab />;
      case 'financial-statements':
        return <FinancialStatementsTab />;
      case 'reports':
        return <ReportsTab invoices={invoices} expenses={expenses} />;
      case 'lifecycle':
        return <AssistantLifecycleTab assistantId="theodora" color="#F59E0B" assistantName="Theodora" />;
      default:
        return <OverviewTab financeStats={financeStats} />;
    }
  };

  return (
    <div className="crm-container finance-crm" style={{ maxWidth: '100%', padding: '0 0.5rem' }}>
      {/* Dynamic Header */}
      <div
        className="crm-header"
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 15px rgba(30, 27, 75, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
              }}
            >
              💳
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Theodora AI — In-House Accounting & Finance Suite
                </h2>
                <span
                  style={{
                    fontSize: '0.7rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#FDE68A',
                    fontWeight: 800,
                  }}
                >
                  Zoho-Free Autonomous Suite
                </span>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#C7D2FE' }}>
                Managing full financial lifecycle: Tax Invoicing, 42 Master Expenses, Wio vs. Director Loan, UAE FTA Form 201 VAT & 9% Corporate Tax.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          background: '#FFFFFF',
          padding: '10px 14px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {tabGroups.map((group) => (
          <div key={group.group} style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginRight: '4px' }}>
              {group.group}:
            </span>
            {group.items.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: activeTab === tab.id ? '1px solid #8B5CF6' : '1px solid transparent',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' : '#F8FAFC',
                  color: activeTab === tab.id ? '#FFFFFF' : '#334155',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeTab === tab.id ? '0 2px 5px rgba(139, 92, 246, 0.25)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Main CRM Viewport Content */}
      <div className="crm-content" style={{ minHeight: '400px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default TheodoraFinanceCRM;
