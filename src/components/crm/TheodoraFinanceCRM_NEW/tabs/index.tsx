import React, { useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import OverviewTab from './OverviewTab';
import InvoicesTab from './InvoicesTab';
import PaymentsTab from './PaymentsTab';
import ExpensesTab from './ExpensesTab';
import ReportsTab from './ReportsTab';
import CommissionsTab from './CommissionsTab';
import AssistantLifecycleTab from '../../shared/AssistantLifecycleTab';
import '../TheodoraFinanceCRM.css';

const TheodoraFinanceCRM = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
    // Commission data (real API)
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'commissions', label: 'Commissions', icon: '💵' },
    { id: 'invoices', label: 'Invoices', icon: '📄' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'lifecycle', label: 'Lifecycle', icon: '🔄' }
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
            onCreate={(data) => handleCreateCommission(data as { agentId: string; amount: number; percentage?: number; type?: string; notes?: string; leadId?: string; propertyId?: string })}
            onRefresh={handleRefreshCommissions}
          />
        );
      case 'invoices':
        return <InvoicesTab invoices={invoices} onSelectInvoice={setSelectedInvoice} />;
      case 'payments':
        return <PaymentsTab selectedInvoice={selectedInvoice} generatedMessage={generatedMessage} onGenerateMessage={handleGeneratePaymentMessage} />;
      case 'expenses':
        return <ExpensesTab expenses={expenses} onApprove={handleApproveExpense} onReject={handleRejectExpense} />;
      case 'reports':
        return <ReportsTab invoices={invoices} expenses={expenses} />;
      case 'lifecycle':
        return <AssistantLifecycleTab assistantId="theodora" color="#F59E0B" assistantName="Theodora" />;
      default:
        return <OverviewTab financeStats={financeStats} />;
    }
  };

  return (
    <div className="crm-container finance-crm">
      <div className="crm-header">
        <div className="header-title">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' }}>
            <span>💰</span>
          </div>
          <div>
            <h2>Theodora - Finance Director</h2>
            <p>Manages invoice processing, payment tracking, financial reporting, and budget analysis</p>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="crm-content">
        {renderContent()}
      </div>

      <div className="features-section">
        <h3>Available Features</h3>
        <ul className="features-list">
          {features.map((feature) => (
            <li key={feature} className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TheodoraFinanceCRM;
