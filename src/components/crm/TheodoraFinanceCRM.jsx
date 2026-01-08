import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, FileText, CreditCard, Receipt,
  ArrowUp, ArrowDown, Search, Filter, Download, Calendar,
  CheckCircle, Clock, AlertCircle, PieChart, BarChart3
} from 'lucide-react';
import './AssistantDashboard.css';

const INVOICES = [
  { id: 'INV-2024-0156', client: 'Ahmed Al Rashid', property: 'Villa 348', amount: 250000, status: 'paid', date: '2024-01-08', dueDate: '2024-01-15' },
  { id: 'INV-2024-0155', client: 'Sarah Johnson', property: 'Apt 1205', amount: 120000, status: 'pending', date: '2024-01-07', dueDate: '2024-01-14' },
  { id: 'INV-2024-0154', client: 'Mohammed Khan', property: 'Townhouse 12', amount: 95000, status: 'overdue', date: '2024-01-01', dueDate: '2024-01-08' },
  { id: 'INV-2024-0153', client: 'Maria Santos', property: 'Penthouse 501', amount: 350000, status: 'paid', date: '2024-01-05', dueDate: '2024-01-12' },
  { id: 'INV-2024-0152', client: 'James Wilson', property: 'Studio 302', amount: 45000, status: 'pending', date: '2024-01-04', dueDate: '2024-01-11' }
];

const EXPENSES = [
  { id: 1, category: 'Marketing', description: 'Facebook Ads Campaign', amount: 15000, date: '2024-01-08', status: 'approved' },
  { id: 2, category: 'Maintenance', description: 'AC Repair - Villa 48', amount: 2500, date: '2024-01-07', status: 'pending' },
  { id: 3, category: 'Utilities', description: 'Office Electricity', amount: 3200, date: '2024-01-06', status: 'approved' },
  { id: 4, category: 'Salaries', description: 'January Payroll', amount: 450000, date: '2024-01-01', status: 'processed' }
];

const TheodoraFinanceCRM = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="assistant-dashboard theodora">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' }}>
          <DollarSign size={28} />
        </div>
        <div className="assistant-info">
          <h2>Theodora - Finance Director</h2>
          <p>Manages invoice processing, payment tracking, financial reporting, and budget analysis</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 4.2M</span>
            <span className="stat-label">Revenue MTD</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 18%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 860K</span>
            <span className="stat-label">Pending</span>
          </div>
          <span className="stat-change">12 invoices</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 95K</span>
            <span className="stat-label">Overdue</span>
          </div>
          <span className="stat-change negative">3 invoices</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <PieChart size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">32%</span>
            <span className="stat-label">Profit Margin</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 2%</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['overview', 'invoices', 'expenses', 'reports'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="finance-overview">
            <div className="finance-summary">
              <div className="summary-card revenue">
                <h4>Total Revenue</h4>
                <div className="summary-value">AED 48.5M</div>
                <div className="summary-period">Year to Date</div>
              </div>
              <div className="summary-card expenses">
                <h4>Total Expenses</h4>
                <div className="summary-value">AED 33.2M</div>
                <div className="summary-period">Year to Date</div>
              </div>
              <div className="summary-card profit">
                <h4>Net Profit</h4>
                <div className="summary-value">AED 15.3M</div>
                <div className="summary-period">Year to Date</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="invoices-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search invoices..." />
              </div>
              <button className="add-btn"><FileText size={16} /> Create Invoice</button>
            </div>
            <div className="invoices-table">
              <div className="table-header">
                <span>Invoice #</span>
                <span>Client</span>
                <span>Property</span>
                <span>Amount</span>
                <span>Due Date</span>
                <span>Status</span>
              </div>
              {INVOICES.map(invoice => (
                <div key={invoice.id} className="table-row">
                  <span className="invoice-id">{invoice.id}</span>
                  <span>{invoice.client}</span>
                  <span>{invoice.property}</span>
                  <span className="amount">AED {invoice.amount.toLocaleString()}</span>
                  <span>{invoice.dueDate}</span>
                  <span className={`status-badge ${invoice.status}`}>{invoice.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-view">
            <h3>Recent Expenses</h3>
            <div className="expenses-list">
              {EXPENSES.map(expense => (
                <div key={expense.id} className="expense-card">
                  <div className="expense-header">
                    <span className="category">{expense.category}</span>
                    <span className={`status-badge ${expense.status}`}>{expense.status}</span>
                  </div>
                  <p className="description">{expense.description}</p>
                  <div className="expense-footer">
                    <span className="amount">AED {expense.amount.toLocaleString()}</span>
                    <span className="date">{expense.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-view">
            <h3>Financial Reports</h3>
            <div className="report-cards">
              <div className="report-card">
                <BarChart3 size={24} />
                <h4>Monthly P&L</h4>
                <p>Profit & Loss Statement</p>
                <button><Download size={14} /> Download</button>
              </div>
              <div className="report-card">
                <PieChart size={24} />
                <h4>Expense Breakdown</h4>
                <p>Category-wise analysis</p>
                <button><Download size={14} /> Download</button>
              </div>
              <div className="report-card">
                <TrendingUp size={24} />
                <h4>Revenue Trends</h4>
                <p>12-month comparison</p>
                <button><Download size={14} /> Download</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TheodoraFinanceCRM;
