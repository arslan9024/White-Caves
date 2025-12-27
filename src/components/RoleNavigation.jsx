import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserRole } from './RoleGateway';
import './RoleNavigation.css';

const roleMenus = {
  'buyer': {
    label: 'Buyer',
    icon: '🏠',
    color: '#3b82f6',
    items: [
      { path: '/buyer/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/buyer/mortgage-calculator', label: 'Mortgage Calculator', icon: '🧮' },
      { path: '/buyer/dld-fees', label: 'DLD Fees', icon: '🏛️' },
      { path: '/buyer/title-deed-registration', label: 'Title Deed Registration', icon: '📜' },
      { path: '/buyer/saved-properties', label: 'Saved Properties', icon: '❤️' },
      { path: '/buyer/viewings', label: 'My Viewings', icon: '📅' },
    ]
  },
  'seller': {
    label: 'Seller',
    icon: '💰',
    color: '#10b981',
    items: [
      { path: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/seller/pricing-tools', label: 'Pricing Tools', icon: '💰' },
      { path: '/seller/listings', label: 'My Listings', icon: '🏠' },
      { path: '/seller/inquiries', label: 'Buyer Inquiries', icon: '💬' },
      { path: '/seller/documents', label: 'Documents', icon: '📋' },
    ]
  },
  'landlord': {
    label: 'Landlord',
    icon: '🔑',
    color: '#8b5cf6',
    items: [
      { path: '/landlord/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/landlord/rental-management', label: 'Rental Management', icon: '🏠' },
      { path: '/landlord/tenants', label: 'My Tenants', icon: '👥' },
      { path: '/landlord/finances', label: 'Finances', icon: '💰' },
      { path: '/landlord/maintenance', label: 'Maintenance', icon: '🔧' },
    ]
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    icon: '📋',
    color: '#f59e0b',
    items: [
      { path: '/leasing-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/leasing-agent/tenant-screening', label: 'Tenant Screening', icon: '👤' },
      { path: '/leasing-agent/contracts', label: 'Contracts', icon: '📜' },
      { path: '/leasing-agent/listings', label: 'My Listings', icon: '🏠' },
      { path: '/leasing-agent/leads', label: 'Leads', icon: '📞' },
      { path: '/leasing-agent/calendar', label: 'Calendar', icon: '📅' },
      { path: '/leasing-agent/commission', label: 'Commission', icon: '💰' },
    ]
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    icon: '🏢',
    color: '#ef4444',
    items: [
      { path: '/secondary-sales-agent/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/secondary-sales-agent/sales-pipeline', label: 'Sales Pipeline', icon: '📈' },
      { path: '/secondary-sales-agent/listings', label: 'My Listings', icon: '🏠' },
      { path: '/secondary-sales-agent/leads', label: 'Leads', icon: '📞' },
      { path: '/secondary-sales-agent/calendar', label: 'Calendar', icon: '📅' },
      { path: '/secondary-sales-agent/commission', label: 'Commission', icon: '💰' },
    ]
  },
  'leasing-team-leader': {
    label: 'Leasing Team Leader',
    icon: '👥',
    color: '#f59e0b',
    items: [
      { path: '/leasing-team-leader/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/leasing-team-leader/team', label: 'My Team', icon: '👥' },
      { path: '/leasing-team-leader/performance', label: 'Performance', icon: '📈' },
      { path: '/leasing-team-leader/assignments', label: 'Assignments', icon: '📋' },
    ]
  },
  'sales-team-leader': {
    label: 'Sales Team Leader',
    icon: '📊',
    color: '#ef4444',
    items: [
      { path: '/sales-team-leader/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/sales-team-leader/team', label: 'My Team', icon: '👥' },
      { path: '/sales-team-leader/performance', label: 'Performance', icon: '📈' },
      { path: '/sales-team-leader/assignments', label: 'Assignments', icon: '📋' },
    ]
  },
  'admin': {
    label: 'Administrator',
    icon: '⚙️',
    color: '#6b7280',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/admin/users', label: 'Users', icon: '👥' },
      { path: '/admin/properties', label: 'Properties', icon: '🏠' },
      { path: '/admin/roles', label: 'Roles', icon: '🔐' },
    ]
  },
  'owner': {
    label: 'Company Owner',
    icon: '👑',
    color: '#ffd700',
    items: [
      { path: '/owner/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/owner/business-model', label: 'Business Model', icon: '📋' },
      { path: '/owner/client-services', label: 'Client Services', icon: '🏢' },
      { path: '/owner/system-health', label: 'System Health', icon: '🩺' },
      { path: '/owner/agents', label: 'Manage Agents', icon: '👥' },
      { path: '/owner/properties', label: 'All Properties', icon: '🏠' },
      { path: '/owner/reports', label: 'Reports', icon: '📈' },
      { path: '/owner/settings', label: 'Settings', icon: '⚙️' },
    ],
    browseAs: {
      clients: [
        { path: '/buyer/dashboard', label: 'Buyer Portal', icon: '🏠' },
        { path: '/seller/dashboard', label: 'Seller Portal', icon: '💰' },
        { path: '/landlord/dashboard', label: 'Landlord Portal', icon: '🏢' },
        { path: '/tenant/dashboard', label: 'Tenant Portal', icon: '🔑' },
      ],
      employees: [
        { path: '/leasing-agent/dashboard', label: 'Leasing Agent', icon: '📋' },
        { path: '/secondary-sales-agent/dashboard', label: 'Sales Agent', icon: '💼' },
        { path: '/team-leader/dashboard', label: 'Team Leader', icon: '👔' },
        { path: '/leasing-agent/contracts', label: 'Contract Management', icon: '📜' },
      ]
    }
  }
};

export default function RoleNavigation({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const menu = roleMenus[role];
  if (!menu) return null;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <nav className="role-navigation" style={{'--role-color': menu.color}}>
      <div className="role-nav-header">
        <Link to="/" className="role-nav-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
          <span>White Caves</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      <div className="role-badge">
        <span className="role-icon">{menu.icon}</span>
        <span className="role-label">{menu.label}</span>
      </div>

      <div className={`role-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {menu.items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}

        {menu.browseAs && (
          <>
            <div className="nav-divider"></div>
            <div className="nav-section-label">Browse as Client</div>
            {menu.browseAs.clients.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item browse-as-item client ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
            
            <div className="nav-divider"></div>
            <div className="nav-section-label">Browse as Employee</div>
            {menu.browseAs.employees.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item browse-as-item employee ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </>
        )}

        <div className="nav-divider"></div>
        
        <div className="nav-section-label">Quick Links</div>
        
        <Link to="/" className="nav-item home-link" onClick={() => setMobileMenuOpen(false)}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </Link>
        
        <Link to="/properties" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
          <span className="nav-icon">🔍</span>
          <span className="nav-label">Browse Properties</span>
        </Link>
        
        <Link to="/services" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Services</span>
        </Link>
        
        <Link to="/contact" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
          <span className="nav-icon">📞</span>
          <span className="nav-label">Contact Us</span>
        </Link>
        
        <div className="nav-divider"></div>
        
        <Link to="/profile" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">My Profile</span>
        </Link>
        
        <button className="nav-item logout" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </nav>
  );
}
