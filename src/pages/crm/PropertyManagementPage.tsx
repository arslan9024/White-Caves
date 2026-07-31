/**
 * CRM Property Management Page (Refactored)
 * Internal property portfolio with listings, status tracking, and management.
 * Business logic extracted to usePropertyManagement hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/properties
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { Badge, Pagination } from '../../components/ui';
import { Modal } from '../../shared/components/ui/Modal';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  BackLink,
  ActionBar,
  SearchInput,
  FilterSelect,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormRow,
  PaginationWrapper,
  LoadingBanner,
  ErrorBanner,
  ModalFooter,
} from './styles/CrmPageStyles';
import { usePropertyManagement, STATUS_MAP, TYPE_MAP } from './hooks/usePropertyManagement';
import type { Property, BadgeVariant } from './hooks/usePropertyManagement';

// ─── Property-Specific Styled Components ────────────────────────────────

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: #0f0f0f;
  border: 1px solid #2c2c2c;
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid ${props => props.$color};
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
`;

const PropertyCardStyled = styled.div<{ $featured?: boolean }>`
  background: #0f0f0f;
  border: 1px solid ${props => (props.$featured ? '#C9A84C' : '#2c2c2c')};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  position: relative;

  ${props => props.$featured && `box-shadow: 0 0 0 1px #C9A84C;`}

  &:hover {
    box-shadow: 0 4px 20px rgba(201, 168, 76, 0.15);
    transform: translateY(-2px);
  }
`;

const PropertyImage = styled.div<{ $type: string }>`
  height: 180px;
  background: ${props => {
    switch (props.$type) {
      case 'villa':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'apartment':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'penthouse':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'commercial':
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default:
        return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
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
  background: #f59e0b;
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
  color: #ffffff;
  margin: 0 0 0.25rem;
`;

const PropertyLocation = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.75rem;
`;

const PropertyPrice = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.75rem;
`;

const PropertyMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #2c2c2c;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #2c2c2c;
  border-radius: 8px;
  overflow: hidden;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${props => (props.$active ? '#C9A84C' : '#1a1a1a')};
  color: ${props => (props.$active ? '#0f0f0f' : 'rgba(255, 255, 255, 0.7)')};
  border: none;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  &:hover {
    background: ${props => (props.$active ? '#a8883a' : '#2c2c2c')};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.5);
`;

// ─── Component ──────────────────────────────────────────────────────────

const PropertyManagementPage: FC = () => {
  useDocumentTitle('Property Management');
  const {
    filteredProperties,
    paginatedProperties,
    stats,
    loading,
    error,
    search,
    statusFilter,
    typeFilter,
    viewMode,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedProperty,
    formData,
    setFormData,
    setViewMode,
    ITEMS_PER_PAGE,
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    handleCreate,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    confirmDelete,
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    formatCurrency,
  } = usePropertyManagement();

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
          <FormSelect
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
          >
            {Object.entries(TYPE_MAP).map(([k, v]) => (
              <option key={k} value={k}>
                {v.icon} {v.label}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <FormLabel>Status</FormLabel>
          <FormSelect
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
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
        <FormLabel htmlFor="featured-check" style={{ margin: 0 }}>
          Featured Property
        </FormLabel>
      </FormGroup>
    </>
  );

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader>
        <div>
          <BackLink onClick={goBack}>← Back to CRM Hub</BackLink>
          <PageTitle>🏠 Property Portfolio</PageTitle>
        </div>
        <PrimaryButton onClick={openCreateModal}>➕ Add Property</PrimaryButton>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading properties from server...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error} — showing fallback data</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

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
          onChange={e => handleSearchChange(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={e => handleStatusFilterChange(e.target.value)}>
          <option value="all">All Status</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={e => handleTypeFilterChange(e.target.value)}>
          <option value="all">All Types</option>
          {Object.entries(TYPE_MAP).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </FilterSelect>
        <ViewToggle>
          <ToggleButton $active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
            Grid
          </ToggleButton>
          <ToggleButton $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
            List
          </ToggleButton>
        </ViewToggle>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-888, #888)', marginLeft: 'auto' }}>
          {filteredProperties.length} propert{filteredProperties.length !== 1 ? 'ies' : 'y'}
        </span>
      </ActionBar>

      {/* Property Grid */}
      {paginatedProperties.length > 0 ? (
        <Grid>
          {paginatedProperties.map((property: Property) => (
            <PropertyCardStyled key={property.id} $featured={property.featured}>
              <PropertyImage $type={property.type}>
                {TYPE_MAP[property.type]?.icon || '🏠'}
                {property.featured && <FeaturedBadge>⭐ Featured</FeaturedBadge>}
                <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                  <Badge variant={STATUS_MAP[property.status]?.variant || 'secondary'} size="small">
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
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-888, #888)', marginBottom: '0.5rem' }}>
                    👤 {property.agent_name}
                  </div>
                )}
                <PropertyActions>
                  <SecondaryButton onClick={() => handleEdit(property)}>Edit</SecondaryButton>
                  <DangerButton onClick={() => confirmDelete(property)}>Delete</DangerButton>
                </PropertyActions>
              </PropertyBody>
            </PropertyCardStyled>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          {search || statusFilter !== 'all' || typeFilter !== 'all'
            ? 'No properties match your filters'
            : 'No properties yet — add your first listing!'}
        </EmptyState>
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
          onClose={closeCreateModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleCreate} disabled={!formData.title.trim() || loading}>
              {loading ? '⏳ Adding...' : 'Add Property'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Edit Property Modal */}
      {showEditModal && selectedProperty && (
        <Modal
          title={`Edit: ${selectedProperty.title}`}
          isOpen={showEditModal}
          onClose={closeEditModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeEditModal}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={handleSaveEdit}
              disabled={!formData.title.trim() || !formData.location.trim() || loading}
            >
              {loading ? '⏳ Saving...' : 'Save Changes'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedProperty && (
        <Modal
          title="Delete Property"
          isOpen={showDeleteConfirm}
          onClose={closeDeleteModal}
          size="small"
        >
          <p style={{ color: 'var(--color-555, #555)', fontSize: '0.9rem' }}>
            Are you sure you want to delete <strong>{selectedProperty.title}</strong>? This action
            cannot be undone.
          </p>
          <ModalFooter>
            <SecondaryButton onClick={closeDeleteModal}>Cancel</SecondaryButton>
            <DangerButton onClick={handleDelete} disabled={loading}>
              {loading ? '⏳ Deleting...' : 'Delete Property'}
            </DangerButton>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
};

export default PropertyManagementPage;
