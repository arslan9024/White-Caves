import React, { useState } from 'react';
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const RegulationsTab = () => {
  const [activeReg, setActiveReg] = useState('uae');

  const regulations = {
    uae: {
      title: 'UAE Real Estate Regulations',
      items: [
        { id: 1, name: 'RERA Guidelines', status: 'compliant', lastReview: '2024-01-08' },
        { id: 2, name: 'DLD Requirements', status: 'compliant', lastReview: '2024-01-07' },
        { id: 3, name: 'Escrow Account Rules', status: 'compliant', lastReview: '2024-01-05' },
        { id: 4, name: 'Sanctions Compliance', status: 'compliant', lastReview: '2024-01-08' }
      ]
    },
    aml: {
      title: 'AML/CFT Regulations',
      items: [
        { id: 1, name: 'KYC Requirements', status: 'compliant', lastReview: '2024-01-08' },
        { id: 2, name: 'Transaction Reporting', status: 'compliant', lastReview: '2024-01-07' },
        { id: 3, name: 'Beneficial Owner ID', status: 'compliant', lastReview: '2024-01-06' },
        { id: 4, name: 'PEP Screening', status: 'compliant', lastReview: '2024-01-08' }
      ]
    },
    taxation: {
      title: 'Taxation & Financial Regulations',
      items: [
        { id: 1, name: 'VAT Compliance', status: 'compliant', lastReview: '2024-01-08' },
        { id: 2, name: 'Withholding Tax', status: 'compliant', lastReview: '2024-01-07' },
        { id: 3, name: 'Transfer Pricing', status: 'compliant', lastReview: '2024-01-06' },
        { id: 4, name: 'Financial Reporting', status: 'compliant', lastReview: '2024-01-05' }
      ]
    }
  };

  const current = regulations[activeReg];

  return (
    <div className="regulations-view">
      <h3>Regulatory Compliance Framework</h3>
      
      <div className="reg-tabs">
        <button
          className={`reg-tab ${activeReg === 'uae' ? 'active' : ''}`}
          onClick={() => setActiveReg('uae')}
        >
          UAE Regulations
        </button>
        <button
          className={`reg-tab ${activeReg === 'aml' ? 'active' : ''}`}
          onClick={() => setActiveReg('aml')}
        >
          AML/CFT
        </button>
        <button
          className={`reg-tab ${activeReg === 'taxation' ? 'active' : ''}`}
          onClick={() => setActiveReg('taxation')}
        >
          Taxation
        </button>
      </div>

      <div className="regulations-content">
        <h4>{current.title}</h4>
        <div className="regulations-list">
          {current.items.map((item) => (
            <div key={item.id} className="regulation-item">
              <div className="regulation-header">
                <div className="regulation-title">
                  <FileText size={16} />
                  <span>{item.name}</span>
                </div>
                <span className={`compliance-badge status-${item.status}`}>
                  {item.status}
                </span>
              </div>
              <div className="regulation-footer">
                <span className="last-review">Last Review: {item.lastReview}</span>
                <button className="btn-review-small">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="compliance-checklist">
        <h4>Overall Compliance Status</h4>
        <div className="checklist-items">
          <div className="checklist-item">
            <CheckCircle size={18} />
            <span>All UAE regulations up to date</span>
          </div>
          <div className="checklist-item">
            <CheckCircle size={18} />
            <span>AML/CFT processes implemented</span>
          </div>
          <div className="checklist-item">
            <CheckCircle size={18} />
            <span>Tax compliance verified</span>
          </div>
          <div className="checklist-item">
            <CheckCircle size={18} />
            <span>All audits completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationsTab;
