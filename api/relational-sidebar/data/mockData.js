/**
 * Mock Data for Relational Sidebar API
 * Use this for testing before connecting to real database
 */

const departments = [
  {
    id: 'OPERATIONS',
    name: 'Operations',
    description: 'Operational tasks and management',
    icon: 'settings',
    color: '#3b82f6',
    services: [
      { id: 'inventory', name: 'Inventory', icon: 'package' },
      { id: 'maintenance', name: 'Maintenance', icon: 'wrench' },
      { id: 'schedules', name: 'Schedules', icon: 'calendar' },
    ],
  },
  {
    id: 'SALES',
    name: 'Sales',
    description: 'Sales and client management',
    icon: 'trending-up',
    color: '#10b981',
    services: [
      { id: 'campaigns', name: 'Campaigns', icon: 'megaphone' },
      { id: 'clients', name: 'Clients', icon: 'users' },
      { id: 'deals', name: 'Deals', icon: 'handshake' },
    ],
  },
  {
    id: 'MARKETING',
    name: 'Marketing',
    description: 'Marketing and communications',
    icon: 'megaphone',
    color: '#f59e0b',
    services: [
      { id: 'messages', name: 'Messages', icon: 'mail' },
      { id: 'analytics', name: 'Analytics', icon: 'bar-chart' },
      { id: 'content', name: 'Content', icon: 'file-text' },
    ],
  },
  {
    id: 'SUPPORT',
    name: 'Support',
    description: 'Customer support and assistance',
    icon: 'help-circle',
    color: '#ef4444',
    services: [
      { id: 'tickets', name: 'Tickets', icon: 'alert-circle' },
      { id: 'feedback', name: 'Feedback', icon: 'message-circle' },
      { id: 'resources', name: 'Resources', icon: 'book' },
    ],
  },
];

const assistants = [
  {
    id: 'mary_001',
    name: 'Mary',
    role: 'Assistant',
    department: 'OPERATIONS',
    services: [
      { id: 'inventory', name: 'Inventory' },
      { id: 'maintenance', name: 'Maintenance' },
    ],
    isActive: true,
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'mary@whitecaves.com',
    lastActivity: new Date(Date.now() - 5 * 60000).toISOString(),
    notificationCount: 3,
    status: 'active',
    availableContexts: ['inventory', 'campaigns'],
    permissions: {
      canViewInventory: true,
      canEditInventory: true,
      canViewReports: true,
      canSendNotifications: false,
    },
  },
  {
    id: 'nina_001',
    name: 'Nina',
    role: 'Assistant',
    department: 'SALES',
    services: [
      { id: 'campaigns', name: 'Campaigns' },
      { id: 'clients', name: 'Clients' },
    ],
    isActive: true,
    avatar: 'https://i.pravatar.cc/150?img=2',
    email: 'nina@whitecaves.com',
    lastActivity: new Date(Date.now() - 15 * 60000).toISOString(),
    notificationCount: 1,
    status: 'active',
    availableContexts: ['campaigns', 'clients'],
    permissions: {
      canViewCampaigns: true,
      canEditCampaigns: true,
      canViewClients: true,
      canSendNotifications: true,
    },
  },
  {
    id: 'linda_001',
    name: 'Linda',
    role: 'Assistant',
    department: 'MARKETING',
    services: [
      { id: 'messages', name: 'Messages' },
      { id: 'analytics', name: 'Analytics' },
      { id: 'content', name: 'Content' },
    ],
    isActive: true,
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'linda@whitecaves.com',
    lastActivity: new Date(Date.now() - 30 * 60000).toISOString(),
    notificationCount: 5,
    status: 'active',
    availableContexts: ['messages', 'analytics'],
    permissions: {
      canViewMessages: true,
      canEditMessages: true,
      canViewAnalytics: true,
      canSendNotifications: true,
    },
  },
  {
    id: 'agent_001',
    name: 'Support Agent',
    role: 'Support Agent',
    department: 'SUPPORT',
    services: [
      { id: 'tickets', name: 'Tickets' },
      { id: 'feedback', name: 'Feedback' },
    ],
    isActive: false,
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'support@whitecaves.com',
    lastActivity: new Date(Date.now() - 2 * 3600000).toISOString(),
    notificationCount: 0,
    status: 'inactive',
    availableContexts: [],
    permissions: {
      canViewTickets: true,
      canEditTickets: false,
      canSendNotifications: false,
    },
  },
];

