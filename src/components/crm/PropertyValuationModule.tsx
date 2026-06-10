import React, { useState } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';
import type { CRMModuleProps } from './types';
import './PropertyValuationModule.css';

const log = createLogger('PropertyValuation');

/**
 * Property Valuation Module
 * ML-based property price estimation and market comparison
 * 
 * Features:
 * - Automated property valuation
 * - Comparable property analysis
 * - Price trends by location
 * - Valuation report generation
 */

export default function PropertyValuationModule({ role, user, data }: CRMModuleProps) {
  const [activeTab, setActiveTab] = useState<string>('valuation');
  const [formData, setFormData] = useState({
    location: '',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    propertyType: 'apartment',
    age: 5,
  });
  const [valuation, setValuation] = useState<{ low: number; mid: number; high: number; confidence: number; isEstimate?: boolean } | null>(null);
  const [comparables, setComparables] = useState<Array<{ property: string; price: number; area: number; pricePerSqft: number }>>([]);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const estimatePrice = async () => {
    setIsEstimating(true);
    setEstimateError(null);
    setFallbackNotice(null);

    try {
      const response = await authFetch('/api/valuation/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setValuation(data.estimate);
        setComparables(data.comparables || []);
      } else {
        // Fallback estimation — real valuation API not yet configured
        log.warn('Valuation API unavailable — using local estimate. Results are approximate.');
        setFallbackNotice('Live valuation API is unavailable. Showing estimated values based on local fallback logic.');
        const basePrice = 2000 * formData.area;
        const locationMultiplier = formData.location.includes('Marina') ? 1.3 : 1.0;
        const estimatedPrice = basePrice * locationMultiplier;
        setValuation({
          low: Math.round(estimatedPrice * 0.9),
          mid: Math.round(estimatedPrice),
          high: Math.round(estimatedPrice * 1.1),
          confidence: 60, // Lower confidence for local estimates
          isEstimate: true, // Flag so UI can show disclaimer
        });
        setComparables([
          { property: 'Marina Tower 1 - 2BR', price: 2100000, area: 1500, pricePerSqft: 1400 },
          { property: 'JBR - 2BR', price: 1900000, area: 1500, pricePerSqft: 1270 },
          { property: 'Downtown - 2BR', price: 2300000, area: 1500, pricePerSqft: 1530 },
        ]);
      }
    } catch (error) {
      log.error('Valuation error:', error);
      setEstimateError('Unable to estimate property value right now. Please try again.');
    } finally {
      setIsEstimating(false);
    }
  };

  const renderValuationTab = () => (
    <div className="module-section">
      <h3>Property Valuation Calculator</h3>
      <div className="valuation-form">
        {estimateError && (
          <div role="alert" className="module-error-alert">
            {estimateError}
          </div>
        )}

        {fallbackNotice && (
          <div role="status" aria-live="polite" className="module-fallback-alert">
            {fallbackNotice}
          </div>
        )}

        <div className="form-group">
          <label>Location</label>
          <select
            value={formData.location}
            title="Select property location"
            aria-label="Select property location"
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          >
            <option value="">Select Location</option>
            <option value="Marina">Marina</option>
            <option value="Downtown">Downtown Dubai</option>
            <option value="JBR">Jumeirah Beach Residence</option>
            <option value="Palm">The Palm</option>
          </select>
        </div>
        <div className="form-group">
          <label>Property Type</label>
          <select
            value={formData.propertyType}
            title="Select property type"
            aria-label="Select property type"
            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
          >
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
        <div className="form-group">
          <label>Area (sqft)</label>
          <input
            type="number"
            placeholder="Enter area in square feet"
            title="Enter area in square feet"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Bedrooms</label>
          <input
            type="number"
            placeholder="Enter number of bedrooms"
            title="Enter number of bedrooms"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Bathrooms</label>
          <input
            type="number"
            placeholder="Enter number of bathrooms"
            title="Enter number of bathrooms"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Property Age (years)</label>
          <input
            type="number"
            placeholder="Enter property age in years"
            title="Enter property age in years"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          />
        </div>
        <button onClick={estimatePrice} className="submit-btn" disabled={isEstimating}>
          {isEstimating ? 'Estimating…' : 'Estimate Value'}
        </button>
      </div>

      {valuation && (
        <div className="valuation-result">
          <h3>Estimated Value</h3>
          <div className="price-range">
            <div className="price-card">
              <p>Low Estimate</p>
              <p className="valuation-price valuation-price--low">
                AED {(Number(valuation.low) || 0).toLocaleString()}
              </p>
            </div>
            <div className="price-card">
              <p>Mid Estimate</p>
              <p className="valuation-price valuation-price--mid">
                AED {(Number(valuation.mid) || 0).toLocaleString()}
              </p>
            </div>
            <div className="price-card">
              <p>High Estimate</p>
              <p className="valuation-price valuation-price--high">
                AED {(Number(valuation.high) || 0).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="valuation-confidence">
            Confidence Level: {valuation.confidence}%
          </p>
        </div>
      )}

      {comparables.length > 0 && (
        <div className="comparables valuation-comparables">
          <h3>Comparable Properties</h3>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Price</th>
                <th>Area (sqft)</th>
                <th>Price/sqft</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((comp) => (
                <tr key={comp.property}>
                  <td>{comp.property}</td>
                  <td>AED {(Number(comp.price) || 0).toLocaleString()}</td>
                  <td>{(Number(comp.area) || 0).toLocaleString()}</td>
                  <td>AED {(Number(comp.pricePerSqft) || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderMarketAnalysis = () => (
    <div className="module-section">
      <h3>Market Analysis</h3>
      <div className="market-chart-placeholder">
        <p>Price Trend (Last 12 Months)</p>
        <svg height="200" className="valuation-chart">
          <polyline points="0,150 30,140 60,130 90,120 120,110 150,100 180,95 210,100 240,110 270,120 300,140 330,160"
            fill="none" stroke="#0066cc" strokeWidth="2" />
        </svg>
        <p className="valuation-chart-note">
          Market showing upward trend. Average growth: 3-5% per year
        </p>
      </div>
    </div>
  );

  return (
    <div className="dubai-crm-module property-valuation-module">
      <div className="module-header">
        <h1>Property Valuation Tools</h1>
        <p>ML-based property price estimation and market comparison</p>
      </div>

      <div className="module-tabs">
        <button
          className={`tab ${activeTab === 'valuation' ? 'active' : ''}`}
          onClick={() => setActiveTab('valuation')}
        >
          Valuation Calculator
        </button>
        <button
          className={`tab ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          Market Analysis
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'valuation' && renderValuationTab()}
        {activeTab === 'market' && renderMarketAnalysis()}
      </div>
    </div>
  );
}
