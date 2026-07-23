/**
 * CRM User Management Page
 * User/role management with role tabs, status toggle, and role change.
 * Business logic extracted to useUserManagement hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/users
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { Badge, Pagination } from '../../components/ui';
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
  PaginationWrapper,
  LoadingBanner,
  ErrorBanner,
} from './styles/CrmPageStyles';
import { useUserManagement, ROLE_CONFIG, STATUS_CONFIG } from './hooks/useUserManagement';
import type { User } from './hooks/useUserManagement';

// ─── User-Specific Styled Components ────────────────────────────────────

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

const TabBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean; $color: string }>`
  background: ${props => (props.$active ? props.$color : '#1a1a1a')};
  color: ${props => (props.$active ? '#0f0f0f' : 'rgba(255, 255, 255, 0.7)')};
  border: 1px solid ${props => (props.$active ? props.$color : '#2c2c2c')};
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

const RoleSelect = styled.select`
  border: 1px solid #2c2c2c;
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
  font-size: 0.78rem;
  outline: none;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:focus {
    border-color: #c9a84c;
  }
`;

// ─── Component ──────────────────────────────────────────────────────────

const UserManagementPage: FC = () => {
  useDocumentTitle('User Management');
  const {
    filteredUsers,
    paginatedUsers,
    stats,
    roleCounts,
    loading,
    error,
    search,
    roleFilter,
    statusFilter,
    currentPage,
    ITEMS_PER_PAGE,
    handleChangeRole,
    handleToggleStatus,
    handleSearchChange,
    handleRoleFilterChange,
    handleStatusFilterChange,
    setCurrentPage,
    retryFetch,
    goBack,
    getRoleBadgeVariant,
    getStatusBadgeVariant,
    formatDate,
  } = useUserManagement();

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <div>
          <BackLink onClick={goBack}>← Back to CRM Hub</BackLink>
          <PageTitle>👤 User Management</PageTitle>
        </div>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading users from server...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error}</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Stats */}
      <StatsRow>
        <StatCard $color="#3B82F6">
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard $color="#10B981">
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active Users</StatLabel>
        </StatCard>
        {Object.entries(ROLE_CONFIG)
          .slice(0, 3)
          .map(([role, cfg]) => (
            <StatCard key={role} $color={cfg.color}>
              <StatValue>{stats.roleCounts[role] || 0}</StatValue>
              <StatLabel>{cfg.label}s</StatLabel>
            </StatCard>
          ))}
      </StatsRow>

      {/* Role Tabs */}
      <TabBar>
        <Tab
          $active={roleFilter === 'all'}
          $color="#1a1a2e"
          onClick={() => handleRoleFilterChange('all')}
        >
          All ({roleCounts.all || 0})
        </Tab>
        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
          <Tab
            key={key}
            $active={roleFilter === key}
            $color={cfg.color}
            onClick={() => handleRoleFilterChange(key)}
          >
            {cfg.label} ({roleCounts[key] || 0})
          </Tab>
        ))}
      </TabBar>

      {/* Search & Filters */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search by name or email..."
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
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
        </span>
      </ActionBar>

      {/* Users Table */}
      <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <Table aria-label="Users list">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th>Last Active</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user: User) => (
                <Tr key={user.id}>
                  <Td style={{ fontWeight: 500 }}>{user.name || '—'}</Td>
                  <Td>{user.email || '—'}</Td>
                  <Td>
                    <Badge variant={getRoleBadgeVariant(user.role || '')} size="small">
                      {ROLE_CONFIG[user.role || '']?.label || user.role || '—'}
                    </Badge>
                  </Td>
                  <Td>{user.department || '—'}</Td>
                  <Td>
                    <Badge variant={getStatusBadgeVariant(user.status || '')} size="small">
                      {STATUS_CONFIG[user.status || '']?.label || user.status || '—'}
                    </Badge>
                  </Td>
                  <Td>{formatDate(user.last_active)}</Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <RoleSelect
                        value={user.role || ''}
                        onChange={e => handleChangeRole(user.id, e.target.value)}
                      >
                        {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key}>
                            {cfg.label}
                          </option>
                        ))}
                      </RoleSelect>
                      {user.status === 'active' ? (
                        <SecondaryButton onClick={() => handleToggleStatus(user)}>
                          Deactivate
                        </SecondaryButton>
                      ) : (
                        <PrimaryButton onClick={() => handleToggleStatus(user)}>
                          Activate
                        </PrimaryButton>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <tr>
                <Td colSpan={7}>
                  <EmptyState>
                    {search || roleFilter !== 'all' || statusFilter !== 'all'
                      ? 'No users match your filters'
                      : 'No users found'}
                  </EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}
    </PageContainer>
  );
};

export default UserManagementPage;
