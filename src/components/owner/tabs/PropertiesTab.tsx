import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Badge, type BadgeVariant } from '../../../components/ui';
import { colors, spacing, typography } from '@/design-tokens';
import type { PropertiesTabProps, Property } from './types';
import {
  TabContainer,
  TabHeader,
  TabTitle,
  HeaderActions,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  FilterRow,
  FilterSelect,
  TableContainer,
  Table,
  PageButton,
  ModalOverlay,
  FormGrid,
  FormGroup,
  LinkButton,
} from './TabStylesComponents';

// ── Local styled components for PropertiesTab ──
const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: ${spacing[3]};
  color: ${colors.text.secondary};
  ${typography.presets.body};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: ${colors.primary[500]};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing[3]};
  padding: ${spacing[6]};
  text-align: center;
  color: ${colors.error[500]};

  p {
    ${typography.presets.body};
    margin: 0;
  }
`;

const ErrorIcon = styled.span`
  font-size: 2rem;
  opacity: 0.8;
`;

const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchInputIcon = styled.span`
  position: absolute;
  left: ${spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.text.secondary};
  pointer-events: none;
`;

const SearchInputField = styled.input`
  width: 100%;
  padding: ${spacing[2]} ${spacing[3]} ${spacing[2]} ${spacing[5]};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: ${colors.text.inverse};
  ${typography.presets.body};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
  }

  &::placeholder {
    color: ${colors.text.secondary};
  }
`;

const PropertyCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

const PropertyThumb = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(196, 30, 58, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: ${colors.text.inverse};
    ${typography.presets.label};
    margin: 0;
  }

  small {
    color: ${colors.text.secondary};
    ${typography.presets.caption};
    margin: 0;
  }
`;

const TypeTag = styled.span`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[2]};
  background: rgba(196, 30, 58, 0.1);
  color: ${colors.primary[500]};
  border-radius: 8px;
  ${typography.presets.caption};
  font-weight: 600;
`;

const UnassignedText = styled.span`
  color: ${colors.text.secondary};
  font-style: italic;
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: ${spacing[1]};
`;

const IconBtn = styled.button<{ danger?: boolean }>`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(196, 30, 58, 0.1);
    ${props => props.danger && `color: ${colors.error[500]};`}
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
  }
`;

const CrudToast = styled.div`
  position: fixed;
  bottom: ${spacing[4]};
  right: ${spacing[4]};
  padding: ${spacing[3]} ${spacing[4]};
  background: ${colors.success[500]};
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  ${typography.presets.body};
  z-index: 2000;
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div<{ small?: boolean }>`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: ${props => (props.small ? '400px' : '600px')};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[5]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    ${typography.presets.heading3};
    color: ${colors.text.inverse};
  }
`;

const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.text.inverse};
  }
`;

const ModalBody = styled.div`
  padding: ${spacing[5]};
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${spacing[3]};
  justify-content: flex-end;
  padding: ${spacing[5]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const WarningText = styled.p`
  color: ${colors.error[500]};
  ${typography.presets.caption};
  margin: ${spacing[2]} 0 0;
`;

const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing[4]} ${spacing[5]};
  flex-wrap: wrap;
  gap: ${spacing[3]};
  ${typography.presets.body};
  color: ${colors.text.secondary};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: ${spacing[1]};
  align-items: center;
`;

// ── CRUD modal form state ────────────────────────────────────────────────────
const EMPTY_FORM: Omit<Property, 'id' | 'code'> = {
  title: '',
  type: 'Apartment',
  location: '',
  price: 0,
  status: 'available',
  agent: null,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    code: 'WC-PAL-001',
    title: 'Luxury Villa Palm Jumeirah',
    type: 'Villa',
    location: 'Palm Jumeirah',
    price: 15000000,
    status: 'available',
    agent: 'Ahmed Ali',
    bedrooms: 5,
    bathrooms: 6,
    area: 8500,
  },
  {
    id: 2,
    code: 'WC-DWN-002',
    title: 'Penthouse Downtown Dubai',
    type: 'Apartment',
    location: 'Downtown Dubai',
    price: 8500000,
    status: 'reserved',
    agent: 'Sara Khan',
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
  },
  {
    id: 3,
    code: 'WC-MAR-003',
    title: 'Marina View Apartment',
    type: 'Apartment',
    location: 'Dubai Marina',
    price: 3200000,
    status: 'available',
    agent: 'Mohammed Hassan',
    bedrooms: 2,
    bathrooms: 3,
    area: 1800,
  },
  {
    id: 4,
    code: 'WC-JVC-004',
    title: 'Family Townhouse JVC',
    type: 'Townhouse',
    location: 'JVC',
    price: 2100000,
    status: 'under_contract',
    agent: 'Fatima Ahmed',
    bedrooms: 3,
    bathrooms: 4,
    area: 2500,
  },
  {
    id: 5,
    code: 'WC-BUS-005',
    title: 'Business Bay Office',
    type: 'Commercial',
    location: 'Business Bay',
    price: 5500000,
    status: 'available',
    agent: null,
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
  },
  {
    id: 6,
    code: 'WC-EMH-006',
    title: 'Emirates Hills Villa',
    type: 'Villa',
    location: 'Emirates Hills',
    price: 28000000,
    status: 'sold',
    agent: 'Ahmed Ali',
    bedrooms: 7,
    bathrooms: 8,
    area: 12000,
  },
];

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

