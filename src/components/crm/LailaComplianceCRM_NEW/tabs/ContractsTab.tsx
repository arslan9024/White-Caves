import React from 'react';
import { FileText, CheckCircle, Clock, Eye, Download } from 'lucide-react';

interface Contract {
  id: string | number;
  title: string;
  type: string;
  parties: string;
  value: number;
  status: string;
  date: string;
}

interface ContractsTabProps {
  contracts: Contract[];
  onApprove: (id: string | number) => void;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ contracts, onApprove }) => {
  return (
    <div className="contracts-view">
      <h3>Contract Review & Management</h3>
      
      <div className="contracts-toolbar">
        <div className="search-bar">
          <input type="text" placeholder="Search contracts..." aria-label="Search contracts" />
        </div>
        <button className="btn-new">+ New Contract</button>
      </div>

      <table className="contracts-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Parties</th>
            <th>Value</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c: Contract) => (
            <tr key={c.id} className={`status-${c.status}`}>
              <td>
                <div className="contract-title">
                  <FileText size={14} />
                  {c.title}
                </div>
              </td>
              <td>
                <span className="type-badge">{c.type}</span>
              </td>
              <td>{c.parties}</td>
              <td className="value">
                {c.value > 0 ? `AED ${(c.value / 1000000).toFixed(1)}M` : '-'}
              </td>
              <td>
                <span className={`status-badge status-${c.status}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </td>
              <td>{c.date}</td>
              <td>
                <div className="contract-actions">
                  <button className="btn-view" title="View contract" aria-label="View contract">
                    <Eye size={16} />
                  </button>
                  {c.status === 'pending_review' && (
                    <button
                      className="btn-approve"
                      onClick={() => onApprove(c.id)}
                      title="Approve contract"
                      aria-label="Approve contract"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button className="btn-download" title="Download" aria-label="Download contract">
                    <Download size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTab;
