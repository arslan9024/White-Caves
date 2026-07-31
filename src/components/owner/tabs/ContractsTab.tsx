import React, { useState, useEffect, useCallback } from 'react';
import type { ContractsTabProps, Contract } from './types';
import SigningStatusBadge from './SigningStatusBadge';
import {
  TabContainer,
  TabHeader,
  TabTitle,
  HeaderActions,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  TableContainer,
  Table,
  FilterRow,
  FilterSelect,
  PaginationContainer,
  PageButton,
  ModalOverlay,
  Modal,
  ModalSmall,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Toast,
  LoadingSpinner,
  LoadingState,
  ErrorState,
  ErrorIcon,
  IconButton,
  ActionButtons,
  ContractStatsRow,
  ContractStat,
  StatNumber,
  StatLabelText,
  TableFooter,
  TypeBadge,
  PartiesCell,
  DateCell,
  PriceCell,
  WarningText,
  FormGrid,
  FormGroup,
  StatusBadge,
} from './TabStylesComponents';

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 1,
    contractNumber: 'WC-CNT-2024-001',
    type: 'tenancy',
    tenant: 'James Hartwell',
    landlord: 'Al Futtaim Properties',
    property: 'Marina Heights, Unit 12A',
    startDate: '2024-01-15',
    endDate: '2025-01-14',
    amount: 120000,
    status: 'active',
    ejariStatus: 'registered',
    signatureStatus: 'signed',
  },
  {
    id: 2,
    contractNumber: 'WC-CNT-2024-002',
    type: 'sale',
    buyer: 'Chen Wei',
    seller: 'White Caves LLC',
    property: 'Downtown Dubai, Burj Vista 4B',
    completionDate: '2024-03-20',
    amount: 3500000,
    status: 'completed',
    ejariStatus: '',
    signatureStatus: 'signed',
  },
  {
    id: 3,
    contractNumber: 'WC-CNT-2024-003',
    type: 'tenancy',
    tenant: 'Priya Sharma',
    landlord: 'Emirates REIT',
    property: 'JBR, The Walk Tower 7, Unit 3C',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    amount: 95000,
    status: 'active',
    ejariStatus: 'registered',
    signatureStatus: 'signed',
  },
  {
    id: 4,
    contractNumber: 'WC-CNT-2024-004',
    type: 'tenancy',
    tenant: 'Omar Al Rashidi',
    landlord: 'Emaar Properties',
    property: 'Arabian Ranches, Villa 22',
    startDate: '2024-05-01',
    endDate: '2025-04-30',
    amount: 180000,
    status: 'active',
    ejariStatus: 'pending',
    signatureStatus: 'sent',
  },
  {
    id: 5,
    contractNumber: 'WC-CNT-2024-005',
    type: 'sale',
    buyer: 'Sarah Johnson',
    seller: 'Damac Properties',
    property: 'Business Bay, Executive Tower',
    completionDate: '2024-06-15',
    amount: 2200000,
    status: 'pending',
    ejariStatus: '',
    signatureStatus: 'opened',
  },
  {
    id: 6,
    contractNumber: 'WC-CNT-2024-006',
    type: 'tenancy',
    tenant: 'Mohammed Al Hassan',
    landlord: 'Nakheel',
    property: 'Palm Jumeirah, Frond G Villa',
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    amount: 350000,
    status: 'expired',
    ejariStatus: 'registered',
    signatureStatus: 'expired',
  },
  {
    id: 7,
    contractNumber: 'WC-CNT-2024-007',
    type: 'sale',
    buyer: 'Fatima Al Mansoori',
    seller: 'Meraas Holding',
    property: 'City Walk, Bldg 12, Unit 504',
    completionDate: '2024-08-01',
    amount: 1850000,
    status: 'active',
    ejariStatus: '',
    signatureStatus: 'rejected',
  },
  {
    id: 8,
    contractNumber: 'WC-CNT-2024-008',
    type: 'tenancy',
    tenant: 'Viktor Petrov',
    landlord: 'Select Group',
    property: 'Dubai Marina, 5242 Tower A',
    startDate: '2024-09-01',
    endDate: '2025-08-31',
    amount: 140000,
    status: 'active',
    ejariStatus: 'pending',
    signatureStatus: 'pending',
  },
];

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

