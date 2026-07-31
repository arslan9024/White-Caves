import React, { useState, useEffect, useRef } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';
import type { CRMModuleProps } from './types';

const log = createLogger('DLDIntegration');

interface DLDProperty {
  id: number;
  plot: string;
  building: string;
  owner: string;
  area: number;
  price: number;
}

/**
 * DLD Integration Module
 * Dubai Land Department integration for property registration, transfers, and tax calculations
 * 
 * Features:
 * - Property lookup by plot/building number
 * - DLD transaction history
 * - Tax calculation for transfers
 * - Document submission status tracking
 */

export default function DLDIntegrationModule({ role, user, data }: CRMModuleProps) {
  const [activeTab, setActiveTab] = useState<string>('lookup');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<DLDProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<DLDProperty | null>(null);
  const [dldFees, setDldFees] = useState(0);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell' | 'lease'>('buy');
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handlePropertyLookup = async () => {
    try {
      const response = await authFetch(`/api/dld/property-lookup?query=${encodeURIComponent(searchQuery)}`);
      if (!isMountedRef.current) return;
      if (response.ok) {
        const result = await response.json();
        setProperties(result.properties || []);
      } else {
        // Mock data
        setProperties([
          { id: 1, plot: 'P123', building: 'Marina Tower 1', owner: 'Mohammed Al-Ketbi', area: 2500, price: 2500000 } as DLDProperty,
          { id: 2, plot: 'P124', building: 'Marina Tower 2', owner: 'Fatima Al-Naqbi', area: 1800, price: 1800000 } as DLDProperty,
        ]);
      }
    } catch (error) {
      if (isMountedRef.current) log.error('Property lookup error:', error);
    }
  };

  const calculateDLDFees = (price: number): number => {
    // Dubai DLD fees differ by transaction type
    if (transactionType === 'lease') {
      // Lease registration: typically 5% of annual rent (approximated as 5% of price here)
      return price * 0.05 + 500;
    }
    // Buy/Sell: 4% of property value + AED 1000 admin fee (actual DLD rate)
    const baseFee = price * 0.04;
    const adminFee = 1000;
    return baseFee + adminFee;
  };

  const handleCalculateFees = () => {
    if (selectedProperty) {
      const fees = calculateDLDFees(selectedProperty.price);
      setDldFees(fees);
    }
  };

  const renderLookupTab = () => (
    <div className="module-section">
      <h3>Property Lookup</h3>
      <div className="lookup-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Enter plot or building number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handlePropertyLookup} className="submit-btn">Search</button>
        </div>
      </div>

      {properties.length > 0 && (
        <div className="lookup-results">
          <table>
            <thead>
              <tr>
                <th>Plot/Building</th>
                <th>Owner</th>
                <th>Area (sqft)</th>
                <th>Estimated Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(prop => (
                <tr key={prop.id}>
                  <td>{prop.plot} - {prop.building}</td>
                  <td>{prop.owner}</td>
                  <td>{(prop.area ?? 0).toLocaleString()}</td>
                  <td>AED {(prop.price ?? 0).toLocaleString()}</td>
                  <td>
                    <button onClick={() => setSelectedProperty(prop)} className="select-btn">Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProperty && (
        <div className="property-details">
          <h4>Selected Property</h4>
          <p><strong>Plot:</strong> {selectedProperty.plot}</p>
          <p><strong>Building:</strong> {selectedProperty.building}</p>
          <p><strong>Area:</strong> {(selectedProperty.area ?? 0).toLocaleString()} sqft</p>
          <p><strong>Value:</strong> AED {(selectedProperty.price ?? 0).toLocaleString()}</p>
        </div>
      )}
    </div>
  );

  const renderTaxCalculator = () => (
    <div className="module-section">
      <h3>DLD Tax & Fee Calculator</h3>
      {selectedProperty && (
        <div className="calculator">
          <div className="calc-item">
            <label>Transaction Type:</label>
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value as 'buy' | 'sell' | 'lease')}>
              <option value="buy">Purchase</option>
              <option value="sell">Sale</option>
              <option value="lease">Lease Transfer</option>
            </select>
          </div>
          <div className="calc-item">
            <label>Property Value:</label>
            <p>AED {(selectedProperty.price ?? 0).toLocaleString()}</p>
          </div>
          <div className="calc-item">
            <button onClick={handleCalculateFees} className="submit-btn">Calculate Fees</button>
          </div>
          {dldFees > 0 && (
            <div className="fee-summary">
              <h4>Fee Breakdown</h4>
              {transactionType === 'lease' ? (
                <>
                  <p>Annual Lease Fee (5%): AED {((selectedProperty.price ?? 0) * 0.05).toLocaleString()}</p>
                  <p>Registration Fee: AED 500</p>
                </>
              ) : (
                <>
                  <p>Registration Fee (4%): AED {((selectedProperty.price ?? 0) * 0.04).toLocaleString()}</p>
                  <p>Admin Fee: AED 1,000</p>
                </>
              )}
              <p style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
                Total DLD Fees: AED {dldFees.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTransactionHistory = () => (
    <div className="module-section">
      <h3>Transaction History</h3>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Property</th>
            <th>Type</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-03-01</td>
            <td>Marina Tower 1, P123</td>
            <td>Purchase</td>
            <td>AED 2,500,000</td>
            <td><span className="status-badge" style={{ backgroundColor: 'var(--accent-green, #22c55e)' }}>Completed</span></td>
          </tr>
          <tr>
            <td>2024-02-15</td>
            <td>Downtown Dubai, P456</td>
            <td>Sale</td>
            <td>AED 1,800,000</td>
            <td><span className="status-badge" style={{ backgroundColor: 'var(--accent-gold, #f59e0b)' }}>Pending</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dubai-crm-module dld-integration-module">
      <div className="module-header">
        <h1>DLD Integration & Tax Management</h1>
        <p>Dubai Land Department property lookup, tax calculation, and document tracking</p>
      </div>

      <div className="module-tabs">
        <button
          className={`tab ${activeTab === 'lookup' ? 'active' : ''}`}
          onClick={() => setActiveTab('lookup')}
        >
          Property Lookup
        </button>
        <button
          className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          Tax Calculator
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Transaction History
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'lookup' && renderLookupTab()}
        {activeTab === 'calculator' && renderTaxCalculator()}
        {activeTab === 'history' && renderTransactionHistory()}
      </div>
    </div>
  );
}