const contextData = [
  {
    assistantId: 'mary_001',
    context: 'inventory',
    itemCount: 45,
    lastUpdated: new Date(Date.now() - 1 * 60000).toISOString(),
    items: [
      { id: 'inv_001', name: 'Paint - White', quantity: 120, unit: 'liters', lastRestocked: '2024-01-15' },
      { id: 'inv_002', name: 'Brushes - Large', quantity: 45, unit: 'pieces', lastRestocked: '2024-01-12' },
      { id: 'inv_003', name: 'Scaffolding', quantity: 8, unit: 'sets', lastRestocked: '2024-01-10' },
      { id: 'inv_004', name: 'Safety Harnesses', quantity: 20, unit: 'pieces', lastRestocked: '2024-01-08' },
      { id: 'inv_005', name: 'Drills - Electric', quantity: 5, unit: 'pieces', lastRestocked: '2024-01-05' },
    ],
  },
  {
    assistantId: 'mary_001',
    context: 'campaigns',
    itemCount: 8,
    lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
    items: [
      { id: 'camp_001', name: 'New Year Sale 2024', status: 'active', reach: 2500 },
      { id: 'camp_002', name: 'Winter Clearance', status: 'active', reach: 1800 },
      { id: 'camp_003', name: 'Q1 Special', status: 'planning', reach: 0 },
    ],
  },
  {
    assistantId: 'nina_001',
    context: 'campaigns',
    itemCount: 12,
    lastUpdated: new Date(Date.now() - 3 * 60000).toISOString(),
    items: [
      { id: 'camp_001', name: 'Spring Promotion', status: 'active', budget: 5000, spent: 2300 },
      { id: 'camp_002', name: 'Summer Campaign', status: 'planning', budget: 8000, spent: 0 },
      { id: 'camp_003', name: 'Holiday Sale', status: 'archived', budget: 10000, spent: 9500 },
    ],
  },
  {
    assistantId: 'nina_001',
    context: 'clients',
    itemCount: 156,
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { id: 'client_001', name: 'ABC Corporation', status: 'active', totalValue: 45000, lastContact: '2024-01-18' },
      { id: 'client_002', name: 'XYZ Industries', status: 'active', totalValue: 32000, lastContact: '2024-01-16' },
      { id: 'client_003', name: 'Global Traders', status: 'inactive', totalValue: 18000, lastContact: '2023-12-20' },
    ],
  },
  {
    assistantId: 'linda_001',
    context: 'messages',
    itemCount: 234,
    lastUpdated: new Date(Date.now() - 10 * 60000).toISOString(),
    items: [
      { id: 'msg_001', sender: 'customer@email.com', subject: 'Inquiry', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
      { id: 'msg_002', sender: 'partner@email.com', subject: 'Partnership Proposal', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), read: true },
      { id: 'msg_003', sender: 'supplier@email.com', subject: 'Order Confirmation', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), read: true },
    ],
  },
  {
    assistantId: 'linda_001',
    context: 'analytics',
    itemCount: 1,
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      {
        id: 'analytics_001',
        period: 'January 2024',
        visitors: 15420,
        conversions: 342,
        revenue: 125000,
        topPages: ['home', 'products', 'about'],
      },
    ],
  },
];

const notifications = [
  {
    id: 'notif_001',
    assistantId: 'mary_001',
    message: 'Inventory low alert: Paint - White below 100 liters',
    type: 'warning',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif_002',
    assistantId: 'mary_001',
    message: 'New campaign request from Sales team',
    type: 'info',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'notif_003',
    assistantId: 'nina_001',
    message: 'Campaign "Spring Promotion" has reached 50% budget',
    type: 'info',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    read: true,
  },
];

module.exports = {
  departments,
  assistants,
  contextData,
  notifications,
};
