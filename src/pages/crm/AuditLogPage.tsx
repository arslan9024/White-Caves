import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { authFetch } from '../../utils/authFetch';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  ActionBar,
  SearchInput,
  FilterSelect,
  Table,
  Th,
  Td,
  Tr,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
} from './styles/CrmPageStyles';

type ActivityRecord = {
  id: string;
  type: string;
  action: string;
  description: string;
  createdAt: string;
  user?: { id: string; name: string; email: string } | null;
  lead?: { id: string; name: string } | null;
};

const PAGE_SIZE = 20;

const AuditLogPage: FC = () => {
  useDocumentTitle('Audit Log');

  const [items, setItems] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState('all');
  const [action, setAction] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const fetchAuditLog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      query.set('page', String(page));
      query.set('pageSize', String(PAGE_SIZE));
      if (type !== 'all') query.set('type', type);
      if (action !== 'all') query.set('action', action);
      const normalizedSearch = search.trim();
      if (normalizedSearch) query.set('search', normalizedSearch);

      const response = await authFetch(`/api/activities?${query.toString()}`);
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || json.message || 'Failed to load audit log');
      }
      setItems((json.data || []) as ActivityRecord[]);
      setTotal(Number(json.pagination?.total || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit log');
    } finally {
      setLoading(false);
    }
  }, [action, page, search, type]);

  useEffect(() => {
    void fetchAuditLog();
  }, [fetchAuditLog]);

  const applySearch = useCallback(() => {
    const nextSearch = searchInput.trim();

    if (page !== 1) {
      setPage(1);
    }

    if (nextSearch !== search) {
      setSearch(nextSearch);
      return;
    }

    if (page === 1) {
      void fetchAuditLog();
    }
  }, [fetchAuditLog, page, search, searchInput]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>🧾 Audit Log</PageTitle>
        <Link to="/owner/crm">Back to CRM Hub</Link>
      </PageHeader>

      <ActionBar>
        <SearchInput
          placeholder="Search description, user, lead..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applySearch();
            }
          }}
        />
        <FilterSelect
          value={type}
          onChange={e => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All types</option>
          <option value="lead">Lead</option>
          <option value="deal">Deal</option>
          <option value="property">Property</option>
          <option value="commission">Commission</option>
          <option value="agent">Agent</option>
          <option value="client">Client</option>
          <option value="system">System</option>
          <option value="appointment">Appointment</option>
        </FilterSelect>
        <FilterSelect
          value={action}
          onChange={e => {
            setAction(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="status_changed">Status Changed</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="visit">Visit</option>
          <option value="note_added">Note Added</option>
        </FilterSelect>
        <PrimaryButton onClick={applySearch} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </PrimaryButton>
      </ActionBar>

      {error && <EmptyState style={{ color: '#b91c1c' }}>{error}</EmptyState>}

      {!error && (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Time</Th>
                <Th>Type</Th>
                <Th>Action</Th>
                <Th>User</Th>
                <Th>Lead</Th>
                <Th>Description</Th>
              </tr>
            </thead>
            <tbody>
              {!loading && items.length === 0 ? (
                <tr>
                  <Td colSpan={6}>
                    <EmptyState>No audit records found for current filters.</EmptyState>
                  </Td>
                </tr>
              ) : (
                items.map(item => (
                  <Tr key={item.id}>
                    <Td>{new Date(item.createdAt).toLocaleString('en-AE')}</Td>
                    <Td>{item.type}</Td>
                    <Td>{item.action}</Td>
                    <Td>{item.user?.name || 'System'}</Td>
                    <Td>{item.lead?.name || '—'}</Td>
                    <Td>{item.description}</Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>

          <ActionBar style={{ marginTop: '1rem', justifyContent: 'space-between' }}>
            <div>
              Page {page} of {totalPages} • Total records: {total}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <SecondaryButton onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                Previous
              </SecondaryButton>
              <SecondaryButton
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </SecondaryButton>
            </div>
          </ActionBar>
        </>
      )}
    </PageContainer>
  );
};

export default AuditLogPage;
