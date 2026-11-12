import { UserCategory } from './useSignIn.config';
import { UserRole } from './useSignIn.config';
export const USER_CATEGORIES: UserCategory[] = [
  {
    id: 'client',
    label: 'Client',
    icon: '🏠',
    desc: 'Looking to buy, sell, or rent property',
    color: '#10b981',
  },
  {
    id: 'staff',
    label: 'Staff Member',
    icon: '💼',
    desc: 'White Caves employee or agent',
    color: '#EF4444',
  },
];
export const CLIENT_ROLES: UserRole[] = [
  { id: 'buyer', label: 'Buyer', icon: '🔍', desc: 'Looking to purchase property' },
  { id: 'seller', label: 'Seller', icon: '💰', desc: 'Want to sell your property' },
  { id: 'landlord', label: 'Landlord', icon: '🏢', desc: 'Renting out your property' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', desc: 'Looking to rent a property' },
];
export const STAFF_ROLES: UserRole[] = [
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📋', desc: 'Property rental specialist' },
  {
    id: 'secondary-sales-agent',
    label: 'Sales Agent',
    icon: '📊',
    desc: 'Property sales specialist',
  },
  { id: 'team-leader', label: 'Team Leader', icon: '👥', desc: 'Managing agent teams' },
];
