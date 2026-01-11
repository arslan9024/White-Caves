import { createSlice, createSelector } from '@reduxjs/toolkit';

const CRM_OBJECT_CATEGORIES = {
  dashboard: { id: 'dashboard', label: 'Dashboard', type: 'view' },
  departments: { id: 'departments', label: 'Departments', type: 'object', count: 10 },
  employees: { id: 'employees', label: 'Employees', type: 'object', count: 103 },
  services: { id: 'services', label: 'Services', type: 'object', count: 40 },
  assistants: { id: 'assistants', label: 'AI Assistants', type: 'object', count: 38 },
  properties: { id: 'properties', label: 'Properties', type: 'object' },
  leads: { id: 'leads', label: 'Leads', type: 'object' },
  analytics: { id: 'analytics', label: 'Analytics', type: 'view' },
  compliance: { id: 'compliance', label: 'Compliance', type: 'view' },
  settings: { id: 'settings', label: 'Settings', type: 'view' },
};

const AI_ASSISTANTS_REGISTRY = [
  { id: 'zoe', name: 'Zoe', role: 'Executive AI', dept: 'executive', color: '#10B981', status: 'online' },
  { id: 'mary', name: 'Mary', role: 'Inventory Manager', dept: 'operations', color: '#3B82F6', status: 'online' },
  { id: 'clara', name: 'Clara', role: 'Lead Manager', dept: 'sales', color: '#8B5CF6', status: 'online' },
  { id: 'linda', name: 'Linda', role: 'WhatsApp Manager', dept: 'communications', color: '#25D366', status: 'online' },
  { id: 'aurora', name: 'Aurora', role: 'CTO Intelligence', dept: 'technology', color: '#0EA5E9', status: 'online', isTeamLead: true, teamName: 'SDLC Documentation Team' },
  { id: 'theodora', name: 'Theodora', role: 'CFO Intelligence', dept: 'finance', color: '#F59E0B', status: 'online' },
  { id: 'sophia', name: 'Sophia', role: 'Contract Manager', dept: 'legal', color: '#DC2626', status: 'online' },
  { id: 'henry', name: 'Henry', role: 'Compliance Officer', dept: 'compliance', color: '#6366F1', status: 'online' },
  { id: 'daisy', name: 'Daisy', role: 'Property Coordinator', dept: 'operations', color: '#EC4899', status: 'online' },
  { id: 'oliver', name: 'Oliver', role: 'Negotiation AI', dept: 'sales', color: '#14B8A6', status: 'online' },
  { id: 'sage', name: 'Sage', role: 'Market Intelligence', dept: 'intelligence', color: '#84CC16', status: 'online' },
  { id: 'nina', name: 'Nina', role: 'WhatsApp Bot', dept: 'communications', color: '#25D366', status: 'online' },
  { id: 'nancy', name: 'Nancy', role: 'HR Manager', dept: 'hr', color: '#A855F7', status: 'online' },
  { id: 'laila', name: 'Laila', role: 'Arabic Communications', dept: 'communications', color: '#F97316', status: 'online' },
  { id: 'olivia', name: 'Olivia', role: 'Marketing Automation', dept: 'marketing', color: '#06B6D4', status: 'online' },
  { id: 'evangeline', name: 'Evangeline', role: 'Legal AI', dept: 'legal', color: '#EF4444', status: 'online' },
  { id: 'hazel', name: 'Hazel', role: 'Frontend Support', dept: 'technology', color: '#8B5CF6', status: 'online' },
  { id: 'willow', name: 'Willow', role: 'Backend Support', dept: 'technology', color: '#3B82F6', status: 'online' },
  { id: 'sentinel', name: 'Sentinel', role: 'Property Analytics', dept: 'operations', color: '#059669', status: 'online' },
  { id: 'hunter', name: 'Hunter', role: 'Lead Prospecting', dept: 'sales', color: '#DC2626', status: 'online' },
  { id: 'cipher', name: 'Cipher', role: 'Market Analysis', dept: 'intelligence', color: '#4F46E5', status: 'online' },
  { id: 'atlas', name: 'Atlas', role: 'Project Management', dept: 'operations', color: '#0891B2', status: 'online' },
  { id: 'vesta', name: 'Vesta', role: 'Handover Coordinator', dept: 'operations', color: '#D946EF', status: 'online' },
  { id: 'juno', name: 'Juno', role: 'Community Manager', dept: 'communications', color: '#F59E0B', status: 'online' },
  { id: 'kairos', name: 'Kairos', role: 'Luxury Specialist', dept: 'sales', color: '#D4AF37', status: 'online' },
  { id: 'maven', name: 'Maven', role: 'Investment Advisor', dept: 'finance', color: '#10B981', status: 'online' },
  { id: 'chloe', name: 'Chloe', role: 'Client Relations', dept: 'sales', color: '#EC4899', status: 'online' },
  { id: 'iris', name: 'Iris', role: 'Document Processing', dept: 'legal', color: '#8B5CF6', status: 'online' },
  { id: 'phoenix', name: 'Phoenix', role: 'Crisis Management', dept: 'executive', color: '#EF4444', status: 'online' },
  { id: 'echo', name: 'Echo', role: 'Voice Assistant', dept: 'communications', color: '#06B6D4', status: 'online' },
  { id: 'nexus', name: 'Nexus', role: 'Integration Hub', dept: 'technology', color: '#4F46E5', status: 'online' },
  { id: 'aria', name: 'Aria', role: 'Scheduling Assistant', dept: 'operations', color: '#F97316', status: 'online' },
  { id: 'stella', name: 'Stella', role: 'Backend Engineer', dept: 'technology', color: '#6366F1', status: 'online', reportsTo: 'aurora', specialty: 'API & Server Architecture' },
  { id: 'nova', name: 'Nova', role: 'Backend Engineer', dept: 'technology', color: '#8B5CF6', status: 'online', reportsTo: 'aurora', specialty: 'Data Processing & Integration' },
  { id: 'ember', name: 'Ember', role: 'Frontend Engineer', dept: 'technology', color: '#F97316', status: 'online', reportsTo: 'aurora', specialty: 'UI Documentation & Standards' },
  { id: 'marina', name: 'Marina', role: 'DevOps Engineer', dept: 'technology', color: '#0891B2', status: 'online', reportsTo: 'aurora', specialty: 'Deployment & Operations' },
  { id: 'coral', name: 'Coral', role: 'Database Specialist', dept: 'technology', color: '#EC4899', status: 'online', reportsTo: 'aurora', specialty: 'Schema & Data Management' },
  { id: 'celeste', name: 'Celeste', role: 'AI/ML Engineer', dept: 'technology', color: '#10B981', status: 'online', reportsTo: 'aurora', specialty: 'ML Pipeline Documentation' },
];

