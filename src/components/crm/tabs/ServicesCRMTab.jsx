import React, { useState } from 'react';
import { Briefcase, Plus, Search, Filter, ChevronRight, Tag, DollarSign, Users, Star, Eye } from 'lucide-react';

const SERVICES_CATEGORIES = [
  { id: 'transaction', name: 'Transaction & Agency', count: 16, color: '#3B82F6' },
  { id: 'subscription', name: 'Subscription & Management', count: 8, color: '#8B5CF6' },
  { id: 'advisory', name: 'Advisory & Premium', count: 8, color: '#D4AF37' },
  { id: 'technology', name: 'Data & Technology', count: 4, color: '#0EA5E9' },
  { id: 'support', name: 'Support & After-Sales', count: 2, color: '#10B981' },
  { id: 'lifestyle', name: 'Lifestyle & Concierge', count: 2, color: '#EC4899' },
];

const SERVICES = [
  { id: 'LPT-001', name: 'Luxury Property Transaction', category: 'transaction', tier: 'premium', price: '2% commission', status: 'active', clients: 45 },
  { id: 'PLS-001', name: 'Premium Leasing Services', category: 'transaction', tier: 'essential', price: '5% annual rent', status: 'active', clients: 120 },
  { id: 'OPM-001', name: 'Off-Plan Property Marketing', category: 'transaction', tier: 'premium', price: '3% commission', status: 'active', clients: 32 },
  { id: 'SPM-001', name: 'Secondary Property Marketing', category: 'transaction', tier: 'essential', price: '2% commission', status: 'active', clients: 78 },
  { id: 'PMG-001', name: 'Property Management Gold', category: 'subscription', tier: 'premium', price: 'AED 2,500/mo', status: 'active', clients: 56 },
  { id: 'TMS-001', name: 'Tenant Management System', category: 'subscription', tier: 'essential', price: 'AED 1,500/mo', status: 'active', clients: 89 },
  { id: 'IAS-001', name: 'Investment Advisory Services', category: 'advisory', tier: 'ultra', price: 'Custom', status: 'active', clients: 12 },
  { id: 'MKT-001', name: 'Market Intelligence Reports', category: 'advisory', tier: 'premium', price: 'AED 5,000/report', status: 'active', clients: 34 },
  { id: 'VPS-001', name: 'Virtual Property Showcase', category: 'technology', tier: 'essential', price: 'AED 3,000/tour', status: 'active', clients: 67 },
  { id: 'AIP-001', name: 'AI-Powered Property Matching', category: 'technology', tier: 'premium', price: 'Included', status: 'active', clients: 145 },
  { id: 'PVS-001', name: 'Post-Sale Support', category: 'support', tier: 'basic', price: 'Free', status: 'active', clients: 234 },
  { id: 'CON-001', name: 'Lifestyle Concierge', category: 'lifestyle', tier: 'ultra', price: 'AED 10,000/mo', status: 'active', clients: 8 },
];

export default function ServicesCRMTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTierBadgeClass = (tier) => `tier-badge ${tier}`;

  return (
    <div>
      <div className="crm-main-header">
        <div>
          <h1 className="crm-main-title">Services Catalog</h1>
          <p className="crm-main-subtitle">40 services across 8 categories</p>
        </div>
        <button className="crm-btn crm-btn-primary">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="crm-stats-grid">
        <div className="crm-stat-card">
          <div className="crm-stat-icon navy"><Briefcase size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">40</div>
            <div className="crm-stat-label">Total Services</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon gold"><Tag size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">8</div>
            <div className="crm-stat-label">Categories</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon success"><Users size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">920</div>
            <div className="crm-stat-label">Active Clients</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon info"><Star size={24} /></div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">4.8</div>
            <div className="crm-stat-label">Avg. Rating</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Categories
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className={`crm-btn ${selectedCategory === 'all' ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Services (40)
          </button>
          {SERVICES_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`crm-btn ${selectedCategory === cat.id ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={selectedCategory === cat.id ? {} : { borderColor: cat.color, color: cat.color }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div className="crm-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="crm-search" style={{ flex: 1 }}>
            <Search size={18} className="crm-search-icon" />
            <input
              type="text"
              className="crm-search-input"
              placeholder="Search services by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              className={`crm-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`crm-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredServices.map((service) => (
            <div key={service.id} className="crm-card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: 'var(--text-muted)',
                  background: 'var(--surface-secondary)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {service.id}
                </span>
                <span className={getTierBadgeClass(service.tier)}>
                  {service.tier.charAt(0).toUpperCase() + service.tier.slice(1)}
                </span>
              </div>
              
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {service.name}
              </h3>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--crm-gold)' }}>
                  <DollarSign size={14} /> {service.price}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <Users size={14} /> {service.clients} clients
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="crm-btn crm-btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                  <Eye size={14} /> View
                </button>
                <button className="crm-btn crm-btn-gold" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="crm-table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Service ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Tier</th>
                <th>Price</th>
                <th>Clients</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td><code style={{ background: 'var(--surface-secondary)', padding: '2px 6px', borderRadius: '4px' }}>{service.id}</code></td>
                  <td style={{ fontWeight: '500' }}>{service.name}</td>
                  <td>{service.category}</td>
                  <td><span className={getTierBadgeClass(service.tier)}>{service.tier}</span></td>
                  <td>{service.price}</td>
                  <td>{service.clients}</td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#10B981',
                      fontWeight: '500'
                    }}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
