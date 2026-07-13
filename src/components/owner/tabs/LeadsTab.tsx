import React, { useState, useCallback, useEffect } from 'react';
import type { LeadsTabProps, Lead } from './types';
import {
  TabContainer,
  TabHeader,
  TabTitle,
  HeaderActions,
  PrimaryButton,
  SecondaryButton,
  TableContainer,
  Table,
  EmptyStateText,
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
  StatusBadge,
  PriorityBadge,
  SourceBadge,
  UnassignedBadge,
  Toast,
  LoadingSpinner,
  LoadingState,
  ErrorState,
  ErrorIcon,
  IconButton,
  ActionButtons,
  LeadStatsRow,
  LeadStat,
  StatNumber,
  StatLabelText,
  TableFooter,
  LeadCell,
  ContactCell,
  StatusSelect,
  LinkButton,
  WarningText,
  DangerButton,
  FormGrid,
  FormGroup,
} from './TabStylesComponents';

const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    name: 'Khalid Al Maktoum',
    phone: '+971 50 111 2222',
    email: 'khalid@email.com',
    source: 'whatsapp',
    interest: 'Palm Jumeirah Villa',
    priority: 'high',
    status: 'new',
    createdAt: new Date().toISOString(),
    agent: 'Ahmed Ali',
  },
  {
    id: 2,
    name: 'Emily Watson',
    phone: '+44 7700 123456',
    email: 'emily.w@email.com',
    source: 'website',
    interest: 'Downtown Apartment',
    priority: 'medium',
    status: 'contacted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    agent: 'Sara Khan',
  },
  {
    id: 3,
    name: 'Chen Wei',
    phone: '+86 138 0000 1234',
    email: 'chen.wei@email.com',
    source: 'chatbot',
    interest: 'Investment Properties',
    priority: 'high',
    status: 'qualified',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    agent: 'Mohammed Hassan',
  },
  {
    id: 4,
    name: 'Rashid Khan',
    phone: '+971 55 333 4444',
    email: 'rashid.k@email.com',
    source: 'referral',
    interest: 'Family Townhouse',
    priority: 'medium',
    status: 'new',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    agent: '',
  },
  {
    id: 5,
    name: 'Maria Garcia',
    phone: '+34 612 345 678',
    email: 'maria.g@email.com',
    source: 'whatsapp',
    interest: 'Luxury Penthouse',
    priority: 'high',
    status: 'contacted',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    agent: 'Fatima Ahmed',
  },
  {
    id: 6,
    name: 'James Miller',
    phone: '+1 555 123 4567',
    email: 'james.m@email.com',
    source: 'website',
    interest: 'Commercial Space',
    priority: 'low',
    status: 'lost',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    agent: 'Omar Rashid',
  },
];

const EMPTY_LEAD: Omit<Lead, 'id' | 'createdAt'> = {
  name: '',
  phone: '',
  email: '',
  source: 'website',
  interest: '',
  priority: 'medium',
  status: 'new',
  agent: '',
};

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

