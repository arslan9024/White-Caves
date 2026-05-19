/* eslint-disable security/detect-object-injection */
/**
 * CRM Lead Management Page (Refactored)
 * Full CRUD lead management with filtering, search, and status pipeline.
 * Business logic extracted to useLeadManagement hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/leads
 */
import React, { FC } from 'react';
import styled from 'styled-components';
import { Badge, Pagination } from '../../components/ui';
import { Skeleton } from '../../components/ui/Skeleton';
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
import { useLeadManagement, STATUS_CONFIG, SOURCE_LABELS } from './hooks/useLeadManagement';
import type { Lead } from './hooks/useLeadManagement';

// ─── Lead-Specific Styled Components ────────────────────────────────────

const PipelineBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const PipelineStage = styled.button<{ $active: boolean; $color: string }>`
  background: ${props => (props.$active ? props.$color : 'white')};
  color: ${props => (props.$active ? 'white' : '#555')};
  border: 1px solid ${props => (props.$active ? props.$color : '#ddd')};
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
    background: ${props => (props.$active ? props.$color : `${props.$color}10`)};
  }
`;

// ─── Component ──────────────────────────────────────────────────────────

const LeadManagementPage: FC = () => {
  useDocumentTitle('Lead Management');
  const {
    filteredLeads,
    paginatedLeads,
    statusCounts,
    loading,
    error,
    search,
    statusFilter,
    sourceFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedLead,
    formData,
    setFormData,
    errorMessage,
    setErrorMessage,
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
    handleSourceFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    getStatusBadgeVariant,
    formatCurrency,
    formatDate,
  } = useLeadManagement();

  // Lead form modal content
  const renderForm = () => (
    <>
      {errorMessage && (
        <ErrorBanner role="alert" aria-live="polite">
          <span>⚠️ {errorMessage}</span>
          <SecondaryButton onClick={() => setErrorMessage(null)}>Dismiss</SecondaryButton>
        </ErrorBanner>
      )}
      <FormRow>
        <FormGroup>
          <FormLabel>Full Name *</FormLabel>
          <FormInput
            type="text"
            aria-label="Lead full name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ahmed Al Rashid"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Company</FormLabel>
          <FormInput
            type="text"
            aria-label="Lead company"
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
            aria-label="Lead email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. ahmed@company.com"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Phone</FormLabel>
          <FormInput
            type="tel"
            aria-label="Lead phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. +971 50 123 4567"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <FormLabel>Status</FormLabel>
          <FormSelect
            aria-label="Lead status"
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
        <FormGroup>
          <FormLabel>Source</FormLabel>
          <FormSelect
            aria-label="Lead source"
            value={formData.source}
            onChange={e => setFormData({ ...formData, source: e.target.value })}
          >
            {Object.entries(SOURCE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormRow>
      <FormGroup>
        <FormLabel>Budget (AED)</FormLabel>
        <FormInput
          type="number"
          min={0}
          step={50000}
          aria-label="Lead budget in AED"
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: e.target.value })}
          placeholder="e.g. 2000000"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Notes</FormLabel>
        <FormTextarea
          aria-label="Lead notes"
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this lead..."
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
          <PageTitle>🎯 Lead Management</PageTitle>
        </div>
        <PrimaryButton onClick={openCreateModal}>➕ New Lead</PrimaryButton>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} variant="rect" height={52} />
          ))}
        </div>
      )}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error} — showing cached data</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {!error && errorMessage && (
        <ErrorBanner role="alert" aria-live="polite">
          <span>⚠️ {errorMessage}</span>
          <SecondaryButton onClick={() => setErrorMessage(null)}>Dismiss</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Pipeline Status Bar */}
      <PipelineBar>
        <PipelineStage
          $active={statusFilter === 'all'}
          $color="#1a1a2e"
          onClick={() => handleStatusFilterChange('all')}
        >
          All ({statusCounts.all || 0})
        </PipelineStage>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <PipelineStage
            key={key}
            $active={statusFilter === key}
            $color={cfg.color}
            onClick={() => handleStatusFilterChange(key)}
          >
            {cfg.label} ({statusCounts[key] || 0})
          </PipelineStage>
        ))}
      </PipelineBar>

      {/* Search & Filters */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search leads by name, company, email..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
        <FilterSelect value={sourceFilter} onChange={e => handleSourceFilterChange(e.target.value)}>
          <option value="all">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
        </span>
      </ActionBar>

      {/* Leads Table */}
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table aria-label="Leads list">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Score</Th>
              <Th>Company</Th>
              <Th>Status</Th>
              <Th>Source</Th>
              <Th>Budget</Th>
              <Th>Contact</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.length > 0 ? (
              paginatedLeads.map((lead: Lead) => {
                const score = lead.score ?? undefined;
                const scoreVariant =
                  score === undefined
                    ? undefined
                    : score >= 80
                      ? 'error'
                      : score >= 50
                        ? 'warning'
                        : 'secondary';
                const scoreEmoji =
                  score === undefined ? '' : score >= 80 ? '🔥' : score >= 50 ? '⚡' : '❄️';
                return (
                  <Tr key={lead.id} onClick={() => handleEdit(lead)}>
                    <Td style={{ fontWeight: 500 }}>{lead.name || '—'}</Td>
                    <Td>
                      {score !== undefined ? (
                        <Badge variant={scoreVariant} size="small">
                          {scoreEmoji} {score}
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>{lead.company || '—'}</Td>
                    <Td>
                      <Badge variant={getStatusBadgeVariant(lead.status || '')} size="small">
                        {STATUS_CONFIG[lead.status || '']?.label || lead.status || '—'}
                      </Badge>
                    </Td>
                    <Td>{SOURCE_LABELS[lead.source || ''] || lead.source || '—'}</Td>
                    <Td>{formatCurrency(lead.budget || lead.value)}</Td>
                    <Td>
                      <div style={{ fontSize: '0.8rem' }}>
                        {lead.email && <div>{lead.email}</div>}
                        {lead.phone && <div style={{ color: '#888' }}>{lead.phone}</div>}
                      </div>
                    </Td>
                    <Td>{formatDate(lead.created_at)}</Td>
                    <Td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <SecondaryButton onClick={() => handleEdit(lead)}>Edit</SecondaryButton>
                        <DangerButton onClick={() => confirmDelete(lead)}>Delete</DangerButton>
                      </div>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <tr>
                <Td colSpan={8}>
                  <EmptyState>
                    {search || statusFilter !== 'all' || sourceFilter !== 'all'
                      ? 'No leads match your filters'
                      : 'No leads yet — create your first one!'}
                  </EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLeads.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredLeads.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <Modal
          title="Create New Lead"
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleCreate} disabled={!formData.name.trim() || loading}>
              {loading ? '⏳ Creating...' : 'Create Lead'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <Modal
          title={`Edit Lead: ${selectedLead.name}`}
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
      {showDeleteConfirm && selectedLead && (
        <Modal
          title="Delete Lead"
          isOpen={showDeleteConfirm}
          onClose={closeDeleteModal}
          size="small"
        >
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            Are you sure you want to delete <strong>{selectedLead.name}</strong>? This action cannot
            be undone.
          </p>
          <ModalFooter>
            <SecondaryButton onClick={closeDeleteModal}>Cancel</SecondaryButton>
            <DangerButton onClick={handleDelete} disabled={loading}>
              {loading ? '⏳ Deleting...' : 'Delete Lead'}
            </DangerButton>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
};

export default LeadManagementPage;
