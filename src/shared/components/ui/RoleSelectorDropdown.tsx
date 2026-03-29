import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import { REAL_ESTATE_ROLES, normalizeRoleKey, type RoleDefinition } from '../../../config/roles';
import './RoleSelectorDropdown.css';

/**
 * RoleSelectorDropdown - Dashboard role switcher UI component
 * Role data centralized in src/config/roles.ts (single source of truth)
 */
interface RoleSelectorDropdownProps {
  currentRole?: string;
  onRoleChange?: (role: RoleDefinition) => void;
  compact?: boolean;
}

const RoleSelectorDropdown = ({ currentRole = 'managing_director', onRoleChange, compact = false }: RoleSelectorDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const normalizedRole = normalizeRoleKey(currentRole);
  const [selectedRole, setSelectedRole] = useState(
    REAL_ESTATE_ROLES.find(r => r.id === normalizedRole) || REAL_ESTATE_ROLES[0]
  );
  const navigate = useNavigate();

  React.useEffect(() => {
    const normalized = normalizeRoleKey(currentRole);
    const role = REAL_ESTATE_ROLES.find(r => r.id === normalized);
    if (role && role.id !== selectedRole.id) {
      setSelectedRole(role);
    }
  }, [currentRole]);

  const handleRoleSelect = (role: RoleDefinition) => {
    setSelectedRole(role);
    setIsOpen(false);
    if (onRoleChange) {
      onRoleChange(role);
    }
    navigate(role.dashboardPath);
  };

  const IconComponent = selectedRole.icon;

  return (
    <div className={`role-selector-container ${compact ? 'compact' : ''}`}>
      <button 
        className="role-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        title={compact ? selectedRole.name : undefined}
      >
        <div className="role-selector-current">
          <div 
            className="role-icon-wrapper"
            style={{ backgroundColor: `${selectedRole.color}20`, color: selectedRole.color }}
          >
            <IconComponent size={compact ? 18 : 24} />
          </div>
          {!compact && (
            <div className="role-info">
              <span className="role-name">{selectedRole.name}</span>
              <span className="role-description">{selectedRole.description}</span>
            </div>
          )}
        </div>
        <ChevronDown 
          className={`chevron-icon ${isOpen ? 'rotated' : ''}`} 
          size={compact ? 14 : 20} 
        />
      </button>

      {isOpen && (
        <>
          <div className="role-selector-backdrop" onClick={() => setIsOpen(false)} role="presentation" aria-hidden="true" />
          <div className="role-selector-dropdown">
            <div className="dropdown-header">
              <span>Switch Dashboard View</span>
              <span className="role-count">{REAL_ESTATE_ROLES.length} roles</span>
            </div>
            <div className="dropdown-list">
              {REAL_ESTATE_ROLES.map((role) => {
                const RoleIcon = role.icon;
                const isSelected = role.id === selectedRole.id;
                return (
                  <button
                    key={role.id}
                    className={`role-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <div 
                      className="role-option-icon"
                      style={{ backgroundColor: `${role.color}20`, color: role.color }}
                    >
                      <RoleIcon size={20} />
                    </div>
                    <div className="role-option-info">
                      <span className="role-option-name">{role.name}</span>
                      <span className="role-option-desc">{role.description}</span>
                    </div>
                    {isSelected && (
                      <Check className="check-icon" size={18} style={{ color: role.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { REAL_ESTATE_ROLES };
export default RoleSelectorDropdown;
