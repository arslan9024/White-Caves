
import React from 'react';
import './Profile.css';

const roleLabels = {
  VISITOR: 'Visitor',
  AGENT: 'Real Estate Agent',
  EMPLOYEE: 'Employee',
  BUYER: 'Property Buyer',
  SELLER: 'Property Seller',
  TENANT: 'Tenant',
  LANDLORD: 'Landlord',
  PROPERTY_OWNER: 'Property Owner'
};

export default function Profile({ user, onLogout }) {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.photoURL || 'https://via.placeholder.com/100'} alt="Profile" className="profile-avatar" />
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>
        <span className="role-badge">{roleLabels[user.role]}</span>
      </div>
      <div className="profile-info">
        <div className="info-item">
          <span>Member since:</span>
          <span>{new Date(user.metadata.creationTime).toLocaleDateString()}</span>
        </div>
        <div className="info-item">
          <span>Last login:</span>
          <span>{new Date(user.metadata.lastSignInTime).toLocaleDateString()}</span>
        </div>
        {user.contactInfo && (
          <>
            <div className="info-item">
              <span>Phone:</span>
              <span>{user.contactInfo.phone || 'Not provided'}</span>
            </div>
            <div className="info-item">
              <span>Address:</span>
              <span>{user.contactInfo.address || 'Not provided'}</span>
            </div>
          </>
        )}
      </div>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
}
