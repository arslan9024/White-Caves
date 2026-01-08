import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, Building2, Users, UserCheck, Home, Key, Briefcase, 
  Shield, Gavel, ClipboardList, Wallet, ChevronDown, Check,
  User, HeartHandshake, Scale, FileCheck, Landmark, HardHat
} from 'lucide-react';
import './RoleSelectorDropdown.css';

const REAL_ESTATE_ROLES = [
  {
    id: 'company_owner',
    name: 'Company Owner',
    icon: Crown,
    color: '#FFD700',
    description: 'Full access to all features, analytics, and settings',
    permissions: ['*'],
    dashboardPath: '/owner/dashboard'
  },
  {
    id: 'super_admin',
    name: 'Super Admin',
    icon: Shield,
    color: '#DC2626',
    description: 'System administration and user management',
    permissions: ['admin.*', 'users.*', 'settings.*'],
    dashboardPath: '/admin/dashboard'
  },
  {
    id: 'branch_manager',
    name: 'Branch Manager',
    icon: Building2,
    color: '#2563EB',
    description: 'Manage branch operations, agents, and listings',
    permissions: ['branch.*', 'agents.*', 'properties.approve'],
    dashboardPath: '/branch/dashboard'
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    icon: Briefcase,
    color: '#7C3AED',
    description: 'Oversee sales team, targets, and commissions',
    permissions: ['sales.*', 'agents.view', 'commissions.*'],
    dashboardPath: '/sales/dashboard'
  },
  {
    id: 'leasing_manager',
    name: 'Leasing Manager',
    icon: Key,
    color: '#059669',
    description: 'Manage rental properties and tenancy contracts',
    permissions: ['rentals.*', 'tenancy.*', 'ejari.*'],
    dashboardPath: '/leasing/dashboard'
  },
  {
    id: 'agent',
    name: 'Real Estate Agent',
    icon: UserCheck,
    color: '#EA580C',
    description: 'List properties, manage clients, close deals',
    permissions: ['properties.own', 'leads.own', 'clients.own'],
    dashboardPath: '/agent/dashboard'
  },
  {
    id: 'property_consultant',
    name: 'Property Consultant',
    icon: HeartHandshake,
    color: '#0891B2',
    description: 'Advise clients on property investments',
    permissions: ['properties.view', 'clients.own', 'analytics.view'],
    dashboardPath: '/consultant/dashboard'
  },
  {
    id: 'legal_officer',
    name: 'Legal Officer',
    icon: Scale,
    color: '#4F46E5',
    description: 'Handle contracts, compliance, and legal matters',
    permissions: ['contracts.*', 'legal.*', 'compliance.*'],
    dashboardPath: '/legal/dashboard'
  },
  {
    id: 'finance_officer',
    name: 'Finance Officer',
    icon: Wallet,
    color: '#16A34A',
    description: 'Manage payments, invoices, and financial reports',
    permissions: ['finance.*', 'payments.*', 'reports.financial'],
    dashboardPath: '/finance/dashboard'
  },
  {
    id: 'marketing_manager',
    name: 'Marketing Manager',
    icon: ClipboardList,
    color: '#DB2777',
    description: 'Manage campaigns, listings visibility, and branding',
    permissions: ['marketing.*', 'properties.promote', 'analytics.marketing'],
    dashboardPath: '/marketing/dashboard'
  },
  {
    id: 'document_controller',
    name: 'Document Controller',
    icon: FileCheck,
    color: '#6366F1',
    description: 'Manage property documents and verifications',
    permissions: ['documents.*', 'verification.*'],
    dashboardPath: '/documents/dashboard'
  },
  {
    id: 'landlord',
    name: 'Landlord / Property Owner',
    icon: Landmark,
    color: '#8B5CF6',
    description: 'Manage owned properties and rental income',
    permissions: ['properties.own', 'tenants.view', 'income.own'],
    dashboardPath: '/landlord/dashboard'
  },
  {
    id: 'tenant',
    name: 'Tenant',
    icon: Home,
    color: '#14B8A6',
    description: 'View rented property, pay rent, raise requests',
    permissions: ['tenancy.own', 'payments.own', 'requests.own'],
    dashboardPath: '/tenant/dashboard'
  },
  {
    id: 'buyer',
    name: 'Property Buyer',
    icon: User,
    color: '#0EA5E9',
    description: 'Search properties, save favorites, make offers',
    permissions: ['properties.view', 'favorites.own', 'offers.own'],
    dashboardPath: '/buyer/dashboard'
  },
  {
    id: 'seller',
    name: 'Property Seller',
    icon: Users,
    color: '#F59E0B',
    description: 'List properties for sale, manage offers',
    permissions: ['properties.own', 'offers.view', 'sales.own'],
    dashboardPath: '/seller/dashboard'
  },
  {
    id: 'developer',
    name: 'Property Developer',
    icon: HardHat,
    color: '#78716C',
    description: 'Manage off-plan projects and developments',
    permissions: ['projects.*', 'offplan.*', 'sales.developer'],
    dashboardPath: '/developer/dashboard'
  },
  {
    id: 'valuation_expert',
    name: 'Valuation Expert',
    icon: Gavel,
    color: '#A855F7',
    description: 'Conduct property valuations and appraisals',
    permissions: ['valuations.*', 'properties.view', 'reports.valuation'],
    dashboardPath: '/valuation/dashboard'
  }
];

const RoleSelectorDropdown = ({ currentRole = 'company_owner', onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    REAL_ESTATE_ROLES.find(r => r.id === currentRole) || REAL_ESTATE_ROLES[0]
  );
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsOpen(false);
    if (onRoleChange) {
      onRoleChange(role);
    }
    navigate(role.dashboardPath);
  };

  const IconComponent = selectedRole.icon;

  return (
    <div className="role-selector-container">
      <button 
        className="role-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="role-selector-current">
          <div 
            className="role-icon-wrapper"
            style={{ backgroundColor: `${selectedRole.color}20`, color: selectedRole.color }}
          >
            <IconComponent size={24} />
          </div>
          <div className="role-info">
            <span className="role-name">{selectedRole.name}</span>
            <span className="role-description">{selectedRole.description}</span>
          </div>
        </div>
        <ChevronDown 
          className={`chevron-icon ${isOpen ? 'rotated' : ''}`} 
          size={20} 
        />
      </button>

      {isOpen && (
        <>
          <div className="role-selector-backdrop" onClick={() => setIsOpen(false)} />
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
