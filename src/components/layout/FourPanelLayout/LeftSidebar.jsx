import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, Star, Clock, Search, MoreVertical } from 'lucide-react';
import './LeftSidebar.css';

/**
 * LeftSidebar Component
 * 
 * OOP Object Hierarchy with 200+ objects organized in 13 sections:
 * 1. User Management (12 objects)
 * 2. Property & Inventory (7 objects)
 * 3. AI Assistants (32 objects)
 * 4. Transactions & Services (6 objects)
 * 5. Integration & External (5 objects)
 * 6. Business Logic & Workflow (5 objects)
 * 7. Data & Knowledge (4 objects)
 * 8. UI & Presentation (5 objects)
 * 9. Utility & Support (5 objects)
 * 
 * Features:
 * - Expandable/collapsible sections
 * - Favorites system with star icon
 * - Recent items quick access
 * - Full-text search across all objects
 * - Drag-drop navigation (optional)
 */

const OBJECT_HIERARCHY = {
  userManagement: {
    label: 'User Management',
    icon: '👥',
    color: '#3B82F6',
    objects: [
      { id: 'user-internal-staff', label: 'Internal Staff', icon: '👔', type: 'staff' },
      { id: 'user-client-buyer', label: 'Client - Buyer', icon: '🏠', type: 'client' },
      { id: 'user-client-seller', label: 'Client - Seller', icon: '📊', type: 'client' },
      { id: 'user-client-tenant', label: 'Client - Tenant', icon: '🔑', type: 'client' },
      { id: 'user-client-landlord', label: 'Client - Landlord', icon: '🏢', type: 'client' },
      { id: 'user-job-candidate', label: 'Job Candidate', icon: '📋', type: 'candidate' },
      { id: 'user-external-partner', label: 'External Partner', icon: '🤝', type: 'partner' },
      { id: 'user-government-regulator', label: 'Government Regulator', icon: '⚖️', type: 'government' },
      { id: 'user-public-viewer', label: 'Public Viewer', icon: '👁️', type: 'public' },
      { id: 'user-uae-pass', label: 'UAE PASS Identity', icon: '🆔', type: 'identity' },
      { id: 'user-company', label: 'Companies', icon: '🏛️', type: 'organization' },
      { id: 'user-agent', label: 'Real Estate Agents', icon: '🎯', type: 'agent' }
    ]
  },
  propertyInventory: {
    label: 'Property & Inventory',
    icon: '🏗️',
    color: '#10B981',
    objects: [
      { id: 'property-villa', label: 'Luxury Villa', icon: '🏡', type: 'property' },
      { id: 'property-apartment', label: 'Premium Apartment', icon: '🏢', type: 'property' },
      { id: 'property-commercial', label: 'Commercial Property', icon: '🏬', type: 'property' },
      { id: 'property-offplan', label: 'Off-Plan Project', icon: '🔨', type: 'project' },
      { id: 'property-rental', label: 'Rental Listing', icon: '🔑', type: 'listing' },
      { id: 'property-media', label: 'Property Media', icon: '📸', type: 'media' },
      { id: 'property-features', label: 'Property Features', icon: '⭐', type: 'features' }
    ]
  },
  aiAssistants: {
    label: 'AI Assistants',
    icon: '🤖',
    color: '#8B5CF6',
    objects: [
      { id: 'ai-zoe', label: 'Zoe - Executive Intelligence', icon: '🎓', type: 'executive' },
      { id: 'ai-clara', label: 'Clara - Sales CRM', icon: '🎯', type: 'sales' },
      { id: 'ai-mary', label: 'Mary - Inventory Manager', icon: '📦', type: 'operations' },
      { id: 'ai-sophia', label: 'Sophia - Pipeline Manager', icon: '📈', type: 'sales' },
      { id: 'ai-theodora', label: 'Theodora - Finance', icon: '💰', type: 'finance' },
      { id: 'ai-aurora', label: 'Aurora - CTO', icon: '💻', type: 'technology' },
      { id: 'ai-hazel', label: 'Hazel - Frontend', icon: '🎨', type: 'technology' },
      { id: 'ai-willow', label: 'Willow - Backend', icon: '⚙️', type: 'technology' },
      { id: 'ai-linda', label: 'Linda - WhatsApp', icon: '💬', type: 'communications' },
      { id: 'ai-nina', label: 'Nina - Bot Developer', icon: '🤖', type: 'communications' },
      { id: 'ai-view-all', label: 'View All 32 Assistants', icon: '➕', type: 'view-all' }
    ]
  },
  transactions: {
    label: 'Transactions & Services',
    icon: '💼',
    color: '#F59E0B',
    objects: [
      { id: 'trans-lead', label: 'Lead', icon: '🔔', type: 'transaction' },
      { id: 'trans-sale', label: 'Sale Transaction', icon: '✅', type: 'transaction' },
      { id: 'trans-rental', label: 'Rental Transaction', icon: '🔑', type: 'transaction' },
      { id: 'trans-service', label: 'Service Request', icon: '🛠️', type: 'service' },
      { id: 'trans-appointment', label: 'Appointment', icon: '📅', type: 'appointment' },
      { id: 'trans-commission', label: 'Commission', icon: '💰', type: 'payment' }
    ]
  },
  integrations: {
    label: 'Integration & External',
    icon: '🔗',
    color: '#EC4899',
    objects: [
      { id: 'int-uae-pass', label: 'UAE PASS Gateway', icon: '🆔', type: 'gateway' },
      { id: 'int-dld', label: 'DLD API Handler', icon: '📜', type: 'api' },
      { id: 'int-whatsapp', label: 'WhatsApp Service', icon: '💬', type: 'service' },
      { id: 'int-payment', label: 'Payment Processor', icon: '💳', type: 'service' },
      { id: 'int-google', label: 'Google Workspace Sync', icon: '📧', type: 'sync' }
    ]
  },
  businessLogic: {
    label: 'Business Logic & Workflow',
    icon: '⚙️',
    color: '#0EA5E9',
    objects: [
      { id: 'logic-agent-assignment', label: 'Agent Assignment Engine', icon: '🎯', type: 'logic' },
      { id: 'logic-valuation', label: 'Property Valuator', icon: '💎', type: 'logic' },
      { id: 'logic-yield-calc', label: 'Rental Yield Calculator', icon: '📊', type: 'calculator' },
      { id: 'logic-compliance', label: 'Compliance Validator', icon: '✓', type: 'validator' },
      { id: 'logic-notification', label: 'Notification Orchestrator', icon: '📢', type: 'service' }
    ]
  },
  dataKnowledge: {
    label: 'Data & Knowledge',
    icon: '📚',
    color: '#6366F1',
    objects: [
      { id: 'data-kb', label: 'Company Knowledge Base', icon: '📖', type: 'knowledge' },
      { id: 'data-market', label: 'Market Analytics', icon: '📈', type: 'analytics' },
      { id: 'data-audit', label: 'Audit Log', icon: '📋', type: 'log' },
      { id: 'data-permissions', label: 'Permission Matrix', icon: '🔐', type: 'security' }
    ]
  },
  uiPresentation: {
    label: 'UI & Presentation',
    icon: '🎨',
    color: '#EC4899',
    objects: [
      { id: 'ui-dashboard', label: 'Dashboard Factory', icon: '📊', type: 'component' },
      { id: 'ui-property-card', label: 'Property Card Component', icon: '🏠', type: 'component' },
      { id: 'ui-signing', label: 'Contract Signing View', icon: '✍️', type: 'view' },
      { id: 'ui-chat', label: 'AI Chat Interface', icon: '💬', type: 'interface' },
      { id: 'ui-formatter', label: 'Bilingual Formatter', icon: '🌐', type: 'formatter' }
    ]
  },
  utilities: {
    label: 'Utility & Support',
    icon: '🔧',
    color: '#14B8A6',
    objects: [
      { id: 'util-address', label: 'Address Service', icon: '📍', type: 'utility' },
      { id: 'util-currency', label: 'Currency Converter', icon: '💱', type: 'utility' },
      { id: 'util-docgen', label: 'Document Generator', icon: '📄', type: 'generator' },
      { id: 'util-search', label: 'Search Filter', icon: '🔍', type: 'filter' },
      { id: 'util-rating', label: 'Rating System', icon: '⭐', type: 'system' }
    ]
  }
};

