import React, { useState } from 'react';
import './NeighborhoodAnalyzer.css';

const NeighborhoodAnalyzer = () => {
  const [selectedArea, setSelectedArea] = useState('dubai-marina');
  const [showDetails, setShowDetails] = useState(false);

  const neighborhoods = {
    'dubai-marina': {
      name: 'Dubai Marina',
      score: 92,
      investmentGrade: 'A+',
      trend: 'rising',
      avgPrice: 1850000,
      pricePerSqft: 1650,
      rentalYield: 6.8,
      appreciation: 8.5,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      description: 'Premier waterfront community with stunning marina views and world-class amenities.',
      demographics: {
        population: 45000,
        avgAge: 35,
        expats: 85,
        families: 35
      },
      amenities: {
        restaurants: 95,
        schools: 8,
        healthcare: 12,
        shopping: 25,
        parks: 6
      },
      transport: {
        metro: 2,
        bus: 15,
        walkability: 88
      },
      futureProjects: [
        { name: 'Marina Promenade Extension', completion: '2025' },
        { name: 'New Metro Station', completion: '2026' }
      ],
      insights: [
        'High demand from young professionals and investors',
        'Strong rental market with consistent occupancy rates',
        'Premium positioning attracts international buyers',
        'Limited new supply keeps prices stable'
      ],
      risks: ['High competition', 'Market saturation in some segments']
    },
    'downtown-dubai': {
      name: 'Downtown Dubai',
      score: 95,
      investmentGrade: 'A+',
      trend: 'stable',
      avgPrice: 2850000,
      pricePerSqft: 2100,
      rentalYield: 5.5,
      appreciation: 10.2,
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
      description: 'Iconic district home to Burj Khalifa and Dubai Mall, representing ultimate luxury.',
      demographics: {
        population: 35000,
        avgAge: 38,
        expats: 90,
        families: 25
      },
      amenities: {
        restaurants: 150,
        schools: 5,
        healthcare: 8,
        shopping: 50,
        parks: 4
      },
      transport: {
        metro: 3,
        bus: 20,
        walkability: 82
      },
      futureProjects: [
        { name: 'Opera District Expansion', completion: '2025' },
        { name: 'Downtown South', completion: '2027' }
      ],
      insights: [
        'Global landmark status ensures lasting value',
        'High capital appreciation potential',
        'Strong short-term rental market',
        'Premium maintenance and service standards'
      ],
      risks: ['Higher entry price point', 'Tourist-dependent rentals']
    },
    'palm-jumeirah': {
      name: 'Palm Jumeirah',
      score: 90,
      investmentGrade: 'A',
      trend: 'rising',
      avgPrice: 8500000,
      pricePerSqft: 2800,
      rentalYield: 4.5,
      appreciation: 12.5,
      image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800',
      description: 'World-famous man-made island offering exclusive beachfront living.',
      demographics: {
        population: 18000,
        avgAge: 42,
        expats: 95,
        families: 55
      },
      amenities: {
        restaurants: 80,
        schools: 3,
        healthcare: 5,
        shopping: 12,
        parks: 8
      },
      transport: {
        metro: 0,
        bus: 8,
        walkability: 45
      },
      futureProjects: [
        { name: 'Palm West Beach', completion: '2025' },
        { name: 'The Palm Tower II', completion: '2026' }
      ],
      insights: [
        'Ultra-premium segment with global recognition',
        'Strong demand from HNWIs and celebrities',
        'Beach access commands premium pricing',
        'Limited supply drives appreciation'
      ],
      risks: ['High maintenance costs', 'Traffic congestion']
    },
    'dubai-hills': {
      name: 'Dubai Hills Estate',
      score: 88,
      investmentGrade: 'A',
      trend: 'rising',
      avgPrice: 3200000,
      pricePerSqft: 1400,
      rentalYield: 5.8,
      appreciation: 9.5,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      description: 'Master-planned community with golf course, parks, and family-friendly amenities.',
      demographics: {
        population: 25000,
        avgAge: 36,
        expats: 75,
        families: 65
      },
      amenities: {
        restaurants: 45,
        schools: 12,
        healthcare: 8,
        shopping: 20,
        parks: 15
      },
      transport: {
        metro: 1,
        bus: 12,
        walkability: 72
      },
      futureProjects: [
        { name: 'Dubai Hills Mall Phase 2', completion: '2025' },
        { name: 'New International School', completion: '2025' }
      ],
      insights: [
        'Ideal for families seeking quality lifestyle',
        'Strong community development ongoing',
        'Golf course adds premium value',
        'Central location with highway access'
      ],
      risks: ['Ongoing construction', 'Distance from beach']
    },
    'jvc': {
      name: 'Jumeirah Village Circle',
      score: 78,
      investmentGrade: 'B+',
      trend: 'stable',
      avgPrice: 850000,
      pricePerSqft: 850,
      rentalYield: 8.2,
      appreciation: 5.5,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      description: 'Affordable family community with diverse housing options and good connectivity.',
      demographics: {
        population: 85000,
        avgAge: 32,
        expats: 80,
        families: 55
      },
      amenities: {
        restaurants: 65,
        schools: 15,
        healthcare: 10,
        shopping: 18,
        parks: 20
      },
      transport: {
        metro: 0,
        bus: 18,
        walkability: 65
      },
      futureProjects: [
        { name: 'Circle Mall Expansion', completion: '2025' },
        { name: 'New Community Park', completion: '2025' }
      ],
      insights: [
        'Best value for money in Dubai',
        'High rental yields attract investors',
        'Young professional and family demographics',
        'Improving infrastructure and amenities'
      ],
      risks: ['No metro access', 'Traffic during peak hours']
    }
  };

  const area = neighborhoods[selectedArea];

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'low';
  };

  return (
    <div className="neighborhood-analyzer">
      <div className="analyzer-header">
        <h2>AI Neighborhood Analyzer</h2>
        <p>Data-driven insights for informed investment decisions</p>
      </div>

      <div className="area-selector">
        {Object.entries(neighborhoods).map(([key, value]) => (
          <button
            key={key}
            className={`area-btn ${selectedArea === key ? 'active' : ''}`}
            onClick={() => setSelectedArea(key)}
          >
            {value.name}
          </button>
        ))}
      </div>

      <div className="analyzer-content">
        <div className="area-hero" style={{ backgroundImage: `url(${area.image})` }}>
          <div className="hero-overlay">
            <div className="hero-content">
              <h3>{area.name}</h3>
              <p>{area.description}</p>
              <div className="hero-badges">
                <span className={`score-badge ${getScoreColor(area.score)}`}>
                  Score: {area.score}/100
                </span>
                <span className="grade-badge">Grade: {area.investmentGrade}</span>
                <span className={`trend-badge ${area.trend}`}>
                  {area.trend === 'rising' ? '📈' : area.trend === 'stable' ? '➡️' : '📉'} {area.trend}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card primary">
            <span className="metric-icon">💰</span>
            <div className="metric-info">
              <span className="metric-value">AED {area.avgPrice.toLocaleString()}</span>
              <span className="metric-label">Average Price</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">📐</span>
            <div className="metric-info">
              <span className="metric-value">AED {area.pricePerSqft.toLocaleString()}</span>
              <span className="metric-label">Price/Sq.Ft</span>
            </div>
          </div>
          <div className="metric-card">
            <span className="metric-icon">📊</span>
            <div className="metric-info">
              <span className="metric-value">{area.rentalYield}%</span>
              <span className="metric-label">Rental Yield</span>
            </div>
          </div>
          <div className="metric-card highlight">
            <span className="metric-icon">📈</span>
            <div className="metric-info">
              <span className="metric-value">+{area.appreciation}%</span>
              <span className="metric-label">Annual Growth</span>
            </div>
          </div>
        </div>

        <div className="analysis-sections">
          <div className="analysis-card">
            <h4>Demographics</h4>
            <div className="demographics-grid">
              <div className="demo-item">
                <span className="demo-value">{area.demographics.population.toLocaleString()}</span>
                <span className="demo-label">Population</span>
              </div>
              <div className="demo-item">
                <span className="demo-value">{area.demographics.avgAge}</span>
                <span className="demo-label">Avg Age</span>
              </div>
              <div className="demo-item">
                <span className="demo-value">{area.demographics.expats}%</span>
                <span className="demo-label">Expats</span>
              </div>
              <div className="demo-item">
                <span className="demo-value">{area.demographics.families}%</span>
                <span className="demo-label">Families</span>
              </div>
            </div>
          </div>

          <div className="analysis-card">
            <h4>Amenities Score</h4>
            <div className="amenities-bars">
              {Object.entries(area.amenities).map(([key, value]) => (
                <div key={key} className="amenity-bar">
                  <span className="amenity-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${Math.min(value, 100)}%` }}
                    />
                  </div>
                  <span className="amenity-count">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-card">
            <h4>Transport & Accessibility</h4>
            <div className="transport-grid">
              <div className="transport-item">
                <span className="transport-icon">🚇</span>
                <span className="transport-value">{area.transport.metro}</span>
                <span className="transport-label">Metro Stations</span>
              </div>
              <div className="transport-item">
                <span className="transport-icon">🚌</span>
                <span className="transport-value">{area.transport.bus}</span>
                <span className="transport-label">Bus Routes</span>
              </div>
              <div className="transport-item walkability">
                <span className="transport-icon">🚶</span>
                <span className="transport-value">{area.transport.walkability}/100</span>
                <span className="transport-label">Walkability</span>
              </div>
            </div>
          </div>

          <div className="analysis-card future">
            <h4>Future Development</h4>
            <div className="future-projects">
              {area.futureProjects.map((project, index) => (
                <div key={index} className="project-item">
                  <span className="project-name">{project.name}</span>
                  <span className="project-date">{project.completion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="insights-section">
          <div className="insights-card positive">
            <h4>Investment Insights</h4>
            <ul>
              {area.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          <div className="insights-card risks">
            <h4>Potential Risks</h4>
            <ul>
              {area.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="action-bar">
          <button className="action-btn primary">View Properties in {area.name}</button>
          <button className="action-btn secondary">Download Report</button>
          <button className="action-btn outline">Compare Areas</button>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodAnalyzer;
