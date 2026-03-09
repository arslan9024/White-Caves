
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../store/navigationSlice';
import { getRoleInfo } from '../config/ROLE_TAB_MAPPING';
import './RoleSelector.css';

const AVAILABLE_ROLES = [
  { id: 'lion', label: 'Super User', canAccess: true },
  { id: 'buyer', label: 'Buyer', canAccess: true },
  { id: 'seller', label: 'Seller', canAccess: true },
  { id: 'landlord', label: 'Landlord', canAccess: true },
  { id: 'leasing-agent', label: 'Leasing Agent', canAccess: true },
  { id: 'secondary-sales-agent', label: 'Sales Agent', canAccess: true },
  { id: 'tenant', label: 'Tenant', canAccess: true },
];

export default function RoleSelector() {
  const dispatch = useDispatch();
  const currentRole = useSelector(state => state.navigation?.activeRole || 'buyer');
  const user = useSelector(state => state.user.currentUser);
  
  const [isOpen, setIsOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  
  // Load available roles on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      try {
        const roleData = JSON.parse(storedRole);
        // For now, make all roles available if user is logged in
        // In production, fetch from /api/user/available-roles
        setAvailableRoles(AVAILABLE_ROLES.filter(r => r.canAccess));
      } catch (e) {
        console.error('Failed to parse stored role:', e);
      }
    }
  }, [user]);
  
  const handleRoleChange = (newRole) => {
    // Update localStorage
    localStorage.setItem('userRole', JSON.stringify({
      role: newRole,
      selectedAt: new Date().toISOString(),
      locked: false
    }));
    
    // Update Redux
    dispatch(setActiveRole(newRole));
    
    // Close dropdown
    setIsOpen(false);
    
    // Log role switch for audit trail
    console.log(`User switched role from ${currentRole} to ${newRole}`);
  };
  
  const currentRoleInfo = getRoleInfo(currentRole);
  
  return (
    <div className="role-selector">
      <button
        className="role-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Current role: ${currentRoleInfo.label}`}
      >
        <span className="role-label">{currentRoleInfo.label}</span>
        <span className={`role-dropdown-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="role-dropdown">
          <div className="role-dropdown-header">
            <h3>Switch Role</h3>
            <p>Select a different role to access other features</p>
          </div>
          
          <div className="role-dropdown-list">
            {availableRoles.map(role => (
              <button
                key={role.id}
                className={`role-option ${currentRole === role.id ? 'active' : ''}`}
                onClick={() => handleRoleChange(role.id)}
                disabled={!role.canAccess}
              >
                <span className="role-option-label">{role.label}</span>
                {currentRole === role.id && <span className="role-option-checkmark">✓</span>}
              </button>
            ))}
          </div>
          
          <div className="role-dropdown-footer">
            <p className="role-info">{currentRoleInfo.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
