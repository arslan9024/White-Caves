import React, { FC } from 'react';
import '../RolePages.css';

interface Step {
  number: number;
  title: string;
  description: string;
  documents: string[];
  timeline: string;
}

interface Document {
  category: string;
  items: string[];
}

interface FeeItem {
  item: string;
  amount: string;
}

interface TitleDeedRegistrationPageProps {}

const TitleDeedRegistrationPage: FC<TitleDeedRegistrationPageProps> = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Sign Memorandum of Understanding (MOU)',
      description: 'Buyer and seller sign Form F (MOU) with the agent. Buyer pays 10% deposit.',
      documents: ['Valid Emirates ID or Passport', 'Original cheques (deposit + remaining amount)', 'Signed Form F'],
      timeline: 'Day 1'
    },
    {
      number: 2,
      title: 'Obtain No Objection Certificate (NOC)',
      description: 'Seller applies for NOC from the developer confirming no outstanding dues.',
      documents: ['Copy of Title Deed', 'Copy of Passport', 'Payment of outstanding service charges'],
      timeline: '3-5 business days'
    },
    {
      number: 3,
      title: 'Mortgage Pre-Approval (if applicable)',
      description: 'If purchasing with a mortgage, obtain final approval from your bank.',
      documents: ['Property valuation report', 'Salary certificate', 'Bank statements', 'Signed SPA'],
      timeline: '5-10 business days'
    },
    {
      number: 4,
      title: 'Block Transfer at Trustee Office',
      description: 'Visit the DLD-approved trustee to complete the blocking process.',
      documents: ['Original NOC', 'Original Title Deed', 'Manager\'s cheques for all payments', 'Valid IDs of both parties'],
      timeline: 'Same day'
    },
    {
      number: 5,
      title: 'Transfer Ownership at DLD',
      description: 'Both parties visit Dubai Land Department to complete the transfer.',
      documents: ['Blocked transfer confirmation', 'All original documents', 'Payment receipts'],
      timeline: 'Same day'
    },
    {
      number: 6,
      title: 'Receive New Title Deed',
      description: 'New title deed is issued in buyer\'s name. Keep this document safe!',
      documents: ['Registration confirmation', 'Payment of DLD fees'],
      timeline: 'Immediate (digital) or 2-3 days (physical)'
    }
  ];

  const requiredDocuments: Document[] = [
    { category: 'Buyer', items: ['Valid Emirates ID or Passport', 'Passport copy with visa page', 'Power of Attorney (if applicable)'] },
    { category: 'Seller', items: ['Original Title Deed', 'Valid Emirates ID or Passport', 'NOC from Developer', 'Service charge clearance'] },
    { category: 'Financial', items: ['Manager\'s cheques for purchase amount', 'Manager\'s cheque for DLD fees', 'Mortgage approval letter (if applicable)'] },
  ];

  const feesSummary: FeeItem[] = [
    { item: 'DLD Transfer Fee', amount: '4% of property value' },
    { item: 'DLD Admin Fee', amount: 'AED 580' },
    { item: 'Trustee Fee (Cash)', amount: 'AED 2,100 + VAT' },
    { item: 'Trustee Fee (Mortgage)', amount: 'AED 4,200 + VAT' },
    { item: 'Mortgage Registration', amount: '0.25% of loan + AED 290' },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Title Deed Registration</h1>
          <p>Complete guide to property ownership transfer in Dubai</p>
        </div>

        <div className="process-timeline">
          <h3>Registration Process</h3>
          <div className="timeline">
            {steps.map((step) => (
              <div key={step.number} className="timeline-step">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <div className="step-header">
                    <h4>{step.title}</h4>
                    <span className="step-timeline">{step.timeline}</span>
                  </div>
                  <p>{step.description}</p>
                  <div className="step-documents">
                    <strong>Required:</strong>
                    <ul>
                      {step.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="documents-section">
          <h3>Document Checklist</h3>
          <div className="documents-grid">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="document-category">
                <h4>{doc.category}</h4>
                <ul>
                  {doc.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <input type="checkbox" id={`doc-${index}-${itemIndex}`} />
                      <label htmlFor={`doc-${index}-${itemIndex}`}>{item}</label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="fees-section">
          <h3>Transfer Fees Summary</h3>
          <div className="fees-table">
            {feesSummary.map((fee, index) => (
              <div key={index} className="fee-row">
                <span className="fee-name">{fee.item}</span>
                <span className="fee-amount">{fee.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleDeedRegistrationPage;
