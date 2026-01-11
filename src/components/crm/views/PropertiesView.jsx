import React, { useState } from 'react';
import { Home, Grid3x3, Plus, Building, Image, Video, Eye } from 'lucide-react';
import TransactionsView from './TransactionsView';

const PROPERTIES = [
  { id: 1, title: 'Palm Jumeirah Villa', type: 'Villa', beds: 5, baths: 6, area: 8500, price: 'AED 12,500,000', status: 'active', image: '🏠' },
  { id: 2, title: 'Downtown Dubai Apartment', type: 'Apartment', beds: 3, baths: 3, area: 2200, price: 'AED 3,800,000', status: 'active', image: '🏢' },
  { id: 3, title: 'Dubai Marina Penthouse', type: 'Penthouse', beds: 4, baths: 5, area: 5200, price: 'AED 8,200,000', status: 'pending', image: '🌆' },
  { id: 4, title: 'Business Bay Office', type: 'Commercial', beds: 0, baths: 2, area: 3500, price: 'AED 4,500,000', status: 'active', image: '🏬' },
  { id: 5, title: 'JBR Beachfront Unit', type: 'Apartment', beds: 2, baths: 2, area: 1800, price: 'AED 2,200,000', status: 'sold', image: '🏖️' },
  { id: 6, title: 'Emirates Hills Mansion', type: 'Villa', beds: 7, baths: 8, area: 15000, price: 'AED 45,000,000', status: 'active', image: '🏰' },
];

const OFF_PLAN_PROJECTS = [
  { id: 1, name: 'Creek Views', developer: 'Emaar', completion: 'Q4 2025', units: 450, sold: 380 },
  { id: 2, name: 'Damac Hills 2', developer: 'DAMAC', completion: 'Q2 2025', units: 320, sold: 290 },
  { id: 3, name: 'Sobha One', developer: 'Sobha', completion: 'Q1 2026', units: 280, sold: 150 },
];

export default function PropertiesView({ activeSubItem, subItemConfig, assistantContext }) {
  const [viewMode, setViewMode] = useState('grid');

  const renderPropertyGrid = () => (
    <div className="properties-grid-view">
      <div className="view-header">
        <div>
          <h2 className="view-title">Property Grid</h2>
          <p className="view-subtitle">{PROPERTIES.length} properties in inventory</p>
        </div>
        <div className="view-actions">
          <button className="view-mode-btn" onClick={() => setViewMode('grid')}>
            <Grid3x3 size={18} />
          </button>
          <button className="crm-btn crm-btn-primary">
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      <div className="properties-grid">
        {PROPERTIES.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              <span className="property-emoji">{property.image}</span>
              <span className={`property-status ${property.status}`}>{property.status}</span>
            </div>
            <div className="property-content">
              <h4 className="property-title">{property.title}</h4>
              <div className="property-type">{property.type}</div>
              <div className="property-specs">
                <span>{property.beds} Beds</span>
                <span>{property.baths} Baths</span>
                <span>{property.area.toLocaleString()} sqft</span>
              </div>
              <div className="property-price">{property.price}</div>
            </div>
            <div className="property-actions">
              <button className="action-btn"><Eye size={14} /> View</button>
              <button className="action-btn">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewListing = () => (
    <div className="new-listing-view">
      <h2 className="view-title">Add New Property Listing</h2>
      <p className="view-subtitle">6-step wizard for complete property listing</p>
      <div className="listing-wizard-preview">
        <div className="wizard-steps">
          {['Basic Info', 'Location', 'Specifications', 'Pricing', 'Media', 'Legal'].map((step, i) => (
            <div key={step} className="wizard-step">
              <div className="step-number">{i + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>
        <button className="crm-btn crm-btn-primary" style={{ marginTop: '24px' }}>
          Start New Listing
        </button>
      </div>
    </div>
  );

  const renderOffPlan = () => (
    <div className="off-plan-view">
      <h2 className="view-title">Off-Plan Properties</h2>
      <p className="view-subtitle">Track off-plan developments and sales</p>
      <div className="off-plan-grid">
        {OFF_PLAN_PROJECTS.map(project => (
          <div key={project.id} className="off-plan-card">
            <Building size={32} color="var(--crm-gold)" />
            <h4>{project.name}</h4>
            <div className="off-plan-developer">{project.developer}</div>
            <div className="off-plan-stats">
              <div>Completion: {project.completion}</div>
              <div>Units: {project.sold}/{project.units}</div>
            </div>
            <div className="off-plan-progress">
              <div className="progress-bar" style={{ width: `${(project.sold / project.units) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkflow = () => (
    <div className="workflow-view">
      <h2 className="view-title">Property Workflow Tracker</h2>
      <p className="view-subtitle">Track property status through stages</p>
      <div className="workflow-stages">
        {['Listed', 'Marketing', 'Viewing', 'Offer', 'Contract', 'Closing', 'Handover'].map((stage, i) => (
          <div key={stage} className="workflow-stage">
            <div className="workflow-dot" />
            <span>{stage}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="media-view">
      <h2 className="view-title">Media Assets</h2>
      <p className="view-subtitle">Property images and marketing materials</p>
      <div className="media-stats">
        <div className="media-stat">
          <Image size={32} color="var(--crm-gold)" />
          <div className="media-value">1,245</div>
          <div className="media-label">Images</div>
        </div>
        <div className="media-stat">
          <Video size={32} color="var(--crm-gold)" />
          <div className="media-value">89</div>
          <div className="media-label">Videos</div>
        </div>
      </div>
    </div>
  );

  const renderVirtualTours = () => (
    <div className="virtual-tours-view">
      <h2 className="view-title">Virtual Tours</h2>
      <p className="view-subtitle">Matterport 3D tours integration</p>
      <div className="tours-placeholder">
        <Eye size={48} color="var(--crm-gold)" />
        <p>12 properties with virtual tours</p>
        <button className="crm-btn crm-btn-secondary">View All Tours</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'portfolio':
        return renderPropertyGrid();
      case 'listings':
        return renderPropertyGrid();
      case 'transactions':
        return <TransactionsView />;
      case 'add-listing':
        return renderNewListing();
      case 'developer-pipeline':
        return renderOffPlan();
      case 'media-gallery':
        return renderMedia();
      case 'virtual-tours':
        return renderVirtualTours();
      default:
        return renderPropertyGrid();
    }
  };

  return (
    <div className="view-container properties-view">
      {renderContent()}
    </div>
  );
}
