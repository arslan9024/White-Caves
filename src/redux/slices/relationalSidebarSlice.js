import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for fetching department-specific data
export const fetchDepartmentData = createAsyncThunk(
  'relationalSidebar/fetchDepartmentData',
  async (departmentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}`);
      if (!response.ok) throw new Error('Failed to fetch department');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching assistant data
export const fetchAssistantData = createAsyncThunk(
  'relationalSidebar/fetchAssistantData',
  async (assistantId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/assistants/${assistantId}`);
      if (!response.ok) throw new Error('Failed to fetch assistant');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for fetching context-specific data (e.g., inventory)
export const fetchContextualData = createAsyncThunk(
  'relationalSidebar/fetchContextualData',
  async ({ assistantId, context }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/assistants/${assistantId}/contexts/${context}`
      );
      if (!response.ok) throw new Error('Failed to fetch contextual data');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Left Sidebar State
  selectedDepartment: null,
  selectedService: null,
  departments: [],
  filteredServices: [],
  departmentData: null,
  departmentLoading: false,
  departmentError: null,

  // Right Sidebar State
  selectedAssistant: null,
  filteredAssistants: [],
  assistantData: null,
  assistantLoading: false,
  assistantError: null,
  assistantNotifications: {}, // { assistantId: { count, messages: [] } }

  // Context-Specific Sidebar State
  activeContext: null, // 'inventory', 'analytics', 'leasing', etc.
  contextData: null,
  contextLoading: false,
  contextError: null,
  showFeatureSidebar: false,

  // Relational State
  relationshipMap: {}, // { departmentId: [assistantIds], assistantId: [serviceIds] }
  selectionHistory: [], // Track user's selections for breadcrumb navigation
};

const relationalSidebarSlice = createSlice({
  name: 'relationalSidebar',
  initialState,
  reducers: {
    // Left Sidebar Actions
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
      state.selectedService = null; // Reset service when dept changes
      state.activeContext = null; // Reset context
      state.showFeatureSidebar = false;
      // Track selection history
      state.selectionHistory.push({
        type: 'department',
        id: action.payload,
        timestamp: new Date().toISOString(),
      });
    },

    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
      state.activeContext = null; // Reset context
      state.showFeatureSidebar = false;
      state.selectionHistory.push({
        type: 'service',
        id: action.payload,
        timestamp: new Date().toISOString(),
      });
    },

    setFilteredServices: (state, action) => {
      state.filteredServices = action.payload;
    },

    // Right Sidebar Actions
    setSelectedAssistant: (state, action) => {
      state.selectedAssistant = action.payload;
      state.selectionHistory.push({
        type: 'assistant',
        id: action.payload,
        timestamp: new Date().toISOString(),
      });
    },

    setFilteredAssistants: (state, action) => {
      state.filteredAssistants = action.payload;
    },

    // Context-Specific Sidebar Actions
    setActiveContext: (state, action) => {
      state.activeContext = action.payload.context;
      state.showFeatureSidebar = action.payload.context !== null;
      state.selectionHistory.push({
        type: 'context',
        id: action.payload.context,
        timestamp: new Date().toISOString(),
      });
    },

    clearActiveContext: (state) => {
      state.activeContext = null;
      state.contextData = null;
      state.showFeatureSidebar = false;
    },

    // Notification Actions
    addNotification: (state, action) => {
      const { assistantId, message } = action.payload;
      if (!state.assistantNotifications[assistantId]) {
        state.assistantNotifications[assistantId] = {
          count: 0,
          messages: [],
        };
      }
      state.assistantNotifications[assistantId].messages.push(message);
      state.assistantNotifications[assistantId].count += 1;
    },

    clearNotifications: (state, action) => {
      const assistantId = action.payload;
      if (state.assistantNotifications[assistantId]) {
        state.assistantNotifications[assistantId].count = 0;
        state.assistantNotifications[assistantId].messages = [];
      }
    },

    // Relationship Map Actions
    setRelationshipMap: (state, action) => {
      state.relationshipMap = action.payload;
    },

    // Selection History Actions
    clearSelectionHistory: (state) => {
      state.selectionHistory = [];
    },

    // Bulk Reset
    resetRelationalSidebar: (state) => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch Department Data
    builder
      .addCase(fetchDepartmentData.pending, (state) => {
        state.departmentLoading = true;
        state.departmentError = null;
      })
      .addCase(fetchDepartmentData.fulfilled, (state, action) => {
        state.departmentLoading = false;
        state.departmentData = action.payload;
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.departmentLoading = false;
        state.departmentError = action.payload;
      });

    // Fetch Assistant Data
    builder
      .addCase(fetchAssistantData.pending, (state) => {
        state.assistantLoading = true;
        state.assistantError = null;
      })
      .addCase(fetchAssistantData.fulfilled, (state, action) => {
        state.assistantLoading = false;
        state.assistantData = action.payload;
      })
      .addCase(fetchAssistantData.rejected, (state, action) => {
        state.assistantLoading = false;
        state.assistantError = action.payload;
      });

    // Fetch Contextual Data (e.g., Inventory)
    builder
      .addCase(fetchContextualData.pending, (state) => {
        state.contextLoading = true;
        state.contextError = null;
      })
      .addCase(fetchContextualData.fulfilled, (state, action) => {
        state.contextLoading = false;
        state.contextData = action.payload;
      })
      .addCase(fetchContextualData.rejected, (state, action) => {
        state.contextLoading = false;
        state.contextError = action.payload;
      });
  },
});

export const {
  setSelectedDepartment,
  setSelectedService,
  setFilteredServices,
  setSelectedAssistant,
  setFilteredAssistants,
  setActiveContext,
  clearActiveContext,
  addNotification,
  clearNotifications,
  setRelationshipMap,
  clearSelectionHistory,
  resetRelationalSidebar,
} = relationalSidebarSlice.actions;

// Selectors
export const selectSelectedDepartment = (state) =>
  state.relationalSidebar.selectedDepartment;
export const selectSelectedService = (state) =>
  state.relationalSidebar.selectedService;
export const selectSelectedAssistant = (state) =>
  state.relationalSidebar.selectedAssistant;
export const selectActiveContext = (state) =>
  state.relationalSidebar.activeContext;
export const selectShowFeatureSidebar = (state) =>
  state.relationalSidebar.showFeatureSidebar;
export const selectFilteredAssistants = (state) =>
  state.relationalSidebar.filteredAssistants;
export const selectFilteredServices = (state) =>
  state.relationalSidebar.filteredServices;
export const selectAssistantNotifications = (state) =>
  state.relationalSidebar.assistantNotifications;
export const selectContextData = (state) =>
  state.relationalSidebar.contextData;
export const selectSelectionHistory = (state) =>
  state.relationalSidebar.selectionHistory;
export const selectDepartmentData = (state) =>
  state.relationalSidebar.departmentData;
export const selectAssistantData = (state) =>
  state.relationalSidebar.assistantData;

export default relationalSidebarSlice.reducer;
