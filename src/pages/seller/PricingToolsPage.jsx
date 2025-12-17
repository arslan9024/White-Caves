import React, { useState, useMemo } from 'react';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function PricingToolsPage() {
  const [propertyType, setPropertyType] = useState('apartment');
  const [location, setLocation] = useState('dubai-marina');
  const [beds, setBeds] = useState(2);
  const [sqft, setSqft] = useState(1500);

  const marketData = {
    'dubai-marina': { apartment: 2100, villa: 0, townhouse: 0, penthouse: 2800 },
    'downtown': { apartment: 2500, villa: 0, townhouse: 0, penthouse: 3200 },
    'palm-jumeirah': { apartment: 2300, villa: 3500, townhouse: 2800, penthouse: 3000 },
    'jbr': { apartment: 2400, villa: 0, townhouse: 0, penthouse: 3100 },
    'emirates-hills': { apartment: 0, villa: 3200, townhouse: 0, penthouse: 0 },
    'arabian-ranches': { apartment: 0, villa: 1800, townhouse: 1600, penthouse: 0 },
  };

  const calculations = useMemo(() => {
    const pricePerSqft = marketData[location]?.[propertyType] || 2000;
    const estimatedPrice = pricePerSqft * sqft;
    const lowRange = estimatedPrice * 0.9;
    const highRange = estimatedPrice * 1.1;
    
    const dldFee = estimatedPrice * 0.02;
    const agencyCommission = estimatedPrice * 0.02;
    const nocFee = 5000;
    const totalCosts = dldFee + agencyCommission + nocFee;
    const netProceeds = estimatedPrice - totalCosts;
    
    return {
      pricePerSqft,
      estimatedPrice,
      lowRange,
      highRange,
      dldFee,
      agencyCommission,
      nocFee,
      totalCosts,
      netProceeds
    };
  }, [propertyType, location, beds, sqft]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="role-page">
      <RoleNavigation role="seller" />
      
      <div className="role-page-content">
        <div className="page-header">
          <h1>Pricing Tools</h1>
          <p>Get market insights and estimate your property value</p>
        </div>

        <div className="calculator-layout">
          <div className="calculator-inputs">
            <h3>Property Details</h3>
            
            <div className="input-group">
              <label>Property Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="select-input">
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="penthouse">Penthouse</option>
              </select>
            </div>

            <div className="input-group">
              <label>Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="select-input">
                <option value="dubai-marina">Dubai Marina</option>
                <option value="downtown">Downtown Dubai</option>
                <option value="palm-jumeirah">Palm Jumeirah</option>
                <option value="jbr">JBR</option>
                <option value="emirates-hills">Emirates Hills</option>
                <option value="arabian-ranches">Arabian Ranches</option>
              </select>
            </div>

            <div className="input-group">
              <label>Bedrooms</label>
              <select value={beds} onChange={(e) => setBeds(Number(e.target.value))} className="select-input">
                <option value="0">Studio</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            <div className="input-group">
              <label>Property Size (sqft)</label>
              <input 
                type="number" 
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="text-input"
              />
            </div>
          </div>

          <div className="calculator-results">
            <h3>Estimated Value</h3>
            
            <div className="result-highlight">
              <span className="result-label">Estimated Market Price</span>
              <span className="result-value">{formatCurrency(calculations.estimatedPrice)}</span>
            </div>

            <div className="price-range">
              <div className="range-item">
                <span className="range-label">Low Estimate</span>
                <span className="range-value">{formatCurrency(calculations.lowRange)}</span>
              </div>
              <div className="range-item">
                <span className="range-label">High Estimate</span>
                <span className="range-value">{formatCurrency(calculations.highRange)}</span>
              </div>
            </div>

            <div className="market-rate">
              <span>Market Rate: {formatCurrency(calculations.pricePerSqft)}/sqft</span>
            </div>

            <hr className="divider" />

            <h4>Selling Costs</h4>
            <div className="costs-breakdown">
              <div className="cost-item">
                <span>DLD Fee (2% seller's share)</span>
                <span>{formatCurrency(calculations.dldFee)}</span>
              </div>
              <div className="cost-item">
                <span>Agency Commission (2%)</span>
                <span>{formatCurrency(calculations.agencyCommission)}</span>
              </div>
              <div className="cost-item">
                <span>NOC Fee (approx)</span>
                <span>{formatCurrency(calculations.nocFee)}</span>
              </div>
              <div className="cost-item total">
                <span>Total Costs</span>
                <span>{formatCurrency(calculations.totalCosts)}</span>
              </div>
            </div>

            <div className="result-highlight net">
              <span className="result-label">Estimated Net Proceeds</span>
              <span className="result-value">{formatCurrency(calculations.netProceeds)}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Tips for Pricing Your Property</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>📊 Research Comparable Sales</h4>
              <p>Look at recently sold properties in your building or community to understand the current market rate.</p>
            </div>
            <div className="info-card">
              <h4>⏰ Consider Market Timing</h4>
              <p>Dubai's property market has seasonal fluctuations. The period from September to April typically sees higher activity.</p>
            </div>
            <div className="info-card">
              <h4>🏠 Highlight Unique Features</h4>
              <p>Upgraded properties, premium views, or unique layouts can justify prices above the average market rate.</p>
            </div>
            <div className="info-card">
              <h4>💡 Price Competitively</h4>
              <p>Properties priced right from the start sell faster and often achieve better final prices than those requiring multiple reductions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
