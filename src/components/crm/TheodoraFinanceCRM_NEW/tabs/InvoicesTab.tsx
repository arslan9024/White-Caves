import React from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import type { Invoice } from '../data/finance';

interface InvoicesTabProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({ invoices, onSelectInvoice }) => {
  return (
    <div className="invoices-view">
      <h3>Invoice Management</h3>
      <div className="tab-toolbar">
        <div className="search-bar">
          <Search size={16} />
          <input type="text" placeholder="Search invoices..." aria-label="Search invoices" />
        </div>
        <button className="filter-btn">
          <Filter size={16} /> Filter
        </button>
        <button className="export-btn">
          <Download size={16} /> Export
        </button>
      </div>

      <table className="invoices-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Client</th>
            <th>Property</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice: Invoice) => (
            <tr key={invoice.id} className={`status-${invoice.status}`}>
              <td>
                <div className="invoice-id">
                  <FileText size={14} />
                  {invoice.id}
                </div>
              </td>
              <td>{invoice.client}</td>
              <td>{invoice.property}</td>
              <td className="amount">AED {invoice.amount.toLocaleString()}</td>
              <td>
                <span className={`status-badge status-${invoice.status}`}>
                  {invoice.status}
                </span>
              </td>
              <td>{invoice.date}</td>
              <td>{invoice.dueDate}</td>
              <td>
                <button
                  className="action-btn-small"
                  onClick={() => onSelectInvoice(invoice)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTab;
