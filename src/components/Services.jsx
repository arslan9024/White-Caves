
import React from 'react';
import './Services.css';

export default function Services() {
  return (
    <div className="services-section">
      <h2>Our Services</h2>
      <div className="services-container">
        <div className="service-card">
          <i className="fas fa-home"></i>
          <h3>For Tenants</h3>
          <p>We help tenants find and rent their ideal home by:</p>
          <ul>
            <li>Property matching based on preferences</li>
            <li>Arranging property viewings</li>
            <li>Lease agreement assistance</li>
            <li>Move-in support</li>
          </ul>
        </div>
        
        <div className="service-card">
          <i className="fas fa-key"></i>
          <h3>For Buyers</h3>
          <p>We assist buyers in purchasing their dream home through:</p>
          <ul>
            <li>Property search and matching</li>
            <li>Property valuation</li>
            <li>Purchase negotiation</li>
            <li>Transaction support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
