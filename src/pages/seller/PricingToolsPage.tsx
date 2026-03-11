import React, { FC, useState, useMemo } from 'react';
import '../RolePages.css';

interface PricingToolsPageProps {}

interface MarketDataType {
  [key: string]: {
    [key: string]: number;
  };
}

interface Calculations {
  pricePerSqft: number;
  estimatedPrice: number;
  lowRange: number;
  highRange: number;
  dldFee: number;
  agencyCommission: number;
  nocFee: number;
  totalCosts: number;
  netProceeds: number;
}

const PricingToolsPage: FC<PricingToolsPageProps> = () => {
  const [propertyType, setPropertyType] = useState<string>('apartment');
  const [location, setLocation] = useState<string>('dubai-marina');
  const [beds, setBeds] = useState<number>(2);
  const [sqft, setSqft] = useState<number>(1500);

  const marketData: MarketDataType = {
    'dubai-marina': { apartment: 2100, villa: 0, townhouse: 0, penthouse: 2800 },
    'downtown': { apartment: 2500, villa: 0, townhouse: 0, penthouse: 3200 },
    'palm-jumeirah': { apartment: 2300, villa: 3500, townhouse: 2800, penthouse: 3000 },
    'jbr': { apartment: 2400, villa: 0, townhouse: 0, penthouse: 3100 },
    'emirates-hills': { apartment: 0, villa: 3200, townhouse: 0, penthouse: 0 },
    'arabian-ranches': { apartment: 0, villa: 1800, townhouse: 1600, penthouse: 0 },
  };

  const calculations: Calculations = useMemo(() => {
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
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
            <h3>Valuation</h3>
            
            <div className="result-box highlight">
              <span className="result-label">Estimated Price</span>
              <span className="result-value">{formatCurrency(calculations.estimatedPrice)}</span>
            </div>

            <div className="result-box">
              <span className="result-label">Price Range</span>
              <span className="result-value">{formatCurrency(calculations.lowRange)} - {formatCurrency(calculations.highRange)}</span>
            </div>

            <h4>Net Proceeds (After Costs)</h4>
            <div className="result-box">
              <span className="result-label">Net Proceeds</span>
              <span className="result-value">{formatCurrency(calculations.netProceeds)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingToolsPage;