const initialState = {
  activeCategory: 'dashboard',
  activeObjectId: null,
  activeAssistant: null,
  sidebarOpen: true,
  aiPanelOpen: false,
  selectedAssistantForChat: null,
  viewMode: 'grid',
  searchQuery: '',
  filterState: {},
  objectCategories: CRM_OBJECT_CATEGORIES,
  aiAssistants: AI_ASSISTANTS_REGISTRY,
  breadcrumbs: [{ id: 'dashboard', label: 'Dashboard' }],
  recentObjects: [],
  favoriteObjects: [],
};

const crmViewSlice = createSlice({
  name: 'crmView',
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      state.activeObjectId = null;
      state.activeAssistant = null;
      state.breadcrumbs = [{ id: action.payload, label: CRM_OBJECT_CATEGORIES[action.payload]?.label || action.payload }];
    },
    
    setActiveObjectId: (state, action) => {
      state.activeObjectId = action.payload;
      if (action.payload) {
        const exists = state.recentObjects.find(o => o.id === action.payload);
        if (!exists) {
          state.recentObjects = [
            { id: action.payload, category: state.activeCategory, timestamp: Date.now() },
            ...state.recentObjects
          ].slice(0, 10);
        }
      }
    },
    
    setActiveAssistant: (state, action) => {
      state.activeAssistant = action.payload;
      state.activeCategory = 'assistants';
      state.activeObjectId = action.payload;
      const assistant = AI_ASSISTANTS_REGISTRY.find(a => a.id === action.payload);
      if (assistant) {
        state.breadcrumbs = [
          { id: 'assistants', label: 'AI Assistants' },
          { id: action.payload, label: assistant.name }
        ];
      }
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleAiPanel: (state) => {
      state.aiPanelOpen = !state.aiPanelOpen;
    },
    
    setAiPanelOpen: (state, action) => {
      state.aiPanelOpen = action.payload;
    },
    
    setSelectedAssistantForChat: (state, action) => {
      state.selectedAssistantForChat = action.payload;
      if (action.payload && !state.aiPanelOpen) {
        state.aiPanelOpen = true;
      }
    },
    
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    setFilterState: (state, action) => {
      state.filterState = { ...state.filterState, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filterState = {};
      state.searchQuery = '';
    },
    
    addBreadcrumb: (state, action) => {
      const exists = state.breadcrumbs.find(b => b.id === action.payload.id);
      if (!exists) {
        state.breadcrumbs.push(action.payload);
      }
    },
    
    navigateToBreadcrumb: (state, action) => {
      const index = state.breadcrumbs.findIndex(b => b.id === action.payload);
      if (index >= 0) {
        state.breadcrumbs = state.breadcrumbs.slice(0, index + 1);
        state.activeCategory = action.payload;
        state.activeObjectId = null;
      }
    },
    
    toggleFavorite: (state, action) => {
      const { id, category } = action.payload;
      const exists = state.favoriteObjects.find(f => f.id === id);
      if (exists) {
        state.favoriteObjects = state.favoriteObjects.filter(f => f.id !== id);
      } else {
        state.favoriteObjects.push({ id, category, timestamp: Date.now() });
      }
    },
    
    resetCrmView: () => initialState,
  },
});

