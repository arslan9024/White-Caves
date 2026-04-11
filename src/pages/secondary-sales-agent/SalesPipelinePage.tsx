import React, { FC, useState } from 'react';
import '../RolePages.css';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
}

interface Deal {
  id: number;
  property: string;
  buyer: string;
  price: string;
  stage: string;
  daysInStage: number;
}

const SalesPipelinePage: FC = () => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const pipelineStages: PipelineStage[] = [
    { id: 'inquiry', name: 'Inquiry', color: '#6b7280' },
    { id: 'viewing', name: 'Viewing', color: '#3b82f6' },
    { id: 'negotiating', name: 'Negotiating', color: '#f59e0b' },
    { id: 'documentation', name: 'Documentation', color: '#8b5cf6' },
    { id: 'closing', name: 'Closing', color: '#10b981' },
  ];

  const deals: Deal[] = [
    { id: 1, property: 'Palm Jumeirah Villa', buyer: 'John Smith', price: 'AED 45M', stage: 'negotiating', daysInStage: 5 },
    { id: 2, property: 'Downtown Penthouse', buyer: 'Emma Wilson', price: 'AED 28M', stage: 'documentation', daysInStage: 3 },
    { id: 3, property: 'Marina 3BR Apt', buyer: 'Michael Brown', price: 'AED 3.5M', stage: 'viewing', daysInStage: 2 },
    { id: 4, property: 'Emirates Hills Villa', buyer: 'Lisa Chen', price: 'AED 65M', stage: 'inquiry', daysInStage: 1 },
  ];

  const getDealsByStage = (stageId: string): Deal[] => deals.filter(d => d.stage === stageId);

  const totalPipelineValue = deals.reduce((sum, deal) => {
    if (!deal.price || typeof deal.price !== 'string') return sum;
    const parsed = parseFloat(deal.price.replace('AED ', '').replace('M', ''));
    const value = Number.isNaN(parsed) ? 0 : parsed * 1000000;
    return sum + value;
  }, 0);

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedDeal && (
          <div className="deal-modal-overlay" onClick={() => setSelectedDeal(null)} role="dialog" aria-modal="true" aria-label="Deal details">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPipelinePage;
