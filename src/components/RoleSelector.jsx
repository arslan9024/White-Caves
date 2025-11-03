
import React, { useState } from 'react';
import './RoleSelector.css';

const roleOptions = [
  { value: 'BUYER', label: 'Property Buyer' },
  { value: 'TENANT', label: 'Tenant' },
  { value: 'SELLER', label: 'Property Seller' },
  { value: 'LANDLORD', label: 'Landlord' },
  { value: 'AGENT', label: 'Real Estate Agent' }
];

export default function RoleSelector({ currentRoles = [], onRolesUpdate }) {
  const [selectedRoles, setSelectedRoles] = useState(currentRoles);

  const toggleRole = (role) => {
    let updatedRoles;
    if (selectedRoles.includes(role)) {
      updatedRoles = selectedRoles.filter(r => r !== role);
    } else {
      updatedRoles = [...selectedRoles, role];
    }
    setSelectedRoles(updatedRoles);
    if (onRolesUpdate) {
      onRolesUpdate(updatedRoles);
    }
  };

  return (
    <div className="role-selector">
      <h4>Select Your Roles</h4>
      <div className="role-options">
        {roleOptions.map(option => (
          <label key={option.value} className="role-option">
            <input
              type="checkbox"
              checked={selectedRoles.includes(option.value)}
              onChange={() => toggleRole(option.value)}
            />
            <span className="role-option-label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
