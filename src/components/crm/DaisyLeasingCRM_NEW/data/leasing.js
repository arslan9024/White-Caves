// Leasing and property data for Daisy Leasing CRM

export const ACTIVE_LEASES = [
  { id: 1, unit: 'Apt 1205 - Marina Views', tenant: 'Ahmed Al Rashid', rent: 120000, startDate: '2024-01-15', endDate: '2025-01-14', status: 'active', daysRemaining: 245 },
  { id: 2, unit: 'Villa 48 - Springs', tenant: 'Sarah Johnson', rent: 180000, startDate: '2023-06-01', endDate: '2024-05-31', status: 'expiring_soon', daysRemaining: 30 },
  { id: 3, unit: 'Townhouse 12 - JVC', tenant: 'Mohammed Khan', rent: 95000, startDate: '2024-03-01', endDate: '2025-02-28', status: 'active', daysRemaining: 310 },
  { id: 4, unit: 'Penthouse 501 - Downtown', tenant: 'Maria Santos', rent: 350000, startDate: '2024-02-15', endDate: '2025-02-14', status: 'active', daysRemaining: 280 },
  { id: 5, unit: 'Studio 302 - Discovery', tenant: 'James Wilson', rent: 45000, startDate: '2023-08-01', endDate: '2024-07-31', status: 'renewal_pending', daysRemaining: 15 }
];

export const MAINTENANCE_REQUESTS = [
  { id: 1, unit: 'Apt 1205', issue: 'AC not cooling', priority: 'high', status: 'in_progress', created: '2024-01-08' },
  { id: 2, unit: 'Villa 48', issue: 'Leaking faucet', priority: 'medium', status: 'pending', created: '2024-01-07' },
  { id: 3, unit: 'Studio 302', issue: 'Light fixture broken', priority: 'low', status: 'scheduled', created: '2024-01-06' }
];

export const RENTAL_INQUIRIES = [
  { id: 1, name: 'Robert Chen', property: '2BR Marina', budget: '100-120K', status: 'viewing_scheduled', date: '2024-01-10' },
  { id: 2, name: 'Sophie Laurent', property: 'Villa Palm', budget: '200-250K', status: 'new', date: '2024-01-09' },
  { id: 3, name: 'Omar Malik', property: 'Studio Downtown', budget: '50-60K', status: 'documents_pending', date: '2024-01-08' }
];
