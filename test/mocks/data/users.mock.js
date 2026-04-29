export const mockUsers = [
  {
    _id: 'user-001',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'agent',
    phone: '+971501234567',
    active: true,
  },
  {
    _id: 'user-002',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'admin',
    phone: '+971507654321',
    active: true,
  },
  {
    _id: 'user-003',
    email: 'client@example.com',
    name: 'Client User',
    role: 'client',
    phone: '+971501111111',
    active: true,
  },
];

export const mockUser = mockUsers[0];

export const createMockUser = (overrides = {}) => ({
  _id: `user-${Date.now()}`,
  email: 'test@example.com',
  name: 'Test User',
  role: 'agent',
  phone: '+971501234567',
  active: true,
  ...overrides,
});
