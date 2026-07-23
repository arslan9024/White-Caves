/**
 * CRM Commission Tracking Page
 * Full commission management with filtering, search, and summary cards.
 * Business logic extracted to useCommissionTracking hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/commissions
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
import { useCommissionTracking, STATUS_CONFIG, TYPE_LABELS } from './hooks/useCommissionTracking';
import type { Commission } from './hooks/useCommissionTracking';

// ─── Commission-Specific Styled Components ──────────────────────────────

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: #0f0f0f;
  border: 1px solid #c9a84c;
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

// ─── Component ──────────────────────────────────────────────────────────

const CommissionTrackingPage: FC = () => {
  useDocumentTitle('Commission Tracking');
  const {
    filteredCommissions,
    paginatedCommissions,
    summaryStats,
    loading,
    error,
    search,
    statusFilter,
    typeFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    selectedCommission,
    formData,
    setFormData,
    ITEMS_PER_PAGE,
    openCreateModal,
    closeCreateModal,
    closeEditModal,
    handleCreate,
    handleEdit,
    handleSaveEdit,
    handleSearchChange,
    handleStatusFilterChange,
    handleTypeFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    getStatusBadgeVariant,
    formatCurrency,
    formatDate,
  } = useCommissionTracking();

  const renderForm = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>Agent Name *</FormLabel>
          <FormInput
            type="text"
            value={formData.agent_name}
            onChange={e => setFormData({ ...formData, agent_name: e.target.value })}
            placeholder="e.g. Ahmed Al Rashid"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Property</FormLabel>
          <FormInput
            type="text"
            value={formData.property_title}
            onChange={e => setFormData({ ...formData, property_title: e.target.value })}
            placeholder="e.g. Palm Jumeirah Villa"
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <FormLabel>Amount (AED) *</FormLabel>
          <FormInput
            type="number"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            placeholder="e.g. 50000"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Percentage (%)</FormLabel>
          <FormInput
            type="number"
            value={formData.percentage}
            onChange={e => setFormData({ ...formData, percentage: e.target.value })}
            placeholder="e.g. 2.5"
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
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
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
        <FormLabel>Notes</FormLabel>
        <FormTextarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this commission..."
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
          <PageTitle>💰 Commission Tracking</PageTitle>
        </div>
        <PrimaryButton onClick={openCreateModal}>➕ New Commission</PrimaryButton>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading commissions from server...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error} — showing cached data</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Summary Stats */}
      <StatsRow>
        <StatCard $color="#c9a84c">
          <StatValue>{formatCurrency(summaryStats.pending)}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard $color="#c9a84c">
          <StatValue>{formatCurrency(summaryStats.approved)}</StatValue>
          <StatLabel>Approved</StatLabel>
        </StatCard>
        <StatCard $color="#10B981">
          <StatValue>{formatCurrency(summaryStats.paid)}</StatValue>
          <StatLabel>Paid</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Search & Filters */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search by agent name..."
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
        <FilterSelect value={typeFilter} onChange={e => handleTypeFilterChange(e.target.value)}>
          <option value="all">All Types</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </FilterSelect>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          {filteredCommissions.length} commission{filteredCommissions.length !== 1 ? 's' : ''} found
        </span>
      </ActionBar>

      {/* Commissions Table */}
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table aria-label="Commissions list">
          <thead>
            <tr>
              <Th>Agent</Th>
              <Th>Amount</Th>
              <Th>Percentage</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Property</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedCommissions.length > 0 ? (
              paginatedCommissions.map((commission: Commission) => (
                <Tr key={commission.id} onClick={() => handleEdit(commission)}>
                  <Td style={{ fontWeight: 500 }}>{commission.agent_name || '—'}</Td>
                  <Td>{formatCurrency(commission.amount)}</Td>
                  <Td>{commission.percentage != null ? `${commission.percentage}%` : '—'}</Td>
                  <Td>{TYPE_LABELS[commission.type || ''] || commission.type || '—'}</Td>
                  <Td>
                    <Badge variant={getStatusBadgeVariant(commission.status || '')} size="small">
                      {STATUS_CONFIG[commission.status || '']?.label || commission.status || '—'}
                    </Badge>
                  </Td>
                  <Td>{commission.property_title || '—'}</Td>
                  <Td>{formatDate(commission.created_at)}</Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <SecondaryButton onClick={() => handleEdit(commission)}>Edit</SecondaryButton>
                  </Td>
                </Tr>
              ))
            ) : (
              <tr>
                <Td colSpan={8}>
                  <EmptyState>
                    {search || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'No commissions match your filters'
                      : 'No commissions yet — create your first one!'}
                  </EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredCommissions.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCommissions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}

      {/* Create Commission Modal */}
      {showCreateModal && (
        <Modal
          title="Create New Commission"
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={handleCreate}
              disabled={!formData.agent_name.trim() || !formData.amount || loading}
            >
              {loading ? '⏳ Creating...' : 'Create Commission'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Edit Commission Modal */}
      {showEditModal && selectedCommission && (
        <Modal
          title={`Edit Commission: ${selectedCommission.agent_name}`}
          isOpen={showEditModal}
          onClose={closeEditModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeEditModal}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={handleSaveEdit}
              disabled={!formData.agent_name.trim() || loading}
            >
              {loading ? '⏳ Saving...' : 'Save Changes'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
};

export default CommissionTrackingPage;
