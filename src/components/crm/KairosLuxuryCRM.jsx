import React, { useState } from 'react';
import { 
  Crown, Star, Heart, Users, Gift,
  Calendar, MapPin, Phone, Mail, Clock,
  ArrowUp, ArrowDown, Filter, Search, Plus, Eye
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const VIP_CLIENTS = [
  { id: 1, name: 'Sheikh Mohammed Al Nahyan', tier: 'Platinum', portfolio: 'AED 45M+', properties: 8, lastContact: '2 days ago', preferences: ['Palm Jumeirah', 'Villas', 'Sea View'] },
  { id: 2, name: 'Lady Victoria Sterling', tier: 'Platinum', portfolio: 'AED 32M+', properties: 5, lastContact: '1 week ago', preferences: ['Downtown', 'Penthouses', 'Burj View'] },
  { id: 3, name: 'Dr. Chen Wei Holdings', tier: 'Gold', portfolio: 'AED 25M+', properties: 12, lastContact: '3 days ago', preferences: ['Business Bay', 'Investment', 'High ROI'] },
  { id: 4, name: 'Maria Santos Family Office', tier: 'Gold', portfolio: 'AED 18M+', properties: 4, lastContact: '5 days ago', preferences: ['Emirates Hills', 'Privacy', 'Golf Course'] }
];

const CONCIERGE_SERVICES = [
  { id: 1, service: 'Private Jet Charter', client: 'Sheikh Mohammed', date: '2024-01-25', status: 'confirmed', partner: 'Jetex Dubai' },
  { id: 2, service: 'Interior Design Consultation', client: 'Lady Victoria', date: '2024-01-28', status: 'scheduled', partner: 'Luxury Interiors LLC' },
  { id: 3, service: 'Golden Visa Processing', client: 'Dr. Chen Wei', date: '2024-01-22', status: 'in_progress', partner: 'Legal Partners' },
  { id: 4, service: 'Yacht Charter', client: 'Maria Santos', date: '2024-02-01', status: 'pending', partner: 'Dubai Marina Yachts' }
];

const EXCLUSIVE_LISTINGS = [
  { id: 1, property: 'Signature Villa - Palm Jumeirah', price: 'AED 85M', status: 'off_market', features: ['Private Beach', '10 Beds', 'Staff Quarters'] },
  { id: 2, property: 'Penthouse - Burj Khalifa', price: 'AED 120M', status: 'exclusive', features: ['Full Floor', 'Helipad Access', 'Butler Service'] },
  { id: 3, property: 'Royal Estate - Emirates Hills', price: 'AED 65M', status: 'off_market', features: ['Golf Course', 'Cinema', 'Wellness Spa'] },
  { id: 4, property: 'Beachfront Mansion - Jumeirah Bay', price: 'AED 95M', status: 'exclusive', features: ['Infinity Pool', 'Art Gallery', 'Smart Home'] }
];

const PARTNER_NETWORK = [
  { id: 1, name: 'Jetex Dubai', category: 'Aviation', services: 'Private Jets', rating: 5.0 },
  { id: 2, name: 'Luxury Interiors LLC', category: 'Design', services: 'Interior Design', rating: 4.9 },
  { id: 3, name: 'Dubai Marina Yachts', category: 'Lifestyle', services: 'Yacht Charter', rating: 4.8 },
  { id: 4, name: 'Rolls Royce Dubai', category: 'Automotive', services: 'Luxury Cars', rating: 5.0 },
  { id: 5, name: 'Legal Partners DIFC', category: 'Legal', services: 'Visa & Legal', rating: 4.9 }
];

const KairosLuxuryCRM = () => {
  const [activeTab, setActiveTab] = useState('vip');

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum': return '#8B5CF6';
      case 'Gold': return '#F59E0B';
      case 'Silver': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'scheduled': case 'exclusive': return '#3B82F6';
      case 'in_progress': return '#F59E0B';
      case 'pending': case 'off_market': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="assistant-dashboard kairos">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' }}>
          <Crown size={28} />
        </div>
        <div className="assistant-info">
          <h2>Kairos - Luxury Concierge & VIP Experience</h2>
          <p>Curates personalized services for high-net-worth clients: viewing schedules, interior design partners, visa/payment coordination, creating white-glove service</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Crown size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">24</span>
            <span className="stat-label">VIP Clients</span>
          </div>
          <span className="stat-change positive">8 Platinum</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Gift size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Active Services</span>
          </div>
          <span className="stat-change">4 this week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Star size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 320M</span>
            <span className="stat-label">Portfolio Value</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 15%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#D97706' }}>
            <Heart size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">98%</span>
            <span className="stat-label">Satisfaction</span>
          </div>
          <span className="stat-change positive">World class</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['vip', 'concierge', 'exclusive', 'partners', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab === 'vip' ? 'VIP Clients' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'vip' && (
          <div className="vip-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search VIP clients..." />
              </div>
              <button className="add-btn"><Plus size={16} /> Add VIP</button>
            </div>
            <div className="vip-grid">
              {VIP_CLIENTS.map(client => (
                <div key={client.id} className="vip-card">
                  <div className="vip-header">
                    <div className="vip-avatar">
                      <Crown size={20} style={{ color: getTierColor(client.tier) }} />
                    </div>
                    <div className="vip-info">
                      <h4>{client.name}</h4>
                      <span className="vip-tier" style={{ color: getTierColor(client.tier) }}>{client.tier}</span>
                    </div>
                  </div>
                  <div className="vip-stats">
                    <span>Portfolio: {client.portfolio}</span>
                    <span>{client.properties} properties</span>
                  </div>
                  <div className="vip-preferences">
                    {client.preferences.map((pref, idx) => (
                      <span key={idx} className="preference-tag">{pref}</span>
                    ))}
                  </div>
                  <div className="vip-footer">
                    <span><Clock size={12} /> {client.lastContact}</span>
                    <div className="vip-actions">
                      <button><Phone size={14} /></button>
                      <button><Mail size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'concierge' && (
          <div className="concierge-view">
            <div className="view-header">
              <h3>Active Concierge Services</h3>
              <button className="add-btn"><Plus size={16} /> New Request</button>
            </div>
            <div className="concierge-list">
              {CONCIERGE_SERVICES.map(service => (
                <div key={service.id} className="concierge-card">
                  <div className="concierge-icon">
                    <Gift size={24} />
                  </div>
                  <div className="concierge-content">
                    <h4>{service.service}</h4>
                    <p className="concierge-client">{service.client}</p>
                    <div className="concierge-meta">
                      <span><Calendar size={12} /> {service.date}</span>
                      <span><Users size={12} /> {service.partner}</span>
                    </div>
                  </div>
                  <span className="concierge-status" style={{ color: getStatusColor(service.status) }}>
                    {service.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exclusive' && (
          <div className="exclusive-view">
            <h3>Exclusive & Off-Market Listings</h3>
            <div className="exclusive-grid">
              {EXCLUSIVE_LISTINGS.map(listing => (
                <div key={listing.id} className="exclusive-card">
                  <div className="exclusive-status" style={{ background: getStatusColor(listing.status) }}>
                    {listing.status.replace('_', ' ')}
                  </div>
                  <h4>{listing.property}</h4>
                  <div className="exclusive-price">{listing.price}</div>
                  <div className="exclusive-features">
                    {listing.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                  <button className="view-btn"><Eye size={14} /> View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="partners-view">
            <h3>Premium Partner Network</h3>
            <div className="partners-grid">
              {PARTNER_NETWORK.map(partner => (
                <div key={partner.id} className="partner-card">
                  <div className="partner-header">
                    <h4>{partner.name}</h4>
                    <span className="partner-rating">⭐ {partner.rating}</span>
                  </div>
                  <p className="partner-category">{partner.category}</p>
                  <p className="partner-services">{partner.services}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="kairos" 
            assistantName="Kairos" 
            assistantColor="#D97706" 
          />
        )}
      </div>
    </div>
  );
};

export default KairosLuxuryCRM;
