import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Edit2, Trash2, Eye, Mail, Phone,
  ChevronDown, ChevronUp, MoreVertical, UserCheck, UserX,
  Download, Upload, RefreshCw
} from 'lucide-react';
import { REAL_ESTATE_ROLES } from '../../../shared/components/ui/RoleSelectorDropdown';
import './UsersTab.css';

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
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/13.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/14.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/15.jpg'
  },
  {
    id: 16,
    name: 'Ali Kazim',
    email: 'ali.k@whitecaves.ae',
    phone: '+971 50 666 7777',
    role: 'freelancer',
    status: 'pending',
    joinDate: '2024-01-02',
    lastActive: '2024-01-08',
    properties: 2,
    deals: 0,
    avatar: 'https://randomuser.me/api/portraits/men/16.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/women/19.jpg'
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
    avatar: 'https://randomuser.me/api/portraits/men/20.jpg'
  }
];

const ROLE_CATEGORIES = {
  executive: 'Executive',
  admin: 'Administration',
  management: 'Management',
  agent: 'Agents',
  specialist: 'Specialists',
  support: 'Support Staff',
  client: 'Clients'
};

export default function UsersTab({ onAction }) {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  const getRoleInfo = (roleId) => {
    return REAL_ESTATE_ROLES.find(r => r.id === roleId) || { name: roleId, color: '#666' };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const roleInfo = getRoleInfo(user.role);
    const matchesCategory = selectedCategory === 'all' || roleInfo.category === selectedCategory;
    return matchesSearch && matchesRole && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'role':
        comparison = a.role.localeCompare(b.role);
        break;
      case 'joinDate':
        comparison = new Date(a.joinDate) - new Date(b.joinDate);
        break;
      case 'deals':
        comparison = a.deals - b.deals;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { background: '#dcfce7', color: '#166534' },
      pending: { background: '#fef3c7', color: '#92400e' },
      inactive: { background: '#fee2e2', color: '#991b1b' }
    };
    return (
      <span className="status-badge" style={styles[status]}>
        {status === 'active' && <UserCheck size={12} />}
        {status === 'inactive' && <UserX size={12} />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const usersByCategory = REAL_ESTATE_ROLES.reduce((acc, role) => {
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
    <div className="users-tab">
      <div className="users-header">
        <div className="header-left">
          <h2>User Management</h2>
          <p>Manage all users across {REAL_ESTATE_ROLES.length} different roles</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => {}}>
            <Download size={16} /> Export
          </button>
          <button className="btn-secondary" onClick={() => {}}>
            <Upload size={16} /> Import
          </button>
          <button className="btn-primary" onClick={() => onAction?.('addUser')}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{users.filter(u => u.status === 'pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{REAL_ESTATE_ROLES.length}</span>
          <span className="stat-label">Role Types</span>
        </div>
      </div>

      <div className="category-overview">
        <h3>Users by Category</h3>
        <div className="category-grid">
          {Object.entries(ROLE_CATEGORIES).map(([key, label]) => (
            <div 
              key={key} 
              className={`category-card ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
            >
              <span className="category-name">{label}</span>
              <span className="category-count">{usersByCategory[key]?.count || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="all">All Roles</option>
            {REAL_ESTATE_ROLES.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>

          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedUsers.length} users selected</span>
          <button className="btn-sm" onClick={() => {}}>Activate</button>
          <button className="btn-sm" onClick={() => {}}>Deactivate</button>
          <button className="btn-sm danger" onClick={() => {}}>Delete</button>
          <button className="btn-sm" onClick={() => setSelectedUsers([])}>Clear</button>
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                User
                {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role
                {sortBy === 'role' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th>Contact</th>
              <th>Status</th>
              <th onClick={() => handleSort('joinDate')} className="sortable">
                Joined
                {sortBy === 'joinDate' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('deals')} className="sortable">
                Deals
                {sortBy === 'deals' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const roleInfo = getRoleInfo(user.role);
              return (
                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>
                    <div className="user-cell">
                      <img src={user.avatar} alt={user.name} className="user-avatar" />
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="role-badge"
                      style={{ 
                        backgroundColor: `${roleInfo.color}20`,
                        color: roleInfo.color,
                        borderColor: roleInfo.color
                      }}
                    >
                      {roleInfo.name}
                    </span>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <a href={`mailto:${user.email}`}><Mail size={14} /></a>
                      <a href={`tel:${user.phone}`}><Phone size={14} /></a>
                    </div>
                  </td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td className="date-cell">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="deals-cell">{user.deals}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View" onClick={() => onAction?.('viewUser', user.id)}>
                        <Eye size={14} />
                      </button>
                      <button className="action-btn" title="Edit" onClick={() => onAction?.('editUser', user.id)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="action-btn danger" title="Delete" onClick={() => onAction?.('deleteUser', user.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>No users found matching your criteria</p>
            <button onClick={() => { setSearchQuery(''); setSelectedRole('all'); setSelectedStatus('all'); setSelectedCategory('all'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="table-footer">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
        <div className="pagination">
          <button disabled>Previous</button>
          <span className="page-number active">1</span>
          <button disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
