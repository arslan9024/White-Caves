import React, { useState, useEffect } from 'react';
import './OffPlanTracker.css';

const OffPlanTracker = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [countdowns, setCountdowns] = useState({});

  const offPlanProjects = [
    {
      id: 1,
      name: 'Marina Vista',
      developer: 'Emaar Properties',
      developerLogo: 'https://via.placeholder.com/60x60?text=Emaar',
      location: 'Dubai Marina',
      type: 'Apartment',
      segment: 'luxury',
      launchDate: new Date('2025-01-15'),
      completionDate: new Date('2027-06-01'),
      priceFrom: 2500000,
      units: 450,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
      status: 'launching-soon',
      paymentPlan: '60/40',
      features: ['Sea View', 'Private Beach', 'Smart Home']
    },
    {
      id: 2,
      name: 'Creek Harbour Tower',
      developer: 'Emaar Properties',
      developerLogo: 'https://via.placeholder.com/60x60?text=Emaar',
      location: 'Dubai Creek Harbour',
      type: 'Apartment',
      segment: 'luxury',
      launchDate: new Date('2025-02-01'),
      completionDate: new Date('2028-03-01'),
      priceFrom: 1800000,
      units: 800,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600',
      status: 'launching-soon',
      paymentPlan: '80/20',
      features: ['Creek View', 'Burj Khalifa View', 'Premium Amenities']
    },
    {
      id: 3,
      name: 'Palm Residences II',
      developer: 'Nakheel',
      developerLogo: 'https://via.placeholder.com/60x60?text=Nakheel',
      location: 'Palm Jumeirah',
      type: 'Villa',
      segment: 'ultra-luxury',
      launchDate: new Date('2025-01-20'),
      completionDate: new Date('2027-12-01'),
      priceFrom: 15000000,
      units: 80,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
      status: 'launching-soon',
      paymentPlan: '50/50',
      features: ['Beach Access', 'Private Pool', 'Garden']
    },
    {
      id: 4,
      name: 'Business Bay Central',
      developer: 'DAMAC',
      developerLogo: 'https://via.placeholder.com/60x60?text=DAMAC',
      location: 'Business Bay',
      type: 'Apartment',
      segment: 'commercial',
      launchDate: new Date('2025-03-10'),
      completionDate: new Date('2027-09-01'),
      priceFrom: 950000,
      units: 1200,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
      status: 'pre-registration',
      paymentPlan: '70/30',
      features: ['Office Space', 'Meeting Rooms', 'Parking']
    },
    {
      id: 5,
      name: 'Dubai Hills Villas',
      developer: 'Meraas',
      developerLogo: 'https://via.placeholder.com/60x60?text=Meraas',
      location: 'Dubai Hills Estate',
      type: 'Villa',
      segment: 'residential',
      launchDate: new Date('2025-02-15'),
      completionDate: new Date('2026-12-01'),
      priceFrom: 5500000,
      units: 150,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      status: 'launching-soon',
      paymentPlan: '60/40',
      features: ['Golf View', 'Private Garden', 'Smart Home']
    }
  ];

  const calculateCountdown = (date) => {
    const now = new Date();
    const diff = date - now;
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      offPlanProjects.forEach(project => {
        newCountdowns[project.id] = calculateCountdown(project.launchDate);
      });
      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredProjects = activeFilter === 'all' 
    ? offPlanProjects 
    : offPlanProjects.filter(p => p.segment === activeFilter);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'ultra-luxury', label: 'Ultra Luxury' },
    { id: 'commercial', label: 'Commercial' }
  ];

  return (
    <div className="offplan-tracker">
      <div className="tracker-header">
        <div className="header-content">
          <h2>Off-Plan Property Launches</h2>
          <p>Track upcoming developments and secure early-bird pricing</p>
        </div>
        <div className="tracker-stats">
          <div className="stat-badge">
            <span className="stat-number">{offPlanProjects.length}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-badge">
            <span className="stat-number">{offPlanProjects.reduce((acc, p) => acc + p.units, 0).toLocaleString()}</span>
            <span className="stat-label">Total Units</span>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className={`project-card ${project.segment}`}>
            <div className="project-image">
              <img src={project.image} alt={project.name} />
              <div className="project-badge">{project.status.replace('-', ' ')}</div>
              <div className="segment-badge">{project.segment.replace('-', ' ')}</div>
            </div>

            <div className="project-content">
              <div className="developer-info">
                <div className="developer-logo">
                  <span>{project.developer.charAt(0)}</span>
                </div>
                <div className="developer-details">
                  <span className="developer-name">{project.developer}</span>
                  <span className="project-location">{project.location}</span>
                </div>
              </div>

              <h3 className="project-name">{project.name}</h3>

              <div className="countdown-section">
                <span className="countdown-label">Launch in:</span>
                <div className="countdown-timer">
                  <div className="countdown-unit">
                    <span className="countdown-value">{countdowns[project.id]?.days || 0}</span>
                    <span className="countdown-text">Days</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-unit">
                    <span className="countdown-value">{countdowns[project.id]?.hours || 0}</span>
                    <span className="countdown-text">Hours</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-unit">
                    <span className="countdown-value">{countdowns[project.id]?.minutes || 0}</span>
                    <span className="countdown-text">Mins</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-unit">
                    <span className="countdown-value">{countdowns[project.id]?.seconds || 0}</span>
                    <span className="countdown-text">Secs</span>
                  </div>
                </div>
              </div>

              <div className="project-details">
                <div className="detail-item">
                  <span className="detail-label">Starting From</span>
                  <span className="detail-value price">AED {project.priceFrom.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Plan</span>
                  <span className="detail-value">{project.paymentPlan}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total Units</span>
                  <span className="detail-value">{project.units}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Completion</span>
                  <span className="detail-value">{project.completionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="project-features">
                {project.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>

              <div className="project-actions">
                <button className="register-btn">Register Interest</button>
                <button className="details-btn">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffPlanTracker;
