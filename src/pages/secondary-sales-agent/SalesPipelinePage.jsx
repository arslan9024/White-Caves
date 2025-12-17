import React, { useState } from 'react';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function SalesPipelinePage() {
  const [selectedDeal, setSelectedDeal] = useState(null);

  const pipelineStages = [
    { id: 'inquiry', name: 'Inquiry', color: '#6b7280' },
    { id: 'viewing', name: 'Viewing', color: '#3b82f6' },
    { id: 'negotiating', name: 'Negotiating', color: '#f59e0b' },
    { id: 'documentation', name: 'Documentation', color: '#8b5cf6' },
    { id: 'closing', name: 'Closing', color: '#10b981' },
  ];

  const deals = [
    { id: 1, property: 'Palm Jumeirah Villa', buyer: 'John Smith', price: 'AED 45M', stage: 'negotiating', daysInStage: 5, expectedCommission: 'AED 450K' },
    { id: 2, property: 'Downtown Penthouse', buyer: 'Emma Wilson', price: 'AED 28M', stage: 'documentation', daysInStage: 3, expectedCommission: 'AED 280K' },
    { id: 3, property: 'Marina 3BR Apt', buyer: 'Michael Brown', price: 'AED 3.5M', stage: 'viewing', daysInStage: 2, expectedCommission: 'AED 35K' },
    { id: 4, property: 'Emirates Hills Villa', buyer: 'Lisa Chen', price: 'AED 65M', stage: 'inquiry', daysInStage: 1, expectedCommission: 'AED 650K' },
    { id: 5, property: 'JBR Penthouse', buyer: 'Omar Hassan', price: 'AED 12M', stage: 'closing', daysInStage: 2, expectedCommission: 'AED 120K' },
    { id: 6, property: 'Business Bay Office', buyer: 'Tech Corp', price: 'AED 8M', stage: 'negotiating', daysInStage: 7, expectedCommission: 'AED 80K' },
  ];

  const getDealsByStage = (stageId) => deals.filter(d => d.stage === stageId);

  const totalPipelineValue = deals.reduce((sum, deal) => {
    const value = parseFloat(deal.price.replace('AED ', '').replace('M', '')) * 1000000;
    return sum + value;
  }, 0);

  const totalExpectedCommission = deals.reduce((sum, deal) => {
    const value = parseFloat(deal.expectedCommission.replace('AED ', '').replace('K', '')) * 1000;
    return sum + value;
  }, 0);

  return (
    <div className="role-page">
      <RoleNavigation role="secondary-sales-agent" />
      
      <div className="role-page-content">
        <div className="page-header">
          <h1>Sales Pipeline</h1>
          <p>Track your deals from inquiry to closing</p>
        </div>

        <div className="pipeline-summary">
          <div className="summary-card">
            <span className="summary-label">Total Deals</span>
            <span className="summary-value">{deals.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Pipeline Value</span>
            <span className="summary-value">AED {(totalPipelineValue / 1000000).toFixed(0)}M</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Expected Commission</span>
            <span className="summary-value">AED {(totalExpectedCommission / 1000).toFixed(0)}K</span>
          </div>
        </div>

        <div className="pipeline-board">
          {pipelineStages.map(stage => (
            <div key={stage.id} className="pipeline-column">
              <div className="column-header" style={{borderTopColor: stage.color}}>
                <h3>{stage.name}</h3>
                <span className="deal-count">{getDealsByStage(stage.id).length}</span>
              </div>
              <div className="column-deals">
                {getDealsByStage(stage.id).map(deal => (
                  <div 
                    key={deal.id} 
                    className="deal-card"
                    onClick={() => setSelectedDeal(deal)}
                  >
                    <h4>{deal.property}</h4>
                    <p className="deal-buyer">{deal.buyer}</p>
                    <div className="deal-details">
                      <span className="deal-price">{deal.price}</span>
                      <span className="deal-days">{deal.daysInStage}d</span>
                    </div>
                    <span className="deal-commission">{deal.expectedCommission}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedDeal && (
          <div className="deal-modal-overlay" onClick={() => setSelectedDeal(null)}>
            <div className="deal-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedDeal(null)}>×</button>
              <h2>{selectedDeal.property}</h2>
              <div className="modal-details">
                <div className="detail-row">
                  <span className="detail-label">Buyer</span>
                  <span className="detail-value">{selectedDeal.buyer}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">{selectedDeal.price}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Stage</span>
                  <span className="detail-value">{selectedDeal.stage}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Days in Stage</span>
                  <span className="detail-value">{selectedDeal.daysInStage} days</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Expected Commission</span>
                  <span className="detail-value highlight">{selectedDeal.expectedCommission}</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary">Move to Next Stage</button>
                <button className="btn btn-secondary">View Details</button>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Sales Process Guide</h3>
          <div className="process-steps">
            <div className="process-step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Inquiry</h4>
                <p>Initial buyer contact. Qualify the lead, understand requirements and budget.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Viewing</h4>
                <p>Property viewings. Show matching properties, gather feedback, address concerns.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Negotiating</h4>
                <p>Price negotiation. Facilitate offers between buyer and seller, reach agreement.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-number">4</span>
              <div className="step-content">
                <h4>Documentation</h4>
                <p>Form F signing, MOU, NOC from developer, mortgage arrangement if needed.</p>
              </div>
            </div>
            <div className="process-step">
              <span className="step-number">5</span>
              <div className="step-content">
                <h4>Closing</h4>
                <p>Transfer at trustee office and DLD. Title deed in buyer's name. Commission paid.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
