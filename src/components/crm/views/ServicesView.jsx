import React from 'react';
import { Briefcase, ClipboardCheck, Wrench, Truck, CheckCircle } from 'lucide-react';

const SERVICE_CATEGORIES = [
  { id: 'sales', name: 'Sales Services', count: 8, color: '#10B981' },
  { id: 'rental', name: 'Rental Services', count: 7, color: '#3B82F6' },
  { id: 'property', name: 'Property Management', count: 6, color: '#F59E0B' },
  { id: 'financial', name: 'Financial Services', count: 5, color: '#8B5CF6' },
  { id: 'legal', name: 'Legal Services', count: 8, color: '#EF4444' },
  { id: 'consulting', name: 'Consulting Services', count: 6, color: '#EC4899' },
];

const SERVICES = [
  { id: 1, name: 'Property Valuation', category: 'Sales', tier: 'Essential', aiAssistant: 'Mary' },
  { id: 2, name: 'Ejari Registration', category: 'Rental', tier: 'Basic', aiAssistant: 'Nina' },
  { id: 3, name: 'Title Deed Transfer', category: 'Legal', tier: 'Premium', aiAssistant: 'Grace' },
  { id: 4, name: 'Mortgage Assistance', category: 'Financial', tier: 'Essential', aiAssistant: 'Max' },
  { id: 5, name: 'Property Inspection', category: 'Property', tier: 'Basic', aiAssistant: 'Henry' },
  { id: 6, name: 'Investment Advisory', category: 'Consulting', tier: 'Ultra-Premium', aiAssistant: 'Zoe' },
];

const SERVICE_REQUESTS = [
  { id: 1, service: 'Property Valuation', client: 'Ahmad Hassan', status: 'in-progress', date: '2024-01-10' },
  { id: 2, service: 'Ejari Registration', client: 'Sarah Williams', status: 'pending', date: '2024-01-11' },
  { id: 3, service: 'Title Deed Transfer', client: 'Mohammed Ali', status: 'completed', date: '2024-01-09' },
];

export default function ServicesView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderServiceCatalog = () => (
    <div className="service-catalog-view">
      <h2 className="view-title">Service Catalog</h2>
      <p className="view-subtitle">40 services across 6 categories</p>
      
      <div className="categories-grid">
        {SERVICE_CATEGORIES.map(cat => (
          <div key={cat.id} className="category-card" style={{ borderLeftColor: cat.color }}>
            <div className="category-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
              <Briefcase size={24} />
            </div>
            <div className="category-info">
              <h4>{cat.name}</h4>
              <span>{cat.count} services</span>
            </div>
          </div>
        ))}
      </div>

      <div className="services-list">
        <h3>All Services</h3>
        <div className="data-table">
          <div className="table-header">
            <div className="table-cell">Service</div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Tier</div>
            <div className="table-cell">AI Assistant</div>
          </div>
          {SERVICES.map(service => (
            <div key={service.id} className="table-row">
              <div className="table-cell">{service.name}</div>
              <div className="table-cell">{service.category}</div>
              <div className="table-cell">
                <span className={`tier-badge ${service.tier.toLowerCase()}`}>{service.tier}</span>
              </div>
              <div className="table-cell">{service.aiAssistant}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServiceRequests = () => (
    <div className="service-requests-view">
      <h2 className="view-title">Service Requests</h2>
      <p className="view-subtitle">Pending and active service requests</p>
      <div className="requests-list">
        {SERVICE_REQUESTS.map(req => (
          <div key={req.id} className="request-card">
            <div className="request-icon">
              <ClipboardCheck size={24} color="var(--crm-gold)" />
            </div>
            <div className="request-info">
              <h4>{req.service}</h4>
              <p>Client: {req.client}</p>
              <span className="request-date">{req.date}</span>
            </div>
            <div className={`request-status ${req.status}`}>{req.status}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="maintenance-view">
      <h2 className="view-title">Maintenance</h2>
      <p className="view-subtitle">Property maintenance requests</p>
      <div className="maintenance-stats">
        <div className="maint-stat">
          <Wrench size={32} color="#F59E0B" />
          <div className="maint-value">8</div>
          <div className="maint-label">Pending</div>
        </div>
        <div className="maint-stat">
          <CheckCircle size={32} color="#10B981" />
          <div className="maint-value">45</div>
          <div className="maint-label">Completed This Month</div>
        </div>
      </div>
    </div>
  );

  const renderHandover = () => (
    <div className="handover-view">
      <h2 className="view-title">Handover Management</h2>
      <p className="view-subtitle">Property handover tracking</p>
      <div className="handover-stats">
        <div className="handover-stat">
          <Truck size={32} color="var(--crm-gold)" />
          <div className="handover-value">5</div>
          <div className="handover-label">Scheduled This Week</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'service-catalog':
        return renderServiceCatalog();
      case 'service-requests':
        return renderServiceRequests();
      case 'maintenance':
        return renderMaintenance();
      case 'handover':
        return renderHandover();
      default:
        return renderServiceCatalog();
    }
  };

  return (
    <div className="view-container services-view">
      {renderContent()}
    </div>
  );
}
