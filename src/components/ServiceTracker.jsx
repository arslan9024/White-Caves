
import React, { useState, useEffect } from 'react';
import './ServiceTracker.css';
import Loading from './Loading';

export default function ServiceTracker({ userId, userRole }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    type: 'BUYER',
    serviceType: 'CONSULTATION',
    description: ''
  });

  useEffect(() => {
    fetchServices();
  }, [userId]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services/${userId}`);
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const validateServiceDependencies = async (serviceType) => {
    if (serviceType === 'KEY_HANDOVER') {
      const completedServices = services.filter(s => s.status === 'COMPLETED');
      const requiredServices = ['EJARI_REGISTRATION', 'DEWA_REGISTRATION', 'MOVE_IN_PERMIT'];
      
      const missingServices = requiredServices.filter(required => 
        !completedServices.some(service => service.serviceType === required)
      );
      
      if (missingServices.length > 0) {
        return {
          valid: false,
          message: `Cannot proceed with key handover. Missing completed services: ${missingServices.join(', ')}`
        };
      }
    }
    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = await validateServiceDependencies(newService.serviceType);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newService, clientId: userId })
      });
      if (response.ok) {
        fetchServices();
        setNewService({ type: 'BUYER', serviceType: 'CONSULTATION', description: '' });
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="service-tracker">
      <h2>Service History</h2>
      
      <form onSubmit={handleSubmit} className="service-form">
        <select
          value={newService.type}
          onChange={(e) => setNewService({...newService, type: e.target.value})}
        >
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
        </select>
        
        <select
          value={newService.serviceType}
          onChange={(e) => setNewService({...newService, serviceType: e.target.value})}
        >
          <option value="CONSULTATION">Consultation</option>
          <option value="PROPERTY_VALUATION">Property Valuation</option>
          <option value="PROPERTY_LISTING">Property Listing</option>
          <option value="PROPERTY_VIEWING">Property Viewing</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="DOCUMENTATION">Documentation</option>
          {user.role === 'AGENT' && (
            <>
              <option value="TENANCY_CONTRACT">Tenancy Contract</option>
              <option value="EJARI_REGISTRATION">EJARI Registration</option>
              <option value="DEWA_REGISTRATION">DEWA Registration</option>
              <option value="MOVE_IN_PERMIT">Move-in Permit</option>
              <option value="FORM_B">Form B (DLD)</option>
              <option value="FORM_F">Form F (DLD)</option>
              <option value="DEVELOPER_NOC">Developer NOC</option>
              <option value="DEWA_CLEARANCE">DEWA Clearance Certificate</option>
              <option value="PROPERTY_TRANSFER">Property Transfer Scheduling</option>
              <option value="TITLE_DEED_UPLOAD">Title Deed Upload</option>
            </>
          )}
        </select>
        
        <textarea
          value={newService.description}
          onChange={(e) => setNewService({...newService, description: e.target.value})}
          placeholder="Service description"
        />
        
        <button type="submit">Add Service</button>
      </form>

      <div className="services-list">
        {services.map(service => (
          <div key={service._id} className="service-card">
            <div className="service-header">
              <span className={`service-type ${service.type.toLowerCase()}`}>
                {service.type}
              </span>
              <span className={`service-status ${service.status.toLowerCase()}`}>
                {service.status}
              </span>
            </div>
            <h3>{service.serviceType.replace('_', ' ')}</h3>
            <p>{service.description}</p>
            <div className="service-dates">
              <span>Started: {new Date(service.startDate).toLocaleDateString()}</span>
              {service.completionDate && (
                <span>Completed: {new Date(service.completionDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
