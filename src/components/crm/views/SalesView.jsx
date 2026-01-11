import React from 'react';
import { Target, Users, Handshake, Route, FileSignature, TrendingUp } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'new', label: 'New Leads', count: 24, value: 'AED 12M', color: '#3B82F6' },
  { id: 'qualified', label: 'Qualified', count: 18, value: 'AED 9M', color: '#8B5CF6' },
  { id: 'proposal', label: 'Proposal', count: 12, value: 'AED 6M', color: '#F59E0B' },
  { id: 'negotiation', label: 'Negotiation', count: 8, value: 'AED 4.5M', color: '#EC4899' },
  { id: 'closed', label: 'Closed Won', count: 5, value: 'AED 2.8M', color: '#10B981' },
];

const LEADS = [
  { id: 1, name: 'Ahmad Al Rashid', source: 'Website', budget: 'AED 2.5M', stage: 'qualified', agent: 'Sarah A.' },
  { id: 2, name: 'Chen Wei', source: 'Referral', budget: 'AED 5M', stage: 'proposal', agent: 'Mohammed A.' },
  { id: 3, name: 'James Wilson', source: 'WhatsApp', budget: 'AED 1.8M', stage: 'new', agent: 'Unassigned' },
  { id: 4, name: 'Fatima Hassan', source: 'Property Finder', budget: 'AED 3.2M', stage: 'negotiation', agent: 'Sarah A.' },
];

const DEALS = [
  { id: 1, property: 'Palm Jumeirah Villa', value: 'AED 8.5M', stage: 'Negotiation', probability: 75 },
  { id: 2, property: 'Downtown Apartment', value: 'AED 2.1M', stage: 'Contract', probability: 90 },
  { id: 3, property: 'Business Bay Penthouse', value: 'AED 4.2M', stage: 'Viewing', probability: 40 },
];

export default function SalesView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderLeadPipeline = () => (
    <div className="pipeline-view">
      <h2 className="view-title">Lead Pipeline</h2>
      <p className="view-subtitle">Track leads through sales stages</p>
      
      <div className="pipeline-stages">
        {PIPELINE_STAGES.map(stage => (
          <div key={stage.id} className="pipeline-stage" style={{ borderTopColor: stage.color }}>
            <div className="stage-header" style={{ color: stage.color }}>
              <span className="stage-count">{stage.count}</span>
              <span className="stage-label">{stage.label}</span>
            </div>
            <div className="stage-value">{stage.value}</div>
          </div>
        ))}
      </div>

      <div className="leads-table">
        <h3>Active Leads</h3>
        <div className="data-table">
          <div className="table-header">
            <div className="table-cell">Lead Name</div>
            <div className="table-cell">Source</div>
            <div className="table-cell">Budget</div>
            <div className="table-cell">Stage</div>
            <div className="table-cell">Agent</div>
          </div>
          {LEADS.map(lead => (
            <div key={lead.id} className="table-row">
              <div className="table-cell">{lead.name}</div>
              <div className="table-cell">{lead.source}</div>
              <div className="table-cell">{lead.budget}</div>
              <div className="table-cell">
                <span className={`stage-badge ${lead.stage}`}>{lead.stage}</span>
              </div>
              <div className="table-cell">{lead.agent}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClientJourney = () => (
    <div className="journey-view">
      <h2 className="view-title">Client Journey</h2>
      <p className="view-subtitle">Track client lifecycle from lead to owner</p>
      <div className="journey-stages">
        {['Inquiry', 'Viewing', 'Offer', 'Negotiation', 'Contract', 'Payment', 'Handover', 'Post-Sale'].map((stage, i) => (
          <div key={stage} className="journey-stage">
            <div className="journey-number">{i + 1}</div>
            <div className="journey-label">{stage}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeals = () => (
    <div className="deals-view">
      <h2 className="view-title">Active Deals</h2>
      <p className="view-subtitle">Track deals through closing</p>
      <div className="deals-grid">
        {DEALS.map(deal => (
          <div key={deal.id} className="deal-card">
            <div className="deal-property">{deal.property}</div>
            <div className="deal-value">{deal.value}</div>
            <div className="deal-stage">{deal.stage}</div>
            <div className="deal-progress">
              <div className="progress-bar" style={{ width: `${deal.probability}%` }} />
              <span>{deal.probability}% probability</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRouting = () => (
    <div className="routing-view">
      <h2 className="view-title">Lead Routing</h2>
      <p className="view-subtitle">Automatic lead assignment rules</p>
      <div className="routing-rules">
        <div className="routing-rule">
          <Route size={20} color="var(--crm-gold)" />
          <div>
            <strong>High-value leads (5M+)</strong>
            <p>Route to Senior Agents</p>
          </div>
        </div>
        <div className="routing-rule">
          <Route size={20} color="var(--crm-gold)" />
          <div>
            <strong>Off-plan inquiries</strong>
            <p>Route to Off-Plan Specialists</p>
          </div>
        </div>
        <div className="routing-rule">
          <Route size={20} color="var(--crm-gold)" />
          <div>
            <strong>Rental inquiries</strong>
            <p>Route to Rental Team</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContracts = () => (
    <div className="contracts-view">
      <h2 className="view-title">Sales Contracts</h2>
      <p className="view-subtitle">Contract management and tracking</p>
      <div className="contracts-stats">
        <div className="contract-stat">
          <FileSignature size={32} color="var(--crm-gold)" />
          <div className="contract-value">12</div>
          <div className="contract-label">Pending Signature</div>
        </div>
        <div className="contract-stat">
          <FileSignature size={32} color="#10B981" />
          <div className="contract-value">45</div>
          <div className="contract-label">Completed This Month</div>
        </div>
      </div>
    </div>
  );

  const renderNegotiations = () => (
    <div className="negotiations-view">
      <h2 className="view-title">Negotiations</h2>
      <p className="view-subtitle">Active deal negotiations in progress</p>
      <div className="negotiations-list">
        <div className="negotiation-card">
          <div className="negotiation-header">
            <span className="property-name">Palm Jumeirah Villa #234</span>
            <span className="negotiation-status active">In Progress</span>
          </div>
          <div className="negotiation-parties">
            <span>Buyer: Ahmad Al Rashid</span>
            <span>Seller: Emirates Properties LLC</span>
          </div>
          <div className="negotiation-offer">
            <span>Current Offer: AED 8,200,000</span>
            <span>Counter: AED 8,500,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'leads':
        return renderLeadPipeline();
      case 'client-journey':
        return renderClientJourney();
      case 'deals':
        return renderDeals();
      case 'negotiations':
        return renderNegotiations();
      case 'contracts':
        return renderContracts();
      default:
        return renderLeadPipeline();
    }
  };

  return (
    <div className="view-container sales-view">
      {renderContent()}
    </div>
  );
}
