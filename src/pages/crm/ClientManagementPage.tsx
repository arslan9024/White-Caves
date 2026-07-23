/**
 * CRM Client Management Page
 * Full client/owner management with type tabs, search, and CRUD.
 * Business logic extracted to useClientManagement hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/clients
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
  Table,
  Th,
  Td,
  Tr,
  EmptyState,
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
import { useClientManagement, TYPE_CONFIG, STATUS_CONFIG } from './hooks/useClientManagement';
import type { Client } from './hooks/useClientManagement';

// ─── Client-Specific Styled Components ──────────────────────────────────

const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean; $color: string }>`
  background: ${props => (props.$active ? props.$color : '#1f1f1f')};
  color: ${props => (props.$active ? '#0f0f0f' : 'rgba(255, 255, 255, 0.7)')};
  border: 1px solid ${props => (props.$active ? props.$color : 'rgba(201, 168, 76, 0.3)')};
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    border-color: ${props => props.$color};
    background: ${props => (props.$active ? props.$color : `${props.$color}20`)};
  }
`;

const VipBadge = styled.span`
  background: #c9a84c;
  color: #0f0f0f;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.4rem;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #1f1f1f;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
`;

// ─── Component ──────────────────────────────────────────────────────────

const ClientManagementPage: FC = () => {
  useDocumentTitle('Client Management');
  const {
    filteredClients,
    paginatedClients,
    typeCounts,
    loading,
    error,
    search,
    typeFilter,
    statusFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedClient,
    formData,
    setFormData,
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
    handleTypeFilterChange,
    handleStatusFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    getTypeBadgeVariant,
    getStatusBadgeVariant,
    formatDate,
  } = useClientManagement();

  const renderForm = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>Full Name *</FormLabel>
          <FormInput
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ahmed Al Rashid"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Company</FormLabel>
          <FormInput
            type="text"
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Global Investments LLC"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormInput
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. ahmed@company.com"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Phone</FormLabel>
          <FormInput
            type="tel"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +971 50 123 4567"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <FormLabel>Type</FormLabel>
          <FormSelect
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
          >
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.icon} {cfg.label}
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
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormRow>
      <FormGroup>
        <FormLabel>Tags (comma-separated)</FormLabel>
        <FormInput
          type="text"
          value={formData.tags}
          onChange={e => setFormData({ ...formData, tags: e.target.value })}
          placeholder="e.g. high-value, returning, referral"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Notes</FormLabel>
        <FormTextarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this client..."
        />
      </FormGroup>
    </>
  );

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <div>
          <BackLink onClick={goBack}>← Back to CRM Hub</BackLink>
          <PageTitle>👥 Client Management</PageTitle>
        </div>
        <PrimaryButton onClick={openCreateModal}>➕ New Client</PrimaryButton>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading clients from server...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error} — showing cached data</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Client Type Tabs */}
      <TabBar>
        <Tab
          $active={typeFilter === 'all'}
          $color="#c9a84c"
          onClick={() => handleTypeFilterChange('all')}
        >
          All ({typeCounts.all || 0})
        </Tab>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
          <Tab
            key={key}
            $active={typeFilter === key}
            $color={
              cfg.badgeVariant === 'info'
                ? '#c9a84c'
                : cfg.badgeVariant === 'primary'
                  ? '#c9a84c'
                  : cfg.badgeVariant === 'success'
                    ? '#10B981'
                    : '#c9a84c'
            }
            onClick={() => handleTypeFilterChange(key)}
          >
            {cfg.icon} {cfg.label} ({typeCounts[key] || 0})
          </Tab>
        ))}
      </TabBar>

      {/* Search & Filters */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={e => handleStatusFilterChange(e.target.value)}>
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </FilterSelect>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found
        </span>
      </ActionBar>

      {/* Clients Table */}
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table aria-label="Clients list">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Type</Th>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Tags</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.length > 0 ? (
              paginatedClients.map((client: Client) => (
                <Tr key={client.id} onClick={() => handleEdit(client)}>
                  <Td style={{ fontWeight: 500 }}>
                    {client.name || '—'}
                    {client.status === 'vip' && <VipBadge>⭐ VIP</VipBadge>}
                  </Td>
                  <Td>{client.email || '—'}</Td>
                  <Td>{client.phone || '—'}</Td>
                  <Td>
                    <Badge variant={getTypeBadgeVariant(client.type || '')} size="small">
                      {TYPE_CONFIG[client.type || '']?.icon}{' '}
                      {TYPE_CONFIG[client.type || '']?.label || client.type || '—'}
                    </Badge>
                  </Td>
                  <Td>{client.company || '—'}</Td>
                  <Td>
                    <Badge variant={getStatusBadgeVariant(client.status || '')} size="small">
                      {STATUS_CONFIG[client.status || '']?.label || client.status || '—'}
                    </Badge>
                  </Td>
                  <Td>
                    {client.tags && client.tags.length > 0 ? (
                      <TagList>
                        {client.tags.map((tag, idx) => (
                          <Tag key={idx}>{tag}</Tag>
                        ))}
                      </TagList>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <SecondaryButton onClick={() => handleEdit(client)}>Edit</SecondaryButton>
                      <DangerButton onClick={() => confirmDelete(client)}>Delete</DangerButton>
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <tr>
                <Td colSpan={8}>
                  <EmptyState>
                    {search || typeFilter !== 'all' || statusFilter !== 'all'
                      ? 'No clients match your filters'
                      : 'No clients yet — add your first one!'}
                  </EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredClients.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredClients.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}

      {/* Create Client Modal */}
      {showCreateModal && (
        <Modal
          title="Add New Client"
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleCreate} disabled={!formData.name.trim() || loading}>
              {loading ? '⏳ Creating...' : 'Add Client'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <Modal
          title={`Edit Client: ${selectedClient.name}`}
          isOpen={showEditModal}
          onClose={closeEditModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeEditModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSaveEdit} disabled={!formData.name.trim() || loading}>
              {loading ? '⏳ Saving...' : 'Save Changes'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedClient && (
        <Modal
          title="Delete Client"
          isOpen={showDeleteConfirm}
          onClose={closeDeleteModal}
          size="small"
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Are you sure you want to delete <strong>{selectedClient.name}</strong>? This action
            cannot be undone.
          </p>
          <ModalFooter>
            <SecondaryButton onClick={closeDeleteModal}>Cancel</SecondaryButton>
            <DangerButton onClick={handleDelete} disabled={loading}>
              {loading ? '⏳ Deleting...' : 'Delete Client'}
            </DangerButton>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ClientManagementPage;
