/**
 * CRM Transaction Management Page
 * Full transaction management with pipeline visualization and CRUD.
 * Business logic extracted to useTransactionManagement hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/transactions
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
import {
  useTransactionManagement,
  STATUS_CONFIG,
  TYPE_LABELS,
  PIPELINE_STAGES,
} from './hooks/useTransactionManagement';
import type { Transaction } from './hooks/useTransactionManagement';

// ─── Transaction-Specific Styled Components ─────────────────────────────

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

const PipelineBar = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  background: #1a1a1a;
  border-radius: 12px;
  padding: 0.5rem;
  border: 1px solid #2c2c2c;
`;

const PipelineStage = styled.button<{ $active: boolean; $color: string }>`
  flex: 1;
  background: ${props => (props.$active ? props.$color : 'transparent')};
  color: ${props => (props.$active ? '#0f0f0f' : 'rgba(255, 255, 255, 0.7)')};
  border: none;
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;

  &:hover {
    background: ${props => (props.$active ? props.$color : '#2c2c2c')};
  }
`;

const PipelineCount = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
`;

const PipelineArrow = styled.span`
  color: #ccc;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

// ─── Component ──────────────────────────────────────────────────────────

const TransactionManagementPage: FC = () => {
  useDocumentTitle('Transaction Management');
  const {
    filteredTransactions,
    paginatedTransactions,
    summaryStats,
    pipelineCounts,
    loading,
    error,
    search,
    statusFilter,
    typeFilter,
    currentPage,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedTransaction,
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
    handleStatusFilterChange,
    handleTypeFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    getStatusBadgeVariant,
    formatCurrency,
    formatDate,
  } = useTransactionManagement();

  const renderForm = () => (
    <>
      <FormRow>
        <FormGroup>
          <FormLabel>Type *</FormLabel>
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
      <FormRow>
        <FormGroup>
          <FormLabel>Amount (AED) *</FormLabel>
          <FormInput
            type="number"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            placeholder="e.g. 5000000"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Closing Date</FormLabel>
          <FormInput
            type="date"
            value={formData.closing_date}
            onChange={e => setFormData({ ...formData, closing_date: e.target.value })}
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup>
          <FormLabel>Property</FormLabel>
          <FormInput
            type="text"
            value={formData.property_title}
            onChange={e => setFormData({ ...formData, property_title: e.target.value })}
            placeholder="e.g. Palm Jumeirah Villa"
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Client</FormLabel>
          <FormInput
            type="text"
            value={formData.client_name}
            onChange={e => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="e.g. Ahmed Al Rashid"
          />
        </FormGroup>
      </FormRow>
      <FormGroup>
        <FormLabel>Agent</FormLabel>
        <FormInput
          type="text"
          value={formData.agent_name}
          onChange={e => setFormData({ ...formData, agent_name: e.target.value })}
          placeholder="e.g. Sarah Johnson"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Notes</FormLabel>
        <FormTextarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this transaction..."
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
          <PageTitle>📋 Transaction Management</PageTitle>
        </div>
        <PrimaryButton onClick={openCreateModal}>➕ New Transaction</PrimaryButton>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading transactions from server...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error} — showing cached data</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Summary Stats */}
      <StatsRow>
        <StatCard $color="#3B82F6">
          <StatValue>{summaryStats.total}</StatValue>
          <StatLabel>Total Transactions</StatLabel>
        </StatCard>
        <StatCard $color="#F59E0B">
          <StatValue>{summaryStats.pending}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard $color="#10B981">
          <StatValue>{summaryStats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>
        <StatCard $color="#8B5CF6">
          <StatValue>{formatCurrency(summaryStats.totalValue)}</StatValue>
          <StatLabel>Total Value</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Pipeline Visualization */}
      <PipelineBar>
        {PIPELINE_STAGES.map((stage, idx) => (
          <React.Fragment key={stage}>
            {idx > 0 && <PipelineArrow>→</PipelineArrow>}
            <PipelineStage
              $active={statusFilter === stage}
              $color={STATUS_CONFIG[stage]?.color || '#6B7280'}
              onClick={() => handleStatusFilterChange(statusFilter === stage ? 'all' : stage)}
            >
              <PipelineCount>{pipelineCounts[stage] || 0}</PipelineCount>
              {STATUS_CONFIG[stage]?.label || stage}
            </PipelineStage>
          </React.Fragment>
        ))}
      </PipelineBar>

      {/* Search & Filters */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search transactions..."
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
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}{' '}
          found
        </span>
      </ActionBar>

      {/* Transactions Table */}
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table aria-label="Transactions list">
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Property</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Client</Th>
              <Th>Agent</Th>
              <Th>Closing Date</Th>
              <Th>Commission</Th>
              <Th>KYC / RERA</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction: Transaction) => (
                <Tr key={transaction.id} onClick={() => handleEdit(transaction)}>
                  <Td>{TYPE_LABELS[transaction.type || ''] || transaction.type || '—'}</Td>
                  <Td style={{ fontWeight: 500 }}>{transaction.property_title || '—'}</Td>
                  <Td>{formatCurrency(transaction.amount)}</Td>
                  <Td>
                    <Badge variant={getStatusBadgeVariant(transaction.status || '')} size="small">
                      {STATUS_CONFIG[transaction.status || '']?.label || transaction.status || '—'}
                    </Badge>
                  </Td>
                  <Td>{transaction.client_name || '—'}</Td>
                  <Td>{transaction.agent_name || '—'}</Td>
                  <Td>{formatDate(transaction.closing_date)}</Td>
                  <Td>{transaction.commission ? formatCurrency(transaction.commission) : '—'}</Td>
                  <Td>
                    <Badge variant={transaction.rera_status === 'Forms Cleared' ? 'success' : 'warning'} size="small">
                      {transaction.rera_status || 'Forms Pending'}
                    </Badge>
                  </Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <SecondaryButton onClick={() => handleEdit(transaction)}>
                        Edit
                      </SecondaryButton>
                      <DangerButton onClick={() => confirmDelete(transaction)}>Delete</DangerButton>
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <tr>
                <Td colSpan={10}>
                  <EmptyState>
                    {search || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'No transactions match your filters'
                      : 'No transactions yet — create your first one!'}
                  </EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredTransactions.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredTransactions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}

      {/* Create Transaction Modal */}
      {showCreateModal && (
        <Modal
          title="Create New Transaction"
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleCreate} disabled={!formData.amount || loading}>
              {loading ? '⏳ Creating...' : 'Create Transaction'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && selectedTransaction && (
        <Modal
          title={`Edit Transaction`}
          isOpen={showEditModal}
          onClose={closeEditModal}
          size="large"
        >
          {renderForm()}
          <ModalFooter>
            <SecondaryButton onClick={closeEditModal}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSaveEdit} disabled={!formData.amount || loading}>
              {loading ? '⏳ Saving...' : 'Save Changes'}
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedTransaction && (
        <Modal
          title="Delete Transaction"
          isOpen={showDeleteConfirm}
          onClose={closeDeleteModal}
          size="small"
        >
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <ModalFooter>
            <SecondaryButton onClick={closeDeleteModal}>Cancel</SecondaryButton>
            <DangerButton onClick={handleDelete} disabled={loading}>
              {loading ? '⏳ Deleting...' : 'Delete Transaction'}
            </DangerButton>
          </ModalFooter>
        </Modal>
      )}
    </PageContainer>
  );
};

export default TransactionManagementPage;
