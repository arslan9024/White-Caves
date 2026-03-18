/**
 * CRM Property Management Page
 * Internal property portfolio with listings, status tracking, and management
 * Route: /owner/crm/properties
 */

import React, { FC, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Modal, Pagination } from '../../components/ui';

// ─── Types ──────────────────────────────────────────────────────────────

interface Property {
  id: string | number;
  title: string;
  type: string;
  status: string;
  location: string;
  area?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  description?: string;
  amenities?: string[];
  images?: string[];
  agent_id?: string;
  agent_name?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Mock Data (until API integration) ──────────────────────────────────

const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Luxury Villa - Palm Jumeirah',
    type: 'villa',
    status: 'available',
    location: 'Palm Jumeirah, Dubai',
    area: 'Palm Jumeirah',
    price: 15000000,
    bedrooms: 5,
    bathrooms: 6,
    sqft: 7500,
    description: 'Stunning beachfront villa with private pool and garden',
    agent_name: 'Ahmed Al Rashid',
    featured: true,
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Modern Apartment - Downtown',
    type: 'apartment',
    status: 'available',
    location: 'Downtown Dubai',
    area: 'Downtown',
    price: 3500000,
    bedrooms: 2,
    bathrooms: 3,
    sqft: 1800,
    description: 'High-floor apartment with Burj Khalifa view',
    agent_name: 'Fatima Hassan',
    featured: false,
    created_at: '2026-01-20T14:00:00Z',
  },
  {
    id: 3,
    title: 'Penthouse Suite - Marina',
    type: 'penthouse',
    status: 'reserved',
    location: 'Dubai Marina',
    area: 'Marina',
    price: 8500000,
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4200,
    description: 'Premium penthouse with full marina and sea view',
    agent_name: 'Omar Khalid',
    featured: true,
    created_at: '2026-02-01T09:00:00Z',
  },
  {
    id: 4,
    title: 'Family Home - Arabian Ranches',
    type: 'villa',
    status: 'sold',
    location: 'Arabian Ranches, Dubai',
    area: 'Arabian Ranches',
    price: 6200000,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3800,
    description: 'Spacious family villa in gated community',
    agent_name: 'Ahmed Al Rashid',
    featured: false,
    created_at: '2025-12-10T08:00:00Z',
  },
  {
    id: 5,
    title: 'Studio - JVC',
    type: 'apartment',
    status: 'available',
    location: 'Jumeirah Village Circle',
    area: 'JVC',
    price: 750000,
    bedrooms: 0,
    bathrooms: 1,
    sqft: 450,
    description: 'Affordable studio apartment for investors',
    agent_name: 'Fatima Hassan',
    featured: false,
    created_at: '2026-01-25T11:00:00Z',
  },
  {
    id: 6,
    title: 'Commercial Office - DIFC',
    type: 'commercial',
    status: 'available',
    location: 'DIFC, Dubai',
    area: 'DIFC',
    price: 12000000,
    bedrooms: 0,
    bathrooms: 4,
    sqft: 5000,
    description: 'Premium Grade A office space in financial district',
    agent_name: 'Omar Khalid',
    featured: true,
    created_at: '2026-02-05T16:00:00Z',
  },
];

// ─── Styled Components ──────────────────────────────────────────────────

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  width: 280px;
  outline: none;
  &:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