const EMPTY_FORM: Omit<Contract, 'id'> = {
  contractNumber: '',
  type: 'tenancy',
  tenant: '',
  landlord: '',
  buyer: '',
  seller: '',
  property: '',
  startDate: '',
  endDate: '',
  completionDate: '',
  amount: 0,
  status: 'pending',
  ejariStatus: 'pending',
};

const ContractsTab: React.FC<ContractsTabProps> = ({ data, loading }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [localContracts, setLocalContracts] = useState<Contract[]>(() =>
    data?.contracts && data.contracts.length > 0 ? data.contracts : MOCK_CONTRACTS
  );
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editTarget, setEditTarget] = useState<Contract | null>(null);
  const [form, setForm] = useState<Omit<Contract, 'id'>>(EMPTY_FORM);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = useCallback(() => {
    setForm({
      ...EMPTY_FORM,
      contractNumber: `WC-CNT-${new Date().getFullYear()}-${String(localContracts.length + 1).padStart(3, '0')}`,
    });
    setEditTarget(null);
    setModalMode('add');
  }, [localContracts.length]);

  const openEdit = useCallback((c: Contract) => {
    setForm({
      contractNumber: c.contractNumber,
      type: c.type,
      tenant: c.tenant ?? '',
      landlord: c.landlord ?? '',
      buyer: c.buyer ?? '',
      seller: c.seller ?? '',
      property: c.property,
      startDate: c.startDate ?? '',
      endDate: c.endDate ?? '',
      completionDate: c.completionDate ?? '',
      amount: c.amount,
      status: c.status,
      ejariStatus: c.ejariStatus,
    });
    setEditTarget(c);
    setModalMode('edit');
  }, []);

  const openDelete = useCallback((c: Contract) => {
    setEditTarget(c);
    setModalMode('delete');
  }, []);
  const closeModal = () => {
    setModalMode('none');
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!form.contractNumber.trim() || !form.property.trim() || form.amount <= 0) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...localContracts.map(c => c.id)) + 1;
      setLocalContracts(prev => [...prev, { id: nextId, ...form }]);
      showToast('✅ Contract added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setLocalContracts(prev => prev.map(c => (c.id === editTarget.id ? { ...c, ...form } : c)));
      showToast('✅ Contract updated');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editTarget) return;
    setLocalContracts(prev => prev.filter(c => c.id !== editTarget.id));
    showToast('🗑️ Contract removed');
    closeModal();
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter]);

  if (loading) {
    return (
      <TabContainer>
        <LoadingState role="status" aria-label="Loading contracts">
          <LoadingSpinner />
          <p>Loading contracts...</p>
        </LoadingState>
      </TabContainer>
    );
  }

  const filteredContracts = localContracts.filter(contract => {
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = filteredContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) =>
    ({
      active: '#22C55E',
      pending: '#F59E0B',
      completed: '#3B82F6',
      expired: '#EF4444',
      cancelled: '#6B7280',
    })[status] ?? '#6B7280';

  const getEjariBadge = (status: string) => {
    if (!status) return null;
    const isRegistered = status === 'registered';
    return (
      <span style={{ color: isRegistered ? 'var(--accent-green, #22C55E)' : 'var(--accent-gold, #F59E0B)' }}>
        {isRegistered ? '✓ Registered' : '⏳ Pending'}
      </span>
    );
  };

  const contractStats = {
    total: localContracts.length,
    active: localContracts.filter(c => c.status === 'active').length,
    pending: localContracts.filter(c => c.status === 'pending').length,
    ejariRegistered: localContracts.filter(c => c.ejariStatus === 'registered').length,
  };

  return (
    <TabContainer>
      {toast && <Toast role="status">{toast}</Toast>}

      <TabHeader>
        <TabTitle>Contract Management</TabTitle>
        <HeaderActions>
          <PrimaryButton onClick={openAdd}>
            <span>📄</span> New Contract
          </PrimaryButton>
        </HeaderActions>
      </TabHeader>

      {/* Stats row */}
      <ContractStatsRow>
        <ContractStat>
          <StatNumber>{contractStats.total}</StatNumber>
          <StatLabelText>Total Contracts</StatLabelText>
        </ContractStat>
        <ContractStat variant="active">
          <StatNumber>{contractStats.active}</StatNumber>
          <StatLabelText>Active</StatLabelText>
        </ContractStat>
        <ContractStat variant="pending">
          <StatNumber>{contractStats.pending}</StatNumber>
          <StatLabelText>Pending</StatLabelText>
        </ContractStat>
        <ContractStat variant="ejari">
          <StatNumber>{contractStats.ejariRegistered}</StatNumber>
          <StatLabelText>Ejari Registered</StatLabelText>
        </ContractStat>
      </ContractStatsRow>

      {/* Filters */}
      <FilterRow>
        <FilterSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="tenancy">Tenancy</option>
          <option value="sale">Sale</option>
        </FilterSelect>
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="expired">Expired</option>
        </FilterSelect>
      </FilterRow>

      {/* Table */}
      {filteredContracts.length === 0 ? (
        <ErrorState>
          <ErrorIcon>📋</ErrorIcon>
          <p>No contracts found</p>
        </ErrorState>
      ) : (
        <TableContainer>
          <Table aria-label="Contracts data">
            <thead>
              <tr>
                <th>Contract No.</th>
                <th>Type</th>
                <th>Parties</th>
                <th>Property</th>
                <th>Duration/Date</th>
                <th>Amount (AED)</th>
                <th>Status</th>
                <th>Ejari</th>
                <th>E-Sign</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContracts.map(contract => (
                <tr key={contract.id}>
                  <td>
                    <strong>{contract.contractNumber}</strong>
                  </td>
                  <td>
                    <TypeBadge $type={contract.type as 'tenancy' | 'sale'}>
                      {contract.type === 'tenancy' ? '🏠 Tenancy' : '💰 Sale'}
                    </TypeBadge>
                  </td>
                  <td>
                    <PartiesCell>
                      {contract.type === 'tenancy' ? (
                        <>
                          <small>Tenant: {contract.tenant}</small>
                          <small>Landlord: {contract.landlord}</small>
                        </>
                      ) : (
                        <>
                          <small>Buyer: {contract.buyer}</small>
                          <small>Seller: {contract.seller}</small>
                        </>
                      )}
                    </PartiesCell>
                  </td>
                  <td>{contract.property}</td>
                  <td>
                    <DateCell>
                      {contract.type === 'tenancy' ? (
                        <>
                          <small>{contract.startDate}</small>
                          <small>to {contract.endDate}</small>
                        </>
                      ) : (
                        <small>Completion: {contract.completionDate}</small>
                      )}
                    </DateCell>
                  </td>
                  <PriceCell>AED {contract.amount.toLocaleString()}</PriceCell>
                  <td>
                    <StatusBadge className="status-badge" $status={contract.status}>
                      {contract.status}
                    </StatusBadge>
                  </td>
                  <td>{getEjariBadge(contract.ejariStatus)}</td>
                  <td>
                    <SigningStatusBadge status={contract.signatureStatus as any} />
                  </td>
                  <td>
                    <ActionButtons>
                      <IconButton
                        title="Edit"
                        aria-label="Edit contract"
                        onClick={() => openEdit(contract)}
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        danger
                        title="Delete"
                        aria-label="Delete contract"
                        onClick={() => openDelete(contract)}
                      >
                        🗑️
                      </IconButton>
                    </ActionButtons>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <nav role="navigation" aria-label="Pagination">
        {totalPages > 1 && (
          <TableFooter>
            <span>
              Showing {paginatedContracts.length} of {filteredContracts.length} contracts
            </span>
            <PaginationContainer>
              <PageButton
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ←
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <PageButton key={p} $active={p === currentPage} onClick={() => setCurrentPage(p)}>
                  {p}
                </PageButton>
              ))}
              <PageButton
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                →
              </PageButton>
            </PaginationContainer>
          </TableFooter>
        )}
      </nav>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="contract-modal-title">
          <Modal>
            <ModalHeader>
              <h3 id="contract-modal-title">
                {modalMode === 'add' ? 'New Contract' : 'Edit Contract'}
              </h3>
              <ModalCloseButton onClick={closeModal} aria-label="Close">
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <label>Contract No.</label>
                  <input
                    type="text"
                    value={form.contractNumber}
                    onChange={e => setForm(f => ({ ...f, contractNumber: e.target.value }))}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={e =>
                      setForm(f => ({ ...f, type: e.target.value as 'tenancy' | 'sale' }))
                    }
                  >
                    <option value="tenancy">Tenancy</option>
                    <option value="sale">Sale</option>
                  </select>
                </FormGroup>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Property *</label>
                  <input
                    type="text"
                    value={form.property}
                    onChange={e => setForm(f => ({ ...f, property: e.target.value }))}
                    placeholder="Building, Unit..."
                  />
                </FormGroup>
                {form.type === 'tenancy' ? (
                  <>
                    <FormGroup>
                      <label>Tenant</label>
                      <input
                        type="text"
                        value={form.tenant ?? ''}
                        onChange={e => setForm(f => ({ ...f, tenant: e.target.value }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Landlord</label>
                      <input
                        type="text"
                        value={form.landlord ?? ''}
                        onChange={e => setForm(f => ({ ...f, landlord: e.target.value }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={form.startDate ?? ''}
                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>End Date</label>
                      <input
                        type="date"
                        value={form.endDate ?? ''}
                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                      />
                    </FormGroup>
                  </>
                ) : (
                  <>
                    <FormGroup>
                      <label>Buyer</label>
                      <input
                        type="text"
                        value={form.buyer ?? ''}
                        onChange={e => setForm(f => ({ ...f, buyer: e.target.value }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Seller</label>
                      <input
                        type="text"
                        value={form.seller ?? ''}
                        onChange={e => setForm(f => ({ ...f, seller: e.target.value }))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Completion Date</label>
                      <input
                        type="date"
                        value={form.completionDate ?? ''}
                        onChange={e => setForm(f => ({ ...f, completionDate: e.target.value }))}
                      />
                    </FormGroup>
                  </>
                )}
                <FormGroup>
                  <label>Amount (AED) *</label>
                  <input
                    type="number"
                    value={form.amount || ''}
                    min={0}
                    onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </FormGroup>
                {form.type === 'tenancy' && (
                  <FormGroup>
                    <label>Ejari Status</label>
                    <select
                      value={form.ejariStatus}
                      onChange={e => setForm(f => ({ ...f, ejariStatus: e.target.value }))}
                    >
                      <option value="pending">Pending</option>
                      <option value="registered">Registered</option>
                    </select>
                  </FormGroup>
                )}
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <PrimaryButton
                onClick={handleSave}
                disabled={!form.contractNumber.trim() || !form.property.trim() || form.amount <= 0}
              >
                {modalMode === 'add' ? 'Add Contract' : 'Save Changes'}
              </PrimaryButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && editTarget && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="contract-del-title">
          <ModalSmall>
            <ModalHeader>
              <h3 id="contract-del-title">Remove Contract</h3>
              <ModalCloseButton onClick={closeModal} aria-label="Close">
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Remove <strong>{editTarget.contractNumber}</strong>?
              </p>
              <WarningText>This action cannot be undone.</WarningText>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <DangerButton onClick={handleDelete}>Remove</DangerButton>
            </ModalFooter>
          </ModalSmall>
        </ModalOverlay>
      )}
    </TabContainer>
  );
};

export default React.memo(ContractsTab);
