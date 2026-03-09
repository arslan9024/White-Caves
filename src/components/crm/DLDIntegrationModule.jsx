import React, { useState } from 'react';

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

export default function DLDIntegrationModule({ role, user, data }) {
  const [activeTab, setActiveTab] = useState('lookup');
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dldFees, setDldFees] = useState(0);
  const [transactionType, setTransactionType] = useState('buy');

  const handlePropertyLookup = async () => {
    try {
      const response = await fetch(`/api/dld/property-lookup?query=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        // Mock data
        setProperties([
          { id: 1, plot: 'P123', building: 'Marina Tower 1', owner: 'Mohammed Al-Ketbi', area: 2500, price: 2500000 },
          { id: 2, plot: 'P124', building: 'Marina Tower 2', owner: 'Fatima Al-Naqbi', area: 1800, price: 1800000 },
        ]);
      }
    } catch (error) {
      console.error('Property lookup error:', error);
    }
  };

  const calculateDLDFees = (price) => {
    // Dubai DLD fee: 0.5% of property value + AED 1000 admin fee
    const baseFee = price * 0.005;
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
                  <td>{prop.area.toLocaleString()}</td>
                  <td>AED {prop.price.toLocaleString()}</td>
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
          <p><strong>Area:</strong> {selectedProperty.area.toLocaleString()} sqft</p>
          <p><strong>Value:</strong> AED {selectedProperty.price.toLocaleString()}</p>
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
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="buy">Purchase</option>
              <option value="sell">Sale</option>
              <option value="lease">Lease Transfer</option>
            </select>
          </div>
          <div className="calc-item">
            <label>Property Value:</label>
            <p>AED {selectedProperty.price.toLocaleString()}</p>
          </div>
          <div className="calc-item">
            <button onClick={handleCalculateFees} className="submit-btn">Calculate Fees</button>
          </div>
          {dldFees > 0 && (
            <div className="fee-summary">
              <h4>Fee Breakdown</h4>
              <p>Registration Fee (0.5%): AED {(selectedProperty.price * 0.005).toLocaleString()}</p>
              <p>Admin Fee: AED 1,000</p>
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
            <td><span className="status-badge" style={{ backgroundColor: '#22c55e' }}>Completed</span></td>
          </tr>
          <tr>
            <td>2024-02-15</td>
            <td>Downtown Dubai, P456</td>
            <td>Sale</td>
            <td>AED 1,800,000</td>
            <td><span className="status-badge" style={{ backgroundColor: '#f59e0b' }}>Pending</span></td>
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
