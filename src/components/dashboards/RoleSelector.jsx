import React from 'react';
import './RoleSelector.css';

const roles = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Looking to purchase property' },
  { id: 'seller', label: 'Seller', icon: '💰', description: 'Selling my property' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', description: 'Renting a property' },
  { id: 'landlord', label: 'Landlord', icon: '🏢', description: 'Property owner renting out' },
  { id: 'agent', label: 'Agent', icon: '👔', description: 'Real estate professional' },
  { id: 'team_leader', label: 'Team Leader', icon: '👥', description: 'Managing a sales team' },
];

export default function RoleSelector({ currentRole, onRoleChange, compact = false }) {
  if (compact) {
    return (
      <div className="role-selector-compact">
        <label>Your Role:</label>
        <select 
          value={currentRole || 'buyer'} 
          onChange={(e) => onRoleChange(e.target.value)}
          className="role-select"
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.icon} {role.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="role-selector">
      <h2>Select Your Role</h2>
      <p className="role-selector-subtitle">Choose how you want to use White Caves</p>
      
      <div className="roles-grid">
        {roles.map(role => (
          <button
            key={role.id}
            className={`role-card ${currentRole === role.id ? 'active' : ''}`}
            onClick={() => onRoleChange(role.id)}
          >
            <span className="role-icon">{role.icon}</span>
            <span className="role-label">{role.label}</span>
            <span className="role-description">{role.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
