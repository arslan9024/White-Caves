import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './CreateTenancyAgreement.css';

export default function CreateTenancyAgreement() {
  const currentUser = useSelector(state => state.user.currentUser);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    landlordId: '',
    tenantId: '',
    landlordEmail: '',
    tenantEmail: '',
    monthlyRent: '',
    securityDeposit: '',
    leaseStartDate: '',
    leaseEndDate: '',
    propertyAddress: '',
    terms: ''
  });

  useEffect(() => {
    if (currentUser && (currentUser.roles.includes('EMPLOYEE') || currentUser.roles.includes('AGENT'))) {
      fetchProperties();
      fetchTenants();
    }
  }, [currentUser]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      const managedProperties = data.filter(p => 
        p.propertyManagerId === currentUser._id || 
        (p.propertyManagerId && p.propertyManagerId._id === currentUser._id)
      );
      setProperties(managedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      const tenantUsers = data.filter(u => u.roles.includes('TENANT'));
      setTenants(tenantUsers);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handlePropertyChange = (e) => {
    const propertyId = e.target.value;
    const selectedProperty = properties.find(p => p._id === propertyId);
    
    if (selectedProperty) {
      setFormData({
        ...formData,
        propertyId,
        landlordId: selectedProperty.owner._id || selectedProperty.owner,
        landlordEmail: '',
        propertyAddress: selectedProperty.location || selectedProperty.title
      });
    } else {
      setFormData({ ...formData, propertyId });
    }
  };

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    const selectedTenant = tenants.find(t => t._id === tenantId);
    
    if (selectedTenant) {
      setFormData({
        ...formData,
        tenantId,
        tenantEmail: selectedTenant.email
      });
    } else {
      setFormData({ ...formData, tenantId });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tenancy-agreements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyManagerId: currentUser._id
        }),
      });

      if (response.ok) {
        alert('Tenancy agreement created successfully! Email notifications sent to landlord and tenant.');
        setFormData({
          propertyId: '',
          landlordId: '',
          tenantId: '',
          landlordEmail: '',
          tenantEmail: '',
          monthlyRent: '',
          securityDeposit: '',
          leaseStartDate: '',
          leaseEndDate: '',
          propertyAddress: '',
          terms: ''
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create tenancy agreement');
      }
    } catch (error) {
      console.error('Error creating agreement:', error);
      alert('Failed to create tenancy agreement');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="create-agreement-container">
        <div className="no-auth">
          <h2>Please log in to access this page</h2>
        </div>
      </div>
    );
  }

  if (!currentUser.roles.includes('EMPLOYEE') && !currentUser.roles.includes('AGENT')) {
    return (
      <div className="create-agreement-container">
        <div className="no-permission">
          <h2>Access Denied</h2>
          <p>Only property managers can create tenancy agreements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-agreement-container">
      <div className="create-agreement-header">
        <h1>Create Tenancy Agreement</h1>
        <p>As a property manager, create binding tenancy agreements for your managed properties</p>
      </div>

      <form onSubmit={handleSubmit} className="agreement-form">
        <div className="form-section">
          <h3>Property Details</h3>
          
          <div className="form-group">
            <label htmlFor="propertyId">Select Property *</label>
            <select
              id="propertyId"
              name="propertyId"
              value={formData.propertyId}
              onChange={handlePropertyChange}
              required
            >
              <option value="">-- Select a managed property --</option>
              {properties.map(property => (
                <option key={property._id} value={property._id}>
                  {property.title} - {property.location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="propertyAddress">Property Address *</label>
            <input
              type="text"
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              placeholder="Property address"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Tenant Information</h3>
          
          <div className="form-group">
            <label htmlFor="tenantId">Select Tenant *</label>
            <select
              id="tenantId"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleTenantChange}
              required
            >
              <option value="">-- Select a tenant --</option>
              {tenants.map(tenant => (
                <option key={tenant._id} value={tenant._id}>
                  {tenant.name} ({tenant.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tenantEmail">Tenant Email *</label>
            <input
              type="email"
              id="tenantEmail"
              name="tenantEmail"
              value={formData.tenantEmail}
              onChange={handleChange}
              placeholder="Tenant's registered email"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Landlord Information</h3>
          
          <div className="form-group">
            <label htmlFor="landlordEmail">Landlord Email *</label>
            <input
              type="email"
              id="landlordEmail"
              name="landlordEmail"
              value={formData.landlordEmail}
              onChange={handleChange}
              placeholder="Landlord's registered email"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Financial Terms</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monthlyRent">Monthly Rent ($) *</label>
              <input
                type="number"
                id="monthlyRent"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleChange}
                placeholder="e.g., 5000"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="securityDeposit">Security Deposit ($) *</label>
              <input
                type="number"
                id="securityDeposit"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                placeholder="e.g., 10000"
                required
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Lease Period</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="leaseStartDate">Lease Start Date *</label>
              <input
                type="date"
                id="leaseStartDate"
                name="leaseStartDate"
                value={formData.leaseStartDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="leaseEndDate">Lease End Date *</label>
              <input
                type="date"
                id="leaseEndDate"
                name="leaseEndDate"
                value={formData.leaseEndDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Terms</h3>
          
          <div className="form-group">
            <label htmlFor="terms">Terms and Conditions</label>
            <textarea
              id="terms"
              name="terms"
              value={formData.terms}
              onChange={handleChange}
              placeholder="Add any additional terms, conditions, or special clauses..."
              rows="6"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Agreement...' : 'Create Tenancy Agreement'}
          </button>
        </div>
      </form>
    </div>
  );
}
