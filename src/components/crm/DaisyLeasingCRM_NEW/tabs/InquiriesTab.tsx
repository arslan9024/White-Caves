import React from 'react';
import { Home, DollarSign, Calendar, Phone, Mail } from 'lucide-react';

const InquiriesTab = ({ inquiries }) => {
  return (
    <div className="inquiries-view">
      <h3>Rental Inquiries</h3>
      <div className="inquiry-cards">
        {inquiries.map(inquiry => (
          <div key={inquiry.id} className="inquiry-card">
            <div className="inquiry-header">
              <h4>{inquiry.name}</h4>
              <span className={`status-badge ${inquiry.status}`}>{inquiry.status.replace('_', ' ')}</span>
            </div>
            <div className="inquiry-details">
              <span><Home size={14} /> {inquiry.property}</span>
              <span><DollarSign size={14} /> {inquiry.budget} AED/year</span>
              <span><Calendar size={14} /> {inquiry.date}</span>
            </div>
            <div className="inquiry-actions">
              <button><Phone size={14} /> Call</button>
              <button><Mail size={14} /> Email</button>
              <button><Calendar size={14} /> Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiriesTab;