export const {
  setActiveCategory,
  setActiveObjectId,
  setActiveAssistant,
  toggleSidebar,
  setSidebarOpen,
  toggleAiPanel,
  setAiPanelOpen,
  setSelectedAssistantForChat,
  setViewMode,
  setSearchQuery,
  setFilterState,
  clearFilters,
  addBreadcrumb,
  navigateToBreadcrumb,
  toggleFavorite,
  resetCrmView,
} = crmViewSlice.actions;

const selectCrmView = state => state.crmView;

export const selectActiveCategory = createSelector(
  [selectCrmView],
  cv => cv?.activeCategory || 'dashboard'
);

export const selectActiveObjectId = createSelector(
  [selectCrmView],
  cv => cv?.activeObjectId
);

export const selectActiveAssistant = createSelector(
  [selectCrmView],
  cv => cv?.activeAssistant
);

export const selectSidebarOpen = createSelector(
  [selectCrmView],
  cv => cv?.sidebarOpen ?? true
);

export const selectAiPanelOpen = createSelector(
  [selectCrmView],
  cv => cv?.aiPanelOpen ?? false
);

export const selectSelectedAssistantForChat = createSelector(
  [selectCrmView],
  cv => cv?.selectedAssistantForChat
);

export const selectViewMode = createSelector(
  [selectCrmView],
  cv => cv?.viewMode || 'grid'
);

export const selectSearchQuery = createSelector(
  [selectCrmView],
  cv => cv?.searchQuery || ''
);

export const selectFilterState = createSelector(
  [selectCrmView],
  cv => cv?.filterState || {}
);

export const selectBreadcrumbs = createSelector(
  [selectCrmView],
  cv => cv?.breadcrumbs || []
);

export const selectRecentObjects = createSelector(
  [selectCrmView],
  cv => cv?.recentObjects || []
);

export const selectFavoriteObjects = createSelector(
  [selectCrmView],
  cv => cv?.favoriteObjects || []
);

export const selectAllAiAssistants = createSelector(
  [selectCrmView],
  cv => cv?.aiAssistants || AI_ASSISTANTS_REGISTRY
);

export const selectAiAssistantById = (assistantId) => createSelector(
  [selectAllAiAssistants],
  assistants => assistants.find(a => a.id === assistantId)
);

export const selectAiAssistantsByDepartment = createSelector(
  [selectAllAiAssistants],
  assistants => {
    const grouped = {};
    assistants.forEach(a => {
      if (!grouped[a.dept]) grouped[a.dept] = [];
      grouped[a.dept].push(a);
    });
    return grouped;
  }
);

export default crmViewSlice.reducer;
