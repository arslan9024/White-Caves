import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp, Building2 } from 'lucide-react';
import './PopularSearches.css';

const POPULAR_AREAS = [
  { id: 'jvc', name: 'Jumeirah Village Circle', count: 333, avgPrice: '1.2M' },
  { id: 'business-bay', name: 'Business Bay', count: 246, avgPrice: '2.1M' },
  { id: 'dlrc', name: 'Dubai Land Residence Complex', count: 209, avgPrice: '950K' },
  { id: 'dip', name: 'Dubai Investment Park', count: 203, avgPrice: '1.5M' },
  { id: 'umm-suqeim', name: 'Umm Suqeim Third', count: 184, avgPrice: '3.8M' },
  { id: 'downtown', name: 'Downtown Dubai', count: 156, avgPrice: '4.5M' },
  { id: 'dubai-marina', name: 'Dubai Marina', count: 142, avgPrice: '2.8M' },
  { id: 'palm-jumeirah', name: 'Palm Jumeirah', count: 128, avgPrice: '8.2M' },
];

export default function PopularSearches() {
  const navigate = useNavigate();

  const handleAreaClick = (areaId) => {
    navigate(`/properties?location=${areaId}`);
  };

  return (
    <section className="popular-searches-section">
      <div className="popular-searches-container">
        <div className="section-header">
          <h2 className="section-title">
            <TrendingUp size={28} className="title-icon" />
            Popular Searches in Dubai
          </h2>
          <p className="section-subtitle">
            Explore the most sought-after areas based on real DLD transaction data
          </p>
        </div>

        <div className="areas-grid">
          {POPULAR_AREAS.map((area) => (
            <button
              key={area.id}
              className="area-card"
              onClick={() => handleAreaClick(area.id)}
            >
              <div className="area-info">
                <MapPin size={18} className="area-icon" />
                <div className="area-details">
                  <h3 className="area-name">{area.name}</h3>
                  <div className="area-stats">
                    <span className="transaction-count">
                      <Building2 size={14} />
                      {area.count} transactions
                    </span>
                    <span className="avg-price">Avg: AED {area.avgPrice}</span>
                  </div>
                </div>
              </div>
              <span className="view-arrow">View Properties</span>
            </button>
          ))}
        </div>

        <div className="cta-row">
          <button 
            className="view-all-btn"
            onClick={() => navigate('/properties')}
          >
            View All Properties
          </button>
          <button 
            className="dld-link-btn"
            onClick={() => navigate('/crm')}
          >
            View DLD Transaction Data
          </button>
        </div>
      </div>
    </section>
  );
}