const LeadsTab: React.FC<LeadsTabProps> = ({ data, loading, error }) => {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CRUD state
  // Use data from props (API/Redux) first; fall back to empty array in production
  // MOCK_LEADS kept below for development reference only
  const [localLeads, setLocalLeads] = useState<Lead[]>(() => data?.leads ?? []);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt'>>(EMPTY_LEAD);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, priorityFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = useCallback(() => {
    setForm(EMPTY_LEAD);
    setEditTarget(null);
    setModalMode('add');
  }, []);
  const openEdit = useCallback((lead: Lead) => {
    const { id: _id, createdAt: _ca, ...rest } = lead;
    setForm(rest);
    setEditTarget(lead);
    setModalMode('edit');
  }, []);
  const openDelete = useCallback((lead: Lead) => {
    setEditTarget(lead);
    setModalMode('delete');
  }, []);
  const closeModal = () => {
    setModalMode('none');
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...localLeads.map(l => l.id)) + 1;
      setLocalLeads(prev => [
        ...prev,
        { id: nextId, createdAt: new Date().toISOString(), ...form },
      ]);
      showToast('✅ Lead added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setLocalLeads(prev => prev.map(l => (l.id === editTarget.id ? { ...l, ...form } : l)));
      showToast('✅ Lead updated successfully');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editTarget) return;
    setLocalLeads(prev => prev.filter(l => l.id !== editTarget.id));
    showToast('🗑️ Lead removed');
    closeModal();
  };

  const handleStatusChange = (id: number, status: string) => {
    setLocalLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  if (loading) {
    return (
      <TabContainer>
        <LoadingState role="status" aria-label="Loading leads">
          <LoadingSpinner />
          <p>Loading leads...</p>
        </LoadingState>
      </TabContainer>
    );
  }
  if (error) {
    return (
      <TabContainer>
        <ErrorState role="alert">
          <ErrorIcon>⚠️</ErrorIcon>
          <p>Failed to load leads: {error}</p>
        </ErrorState>
      </TabContainer>
    );
  }

  const filteredLeads = localLeads.filter(lead => {
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    return matchesSource && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSourceIcon = (source: string): string =>
    ({ whatsapp: '💬', website: '🌐', chatbot: '🤖', referral: '🤝', social: '📱' })[source] ??
    '📋';

  const getPriorityBadge = (priority: string) => (
    <PriorityBadge $priority={priority}>{priority}</PriorityBadge>
  );

  const getStatusColor = (status: string) =>
    ({ new: '#3B82F6', contacted: '#06B6D4', qualified: '#22C55E', lost: '#EF4444' })[status] ??
    '#6B7280';

  const leadStats = {
    total: localLeads.length,
    new: localLeads.filter(l => l.status === 'new').length,
    qualified: localLeads.filter(l => l.status === 'qualified').length,
    highPriority: localLeads.filter(l => l.priority === 'high').length,
  };

  return (
    <TabContainer>
      {toast && <Toast role="status">{toast}</Toast>}

      <TabHeader>
        <TabTitle>Lead Management</TabTitle>
        <HeaderActions>
          <PrimaryButton onClick={openAdd}>
            <span>➕</span> Add Lead
          </PrimaryButton>
        </HeaderActions>
      </TabHeader>

      {/* Stats row */}
      <LeadStatsRow>
        <LeadStat>
          <StatNumber>{leadStats.total}</StatNumber>
          <StatLabelText>Total Leads</StatLabelText>
        </LeadStat>
        <LeadStat>
          <StatNumber>{leadStats.new}</StatNumber>
          <StatLabelText>New</StatLabelText>
        </LeadStat>
        <LeadStat>
          <StatNumber>{leadStats.qualified}</StatNumber>
          <StatLabelText>Qualified</StatLabelText>
        </LeadStat>
        <LeadStat>
          <StatNumber>{leadStats.highPriority}</StatNumber>
          <StatLabelText>High Priority</StatLabelText>
        </LeadStat>
      </LeadStatsRow>

      {/* Filters */}
      <FilterRow>
        <FilterSelect value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          <option value="all">All Sources</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="website">Website</option>
          <option value="chatbot">Chatbot</option>
          <option value="referral">Referral</option>
        </FilterSelect>
        <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </FilterSelect>
        <FilterSelect value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </FilterSelect>
      </FilterRow>

      {/* Empty state */}
      {filteredLeads.length === 0 && (
        <EmptyStateText style={{ padding: '2rem', textAlign: 'center' }}>
          No leads found. <LinkButton onClick={openAdd}>Add your first lead →</LinkButton>
        </EmptyStateText>
      )}

      {filteredLeads.length > 0 && (
        <TableContainer>
          <Table aria-label="Leads data">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <LeadCell>
                      <strong>{lead.name}</strong>
                      <small>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </small>
                    </LeadCell>
                  </td>
                  <td>
                    <ContactCell>
                      <span>{lead.phone}</span>
                      <small>{lead.email}</small>
                    </ContactCell>
                  </td>
                  <td>
                    <SourceBadge>
                      {getSourceIcon(lead.source)} {lead.source}
                    </SourceBadge>
                  </td>
                  <td>{lead.interest || 'N/A'}</td>
                  <td>{getPriorityBadge(lead.priority)}</td>
                  <td>
                    <StatusBadge $status={lead.status}>{lead.status}</StatusBadge>
                    <StatusSelect
                      value={lead.status}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
                      style={{ color: getStatusColor(lead.status) }}
                      aria-label="Change lead status"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </StatusSelect>
                  </td>
                  <td>{lead.agent || <UnassignedBadge>Unassigned</UnassignedBadge>}</td>
                  <td>
                    <ActionButtons>
                      <IconButton
                        title="Edit"
                        aria-label="Edit lead"
                        onClick={() => openEdit(lead)}
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        danger
                        title="Delete"
                        aria-label="Delete lead"
                        onClick={() => openDelete(lead)}
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
              Showing {paginatedLeads.length} of {filteredLeads.length} leads
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
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
          <Modal>
            <ModalHeader>
              <h3 id="lead-modal-title">{modalMode === 'add' ? 'Add New Lead' : 'Edit Lead'}</h3>
              <ModalCloseButton onClick={closeModal} aria-label="Close">
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Khalid Al Maktoum"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+971 50 000 0000"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Source</label>
                  <select
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  >
                    <option value="website">Website</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="chatbot">Chatbot</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Interest / Property Type</label>
                  <input
                    type="text"
                    value={form.interest}
                    onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                    placeholder="e.g. 3BR Villa in Palm Jumeirah"
                  />
                </FormGroup>
                <FormGroup>
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Assigned Agent</label>
                  <input
                    type="text"
                    value={form.agent}
                    onChange={e => setForm(f => ({ ...f, agent: e.target.value }))}
                    placeholder="Agent name (optional)"
                  />
                </FormGroup>
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={!form.name.trim()}>
                {modalMode === 'add' ? 'Add Lead' : 'Save Changes'}
              </PrimaryButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && editTarget && (
        <ModalOverlay role="dialog" aria-modal="true" aria-labelledby="del-lead-title">
          <ModalSmall>
            <ModalHeader>
              <h3 id="del-lead-title">Remove Lead</h3>
              <ModalCloseButton onClick={closeModal} aria-label="Close">
                ✕
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                Remove <strong>{editTarget.name}</strong> from your leads?
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

export default React.memo(LeadsTab);
