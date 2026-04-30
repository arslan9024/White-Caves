import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Tag,
  DollarSign,
  Users,
  Star,
  Eye,
  Crown,
  Key,
  Settings,
  TrendingUp,
  Shield,
  Calculator,
  Palette,
  Bot,
} from 'lucide-react';

const SERVICE_CATEGORIES = [
  {
    id: 'luxury-property-transactions',
    name: 'Luxury Property Transactions',
    code: 'LPT',
    count: 5,
    color: '#E31E24',
    icon: Crown,
  },
  {
    id: 'premium-leasing-services',
    name: 'Premium Leasing Services',
    code: 'PLS',
    count: 5,
    color: '#3B82F6',
    icon: Key,
  },
  {
    id: 'property-portfolio-management',
    name: 'Property & Portfolio Management',
    code: 'PPM',
    count: 5,
    color: '#8B5CF6',
    icon: Settings,
  },
  {
    id: 'investment-advisory',
    name: 'Investment Advisory',
    code: 'IA',
    count: 5,
    color: '#10B981',
    icon: TrendingUp,
  },
  {
    id: 'legal-compliance-services',
    name: 'Legal & Compliance Services',
    code: 'LCS',
    count: 5,
    color: '#EF4444',
    icon: Shield,
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    code: 'FS',
    count: 5,
    color: '#F59E0B',
    icon: Calculator,
  },
  {
    id: 'value-added-services',
    name: 'Value-Added Services',
    code: 'VAS',
    count: 5,
    color: '#EC4899',
    icon: Palette,
  },
  {
    id: 'technology-services',
    name: 'Technology Services',
    code: 'TS',
    count: 5,
    color: '#0EA5E9',
    icon: Bot,
  },
];

