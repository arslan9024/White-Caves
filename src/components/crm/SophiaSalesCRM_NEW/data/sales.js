// Sales pipeline and deals data for Sophia Sales CRM

export const PIPELINE_STAGES = [
  { id: 'new', label: 'New Lead', count: 24, value: 'AED 45.2M' },
  { id: 'qualified', label: 'Qualified', count: 18, value: 'AED 38.5M' },
  { id: 'viewing', label: 'Property Viewing', count: 12, value: 'AED 28.1M' },
  { id: 'negotiation', label: 'Negotiation', count: 8, value: 'AED 22.4M' },
  { id: 'documentation', label: 'Documentation', count: 5, value: 'AED 15.8M' },
  { id: 'closing', label: 'Closing', count: 3, value: 'AED 9.2M' }
];

export const DEALS = [
  { id: 1, property: 'Villa 348 - DAMAC Hills 2', client: 'Ahmed Al Rashid', value: 2500000, stage: 'negotiation', probability: 85, agent: 'Sarah Johnson', daysInStage: 5 },
  { id: 2, property: 'Apartment 1205 - Marina', client: 'James Wilson', value: 1800000, stage: 'viewing', probability: 60, agent: 'Mohammed Ali', daysInStage: 3 },
  { id: 3, property: 'Townhouse 56 - Springs', client: 'Maria Santos', value: 3200000, stage: 'documentation', probability: 95, agent: 'Aisha Khan', daysInStage: 2 },
  { id: 4, property: 'Penthouse 2501 - Downtown', client: 'Robert Chen', value: 8500000, stage: 'qualified', probability: 45, agent: 'Omar Malik', daysInStage: 7 },
  { id: 5, property: 'Villa 112 - Palm Jumeirah', client: 'Sophie Laurent', value: 12000000, stage: 'negotiation', probability: 75, agent: 'Sarah Johnson', daysInStage: 4 }
];

export const AGENTS = [
  { id: 1, name: 'Sarah Johnson', deals: 8, value: 'AED 24.5M', conversion: 68, avatar: '👩‍💼' },
  { id: 2, name: 'Mohammed Ali', deals: 6, value: 'AED 18.2M', conversion: 55, avatar: '👨‍💼' },
  { id: 3, name: 'Aisha Khan', deals: 5, value: 'AED 15.8M', conversion: 72, avatar: '👩‍💻' },
  { id: 4, name: 'Omar Malik', deals: 4, value: 'AED 12.1M', conversion: 48, avatar: '👨‍💻' }
];
