import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  UserCheck,
  UserX,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { Pagination, Badge, type BadgeVariant } from '../../../components/ui';
import { REAL_ESTATE_ROLES } from '../../../config/roles';
import type { UsersTabProps } from './types';
import {
  UsersContainer,
  UsersHeader,
  HeaderLeft,
  HeaderActions,
  UsersStats,
  UserStatCard,
  StatValue,
  StatLabel,
  CategoryOverview,
  CategoryGrid,
  CategoryCard,
  CategoryName,
  CategoryCount,
  UsersToolbar,
  SearchBox,
  ToolbarFilters,
  UserCell,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  RoleBadge,
  ContactCell,
  DateCell,
  DealsCell,
  PrimaryButton,
  SecondaryButton,
  ActionButton,
  DangerButton,
  Table,
  TableContainer,
  TableRow,
  TableHeader,
  TableCell,
  StatsGrid,
  PageButton,
  PaginationContainer,
  PaginationInfo,
  FormGrid,
  SecondaryButton as CancelButton,
} from './TabStylesComponents';

const DUMMY_USERS = [
  {
    id: 1,
    name: 'Ahmed Al Maktoum',
    email: 'ahmed.maktoum@whitecaves.ae',
    phone: '+971 50 123 4567',
    role: 'company_owner',
    status: 'active',
    joinDate: '2023-01-15',
    lastActive: '2024-01-08',
    properties: 45,
    deals: 128,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@whitecaves.ae',
    phone: '+971 55 234 5678',
    role: 'sales_manager',
    status: 'active',
    joinDate: '2023-03-20',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 87,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Mohammed Al Rashid',
    email: 'mohammed.r@whitecaves.ae',
    phone: '+971 50 345 6789',
    role: 'sales_agent',
    status: 'active',
    joinDate: '2023-04-10',
    lastActive: '2024-01-07',
    properties: 12,
    deals: 34,
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    email: 'priya.sharma@whitecaves.ae',
    phone: '+971 56 456 7890',
    role: 'leasing_agent',
    status: 'active',
    joinDate: '2023-05-15',
    lastActive: '2024-01-08',
    properties: 8,
    deals: 45,
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'james.w@whitecaves.ae',
    phone: '+971 52 567 8901',
    role: 'property_manager',
    status: 'active',
    joinDate: '2023-06-01',
    lastActive: '2024-01-06',
    properties: 23,
    deals: 0,
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: 6,
    name: 'Fatima Al Zaabi',
    email: 'fatima.z@whitecaves.ae',
    phone: '+971 50 678 9012',
    role: 'mortgage_consultant',
    status: 'active',
    joinDate: '2023-07-10',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 56,
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    id: 7,
    name: 'Khalid Hassan',
    email: 'khalid.h@whitecaves.ae',
    phone: '+971 55 789 0123',
    role: 'valuation_expert',
    status: 'active',
    joinDate: '2023-08-20',
    lastActive: '2024-01-05',
    properties: 0,
    deals: 89,
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
  {
    id: 8,
    name: 'Omar Al Suwaidi',
    email: 'omar.s@whitecaves.ae',
    phone: '+971 50 890 1234',
    role: 'trustee_officer',
    status: 'active',
    joinDate: '2023-09-05',
    lastActive: '2024-01-07',
    properties: 0,
    deals: 67,
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
  {
    id: 9,
    name: 'Lisa Chen',
    email: 'lisa.c@whitecaves.ae',
    phone: '+971 56 901 2345',
    role: 'legal_officer',
    status: 'active',
    joinDate: '2023-10-15',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 112,
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
  },
  {
    id: 10,
    name: 'David Miller',
    email: 'david.m@whitecaves.ae',
    phone: '+971 52 012 3456',
    role: 'finance_officer',
    status: 'active',
    joinDate: '2023-11-01',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 0,
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: 11,
    name: 'Noor Al Hashimi',
    email: 'noor.h@gmail.com',
    phone: '+971 50 111 2222',
    role: 'landlord',
    status: 'active',
    joinDate: '2023-06-15',
    lastActive: '2024-01-07',
    properties: 5,
    deals: 8,
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
  },
  {
    id: 12,
    name: 'Raj Patel',
    email: 'raj.patel@gmail.com',
    phone: '+971 55 222 3333',
    role: 'buyer',
    status: 'active',
    joinDate: '2023-12-01',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 1,
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: 13,
    name: 'Emma Thompson',
    email: 'emma.t@gmail.com',
    phone: '+971 56 333 4444',
    role: 'tenant',
    status: 'active',
    joinDate: '2023-08-20',
    lastActive: '2024-01-06',
    properties: 0,
    deals: 1,
    avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
  },
  {
    id: 14,
    name: 'Abdullah Al Mansoori',
    email: 'abdullah.m@investors.ae',
    phone: '+971 50 444 5555',
    role: 'investor',
    status: 'active',
    joinDate: '2023-09-10',
    lastActive: '2024-01-05',
    properties: 0,
    deals: 12,
    avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
  },
  {
    id: 15,
    name: 'Marina Dubova',
    email: 'marina.d@developer.ae',
    phone: '+971 55 555 6666',
    role: 'developer',
    status: 'active',
    joinDate: '2023-07-25',
    lastActive: '2024-01-08',
    properties: 150,
    deals: 45,
    avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
  },
  {
    id: 16,
    name: 'Ali Kazim',
    email: 'ali.k@whitecaves.ae',
    phone: '+971 50 666 7777',
    role: 'affiliated_agent',
    status: 'pending',
    joinDate: '2024-01-02',
    lastActive: '2024-01-08',
    properties: 2,
    deals: 0,
    avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
  },
  {
    id: 17,
    name: 'Sophia Williams',
    email: 'sophia.w@whitecaves.ae',
    phone: '+971 56 777 8888',
    role: 'marketing_manager',
    status: 'active',
    joinDate: '2023-10-01',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 0,
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    id: 18,
    name: 'Hassan Al Farsi',
    email: 'hassan.f@whitecaves.ae',
    phone: '+971 50 888 9999',
    role: 'branch_manager',
    status: 'active',
    joinDate: '2023-04-15',
    lastActive: '2024-01-07',
    properties: 0,
    deals: 156,
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  },
  {
    id: 19,
    name: 'Aisha Khalifa',
    email: 'aisha.k@whitecaves.ae',
    phone: '+971 55 999 0000',
    role: 'leasing_manager',
    status: 'active',
    joinDate: '2023-05-20',
    lastActive: '2024-01-08',
    properties: 0,
    deals: 98,
    avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
  },
  {
    id: 20,
    name: 'Michael Brown',
    email: 'michael.b@whitecaves.ae',
    phone: '+971 52 000 1111',
    role: 'document_controller',
    status: 'inactive',
    joinDate: '2023-11-15',
    lastActive: '2023-12-20',
    properties: 0,
    deals: 0,
    avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
  },
];

const ROLE_CATEGORIES = {
  executive: 'Executive',
  admin: 'Administration',
  management: 'Management',
  agent: 'Agents',
  specialist: 'Specialists',
  support: 'Support Staff',
  client: 'Clients',
};

function UsersTab({ onAction }: UsersTabProps) {
  const [users, setUsers] = useState(() => (import.meta.env.DEV ? DUMMY_USERS : []));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const getRoleInfo = (roleId: string) => {
    return (
      REAL_ESTATE_ROLES.find(r => r.id === roleId) || {
        name: roleId,
        color: '#666',
        category: 'support' as const,
      }
    );
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      const roleInfo = getRoleInfo(user.role);
      const matchesCategory = selectedCategory === 'all' || roleInfo.category === selectedCategory;
      return matchesSearch && matchesRole && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate || 0).getTime() - new Date(b.joinDate || 0).getTime();
          break;
        case 'deals':
          comparison = a.deals - b.deals;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusVariants: Record<string, BadgeVariant> = {
      active: 'success',
      pending: 'warning',
      inactive: 'error',
    };
    return (
      <Badge variant={statusVariants[status] || 'secondary'} size="small">
        {status === 'active' && <UserCheck size={12} />}
        {status === 'inactive' && <UserX size={12} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStatus, selectedCategory]);

  const usersByCategory = REAL_ESTATE_ROLES.reduce<
    Record<string, { count: number; roles: Array<Record<string, unknown>> }>
  >((acc, role) => {
    const cat = role.category || 'other';
    if (!acc[cat]) acc[cat] = { count: 0, roles: [] };
    const roleUsers = users.filter(u => u.role === role.id);
    acc[cat].count += roleUsers.length;
    if (roleUsers.length > 0) {
      acc[cat].roles.push({ ...role, userCount: roleUsers.length });
    }
    return acc;
  }, {});

  return (
    <UsersContainer>
      <UsersHeader>
        <HeaderLeft>
          <h2>User Management</h2>
          <p>Manage all users across {REAL_ESTATE_ROLES.length} different roles</p>
        </HeaderLeft>
        <HeaderActions>
          <SecondaryButton disabled title="Export coming soon">
            <Download size={16} /> Export
          </SecondaryButton>
          <SecondaryButton disabled title="Import coming soon">
            <Upload size={16} /> Import
          </SecondaryButton>
          <PrimaryButton onClick={() => onAction?.('addUser')}>
            <Plus size={16} /> Add User
          </PrimaryButton>
        </HeaderActions>
      </UsersHeader>

      <UsersStats>
        <UserStatCard>
          <StatValue>{users.length}</StatValue>
          <StatLabel>Total Users</StatLabel>
        </UserStatCard>
        <UserStatCard>
          <StatValue>{users.filter(u => u.status === 'active').length}</StatValue>
          <StatLabel>Active</StatLabel>
        </UserStatCard>
        <UserStatCard>
          <StatValue>{users.filter(u => u.status === 'pending').length}</StatValue>
          <StatLabel>Pending</StatLabel>
        </UserStatCard>
        <UserStatCard>
          <StatValue>{REAL_ESTATE_ROLES.length}</StatValue>
          <StatLabel>Role Types</StatLabel>
        </UserStatCard>
      </UsersStats>

      <CategoryOverview>
        <h3>Users by Category</h3>
        <CategoryGrid>
          {Object.entries(ROLE_CATEGORIES).map(([key, label]) => (
            <CategoryCard
              key={key}
              $isActive={selectedCategory === key}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
            >
              <CategoryName>{label}</CategoryName>
              <CategoryCount>{usersByCategory[key]?.count || 0}</CategoryCount>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </CategoryOverview>

      <UsersToolbar>
        <SearchBox>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </SearchBox>

        <ToolbarFilters>
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
            <option value="all">All Roles</option>
            {REAL_ESTATE_ROLES.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </ToolbarFilters>
      </UsersToolbar>

      {selectedUsers.length > 0 && (
        <StatsGrid
          style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}
        >
          <span style={{ fontWeight: 600 }}>{selectedUsers.length} users selected</span>
          <SecondaryButton onClick={() => onAction?.('bulkActivate', { userIds: selectedUsers })}>
            Activate
          </SecondaryButton>
          <SecondaryButton onClick={() => onAction?.('bulkDeactivate', { userIds: selectedUsers })}>
            Deactivate
          </SecondaryButton>
          <DangerButton
            onClick={() => {
              if (
                window.confirm(
                  `Delete ${selectedUsers.length} selected user(s)? This cannot be undone.`
                )
              )
                onAction?.('bulkDelete', { userIds: selectedUsers });
            }}
          >
            Delete
          </DangerButton>
          <CancelButton onClick={() => setSelectedUsers([])}>Clear</CancelButton>
        </StatsGrid>
      )}

      <TableContainer>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>
                <input
                  type="checkbox"
                  checked={
                    selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableHeader>
              <TableHeader style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                User
                {sortBy === 'name' &&
                  (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </TableHeader>
              <TableHeader style={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>
                Role
                {sortBy === 'role' &&
                  (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader style={{ cursor: 'pointer' }} onClick={() => handleSort('joinDate')}>
                Joined
                {sortBy === 'joinDate' &&
                  (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </TableHeader>
              <TableHeader style={{ cursor: 'pointer' }} onClick={() => handleSort('deals')}>
                Deals
                {sortBy === 'deals' &&
                  (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {paginatedUsers.map(user => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <TableRow
                  key={user.id}
                  style={{
                    background: selectedUsers.includes(user.id)
                      ? 'rgba(201, 168, 76, 0.05)'
                      : undefined,
                  }}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <UserCell>
                    <UserAvatar
                      src={user.avatar}
                      alt={user.name}
                      loading="lazy"
                      width={40}
                      height={40}
                    />
                    <UserInfo>
                      <UserName>{user.name}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserCell>
                  <TableCell>
                    <RoleBadge
                      style={{
                        backgroundColor: `${roleInfo.color}20`,
                        color: roleInfo.color,
                        borderColor: roleInfo.color,
                      }}
                    >
                      {roleInfo.name}
                    </RoleBadge>
                  </TableCell>
                  <ContactCell>
                    <a
                      href={`mailto:${user.email}`}
                      aria-label={`Email ${user.email}`}
                      title={`Email ${user.email}`}
                    >
                      <Mail size={14} />
                    </a>
                    <a
                      href={`tel:${user.phone}`}
                      aria-label={`Call ${user.phone}`}
                      title={`Call ${user.phone}`}
                    >
                      <Phone size={14} />
                    </a>
                  </ContactCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <DateCell>
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                  </DateCell>
                  <DealsCell>{user.deals}</DealsCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionButton
                        title="View"
                        onClick={() => onAction?.('viewUser', { id: user.id })}
                      >
                        <Eye size={14} />
                      </ActionButton>
                      <ActionButton
                        title="Edit"
                        onClick={() => onAction?.('editUser', { id: user.id })}
                      >
                        <Edit2 size={14} />
                      </ActionButton>
                      <ActionButton
                        title="Delete"
                        onClick={() => onAction?.('deleteUser', { id: user.id })}
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>

        {paginatedUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No users found matching your filters.</p>
          </div>
        )}

        {paginatedUsers.length > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </PaginationInfo>
            <div style={{ display: 'flex', gap: '8px' }}>
              <PageButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Previous
              </PageButton>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <PageButton
                    key={page}
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PageButton>
                );
              })}
              <PageButton
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                Next
              </PageButton>
            </div>
          </PaginationContainer>
        )}
      </TableContainer>
    </UsersContainer>
  );
}

export default React.memo(UsersTab);