const SERVICES_DATA = [
  {
    id: 'LPT-001',
    name: 'Ultra-Prime Property Acquisition',
    category: 'luxury-property-transactions',
    tier: 'ultra',
    price: '1.5-2%',
    description: 'Properties AED 50M+',
    clients: 18,
    rating: 99,
    revenue: 42500000,
  },
  {
    id: 'LPT-002',
    name: 'Prime Residential Sales',
    category: 'luxury-property-transactions',
    tier: 'premium',
    price: '2%',
    description: 'Villas/apartments AED 10-50M',
    clients: 128,
    rating: 96,
    revenue: 28500000,
  },
  {
    id: 'LPT-003',
    name: 'Waterfront & Island Properties',
    category: 'luxury-property-transactions',
    tier: 'ultra',
    price: '2% + premium',
    description: 'Palm, Bluewaters, Creek Harbour',
    clients: 52,
    rating: 98,
    revenue: 35200000,
  },
  {
    id: 'LPT-004',
    name: 'Off-Plan Luxury Projects',
    category: 'luxury-property-transactions',
    tier: 'premium',
    price: '2-3%',
    description: 'Pre-launch developments',
    clients: 245,
    rating: 94,
    revenue: 18500000,
  },
  {
    id: 'LPT-005',
    name: 'Bulk Portfolio Transactions',
    category: 'luxury-property-transactions',
    tier: 'corporate',
    price: '1-1.5%',
    description: '5+ unit portfolios',
    clients: 12,
    rating: 97,
    revenue: 48200000,
  },
  {
    id: 'PLS-001',
    name: 'Short-Term Luxury Leasing',
    category: 'premium-leasing-services',
    tier: 'premium',
    price: '8%',
    description: '3-11 months with concierge',
    clients: 218,
    rating: 95,
    revenue: 4200000,
  },
  {
    id: 'PLS-002',
    name: 'Long-Term Premium Rentals',
    category: 'premium-leasing-services',
    tier: 'essential',
    price: '5%',
    description: '1-3 year leases',
    clients: 742,
    rating: 92,
    revenue: 5800000,
  },
  {
    id: 'PLS-003',
    name: 'Corporate Housing Solutions',
    category: 'premium-leasing-services',
    tier: 'corporate',
    price: '6%',
    description: 'Bulk corporate relocations',
    clients: 42,
    rating: 96,
    revenue: 3500000,
  },
  {
    id: 'PLS-004',
    name: 'Vacation  Management',
    category: 'premium-leasing-services',
    tier: 'premium',
    price: '20-30%',
    description: 'Turnkey vacation rental',
    clients: 112,
    rating: 91,
    revenue: 2800000,
  },
  {
    id: 'PLS-005',
    name: 'Serviced Apartment Placement',
    category: 'premium-leasing-services',
    tier: 'essential',
    price: '10%',
    description: '-style apartments',
    clients: 298,
    rating: 93,
    revenue: 1250000,
  },
  {
    id: 'PPM-001',
    name: 'Full-Service Property Management',
    category: 'property-portfolio-management',
    tier: 'essential',
    price: '4-8%',
    description: 'End-to-end management',
    clients: 423,
    rating: 91,
    revenue: 4200000,
  },
  {
    id: 'PPM-002',
    name: 'Luxury Concierge Services',
    category: 'property-portfolio-management',
    tier: 'ultra',
    price: 'AED 2,500-10K/mo',
    description: '24/7 personal concierge',
    clients: 89,
    rating: 98,
    revenue: 3200000,
  },
  {
    id: 'PPM-003',
    name: 'Portfolio Performance Optimization',
    category: 'property-portfolio-management',
    tier: 'premium',
    price: '1% AUM',
    description: 'AI-driven analytics',
    clients: 62,
    rating: 95,
    revenue: 4800000,
  },
  {
    id: 'PPM-004',
    name: 'Smart  Integration',
    category: 'property-portfolio-management',
    tier: 'premium',
    price: '15-20%',
    description: ' automation systems',
    clients: 142,
    rating: 94,
    revenue: 2100000,
  },
  {
    id: 'PPM-005',
    name: 'Green & Sustainable Certification',
    category: 'property-portfolio-management',
    tier: 'premium',
    price: 'AED 15-50K',
    description: 'LEED/BREEAM certification',
    clients: 18,
    rating: 96,
    revenue: 720000,
  },
  {
    id: 'IA-001',
    name: 'Real Estate Investment Strategy',
    category: 'investment-advisory',
    tier: 'premium',
    price: '1%',
    description: 'Personalized roadmap',
    clients: 162,
    rating: 94,
    revenue: 5200000,
  },
  {
    id: 'IA-002',
    name: 'Market Intelligence & Research',
    category: 'investment-advisory',
    tier: 'premium',
    price: 'AED 5-25K',
    description: 'Custom market reports',
    clients: 78,
    rating: 96,
    revenue: 1290000,
  },
  {
    id: 'IA-003',
    name: 'Development Site Acquisition',
    category: 'investment-advisory',
    tier: 'corporate',
    price: '2-3%',
    description: 'Land sourcing & feasibility',
    clients: 18,
    rating: 95,
    revenue: 12500000,
  },
  {
    id: 'IA-004',
    name: 'REIT & Fund Investment',
    category: 'investment-advisory',
    tier: 'premium',
    price: '1% AUM',
    description: 'UAE real estate funds',
    clients: 112,
    rating: 93,
    revenue: 2800000,
  },
  {
    id: 'IA-005',
    name: 'Exit Strategy Planning',
    category: 'investment-advisory',
    tier: 'premium',
    price: '1%',
    description: 'Optimal disposal timing',
    clients: 58,
    rating: 95,
    revenue: 3400000,
  },
  {
    id: 'LCS-001',
    name: 'UAE PASS Digital Onboarding',
    category: 'legal-compliance-services',
    tier: 'basic',
    price: 'AED 500',
    description: 'Digital identity verification',
    clients: 2380,
    rating: 97,
    revenue: 1190000,
  },
  {
    id: 'LCS-002',
    name: 'RERA/DLD Compliance Package',
    category: 'legal-compliance-services',
    tier: 'essential',
    price: 'AED 2,500',
    description: 'Full transaction compliance',
    clients: 1845,
    rating: 95,
    revenue: 4612500,
  },
  {
    id: 'LCS-003',
    name: 'Contract Review & Negotiation',
    category: 'legal-compliance-services',
    tier: 'essential',
    price: 'AED 1.5-5K',
    description: 'Legal contract review',
    clients: 542,
    rating: 94,
    revenue: 1420000,
  },
  {
    id: 'LCS-004',
    name: 'Title Deed Verification',
    category: 'legal-compliance-services',
    tier: 'essential',
    price: 'AED 1,000',
    description: 'Ownership due diligence',
    clients: 1220,
    rating: 98,
    revenue: 1220000,
  },
  {
    id: 'LCS-005',
    name: 'Dispute Resolution & Mediation',
    category: 'legal-compliance-services',
    tier: 'essential',
    price: 'AED 350/hr',
    description: 'Tenant-landlord disputes',
    clients: 164,
    rating: 89,
    revenue: 820000,
  },
  {
    id: 'FS-001',
    name: 'Mortgage Facilitation',
    category: 'financial-services',
    tier: 'essential',
    price: '0.5-1%',
    description: 'Partner bank rates',
    clients: 398,
    rating: 92,
    revenue: 3800000,
  },
  {
    id: 'FS-002',
    name: 'Tax Optimization Strategy',
    category: 'financial-services',
    tier: 'premium',
    price: 'AED 10-50K',
    description: 'International tax structuring',
    clients: 58,
    rating: 96,
    revenue: 1740000,
  },
  {
    id: 'FS-003',
    name: 'Currency Exchange & Transfer',
    category: 'financial-services',
    tier: 'essential',
    price: '0.1-0.5%',
    description: 'Competitive FX rates',
    clients: 875,
    rating: 94,
    revenue: 2680000,
  },
  {
    id: 'FS-004',
    name: 'Insurance Portfolio',
    category: 'financial-services',
    tier: 'essential',
    price: '15-20%',
    description: 'Property insurance',
    clients: 524,
    rating: 91,
    revenue: 1420000,
  },
  {
    id: 'FS-005',
    name: 'Escrow Services Management',
    category: 'financial-services',
    tier: 'essential',
    price: '0.25%',
    description: 'Secure fund holding',
    clients: 232,
    rating: 97,
    revenue: 980000,
  },
  {
    id: 'VAS-001',
    name: 'Interior Design & Staging',
    category: 'value-added-services',
    tier: 'essential',
    price: '10-20%',
    description: 'Luxury interior design',
    clients: 168,
    rating: 95,
    revenue: 2800000,
  },
  {
    id: 'VAS-002',
    name: 'Property Marketing Premium',
    category: 'value-added-services',
    tier: 'essential',
    price: 'AED 3-15K',
    description: 'Photography & virtual tours',
    clients: 742,
    rating: 94,
    revenue: 5936000,
  },
  {
    id: 'VAS-003',
    name: 'Relocation & Settling-In',
    category: 'value-added-services',
    tier: 'essential',
    price: 'AED 7.5-25K',
    description: 'Visa, schools, utilities',
    clients: 112,
    rating: 96,
    revenue: 1680000,
  },
  {
    id: 'VAS-004',
    name: 'Lifestyle Concierge',
    category: 'value-added-services',
    tier: 'ultra',
    price: 'AED 1,500/mo',
    description: 'Personal lifestyle services',
    clients: 86,
    rating: 98,
    revenue: 1548000,
  },
  {
    id: 'VAS-005',
    name: 'AI-Powered Market Alerts',
    category: 'value-added-services',
    tier: 'basic',
    price: 'AED 500/mo',
    description: 'Smart property alerts',
    clients: 1245,
    rating: 89,
    revenue: 622500,
  },
  {
    id: 'TS-001',
    name: 'White Caves AI Platform Access',
    category: 'technology-services',
    tier: 'ultra',
    price: 'AED 10K/yr',
    description: 'Full 32 AI assistants',
    clients: 48,
    rating: 97,
    revenue: 480000,
  },
  {
    id: 'TS-002',
    name: 'Digital Portfolio Dashboard',
    category: 'technology-services',
    tier: 'premium',
    price: 'AED 2,500/mo',
    description: 'Real-time analytics',
    clients: 82,
    rating: 94,
    revenue: 2580000,
  },
  {
    id: 'TS-003',
    name: 'Predictive Analytics Reports',
    category: 'technology-services',
    tier: 'premium',
    price: 'AED 2,500',
    description: 'AI value forecasts',
    clients: 118,
    rating: 93,
    revenue: 295000,
  },
  {
    id: 'TS-004',
    name: 'API Integration Services',
    category: 'technology-services',
    tier: 'corporate',
    price: 'AED 15-50K',
    description: 'System integrations',
    clients: 15,
    rating: 95,
    revenue: 540000,
  },
  {
    id: 'TS-005',
    name: 'Blockchain Title Management',
    category: 'technology-services',
    tier: 'ultra',
    price: '0.5%',
    description: 'Digital title deeds',
    clients: 18,
    rating: 96,
    revenue: 450000,
  },
];

