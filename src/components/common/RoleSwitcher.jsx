import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveRole, setCurrentModule, setCurrentSubModule } from '../../store/navigationSlice';
import { getDefaultModule } from '../../features/featureRegistry';
import './RoleSwitcher.css';

const ROLE_OPTIONS = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Find your dream property' },
  { id: 'seller', label: 'Seller', icon: '🏢', description: 'List and sell properties' },
  { id: 'landlord', label: 'Landlord', icon: '👑', description: 'Manage rental properties' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', description: 'Your rental home' },
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📝', description: 'Manage rentals' },
  { id: 'secondary-sales-agent', label: 'Sales Agent', icon: '👔', description: 'Close deals' },
  { id: 'owner', label: 'Owner', icon: '⚙️', description: 'System management' }
];

const RoleSwitcher = ({ compact = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRole = useSelector((state) => state.navigation.activeRole);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (roleId) => {
    dispatch(setActiveRole(roleId));
    
    const defaultModule = getDefaultModule(roleId);
    if (defaultModule) {
      dispatch(setCurrentModule(defaultModule.id));
      dispatch(setCurrentSubModule(defaultModule.defaultSubModule));
    }
    
    localStorage.setItem('userRole', JSON.stringify({ 
      role: roleId, 
      selectedAt: new Date().toISOString() 
    }));
    
    navigate(`/${roleId}/dashboard`);
    setIsOpen(false);
  };

  const currentRoleOption = ROLE_OPTIONS.find(opt => opt.id === currentRole);

  return (
    <div className="role-switcher" ref={dropdownRef}>
      <button 
        className={`role-switcher-toggle ${compact ? 'compact' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch role"
        title="Switch User Role"
      >
        <span className="current-role-icon">{currentRoleOption?.icon || '👤'}</span>
        {!compact && (
          <span className="current-role-label">{currentRoleOption?.label || 'Select Role'}</span>
        )}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="role-switcher-dropdown">
          <div className="dropdown-header">Switch Role</div>
          {ROLE_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`role-option ${currentRole === option.id ? 'active' : ''}`}
              onClick={() => handleRoleChange(option.id)}
            >
              <span className="role-icon">{option.icon}</span>
              <div className="role-info">
                <span className="role-label">{option.label}</span>
                <span className="role-description">{option.description}</span>
              </div>
              {currentRole === option.id && (
                <span className="role-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
