import { createSlice } from '@reduxjs/toolkit';
import { AI_ASSISTANTS } from '../config/assistantRegistry';

const getDefaultAssistant = () => {
  const zoe = AI_ASSISTANTS.zoe;
  return {
    id: zoe.id,
    name: zoe.name,
    title: zoe.title,
    department: zoe.department,
    color: zoe.color,
    icon: zoe.icon,
    description: zoe.description,
    capabilities: zoe.capabilities,
    features: [
      { id: 'dashboard', label: 'Dashboard', component: 'ExecutiveDashboard' },
      { id: 'suggestions', label: 'Suggestions', component: 'SuggestionInbox' },
      { id: 'analytics', label: 'Analytics', component: 'AnalyticsDashboard' },
      { id: 'reports', label: 'Reports', component: 'ReportGenerator' }
    ]
  };
};

const initialState = {
  activeAssistant: getDefaultAssistant(),
  mainViewContent: {
    component: 'ExecutiveDashboard',
    props: {}
  },
  sidebarSearchQuery: '',
  recentAssistants: [],
  favoriteAssistants: ['zoe', 'mary', 'clara', 'linda'],
  assistantStatuses: Object.keys(AI_ASSISTANTS).reduce((acc, id) => {
    acc[id] = 'online';
    return acc;
  }, {}),
  notifications: {}
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveAssistant: (state, action) => {
      const assistant = action.payload;
      state.activeAssistant = assistant;
      
      if (!state.recentAssistants.includes(assistant.id)) {
        state.recentAssistants.unshift(assistant.id);
        if (state.recentAssistants.length > 5) {
          state.recentAssistants = state.recentAssistants.slice(0, 5);
        }
      }
      
      if (assistant.features && assistant.features.length > 0) {
        state.mainViewContent = {
          component: assistant.features[0].component,
          props: { assistantId: assistant.id }
        };
      }
    },
    setMainViewContent: (state, action) => {
      state.mainViewContent = action.payload;
    },
    setSidebarSearchQuery: (state, action) => {
      state.sidebarSearchQuery = action.payload;
    },
    toggleFavoriteAssistant: (state, action) => {
      const assistantId = action.payload;
      const index = state.favoriteAssistants.indexOf(assistantId);
      if (index > -1) {
        state.favoriteAssistants.splice(index, 1);
      } else {
        state.favoriteAssistants.push(assistantId);
      }
    },
    setAssistantStatus: (state, action) => {
      const { assistantId, status } = action.payload;
      state.assistantStatuses[assistantId] = status;
    },
    addAssistantNotification: (state, action) => {
      const { assistantId, notification } = action.payload;
      if (!state.notifications[assistantId]) {
        state.notifications[assistantId] = [];
      }
      state.notifications[assistantId].unshift(notification);
    },
    clearAssistantNotifications: (state, action) => {
      const assistantId = action.payload;
      state.notifications[assistantId] = [];
    }
  }
});

export const {
  setActiveAssistant,
  setMainViewContent,
  setSidebarSearchQuery,
  toggleFavoriteAssistant,
  setAssistantStatus,
  addAssistantNotification,
  clearAssistantNotifications
} = appSlice.actions;

export default appSlice.reducer;
