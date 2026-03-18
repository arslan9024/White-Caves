/**
 * CRM Lead Management Page
 * Full CRUD lead management with filtering, search, and status pipeline
 * Route: /owner/crm/leads
 */

import React, { FC, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, Modal, Pagination } from '../../components/ui';
import type { AppDispatch } from '../../store/store';
import {
  selectAllLeads,
  selectLeadsLoading,
  addLead,
  updateLead,
  deleteLead,
  selectLead,
  addActivity,
} from '../../store/crmDataSlice';

// ─── Types ──────────────────────────────────────────────────────────────

interface Lead {
  id: string | number;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
  budget?: number;
  value?: number;
  assigned_to?: string;
  agent_id?: string | number;
  notes?: string;
  created_at?: string;
  last_activity?: string;
  [key: string]: any;
}

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
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3B82F6;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  width: 260px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  outline: none;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #3B82F6;
  }
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
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: #2563EB;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const DangerButton = styled.button`
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #DC2626;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #f5f5f5;
    border-color: #bbb;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

const Th = styled.th`
  background: #fafafa;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e8e8e8;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background 0.1s;
  cursor: pointer;

  &:hover {
    background: #f8f9ff;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #888;
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

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
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

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
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

  &:focus {
    border-color: #3B82F6;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const PipelineBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const PipelineStage = styled.button<{ $active: boolean; $color: string }>`
  background: ${props => props.$active ? props.$color : 'white'};
  color: ${props => props.$active ? 'white' : '#555'};
  border: 1px solid ${props => props.$active ? props.$color : '#ddd'};
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
    background: ${props => props.$active ? props.$color : `${props.$color}10`};
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

// ─── Constants ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; badgeVariant: string }> = {
  hot: { label: 'Hot', color: '#EF4444', badgeVariant: 'error' },
  warm: { label: 'Warm', color: '#F59E0B', badgeVariant: 'warning' },
  cold: { label: 'Cold', color: '#3B82F6', badgeVariant: 'info' },
  new: { label: 'New', color: '#10B981', badgeVariant: 'success' },
  contacted: { label: 'Contacted', color: '#8B5CF6', badgeVariant: 'primary' },
  qualified: { label: 'Qualified', color: '#EC4899', badgeVariant: 'primary' },
  won: { label: 'Won', color: '#10B981', badgeVariant: 'success' },
  lost: { label: 'Lost', color: '#6B7280', badgeVariant: 'secondary' },
};

const SOURCE_LABELS: Record<string, string> = {
  whatsapp: '💬 WhatsApp',
  website: '🌐 Website',
  phone: '📞 Phone',
  referral: '🤝 Referral',
  marketing: '📣 Marketing',
  direct: '👤 Direct',
};

const ITEMS_PER_PAGE = 10;

// ─── Component ──────────────────────────────────────────────────────────

const LeadManagementPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const allLeads = useSelector(selectAllLeads) as Lead[];
  const loading = useSelector(selectLeadsLoading);

  // Local state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'new',
    source: 'direct',
    budget: '',
    notes: '',
  });

  // Filter & search
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead: Lead) => {
      const matchesSearch = !search || [
        lead.name, lead.company, lead.email, lead.phone
      ].some(field => field?.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [allLeads, search, statusFilter, sourceFilter]);

  // Pagination
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Status counts for pipeline
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allLeads.length };
    allLeads.forEach((lead: Lead) => {
      const status = lead.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [allLeads]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'new',
      source: 'direct',
      budget: '',
      notes: '',
    });
  }, []);

  // Create lead
  const handleCreate = () => {
    const newLead = {
      id: Date.now(),
      ...formData,
      budget: formData.budget ? Number(formData.budget) : undefined,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
    };
    dispatch(addLead(newLead));
    dispatch(addActivity({
      id: Date.now(),
      type: 'lead',
      description: `New lead created: ${formData.name} (${formData.company || 'No company'})`,
      timestamp: new Date().toISOString(),
    }));
    setShowCreateModal(false);
    resetForm();
  };

  // Edit lead
  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name || '',
      company: lead.company || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'new',
      source: lead.source || 'direct',
      budget: lead.budget?.toString() || lead.value?.toString() || '',
      notes: lead.notes || '',
    });
    setShowEditModal(true);
  };

  // Save edit
  const handleSaveEdit = () => {
    if (selectedLead) {
      dispatch(updateLead({
        ...selectedLead,
        ...formData,
        budget: formData.budget ? Number(formData.budget) : undefined,
        last_activity: new Date().toISOString(),
      }));
      dispatch(addActivity({
        id: Date.now(),
        type: 'lead',
        description: `Lead updated: ${formData.name}`,
        timestamp: new Date().toISOString(),
      }));
    }
    setShowEditModal(false);
    setSelectedLead(null);
    resetForm();
  };

  // Delete lead
  const handleDelete = () => {
    if (selectedLead) {
      dispatch(deleteLead(selectedLead.id));
      dispatch(addActivity({
        id: Date.now(),
        type: 'lead',
        description: `Lead deleted: ${selectedLead.name}`,
        timestamp: new Date().toISOString(),
      }));
    }
    setShowDeleteConfirm(false);
    setSelectedLead(null);
  };

  const confirmDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDeleteConfirm(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    return (STATUS_CONFIG[status]?.badgeVariant as any) || 'secondary';
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '—';
    return `AED ${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Lead form modal content
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
          <FormLabel>Status</FormLabel>
          <FormSelect
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <FormLabel>Source</FormLabel>
          <FormSelect
            value={formData.source}
            onChange={e => setFormData({ ...formData, source: e.target.value })}
          >
            {Object.entries(SOURCE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormRow>
      <FormGroup>
        <FormLabel>Budget (AED)</FormLabel>
        <FormInput
          type="number"
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: e.target.value })}
          placeholder="e.g. 2000000"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Notes</FormLabel>
        <FormTextarea
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
          <BackLink onClick={() => navigate('/owner/crm')}>← Back to CRM Hub</BackLink>
          <PageTitle>🎯 Lead Management</PageTitle>
        </div>
        <PrimaryButton onClick={() => { resetForm(); setShowCreateModal(true); }}>
          ➕ New Lead
        </PrimaryButton>
      </PageHeader>

      {/* Pipeline Status Bar */}
      <PipelineBar>
        <PipelineStage
          $active={statusFilter === 'all'}
          $color="#1a1a2e"
          onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
        >
          All ({statusCounts.all || 0})
        </PipelineStage>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <PipelineStage
            key={key}
            $active={statusFilter === key}
            $color={cfg.color}
            onClick={() => { setStatusFilter(key); setCurrentPage(1); }}
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
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <FilterSelect
          value={sourceFilter}
          onChange={e => { setSourceFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </FilterSelect>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
        </span>
      </ActionBar>

      {/* Leads Table */}
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
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
              paginatedLeads.map((lead: Lead) => (
                <Tr key={lead.id} onClick={() => handleEdit(lead)}>
                  <Td style={{ fontWeight: 500 }}>{lead.name || '—'}</Td>
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
              ))
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
          onClose={() => setShowCreateModal(false)}
          size="large"
        >
          {renderForm()}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SecondaryButton onClick={() => setShowCreateModal(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleCreate} disabled={!formData.name.trim()}>
              Create Lead
            </PrimaryButton>
          </div>
        </Modal>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <Modal
          title={`Edit Lead: ${selectedLead.name}`}
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedLead(null); }}
          size="large"
        >
          {renderForm()}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SecondaryButton onClick={() => { setShowEditModal(false); setSelectedLead(null); }}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleSaveEdit}>Save Changes</PrimaryButton>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedLead && (
        <Modal
          title="Delete Lead"
          isOpen={showDeleteConfirm}
          onClose={() => { setShowDeleteConfirm(false); setSelectedLead(null); }}
          size="small"
        >
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            Are you sure you want to delete <strong>{selectedLead.name}</strong>?
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <SecondaryButton onClick={() => { setShowDeleteConfirm(false); setSelectedLead(null); }}>
              Cancel
            </SecondaryButton>
            <DangerButton onClick={handleDelete}>Delete Lead</DangerButton>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};

export default LeadManagementPage;
