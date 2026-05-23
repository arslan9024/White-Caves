import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { setUserRoles, setActiveRole, submitRoleChangeRequest } from '../../../../store/roleSlice';
import { apiClient } from '../../../../utils/apiClient';
import { createLogger } from '../../../../utils/logger';
import './RoleSelection.css';

const log = createLogger('RoleSelection');

interface RoleOption {
  value: string;
  label: string;
  icon: string;
  description: string;
  autoApprove: boolean;
}

const roleOptions: RoleOption[] = [
  { 
    value: 'buyer', 
    label: 'Buyer', 
    icon: '👤',
    description: 'Looking to buy property in Dubai', 
    autoApprove: true 
  },
  { 
    value: 'tenant', 
    label: 'Tenant', 
    icon: '🏠',
    description: 'Looking to rent a property', 
    autoApprove: true 
  },
  { 
    value: 'seller', 
    label: 'Seller', 
    icon: '💼',
    description: 'Want to sell your property', 
    autoApprove: false 
  },
  { 
    value: 'landlord', 
    label: 'Landlord', 
    icon: '👑',
    description: 'Manage and rent out properties', 
    autoApprove: false 
  },
  { 
    value: 'leasing_agent', 
    label: 'Leasing Agent', 
    icon: '🔑',
    description: 'Real estate leasing professional', 
    autoApprove: false 
  },
  { 
    value: 'sales_agent', 
    label: 'Sales Agent', 
    icon: '👔',
    description: 'Real estate sales professional', 
    autoApprove: false 
  },
];

interface RoleSelectionFormProps {
  userId: string;
  onComplete?: (role: string, autoApproved: boolean) => void;
  onSkip?: () => void;
}

const RoleSelectionForm = ({ userId, onComplete, onSkip }: RoleSelectionFormProps) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const selectedRoleData = roleOptions.find(r => r.value === selectedRole);
  const requiresApproval = selectedRoleData && !selectedRoleData.autoApprove;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    setError(null);

    try {
      const roleData = roleOptions.find(r => r.value === selectedRole);
      if (!roleData) {
        setError('Invalid role selection. Please select a role and try again.');
        setLoading(false);
        return;
      }
      
      if (token) {
        apiClient.setAuthToken(token);
      }
      
      // Make API call FIRST, then update Redux only on success
      if (roleData.autoApprove) {
        await apiClient.post('/users/role', { 
          userId, 
          role: selectedRole,
          status: 'approved'
        });
        // Only dispatch after API confirms success
        dispatch(setUserRoles([selectedRole]));
        dispatch(setActiveRole(selectedRole));
      } else {
        await apiClient.post('/users/role-request', { 
          userId, 
          requestedRole: selectedRole,
          reason,
        });
        // Only dispatch after API confirms success
        dispatch(submitRoleChangeRequest({
          userId,
          currentRole: 'buyer',
          requestedRole: selectedRole,
          reason,
        }));
        dispatch(setUserRoles(['buyer']));
        dispatch(setActiveRole('buyer'));
      }

      onComplete?.(selectedRole, roleData.autoApprove);
    } catch (err) {
      
      setError(err.message || 'Failed to set role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-selection-form">
      <div className="role-selection-header">
        <h2>Choose Your Role</h2>
        <p>Select how you'd like to use White Caves Real Estate</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="role-options">
          {roleOptions.map((role) => (
            <label
              key={role.value}
              className={`role-option ${selectedRole === role.value ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={selectedRole === role.value}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={loading}
              />
              <div className="role-option-content">
                <span className="role-icon">{role.icon}</span>
                <div className="role-info">
                  <span className="role-label">{role.label}</span>
                  <span className="role-description">{role.description}</span>
                </div>
                {!role.autoApprove && (
                  <span className="approval-badge">Requires Approval</span>
                )}
              </div>
            </label>
          ))}
        </div>

        {requiresApproval && (
          <div className="approval-notice">
            <div className="notice-icon">ℹ️</div>
            <div className="notice-content">
              <h4>Approval Required</h4>
              <p>
                This role requires admin approval. You'll have access as a Buyer until approved.
                Please provide a brief reason for your request.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you requesting this role? (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="role-selection-actions">
          <button
            type="button"
            className="skip-btn"
            onClick={onSkip}
            disabled={loading}
          >
            Skip for now
          </button>
          <button
            type="submit"
            className="continue-btn"
            disabled={!selectedRole || loading}
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleSelectionForm;
