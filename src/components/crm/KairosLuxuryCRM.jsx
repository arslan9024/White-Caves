import React from 'react';
import { Crown, Diamond, Building2, Sparkles, Users, TrendingUp } from 'lucide-react';
import './shared/CRMDashboard.css';

const KairosLuxuryCRM = ({ assistant }) => {
  const stats = [
    { label: 'Ultra-Luxury Listings', value: '48', icon: Crown, trend: 'AED 10M+' },
    { label: 'VIP Clients', value: '124', icon: Diamond, trend: '+18 this month' },
    { label: 'Exclusive Deals', value: '12', icon: Sparkles, trend: 'In negotiation' },
    { label: 'Portfolio Value', value: 'AED 2.8B', icon: TrendingUp, trend: '+15% YoY' }
  ];

  return (
    <div className="crm-dashboard kairos-luxury">
      <div className="crm-header">
        <div className="crm-title-section">
          <div className="crm-icon" style={{ background: `${assistant?.color || '#A855F7'}20` }}>
            <Crown size={28} style={{ color: assistant?.color || '#A855F7' }} />
          </div>
          <div className="crm-title-info">
            <h1>{assistant?.name || 'Kairos'}</h1>
            <p>{assistant?.title || 'Ultra-Luxury Property Specialist'}</p>
          </div>
        </div>
      </div>

      <div className="crm-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="crm-content-grid">
        <div className="crm-panel">
          <div className="panel-header">
            <h3>Featured Luxury Properties</h3>
            <Building2 size={18} />
          </div>
          <div className="panel-content">
            {[
              { property: 'Signature Villa, Palm Jumeirah', price: 'AED 85M', beds: 7, views: 'Private Beach' },
              { property: 'Penthouse, Burj Khalifa', price: 'AED 120M', beds: 5, views: 'Full City' },
              { property: 'Mansion, Emirates Hills', price: 'AED 65M', beds: 8, views: 'Golf Course' },
              { property: 'Sky Palace, DIFC', price: 'AED 48M', beds: 4, views: 'Panoramic' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.property}</span>
                  <span className="item-meta">{item.beds} Beds • {item.views}</span>
                </div>
                <span className="price-badge luxury">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel">
          <div className="panel-header">
            <h3>VIP Client Requests</h3>
            <Users size={18} />
          </div>
          <div className="panel-content">
            {[
              { client: 'Royal Family Office', budget: 'AED 100M+', requirement: 'Beachfront Estate', status: 'Active' },
              { client: 'International UHNWI', budget: 'AED 50-80M', requirement: 'Penthouse Portfolio', status: 'Matching' },
              { client: 'Private Equity Fund', budget: 'AED 200M', requirement: 'Trophy Assets', status: 'Due Diligence' },
              { client: 'Celebrity Client', budget: 'AED 40M+', requirement: 'Privacy Estate', status: 'Active' }
            ].map((item, index) => (
              <div key={index} className="list-item">
                <div className="item-info">
                  <span className="item-name">{item.client}</span>
                  <span className="item-meta">{item.budget} • {item.requirement}</span>
                </div>
                <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="crm-panel full-width">
          <div className="panel-header">
            <h3>Luxury Market Segments</h3>
            <Diamond size={18} />
          </div>
          <div className="panel-content categories">
            {[
              { name: 'Beachfront Villas', inventory: 12, avgPrice: 'AED 75M' },
              { name: 'Penthouses', inventory: 18, avgPrice: 'AED 45M' },
              { name: 'Golf Course Estates', inventory: 8, avgPrice: 'AED 35M' },
              { name: 'Sky Residences', inventory: 15, avgPrice: 'AED 28M' },
              { name: 'Branded Residences', inventory: 22, avgPrice: 'AED 22M' },
              { name: 'Private Islands', inventory: 3, avgPrice: 'AED 150M' }
            ].map((segment, index) => (
              <div key={index} className="category-card">
                <span className="category-name">{segment.name}</span>
                <span className="category-count">{segment.inventory} properties • {segment.avgPrice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KairosLuxuryCRM;