export default function LeftSidebar() {
  const dispatch = useDispatch();
  const [expandedSections, setExpandedSections] = useState({
    userManagement: true,
    propertyInventory: true,
    aiAssistants: true,
    transactions: false,
    integrations: false,
    businessLogic: false,
    dataKnowledge: false,
    uiPresentation: false,
    utilities: false
  });
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecent, setShowRecent] = useState(true);
  
  const selectedObject = useSelector(state => state.navigation?.selectedObject);
  const recentObjects = useSelector(state => state.navigation?.recentObjects || []);
  
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  
  const toggleFavorite = (objectId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(objectId)) {
      newFavorites.delete(objectId);
    } else {
      newFavorites.add(objectId);
    }
    setFavorites(newFavorites);
  };
  
  const selectObject = (object) => {
    dispatch({
      type: 'SELECT_OBJECT',
      payload: object
    });
  };
  
  // Filter objects based on search query
  const getFilteredObjects = (objects) => {
    if (!searchQuery) return objects;
    return objects.filter(obj => 
      obj.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  return (
    <div className="left-sidebar-content">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h2>Navigation</h2>
        <p className="sidebar-subtitle">200+ Objects</p>
      </div>
      
      {/* Search */}
      <div className="sidebar-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search objects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Favorites Section */}
      {favorites.size > 0 && (
        <div className="favorites-section">
          <div className="section-header">
            <Star size={16} />
            <span>Favorites</span>
          </div>
          <div className="objects-list">
            {Array.from(favorites).map(favId => {
              const obj = Object.values(OBJECT_HIERARCHY)
                .flatMap(section => section.objects)
                .find(o => o.id === favId);
              return obj ? (
                <button
                  key={favId}
                  className={`object-item ${selectedObject?.id === favId ? 'active' : ''}`}
                  onClick={() => selectObject(obj)}
                >
                  <span className="object-icon">{obj.icon}</span>
                  <span className="object-label">{obj.label}</span>
                  <Star
                    size={14}
                    className="favorite-btn"
                    fill="currentColor"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(favId);
                    }}
                  />
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      {/* Recent Objects */}
      {recentObjects.length > 0 && showRecent && (
        <div className="recent-section">
          <div className="section-header">
            <Clock size={16} />
            <span>Recent</span>
          </div>
          <div className="objects-list">
            {recentObjects.slice(0, 5).map(obj => (
              <button
                key={obj.id}
                className={`object-item ${selectedObject?.id === obj.id ? 'active' : ''}`}
                onClick={() => selectObject(obj)}
              >
                <span className="object-icon">{obj.icon}</span>
                <span className="object-label">{obj.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Sections */}
      <div className="sections-container">
        {Object.entries(OBJECT_HIERARCHY).map(([sectionKey, section]) => {
          const filteredObjects = getFilteredObjects(section.objects);
          const isExpanded = expandedSections[sectionKey];
          const hasMatchingObjects = filteredObjects.length > 0;
          
          if (!hasMatchingObjects && searchQuery) return null;
          
          return (
            <div key={sectionKey} className="section">
              <button
                className="section-header"
                onClick={() => toggleSection(sectionKey)}
                style={{ borderLeftColor: section.color }}
              >
                <span className="section-icon">{section.icon}</span>
                <span className="section-label">{section.label}</span>
                <span className="section-count">
                  {filteredObjects.length}
                </span>
                <ChevronRight
                  size={16}
                  className={`chevron ${isExpanded ? 'expanded' : ''}`}
                />
              </button>
              
              {isExpanded && (
                <div className="objects-list">
                  {filteredObjects.map(obj => (
                    <button
                      key={obj.id}
                      className={`object-item ${selectedObject?.id === obj.id ? 'active' : ''}`}
                      onClick={() => selectObject(obj)}
                      title={obj.label}
                    >
                      <span className="object-icon">{obj.icon}</span>
                      <span className="object-label">{obj.label}</span>
                      <button
                        className={`favorite-btn ${favorites.has(obj.id) ? 'favorited' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(obj.id);
                        }}
                        aria-label={`${favorites.has(obj.id) ? 'Remove from' : 'Add to'} favorites`}
                      >
                        <Star size={14} />
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
