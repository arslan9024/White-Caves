import React, { useState, useMemo } from 'react';
import { 
  Users, Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  Eye, Phone, Mail, MessageCircle, Calendar, Tag, Star,
  ChevronDown, ChevronUp, Download, Upload, RefreshCw, Bot,
  UserPlus, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  DollarSign, Home, MapPin, Briefcase, Zap, Building2, Key
} from 'lucide-react';
import FullScreenDetailModal from '../../shared/components/ui/FullScreenDetailModal';
import AssistantFeatureMatrix from './shared/AssistantFeatureMatrix';
import { DualCategoryTabStrip } from './shared';
import { CLARA_FEATURES } from './data/assistantFeatures';
import './ClaraLeadsCRM.css';

const DUMMY_LEADS = [
  {
    id: 'L-001',
    name: 'Mohammed Al Rashid',
    email: 'mohammed.rashid@email.com',
    phone: '+971501234567',
    avatar: 'https://i.pravatar.cc/150?img=11',
    source: 'website',
    status: 'hot',
    stage: 'negotiation',
    interest: { type: 'buy', propertyType: 'apartment', budget: 3500000, area: 'Dubai Marina' },
    assignedAgent: { name: 'Sarah Johnson', id: 'A001' },
    score: 85,
    lastContact: '2024-01-20',
    nextFollowUp: '2024-01-22',
    notes: 'Interested in 3BR apartments in Marina. Has financing approved.',
    activities: [
      { type: 'call', date: '2024-01-20', note: 'Discussed property options' },
      { type: 'email', date: '2024-01-18', note: 'Sent property listings' },
      { type: 'viewing', date: '2024-01-15', note: 'Viewed Marina Heights apartment' }
    ],
    createdAt: '2024-01-10'
  },
  {
    id: 'L-002',
    name: 'Sarah Williams',
    email: 'sarah.w@email.com',
    phone: '+971502345678',
    avatar: 'https://i.pravatar.cc/150?img=5',
    source: 'referral',
    status: 'warm',
    stage: 'viewing',
    interest: { type: 'rent', propertyType: 'villa', budget: 180000, area: 'Arabian Ranches' },
    assignedAgent: { name: 'Ahmed Hassan', id: 'A002' },
    score: 65,
    lastContact: '2024-01-19',
    nextFollowUp: '2024-01-23',
    notes: 'Family of 4, needs 4+ bedrooms. Relocating from UK.',
    activities: [
      { type: 'viewing', date: '2024-01-19', note: 'Viewed 2 villas in Arabian Ranches' }
    ],
    createdAt: '2024-01-12'
  },
  {
    id: 'L-003',
    name: 'Ahmad Khalil',
    email: 'ahmad.k@business.com',
    phone: '+971503456789',
    avatar: 'https://i.pravatar.cc/150?img=12',
    source: 'whatsapp',
    status: 'cold',
    stage: 'initial',
    interest: { type: 'buy', propertyType: 'commercial', budget: 8000000, area: 'Business Bay' },
    assignedAgent: { name: 'Fatima Khan', id: 'A003' },
    score: 35,
    lastContact: '2024-01-15',
    nextFollowUp: '2024-01-25',
    notes: 'Looking for investment property. Not in a hurry.',
    activities: [
      { type: 'whatsapp', date: '2024-01-15', note: 'Initial inquiry about commercial spaces' }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: 'L-004',
    name: 'Emma Thompson',
    email: 'emma.t@company.com',
    phone: '+971504567890',
    avatar: 'https://i.pravatar.cc/150?img=9',
    source: 'portal',
    status: 'hot',
    stage: 'offer',
    interest: { type: 'buy', propertyType: 'apartment', budget: 2500000, area: 'Downtown Dubai' },
    assignedAgent: { name: 'Sarah Johnson', id: 'A001' },
    score: 92,
    lastContact: '2024-01-20',
    nextFollowUp: '2024-01-21',
    notes: 'Ready to make an offer. Prefers high floor with Burj view.',
    activities: [
      { type: 'meeting', date: '2024-01-20', note: 'Met to discuss offer terms' },
      { type: 'viewing', date: '2024-01-18', note: 'Loved the apartment on 45th floor' }
    ],
    createdAt: '2024-01-05'
  },
  {
    id: 'L-005',
    name: 'Omar Hassan',
    email: 'omar.h@gmail.com',
    phone: '+971505678901',
    avatar: 'https://i.pravatar.cc/150?img=15',
    source: 'social',
    status: 'warm',
    stage: 'qualified',
    interest: { type: 'rent', propertyType: 'apartment', budget: 85000, area: 'JVC' },
    assignedAgent: null,
    score: 55,
    lastContact: '2024-01-17',
    nextFollowUp: '2024-01-24',
    notes: 'Young professional, single. Looking for studio or 1BR.',
    activities: [
      { type: 'call', date: '2024-01-17', note: 'Initial qualification call' }
    ],
    createdAt: '2024-01-17'
  }
];

const LEAD_STAGES = [
  { id: 'initial', label: 'Initial Contact', color: '#6b7280' },
  { id: 'qualified', label: 'Qualified', color: '#3b82f6' },
  { id: 'viewing', label: 'Viewing Scheduled', color: '#8b5cf6' },
  { id: 'negotiation', label: 'Negotiation', color: '#f59e0b' },
  { id: 'offer', label: 'Offer Made', color: '#22c55e' },
  { id: 'closed', label: 'Closed/Won', color: '#10b981' },
  { id: 'lost', label: 'Lost', color: '#ef4444' }
];

const LeadForm = ({ lead, onSave, onCancel }) => {
  const [formData, setFormData] = useState(lead || {
    name: '',
    email: '',
    phone: '',
    source: 'website',
    status: 'warm',
    stage: 'initial',
    interest: { type: 'buy', propertyType: 'apartment', budget: '', area: '' },
    notes: '',
    score: 50
  });

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: lead?.id || `L-${String(Date.now()).slice(-3)}`,
      avatar: lead?.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      createdAt: lead?.createdAt || new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activities: lead?.activities || [],
      assignedAgent: lead?.assignedAgent || null
    });
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Contact Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Mohammed Al Rashid"
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number *</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+971501234567"
              required
            />
          </div>
          <div className="form-group">
            <label>Lead Source</label>
            <select value={formData.source} onChange={(e) => handleChange('source', e.target.value)}>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="portal">Property Portal</option>
              <option value="social">Social Media</option>
              <option value="walk_in">Walk-in</option>
              <option value="call">Phone Call</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Lead Status</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Temperature</label>
            <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="hot">Hot 🔥</option>
              <option value="warm">Warm ☀️</option>
              <option value="cold">Cold ❄️</option>
            </select>
          </div>
          <div className="form-group">
            <label>Stage</label>
            <select value={formData.stage} onChange={(e) => handleChange('stage', e.target.value)}>
              {LEAD_STAGES.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Lead Score (1-100)</label>
            <input 
              type="number" 
              min="1"
              max="100"
              value={formData.score}
              onChange={(e) => handleChange('score', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Property Interest</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Interest Type</label>
            <select value={formData.interest.type} onChange={(e) => handleChange('interest.type', e.target.value)}>
              <option value="buy">Looking to Buy</option>
              <option value="rent">Looking to Rent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Property Type</label>
            <select value={formData.interest.propertyType} onChange={(e) => handleChange('interest.propertyType', e.target.value)}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Budget (AED)</label>
            <input 
              type="number" 
              value={formData.interest.budget}
              onChange={(e) => handleChange('interest.budget', parseInt(e.target.value))}
              placeholder="e.g., 3500000"
            />
          </div>
          <div className="form-group">
            <label>Preferred Area</label>
            <input 
              type="text" 
              value={formData.interest.area}
              onChange={(e) => handleChange('interest.area', e.target.value)}
              placeholder="e.g., Dubai Marina"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Notes</h3>
        <div className="form-row">
          <div className="form-group full-width">
            <textarea 
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any relevant notes about this lead..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">
          {lead ? 'Update Lead' : 'Add Lead'}
        </button>
      </div>
    </form>
  );
};

const INTEREST_CATEGORIES = [
  { id: 'all', label: 'All Leads', icon: Users },
  { id: 'buy', label: 'Buyers (Sale)', icon: Building2 },
  { id: 'rent', label: 'Tenants (Rent)', icon: Key }
];

const ClaraLeadsCRM = () => {
  const [leads, setLeads] = useState(DUMMY_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [interestCategory, setInterestCategory] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  const stats = useMemo(() => ({
    total: leads.length,
    hot: leads.filter(l => l.status === 'hot').length,
    warm: leads.filter(l => l.status === 'warm').length,
    cold: leads.filter(l => l.status === 'cold').length,
    unassigned: leads.filter(l => !l.assignedAgent).length,
    avgScore: Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length) || 0,
    buyers: leads.filter(l => l.interest?.type === 'buy').length,
    renters: leads.filter(l => l.interest?.type === 'rent').length
  }), [leads]);

  const categoryCounts = useMemo(() => ({
    all: leads.length,
    buy: leads.filter(l => l.interest?.type === 'buy').length,
    rent: leads.filter(l => l.interest?.type === 'rent').length
  }), [leads]);

  const filteredLeads = useMemo(() => {
    return leads
      .filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             l.phone.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
        const matchesStage = filterStage === 'all' || l.stage === filterStage;
        const matchesSource = filterSource === 'all' || l.source === filterSource;
        const matchesInterest = interestCategory === 'all' || l.interest?.type === interestCategory;
        return matchesSearch && matchesStatus && matchesStage && matchesSource && matchesInterest;
      })
      .sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
  }, [leads, searchQuery, filterStatus, filterStage, filterSource, interestCategory, sortBy, sortOrder]);

  const handleAddLead = (lead) => {
    setLeads(prev => [...prev, lead]);
    setShowAddForm(false);
  };

  const handleEditLead = (lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    setEditLead(null);
  };

  const handleDeleteLead = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot': return '#ef4444';
      case 'warm': return '#f59e0b';
      case 'cold': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'website': return '🌐';
      case 'referral': return '👥';
      case 'whatsapp': return '💬';
      case 'portal': return '🏠';
      case 'social': return '📱';
      case 'walk_in': return '🚶';
      case 'call': return '📞';
      default: return '📋';
    }
  };

  const getStageInfo = (stageId) => {
    return LEAD_STAGES.find(s => s.id === stageId) || { label: stageId, color: '#6b7280' };
  };

  return (
    <div className="clara-crm-container">
      {/* Header */}
      <div className="clara-header">
        <div className="clara-info">
          <div className="clara-avatar">
            <Bot size={24} />
          </div>
          <div className="clara-details">
            <h2>Clara - Leads Manager</h2>
            <span className="clara-status">Tracking {leads.length} leads</span>
          </div>
        </div>
        <div className="clara-actions">
          <button className="clara-action-btn"><Upload size={18} /> Import</button>
          <button className="clara-action-btn"><Download size={18} /> Export</button>
          <button 
            className={`clara-action-btn features ${showFeatures ? 'active' : ''}`}
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <Zap size={18} /> Features ({CLARA_FEATURES.length})
          </button>
          <button className="clara-action-btn primary" onClick={() => setShowAddForm(true)}>
            <UserPlus size={18} /> Add Lead
          </button>
        </div>
      </div>

      {showFeatures && (
        <div className="clara-features-panel">
          <AssistantFeatureMatrix 
            features={CLARA_FEATURES}
            title="Clara's Lead Management Capabilities"
            accentColor="#ec4899"
            categories={['Lead Management', 'AI Features', 'Communication', 'Task Management', 'Analytics', 'Team Management', 'Display', 'Compliance']}
          />
        </div>
      )}

      {/* Stats */}
      <div className="leads-stats">
        <div className="stat-card">
          <Users size={24} />
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <div className="stat-content">
            <span className="stat-value" style={{ color: '#ef4444' }}>{stats.hot}</span>
            <span className="stat-label">Hot Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">☀️</span>
          <div className="stat-content">
            <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.warm}</span>
            <span className="stat-label">Warm Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❄️</span>
          <div className="stat-content">
            <span className="stat-value" style={{ color: '#3b82f6' }}>{stats.cold}</span>
            <span className="stat-label">Cold Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} color="#22c55e" />
          <div className="stat-content">
            <span className="stat-value">{stats.avgScore}%</span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>
      </div>

      {/* Interest Type Category Filter */}
      <div className="interest-category-filter">
        <DualCategoryTabStrip
          categories={INTEREST_CATEGORIES}
          activeCategory={interestCategory}
          onCategoryChange={setInterestCategory}
          counts={categoryCounts}
          colorScheme="red"
        />
      </div>

      {/* Filters */}
      <div className="leads-filters">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="hot">🔥 Hot</option>
            <option value="warm">☀️ Warm</option>
            <option value="cold">❄️ Cold</option>
          </select>
          <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)}>
            <option value="all">All Stages</option>
            {LEAD_STAGES.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.label}</option>
            ))}
          </select>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
            <option value="all">All Sources</option>
            <option value="website">🌐 Website</option>
            <option value="referral">👥 Referral</option>
            <option value="whatsapp">💬 WhatsApp</option>
            <option value="portal">🏠 Portal</option>
            <option value="social">📱 Social</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="score">Lead Score</option>
            <option value="lastContact">Last Contact</option>
            <option value="createdAt">Date Added</option>
            <option value="name">Name</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="leads-table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Status</th>
              <th>Stage</th>
              <th>Interest</th>
              <th>Score</th>
              <th>Agent</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td>
                  <div className="lead-cell">
                    <img src={lead.avatar} alt={lead.name} className="lead-avatar" />
                    <div className="lead-info">
                      <span className="lead-id">{lead.id}</span>
                      <span className="lead-name">{lead.name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <span><Mail size={12} /> {lead.email}</span>
                    <span><Phone size={12} /> {lead.phone}</span>
                  </div>
                </td>
                <td>
                  <span className="source-badge">
                    {getSourceIcon(lead.source)} {lead.source}
                  </span>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(lead.status)}20`,
                      color: getStatusColor(lead.status)
                    }}
                  >
                    {lead.status === 'hot' ? '🔥' : lead.status === 'warm' ? '☀️' : '❄️'} {lead.status}
                  </span>
                </td>
                <td>
                  <span 
                    className="stage-badge"
                    style={{ 
                      backgroundColor: `${getStageInfo(lead.stage).color}20`,
                      color: getStageInfo(lead.stage).color
                    }}
                  >
                    {getStageInfo(lead.stage).label}
                  </span>
                </td>
                <td>
                  <div className="interest-cell">
                    <span className="interest-type">{lead.interest.type === 'buy' ? '🏠 Buy' : '🔑 Rent'}</span>
                    <span className="interest-budget">AED {lead.interest.budget?.toLocaleString()}</span>
                  </div>
                </td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ 
                          width: `${lead.score}%`,
                          backgroundColor: lead.score >= 70 ? '#22c55e' : lead.score >= 40 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <span className="score-value">{lead.score}%</span>
                  </div>
                </td>
                <td>
                  {lead.assignedAgent ? (
                    <span className="agent-badge">{lead.assignedAgent.name}</span>
                  ) : (
                    <span className="unassigned-badge">Unassigned</span>
                  )}
                </td>
                <td>
                  <div className="followup-cell">
                    <Calendar size={14} />
                    <span>{lead.nextFollowUp}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" onClick={() => handleViewLead(lead)}>
                      <Eye size={16} />
                    </button>
                    <button className="action-btn call" onClick={() => window.location.href = `tel:${lead.phone}`}>
                      <Phone size={16} />
                    </button>
                    <button className="action-btn whatsapp" onClick={() => window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`)}>
                      <MessageCircle size={16} />
                    </button>
                    <button className="action-btn edit" onClick={() => setEditLead(lead)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteLead(lead.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editLead) && (
        <div className="form-modal-overlay" onClick={() => { setShowAddForm(false); setEditLead(null); }}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <h2>{editLead ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button className="close-btn" onClick={() => { setShowAddForm(false); setEditLead(null); }}>
                &times;
              </button>
            </div>
            <LeadForm 
              lead={editLead}
              onSave={editLead ? handleEditLead : handleAddLead}
              onCancel={() => { setShowAddForm(false); setEditLead(null); }}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <FullScreenDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedLead?.name}
        subtitle={`${selectedLead?.id} • ${selectedLead?.source}`}
        tabs={[
          {
            label: 'Overview',
            icon: Users,
            content: selectedLead && (
              <div className="detail-overview">
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Email</span>
                      <span className="value">{selectedLead.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Phone</span>
                      <span className="value">{selectedLead.phone}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Lead Score</span>
                      <span className="value">{selectedLead.score}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Stage</span>
                      <span className="value">{getStageInfo(selectedLead.stage).label}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Property Interest</h3>
                  <div className="interest-details">
                    <p><strong>Type:</strong> {selectedLead.interest.type === 'buy' ? 'Looking to Buy' : 'Looking to Rent'}</p>
                    <p><strong>Property:</strong> {selectedLead.interest.propertyType}</p>
                    <p><strong>Budget:</strong> AED {selectedLead.interest.budget?.toLocaleString()}</p>
                    <p><strong>Area:</strong> {selectedLead.interest.area}</p>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Notes</h3>
                  <p>{selectedLead.notes}</p>
                </div>
              </div>
            )
          },
          {
            label: 'Activity',
            icon: Clock,
            content: selectedLead && (
              <div className="activity-timeline">
                <h3>Activity History</h3>
                {selectedLead.activities.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'call' ? <Phone size={16} /> :
                       activity.type === 'email' ? <Mail size={16} /> :
                       activity.type === 'viewing' ? <Home size={16} /> :
                       activity.type === 'meeting' ? <Briefcase size={16} /> :
                       <MessageCircle size={16} />}
                    </div>
                    <div className="activity-content">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-date">{activity.date}</span>
                      <p className="activity-note">{activity.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        ]}
        actions={[
          { label: 'Edit Lead', onClick: () => { setShowDetailModal(false); setEditLead(selectedLead); } },
          { label: 'Call Now', icon: Phone, primary: true, onClick: () => window.location.href = `tel:${selectedLead?.phone}` }
        ]}
      />
    </div>
  );
};

export default ClaraLeadsCRM;