`;

const FilterSelect = styled.select`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  background: white;
  cursor: pointer;
  outline: none;
  &:focus { border-color: #3B82F6; }
`;

const PrimaryButton = styled.button`
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  &:hover { background: #2563EB; box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover { background: #f5f5f5; }
`;

const DangerButton = styled.button`
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover { background: #DC2626; }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
`;

const PropertyCard = styled.div<{ $featured?: boolean }>`
  background: white;
  border: 1px solid ${props => props.$featured ? '#3B82F6' : '#e8e8e8'};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  position: relative;

  ${props => props.$featured && `box-shadow: 0 0 0 1px #3B82F6;`}

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
`;

const PropertyImage = styled.div<{ $type: string }>`
  height: 180px;
  background: ${props => {
    switch (props.$type) {
      case 'villa': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'apartment': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'penthouse': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'commercial': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #F59E0B;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
`;

const PropertyBody = styled.div`
  padding: 1.25rem;
`;

const PropertyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 0.25rem;
`;

const PropertyLocation = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.75rem;
`;

const PropertyPrice = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #10B981;
  margin-bottom: 0.75rem;
`;

const PropertyMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: #666;
  margin-bottom: 0.75rem;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.35rem;
`;

const FormInput = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  &:focus { border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
`;

const FormSelect = styled.select`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: white;
  box-sizing: border-box;
  &:focus { border-color: #3B82F6; }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#3B82F6' : 'white'};
  color: ${props => props.$active ? 'white' : '#555'};
  border: none;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover { background: ${props => props.$active ? '#2563EB' : '#f5f5f5'}; }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

// ─── Constants ──────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; variant: string; color: string }> = {
  available: { label: 'Available', variant: 'success', color: '#10B981' },
  reserved: { label: 'Reserved', variant: 'warning', color: '#F59E0B' },
  sold: { label: 'Sold', variant: 'error', color: '#EF4444' },
  rented: { label: 'Rented', variant: 'info', color: '#3B82F6' },
  off_market: { label: 'Off Market', variant: 'secondary', color: '#6B7280' },
};

const TYPE_MAP: Record<string, { label: string; icon: string }> = {
  villa: { label: 'Villa', icon: '🏡' },
  apartment: { label: 'Apartment', icon: '🏢' },
  penthouse: { label: 'Penthouse', icon: '🏙️' },
  commercial: { label: 'Commercial', icon: '🏗️' },
  land: { label: 'Land', icon: '🌍' },
  townhouse: { label: 'Townhouse', icon: '🏘️' },
};

const ITEMS_PER_PAGE = 9;

// ─── Component ──────────────────────────────────────────────────────────

const PropertyManagementPage: FC = () => {
  const navigate = useNavigate();

  // State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    status: 'available',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    agent_name: '',
    featured: false,
  });

  // Stats
  const stats = useMemo(() => {
    const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
    return {
      total: properties.length,
      available: properties.filter(p => p.status === 'available').length,
      reserved: properties.filter(p => p.status === 'reserved').length,
      sold: properties.filter(p => p.status === 'sold').length,
      totalValue,
    };
  }, [properties]);

  // Filter
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !search || [
        p.title, p.location, p.area, p.agent_name, p.description
      ].some(f => f?.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [properties, search, statusFilter, typeFilter]);

  // Pagination
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetForm = useCallback(() => {
    setFormData({
      title: '', type: 'apartment', status: 'available', location: '',
      price: '', bedrooms: '', bathrooms: '', sqft: '',
      description: '', agent_name: '', featured: false,
    });
  }, []);

  const handleCreate = () => {
    const newProperty: Property = {
      id: Date.now(),
      title: formData.title,
      type: formData.type,
      status: formData.status,
      location: formData.location,
      price: Number(formData.price) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      sqft: Number(formData.sqft) || 0,
      description: formData.description,
      agent_name: formData.agent_name,
      featured: formData.featured,
      created_at: new Date().toISOString(),
    };
    setProperties(prev => [newProperty, ...prev]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      status: property.status,
      location: property.location,
      price: property.price?.toString() || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      sqft: property.sqft?.toString() || '',
      description: property.description || '',
      agent_name: property.agent_name || '',
      featured: property.featured || false,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedProperty) {
      setProperties(prev => prev.map(p =>
        p.id === selectedProperty.id ? {
          ...p,
          ...formData,
          price: Number(formData.price) || 0,
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          sqft: Number(formData.sqft) || 0,
          updated_at: new Date().toISOString(),
        } : p
      ));
    }
    setShowEditModal(false);
    setSelectedProperty(null);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedProperty) {
      setProperties(prev => prev.filter(p => p.id !== selectedProperty.id));
    }
    setShowDeleteConfirm(false);
    setSelectedProperty(null);
  };

  const formatCurrency = (amount: number) => `AED ${amount.toLocaleString()}`;

  const renderForm = () => (
    <>
      <FormGroup>
        <FormLabel>Property Title *</FormLabel>
        <FormInput
          type="text"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Luxury Villa - Palm Jumeirah"
        />
      </FormGroup>
      <FormRow>
        <FormGroup>
          <FormLabel>Type</FormLabel>
          <FormSelect value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
            {Object.entries(TYPE_MAP).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <FormLabel>Status</FormLabel>
          <FormSelect value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormRow>
      <FormGroup>
        <FormLabel>Location</FormLabel>
        <FormInput
          type="text"
          value={formData.location}
          onChange={e => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g. Palm Jumeirah, Dubai"
        />
      </FormGroup>
      <FormRow>
        <FormGroup>
          <FormLabel>Price (AED)</FormLabel>
          <FormInput
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            placeholder="e.g. 5000000"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Area (sqft)</FormLabel>
          <FormInput
            type="number"
            value={formData.sqft}
            onChange={e => setFormData({ ...formData, sqft: e.target.value })}
            placeholder="e.g. 2500"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <FormLabel>Bedrooms</FormLabel>
          <FormInput
            type="number"
            value={formData.bedrooms}
            onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
            placeholder="e.g. 3"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Bathrooms</FormLabel>
          <FormInput
            type="number"
            value={formData.bathrooms}
            onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
            placeholder="e.g. 4"
          />
        </FormGroup>
      </FormRow>
      <FormGroup>
        <FormLabel>Assigned Agent</FormLabel>
        <FormInput
          type="text"
          value={formData.agent_name}
          onChange={e => setFormData({ ...formData, agent_name: e.target.value })}
          placeholder="e.g. Ahmed Al Rashid"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Description</FormLabel>
        <FormTextarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Property description..."
        />
      </FormGroup>
      <FormGroup style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={e => setFormData({ ...formData, featured: e.target.checked })}
          id="featured-check"
        />
        <FormLabel htmlFor="featured-check" style={{ margin: 0 }}>Featured Property</FormLabel>
      </FormGroup>
    </>
  );

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div>
          <BackLink onClick={() => navigate('/owner/crm')}>← Back to CRM Hub</BackLink>
          <PageTitle>🏠 Property Portfolio</PageTitle>
        </div>
        <PrimaryButton onClick={() => { resetForm(); setShowCreateModal(true); }}>
          ➕ Add Property
        </PrimaryButton>
      </PageHeader>

      {/* Stats */}
      <StatsRow>
        <StatCard $color="#3B82F6">
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Properties</StatLabel>
        </StatCard>
        <StatCard $color="#10B981">
          <StatValue>{stats.available}</StatValue>
          <StatLabel>Available</StatLabel>
        </StatCard>
        <StatCard $color="#F59E0B">
          <StatValue>{stats.reserved}</StatValue>
          <StatLabel>Reserved</StatLabel>
        </StatCard>
        <StatCard $color="#EF4444">
          <StatValue>{stats.sold}</StatValue>
          <StatLabel>Sold</StatLabel>
        </StatCard>
        <StatCard $color="#8B5CF6">
          <StatValue>{formatCurrency(stats.totalValue)}</StatValue>
          <StatLabel>Portfolio Value</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Filters */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <FilterSelect value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="all">All Status</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
          <option value="all">All Types</option>
          {Object.entries(TYPE_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </FilterSelect>
        <ViewToggle>
          <ToggleButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>Grid</ToggleButton>
          <ToggleButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}>List</ToggleButton>
        </ViewToggle>
        <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: 'auto' }}>
          {filteredProperties.length} propert{filteredProperties.length !== 1 ? 'ies' : 'y'}
        </span>
      </ActionBar>

      {/* Property Grid */}
      {paginatedProperties.length > 0 ? (
        <Grid>
          {paginatedProperties.map(property => (
            <PropertyCard key={property.id} $featured={property.featured}>
              <PropertyImage $type={property.type}>
                {TYPE_MAP[property.type]?.icon || '🏠'}
                {property.featured && <FeaturedBadge>⭐ Featured</FeaturedBadge>}
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                  <Badge variant={(STATUS_MAP[property.status]?.variant as any) || 'secondary'} size="small">
                    {STATUS_MAP[property.status]?.label || property.status}
                  </Badge>
                </div>
              </PropertyImage>
              <PropertyBody>
                <PropertyTitle>{property.title}</PropertyTitle>
                <PropertyLocation>📍 {property.location}</PropertyLocation>
                <PropertyPrice>{formatCurrency(property.price)}</PropertyPrice>
                <PropertyMeta>
                  {property.bedrooms !== undefined && property.bedrooms > 0 && (
                    <span>🛏️ {property.bedrooms} Bed</span>
                  )}
                  {property.bathrooms !== undefined && property.bathrooms > 0 && (
                    <span>🚿 {property.bathrooms} Bath</span>
                  )}
                  {property.sqft && <span>📐 {property.sqft.toLocaleString()} sqft</span>}
                </PropertyMeta>
                {property.agent_name && (
                  <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.5rem' }}>
                    👤 {property.agent_name}
                  </div>
                )}
                <PropertyActions>
                  <SecondaryButton onClick={() => handleEdit(property)}>Edit</SecondaryButton>
                  <DangerButton onClick={() => { setSelectedProperty(property); setShowDeleteConfirm(true); }}>
                    Delete
                  </DangerButton>
                </PropertyActions>
              </PropertyBody>
            </PropertyCard>
          ))}
        </Grid>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          {search || statusFilter !== 'all' || typeFilter !== 'all'
            ? 'No properties match your filters'
            : 'No properties yet — add your first listing!'}
        </div>
      )}

      {/* Pagination */}
      {filteredProperties.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredProperties.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}

      {/* Create Property Modal */}
      {showCreateModal && (
        <Modal
          title="Add New Property"
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          size="large"
        >
          {renderForm()}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SecondaryButton onClick={() => setShowCreateModal(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleCreate} disabled={!formData.title.trim()}>
              Add Property
            </PrimaryButton>
          </div>
        </Modal>
      )}

      {/* Edit Property Modal */}
      {showEditModal && selectedProperty && (
        <Modal
          title={`Edit: ${selectedProperty.title}`}
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedProperty(null); }}
          size="large"
        >
          {renderForm()}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SecondaryButton onClick={() => { setShowEditModal(false); setSelectedProperty(null); }}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleSaveEdit}>Save Changes</PrimaryButton>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedProperty && (
        <Modal
          title="Delete Property"
          isOpen={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setSelectedProperty(null); }}
          size="small"
        >
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            Are you sure you want to delete <strong>{selectedProperty.title}</strong>?
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SecondaryButton onClick={() => { setShowDeleteConfirm(false); setSelectedProperty(null); }}>
              Cancel
            </SecondaryButton>
            <DangerButton onClick={handleDelete}>Delete Property</DangerButton>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default PropertyManagementPage;
