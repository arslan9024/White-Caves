import React, { useState } from 'react';
import { BarChart3, PieChart, Download, Calendar } from 'lucide-react';

interface Invoice {
  id: string | number;
  amount: number;
  status: string;
}

interface Expense {
  id: string | number;
  amount: number;
  status: string;
}

interface ReportsTabProps {
  invoices: Invoice[];
  expenses: Expense[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({ invoices, expenses }) => {
  const [reportType, setReportType] = useState<string>('revenue');

  const totalRevenue = invoices
    .filter((i: Invoice) => i.status === 'paid')
    .reduce((sum: number, i: Invoice) => sum + i.amount, 0);

  const totalExpenses = expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="reports-view">
      <h3>Financial Reports</h3>
      
      <div className="report-generator">
        <div className="report-options">
          <div className="option-group">
            <label>Report Type:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="revenue">Revenue Report</option>
              <option value="expenses">Expense Report</option>
              <option value="profit">Profit & Loss Report</option>
              <option value="cash-flow">Cash Flow Report</option>
            </select>
          </div>
          <button className="btn-generate">
            <Download size={16} /> Generate Report
          </button>
        </div>

        <div className="report-preview">
          {reportType === 'revenue' && (
            <div className="report-section">
              <h4>
                <BarChart3 size={18} /> Revenue Report
              </h4>
              <div className="report-data">
                <div className="data-row">
                  <span>Total Paid Invoices:</span>
                  <strong>AED {totalRevenue.toLocaleString()}</strong>
                </div>
                <div className="data-row">
                  <span>Number of Invoices:</span>
                  <strong>{invoices.filter(i => i.status === 'paid').length}</strong>
                </div>
                <div className="data-row">
                  <span>Average Invoice Value:</span>
                  <strong>
                    AED {(totalRevenue / (invoices.filter(i => i.status === 'paid').length || 1)).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {reportType === 'expenses' && (
            <div className="report-section">
              <h4>
                <BarChart3 size={18} /> Expense Report
              </h4>
              <div className="report-data">
                <div className="data-row">
                  <span>Total Expenses:</span>
                  <strong>AED {totalExpenses.toLocaleString()}</strong>
                </div>
                <div className="data-row">
                  <span>Number of Expenses:</span>
                  <strong>{expenses.length}</strong>
                </div>
                <div className="data-row">
                  <span>Average Expense:</span>
                  <strong>AED {(totalExpenses / (expenses.length || 1)).toLocaleString()}</strong>
                </div>
                <div className="data-row">
                  <span>Pending Approvals:</span>
                  <strong>{expenses.filter(e => e.status === 'pending').length}</strong>
                </div>
              </div>
            </div>
          )}

          {reportType === 'profit' && (
            <div className="report-section">
              <h4>
                <PieChart size={18} /> Profit & Loss Report
              </h4>
              <div className="report-data">
                <div className="data-row">
                  <span>Total Revenue:</span>
                  <strong style={{ color: '#10B981' }}>AED {totalRevenue.toLocaleString()}</strong>
                </div>
                <div className="data-row">
                  <span>Total Expenses:</span>
                  <strong style={{ color: '#EF4444' }}>AED {totalExpenses.toLocaleString()}</strong>
                </div>
                <div className="data-row highlight">
                  <span>Net Profit:</span>
                  <strong style={{ color: netProfit >= 0 ? '#10B981' : '#EF4444' }}>
                    AED {netProfit.toLocaleString()}
                  </strong>
                </div>
                <div className="data-row">
                  <span>Profit Margin:</span>
                  <strong>
                    {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
                  </strong>
                </div>
              </div>
            </div>
          )}

          {reportType === 'cash-flow' && (
            <div className="report-section">
              <h4>
                <BarChart3 size={18} /> Cash Flow Report
              </h4>
              <div className="report-data">
                <div className="data-row">
                  <span>Cash Inflow (Paid):</span>
                  <strong style={{ color: '#10B981' }}>AED {totalRevenue.toLocaleString()}</strong>
                </div>
                <div className="data-row">
                  <span>Cash Outflow (Expenses):</span>
                  <strong style={{ color: '#EF4444' }}>AED {totalExpenses.toLocaleString()}</strong>
                </div>
                <div className="data-row">
                  <span>Pending Inflow:</span>
                  <strong>
                    AED {invoices
                      .filter(i => i.status !== 'paid')
                      .reduce((sum, i) => sum + i.amount, 0)
                      .toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
