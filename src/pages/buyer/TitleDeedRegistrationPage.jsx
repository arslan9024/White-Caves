import React from 'react';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function TitleDeedRegistrationPage() {
  const steps = [
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

  const requiredDocuments = [
    { category: 'Buyer', items: ['Valid Emirates ID or Passport', 'Passport copy with visa page', 'Power of Attorney (if applicable)'] },
    { category: 'Seller', items: ['Original Title Deed', 'Valid Emirates ID or Passport', 'NOC from Developer', 'Service charge clearance'] },
    { category: 'Financial', items: ['Manager\'s cheques for purchase amount', 'Manager\'s cheque for DLD fees', 'Mortgage approval letter (if applicable)'] },
  ];

  const feesSummary = [
    { item: 'DLD Transfer Fee', amount: '4% of property value' },
    { item: 'DLD Admin Fee', amount: 'AED 580' },
    { item: 'Trustee Fee (Cash)', amount: 'AED 2,100 + VAT' },
    { item: 'Trustee Fee (Mortgage)', amount: 'AED 4,200 + VAT' },
    { item: 'Mortgage Registration', amount: '0.25% of loan + AED 290' },
  ];

  return (
    <div className="role-page">
      <RoleNavigation role="buyer" />
      
      <div className="role-page-content">
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
            {requiredDocuments.map((category, index) => (
              <div key={index} className="document-category">
                <h4>{category.category}</h4>
                <ul className="document-list">
                  {category.items.map((item, i) => (
                    <li key={i}>
                      <span className="check-icon">☐</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="fees-section">
          <h3>Registration Fees Summary</h3>
          <div className="fees-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {feesSummary.map((fee, index) => (
                  <tr key={index}>
                    <td>{fee.item}</td>
                    <td>{fee.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="info-section">
          <h3>Important Notes</h3>
          <div className="info-grid">
            <div className="info-card warning">
              <h4>⚠️ Title Deed Verification</h4>
              <p>Always verify the authenticity of the title deed through the Dubai REST app or DLD portal before proceeding with any transaction.</p>
            </div>
            <div className="info-card">
              <h4>📱 Digital Title Deed</h4>
              <p>Dubai now issues digital title deeds that can be accessed through the Dubai REST app. Physical copies can be requested for an additional fee.</p>
            </div>
            <div className="info-card">
              <h4>🏦 Mortgage Release</h4>
              <p>If the property has an existing mortgage, it must be released before transfer. The seller's bank will provide a liability letter.</p>
            </div>
            <div className="info-card">
              <h4>📋 Power of Attorney</h4>
              <p>If either party cannot attend in person, a notarized Power of Attorney can be used. It must be attested by UAE authorities.</p>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <h3>Need Assistance?</h3>
          <p>Our team can guide you through the entire title deed registration process.</p>
          <button className="btn btn-primary">Contact Our Team</button>
        </div>
      </div>
    </div>
  );
}