const TIER_CONFIG = {
  basic: { label: 'Basic', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' },
  essential: { label: 'Essential', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  premium: { label: 'Premium', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
  ultra: { label: 'Ultra-Premium', color: '#E31E24', bg: 'rgba(227, 30, 36, 0.15)' },
  corporate: { label: 'Corporate', color: '#0A1A3A', bg: 'rgba(10, 26, 58, 0.1)' },
};

export default function ServicesCRMTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const stats = useMemo(() => {
    const totalClients = SERVICES_DATA.reduce((sum, s) => sum + s.clients, 0);
    const totalRevenue = SERVICES_DATA.reduce((sum, s) => sum + s.revenue, 0);
    const avgRating = (
      SERVICES_DATA.reduce((sum, s) => sum + s.rating, 0) / SERVICES_DATA.length
    ).toFixed(1);
    return { totalClients, totalRevenue, avgRating };
  }, []);

  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter(service => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesTier = selectedTier === 'all' || service.tier === selectedTier;
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [searchQuery, selectedCategory, selectedTier]);

  const formatRevenue = value => {
    if (value >= 1000000) return `AED ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `AED ${(value / 1000).toFixed(0)}K`;
    return `AED ${value}`;
  };

  return (
    <div>
      <div className="crm-main-header">
        <div>
          <h1 className="crm-main-title">Services Catalog</h1>
          <p className="crm-main-subtitle">40 services across 8 categories | 5-tier access model</p>
        </div>
        <button className="crm-btn crm-btn-primary">
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="crm-stats-grid">
        <div className="crm-stat-card">
          <div className="crm-stat-icon navy">
            <Briefcase size={24} />
          </div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">40</div>
            <div className="crm-stat-label">Total Services</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon gold">
            <Tag size={24} />
          </div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">8</div>
            <div className="crm-stat-label">Categories</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon success">
            <Users size={24} />
          </div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">{stats.totalClients.toLocaleString()}</div>
            <div className="crm-stat-label">Active Clients</div>
          </div>
        </div>
        <div className="crm-stat-card">
          <div className="crm-stat-icon info">
            <DollarSign size={24} />
          </div>
          <div className="crm-stat-content">
            <div className="crm-stat-value">{formatRevenue(stats.totalRevenue)}</div>
            <div className="crm-stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Categories (5 services each)
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`crm-btn ${selectedCategory === 'all' ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All (40)
          </button>
          {SERVICE_CATEGORIES.map(cat => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                className={`crm-btn ${selectedCategory === cat.id ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={selectedCategory === cat.id ? {} : { borderColor: cat.color }}
              >
                <IconComponent
                  size={14}
                  style={{ color: selectedCategory === cat.id ? 'inherit' : cat.color }}
                />
                {cat.code} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Access Tiers
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`crm-btn ${selectedTier === 'all' ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
            onClick={() => setSelectedTier('all')}
          >
            All Tiers
          </button>
          {Object.entries(TIER_CONFIG).map(([key, config]) => (
            <button
              key={key}
              className={`crm-btn ${selectedTier === key ? 'crm-btn-primary' : 'crm-btn-secondary'}`}
              onClick={() => setSelectedTier(key)}
              style={selectedTier === key ? {} : { borderColor: config.color, color: config.color }}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      <div className="crm-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="crm-search" style={{ flex: 1 }}>
            <Search size={18} className="crm-search-icon" />
            <input
              type="text"
              className="crm-search-input"
              placeholder="Search services by name, code, or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`crm-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`crm-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Showing {filteredServices.length} of 40 services
      </div>

      {viewMode === 'grid' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredServices.map(service => {
            const tierConfig = TIER_CONFIG[service.tier];
            const category = SERVICE_CATEGORIES.find(c => c.id === service.category);
            return (
              <div
                key={service.id}
                className="crm-card"
                style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: category?.color || 'var(--text-muted)',
                      background: 'var(--surface-secondary)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {service.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: tierConfig.bg,
                      color: tierConfig.color,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {tierConfig.label}
                  </span>
                </div>

                <h3
                  style={{
                    margin: '0 0 4px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}
                >
                  {service.name}
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {service.description}
                </p>

                <div
                  style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '0.8rem' }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--crm-gold)',
                      fontWeight: '600',
                    }}
                  >
                    <DollarSign size={14} /> {service.price}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Users size={14} /> {service.clients}
                  </span>
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}
                  >
                    <Star size={14} /> {service.rating}%
                  </span>
                </div>

                <div
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}
                >
                  Revenue:{' '}
                  <span style={{ color: 'var(--crm-navy)', fontWeight: '600' }}>
                    {formatRevenue(service.revenue)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="crm-btn crm-btn-secondary"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '8px',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="crm-btn crm-btn-gold"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '8px',
                      fontSize: '0.8rem',
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="crm-table-wrapper">
          <table className="crm-table">
            <thead>
              <tr>
                <th></th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Tier</th>
                <th>Price</th>
                <th>Clients</th>
                <th>Rating</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => {
                const tierConfig = TIER_CONFIG[service.tier];
                const category = SERVICE_CATEGORIES.find(c => c.id === service.category);
                return (
                  <tr key={service.id}>
                    <td>
                      <code
                        style={{
                          background: 'var(--surface-secondary)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          color: category?.color,
                        }}
                      >
                        {service.id}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{service.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {service.description}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{category?.code}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '10px',
                          background: tierConfig.bg,
                          color: tierConfig.color,
                          textTransform: 'uppercase',
                        }}
                      >
                        {tierConfig.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--crm-gold)', fontWeight: '500' }}>{service.price}</td>
                    <td>{service.clients}</td>
                    <td>
                      <span style={{ color: '#10B981', fontWeight: '500' }}>{service.rating}%</span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{formatRevenue(service.revenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