const PropertiesTab: React.FC<PropertiesTabProps> = ({ data, loading, error, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // CRUD state
  const [localProperties, setLocalProperties] = useState<Property[]>(
    () => data?.properties ?? MOCK_PROPERTIES
  );
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [form, setForm] = useState<Omit<Property, 'id' | 'code'>>(EMPTY_FORM);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ useEffect BEFORE early returns — Rules of Hooks compliant
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = useCallback(() => {
    onAction?.('addProperty');
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setModalMode('add');
  }, [onAction]);

  const openEdit = useCallback(
    (prop: Property) => {
      onAction?.('editProperty', prop.id);
      const { id: _id, code: _code, ...rest } = prop;
      setForm(rest);
      setEditTarget(prop);
      setModalMode('edit');
    },
    [onAction]
  );

  const openDelete = useCallback(
    (prop: Property) => {
      onAction?.('deleteProperty', prop.id);
      setEditTarget(prop);
      setModalMode('delete');
    },
    [onAction]
  );

  const handleView = useCallback(
    (prop: Property) => {
      onAction?.('viewProperty', prop.id);
    },
    [onAction]
  );

  const closeModal = () => {
    setModalMode('none');
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim() || form.price <= 0) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...localProperties.map(p => p.id)) + 1;
      const code = `WC-NEW-${String(nextId).padStart(3, '0')}`;
      setLocalProperties(prev => [...prev, { id: nextId, code, ...form }]);
      showToast('✅ Property added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setLocalProperties(prev => prev.map(p => (p.id === editTarget.id ? { ...p, ...form } : p)));
      showToast('✅ Property updated successfully');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editTarget) return;
    setLocalProperties(prev => prev.filter(p => p.id !== editTarget.id));
    showToast('🗑️ Property deleted');
    closeModal();
  };

  // Reset page when filters change (must be before early returns — Rules of Hooks)
  React.useEffect(() => {
    const reset = async () => {
      setCurrentPage(1);
    };
    reset();
  }, [searchQuery, statusFilter, typeFilter]);

  // Show loading state
  if (loading) {
    return (
      <TabContainer>
        <LoadingState role="status" aria-label="Loading properties">
          <LoadingSpinner />
          <p>Loading properties...</p>
        </LoadingState>
      </TabContainer>
    );
  }

  // Show error state with retry
  if (error) {
    return (
      <TabContainer>
        <ErrorState role="alert">
          <ErrorIcon>⚠️</ErrorIcon>
          <p>Failed to load properties: {error}</p>
          <SecondaryButton onClick={() => onAction?.('retryFetch')}>Retry</SecondaryButton>
        </ErrorState>
      </TabContainer>
    );
  }

  const filteredProperties = localProperties.filter(prop => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      prop.title.toLowerCase().includes(q) ||
      prop.code.toLowerCase().includes(q) ||
      prop.location.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    const matchesType = typeFilter === 'all' || prop.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: BadgeVariant; text: string }> = {
      available: { variant: 'success', text: 'Available' },
      reserved: { variant: 'warning', text: 'Reserved' },
      under_contract: { variant: 'info', text: 'Under Contract' },
      sold: { variant: 'error', text: 'Sold' },
      off_market: { variant: 'secondary', text: 'Off Market' },
    };
    // eslint-disable-next-line security/detect-object-injection
    const cfg = statusConfig[status] ?? { variant: 'secondary' as BadgeVariant, text: status };
    return (
      <Badge variant={cfg.variant} size="small">
        {cfg.text}
      </Badge>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filteredProperties.slice(startIdx, startIdx + itemsPerPage);

  const isFormValid = form.title.trim() !== '' && form.location.trim() !== '' && form.price > 0;

  return (
    <TabContainer>
      {/* Toast */}
      {toast && <CrudToast role="status">{toast}</CrudToast>}

      {/* Header */}
      <TabHeader>
        <TabTitle>Property Management</TabTitle>
        <HeaderActions>
          <PrimaryButton onClick={openAdd}>
            <span>➕</span> Add Property
          </PrimaryButton>
        </HeaderActions>
      </TabHeader>

      {/* Filters */}
      <FilterRow>
        <SearchInputContainer>
          <SearchInputIcon>🔍</SearchInputIcon>
          <SearchInputField
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchInputContainer>
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="under_contract">Under Contract</option>
          <option value="sold">Sold</option>
          <option value="off_market">Off Market</option>
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </FilterSelect>
      </FilterRow>

      {/* Empty state */}
      {filteredProperties.length === 0 && (
        <ErrorState>
          <p>No properties found.</p>
          <LinkButton onClick={openAdd}>Add your first property →</LinkButton>
        </ErrorState>
      )}

      {/* Table */}
      {filteredProperties.length > 0 && (
        <TableContainer>
          <Table aria-label="Properties list">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price (AED)</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(prop => (
                <tr key={prop.id}>
                  <td>
                    <PropertyCell>
                      <PropertyThumb>🏠</PropertyThumb>
                      <PropertyInfo>
                        <strong>{prop.code}</strong>
                        <small>{prop.title}</small>
                      </PropertyInfo>
                    </PropertyCell>
                  </td>
                  <td>
                    <TypeTag>{prop.type}</TypeTag>
                  </td>
                  <td>{prop.location}</td>
                  <td>
                    <strong style={{ color: colors.success[500] }}>
                      AED {prop.price.toLocaleString()}
                    </strong>
                  </td>
                  <td>{getStatusBadge(prop.status)}</td>
                  <td>{prop.agent ?? <UnassignedText>Unassigned</UnassignedText>}</td>
                  <td>
                    <ActionButtonsRow>
                      <IconBtn
                        title="View"
                        aria-label="View property"
                        onClick={() => handleView(prop)}
                      >
                        👁️
                      </IconBtn>
                      <IconBtn
                        title="Edit"
                        aria-label="Edit property"
                        onClick={() => openEdit(prop)}
                      >
                        ✏️
                      </IconBtn>
                      <IconBtn
                        danger
                        title="Delete"
                        aria-label="Delete property"
                        onClick={() => openDelete(prop)}
                      >
                        🗑️
                      </IconBtn>
                    </ActionButtonsRow>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TableFooter>
        <span>
          Showing {paginated.length} of {filteredProperties.length} properties
        </span>
        {totalPages > 1 && (
          <PaginationButtons>
            <PageButton
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              ←
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PageButton
                key={page}
                $active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            ))}
            <PageButton
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              →
            </PageButton>
          </PaginationButtons>
        )}
      </TableFooter>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="prop-modal-title">
          <ModalContent>
            <ModalHeader>
              <h3 id="prop-modal-title">
                {modalMode === 'add' ? 'Add New Property' : 'Edit Property'}
              </h3>
              <ModalCloseButton onClick={closeModal} aria-label="Close">
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <label>Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Marina View Apartment"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Townhouse</option>
                    <option>Commercial</option>
                    <option>Land</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Dubai Marina"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Price (AED) *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price || ''}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    placeholder="e.g. 3200000"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="under_contract">Under Contract</option>
                    <option value="sold">Sold</option>
                    <option value="off_market">Off Market</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Agent</label>
                  <input
                    type="text"
                    value={form.agent ?? ''}
                    onChange={e => setForm(f => ({ ...f, agent: e.target.value || null }))}
                    placeholder="Agent name (optional)"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms ?? ''}
                    onChange={e => setForm(f => ({ ...f, bedrooms: Number(e.target.value) }))}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bathrooms ?? ''}
                    onChange={e => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Area (sqft)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.area ?? ''}
                    onChange={e => setForm(f => ({ ...f, area: Number(e.target.value) }))}
                  />
                </FormGroup>
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={!isFormValid}>
                {modalMode === 'add' ? 'Add Property' : 'Save Changes'}
              </PrimaryButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && editTarget && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="del-modal-title">
          <ModalContent small>
            <ModalHeader>
              <h3 id="del-modal-title">Delete Property</h3>
              <ModalCloseButton onClick={closeModal} aria-label="Close">
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete <strong>{editTarget.title}</strong>?
              </p>
              <WarningText>This action cannot be undone.</WarningText>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <DangerButton onClick={handleDelete}>Delete</DangerButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </TabContainer>
  );
};

export default React.memo(PropertiesTab);
