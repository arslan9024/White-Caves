import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleGateway.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const ROLES = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Looking to purchase property in Dubai' },
  { id: 'seller', label: 'Seller', icon: '💰', description: 'Selling residential or commercial property' },
  { id: 'landlord', label: 'Landlord', icon: '🔑', description: 'Renting out properties to tenants' },
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📋', description: 'Professional agent handling rental properties' },
  { id: 'secondary-sales-agent', label: 'Secondary Sales Agent', icon: '🏢', description: 'Professional agent handling property sales' },
  { id: 'leasing-team-leader', label: 'Leasing Team Leader', icon: '👥', description: 'Managing leasing agents team' },
  { id: 'sales-team-leader', label: 'Sales Team Leader', icon: '📊', description: 'Managing secondary sales agents team' },
  { id: 'admin', label: 'Administrator', icon: '⚙️', description: 'Platform administration and management' },
];

export default function RoleGateway({ user, onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email === OWNER_EMAIL) {
      const ownerRole = {
        role: 'owner',
        selectedAt: new Date().toISOString(),
        locked: true,
        isOwner: true
      };
      localStorage.setItem('userRole', JSON.stringify(ownerRole));
      navigate('/owner/dashboard');
    }
  }, [user, navigate]);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (!selectedRole) return;
    
    const userRole = {
      role: selectedRole,
      selectedAt: new Date().toISOString(),
      locked: true
    };
    
    localStorage.setItem('userRole', JSON.stringify(userRole));
    
    if (onRoleSelect) {
      onRoleSelect(selectedRole);
    }
    
    navigate(`/${selectedRole}/dashboard`);
  };

  return (
    <div className="role-gateway">
      <div className="role-gateway-container">
        <div className="role-gateway-header">
          <h1>Select Your Role</h1>
          <p>Please select your primary role to continue. This selection determines the content and features available to you.</p>
          <p className="role-warning">Note: Your role cannot be changed after selection without admin approval.</p>
        </div>

        <div className="roles-grid">
          {ROLES.map((role) => (
            <div
              key={role.id}
              className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <span className="role-icon">{role.icon}</span>
              <h3>{role.label}</h3>
              <p>{role.description}</p>
              {selectedRole === role.id && (
                <div className="role-checkmark">✓</div>
              )}
            </div>
          ))}
        </div>

        {selectedRole && (
          <div className="role-confirm-section">
            <p>You selected: <strong>{ROLES.find(r => r.id === selectedRole)?.label}</strong></p>
            <button className="btn btn-primary btn-large" onClick={handleConfirm}>
              Confirm Selection & Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function useUserRole() {
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        setUserRole(JSON.parse(stored));
      } catch (e) {
        setUserRole(null);
      }
    }
  }, []);
  
  return userRole;
}

export function RoleGuard({ allowedRoles, children }) {
  const navigate = useNavigate();
  const userRole = useUserRole();
  
  useEffect(() => {
    if (!userRole) {
      navigate('/select-role');
      return;
    }
    
    if (!allowedRoles.includes(userRole.role)) {
      navigate(`/${userRole.role}/dashboard`);
    }
  }, [userRole, allowedRoles, navigate]);
  
  if (!userRole || !allowedRoles.includes(userRole.role)) {
    return null;
  }
  
  return children;
}

export { ROLES };
